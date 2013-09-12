<cfcomponent extends="emsadmin.api.1.resources._base" taffy_uri="/emsEntries">

	<cffunction name="get" access="public" output="false" hint="returns all EMS entries">
		<cfargument name="limit" type="numeric" required="false" default="100"/>
		<cfargument name="start" type="numeric" required="false" default="0"/>
		<cfargument name="filter" type="any" required="false" default=""/>
		<cfargument name="sort" type="any" required="false" default=""/>
	
		<cfset var local = {}/>
		<cfset local.stdata = {}/>
		<cfset local.retArray = arraynew(1)/>
		<cfset local.success = false/>
		<cfset local.sort = arraynew(1)/>
		<cfif len(trim(arguments.sort))>
			<cfset local.sort = deserializeJSON(arguments.sort)/>
		</cfif>
		<cfset local.filter = arraynew(1)/>
		<cfif len(trim(arguments.filter))>
			<cfset local.filter = deserializeJSON(arguments.filter)/>
		</cfif>
		<cfset local.s = structnew()/>
		
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#" maxrows="#arguments.limit#">
				with OrderedQuery as (
				select s.*, f.form_nm, row_number() over (
				<cfif arraylen(local.sort)>
					order by 
					#local.sort[arraylen(local.sort)].property# 
					#local.sort[arraylen(local.sort)].direction#
				<cfelse>
					order by evaluation_dt desc
				</cfif>) as 'RowNumber'
				from Student_Evaluation s
				inner join Form f on right(s.student_evaluation_id,6) = f.form_id
				where s.tartan_id > <cfqueryparam cfsqltype="cf_sql_integer" value="0">
					and s.is_active = <cfqueryparam cfsqltype="cf_sql_bit" value="1">
					and f.form_id <> <cfqueryparam cfsqltype="cf_sql_varchar" value="k7s0r3">
				<cfif arraylen(local.filter)>
					and (
					<cfset delim = ""/>
					<cfloop array="#local.filter#" index="thisFilter">
						<cfif thisFilter.property is "AGE">
							<cfset newdt = dateadd('h', (0-thisFilter.value), now()) />
							#delim# evaluation_dt > <cfqueryparam cfsqltype="cf_sql_timestamp" value="#createodbcDateTime(newdt)#" > 
						<cfelseif thisFilter.property is "STARTDATE">
							<cfset newdt = thisFilter.value />
							#delim# evaluation_dt > <cfqueryparam cfsqltype="cf_sql_timestamp" value="#createodbcDateTime(newdt)#" > 
						<cfelseif thisFilter.property is "ENDDATE">
							<cfset newdt = dateadd('d', 1, thisFilter.value) />
							#delim# evaluation_dt < <cfqueryparam cfsqltype="cf_sql_timestamp" value="#createodbcDateTime(newdt)#" > 
						<cfelse>
							#delim#
							<cfif thisFilter.property is "LAST_NM">(</cfif>
							#thisFilter.property#
							<cfif isNumeric(thisFilter.value)>
								= <cfqueryparam cfsqltype="cf_sql_numeric" value="#thisFilter.value#">
							<cfelse>
								like <cfqueryparam cfsqltype="cf_sql_varchar" value="%#thisFilter.value#%">
							</cfif>
							<cfif thisFilter.property is "FIRST_NM">)</cfif>
						</cfif>
						<cfset delim = "AND"/>
						<cfif thisFilter.property is "LAST_NM">
							<cfset delim = "OR"/>
						</cfif>
					</cfloop>
					)
				</cfif>)
				select *
				from OrderedQuery
				where RowNumber between #arguments.start# and (#arguments.limit + arguments.start#)
			</cfquery>
			
			<cfloop query="local.q">
				
				<cfscript>
					s = structnew();
					local.formId = listlast(local.q.STUDENT_EVALUATION_ID, '*');
					if (local.formId is not "k7s0r3") {
						structinsert(s, 'studentEvaluationId', local.q.STUDENT_EVALUATION_ID);
						structinsert(s, 'lastName', local.q.LAST_NM);
						structinsert(s, 'firstName', local.q.FIRST_NM);
						local.studentName = trim(local.q.LAST_NM) & ', ' & trim(local.q.FIRST_NM);
						structinsert(s, 'studentName', local.studentName);
						structinsert(s, 'tartanId', local.q.TARTAN_ID);
						structinsert(s, 'evaluatorId', local.q.EVALUATOR_ID);
						structinsert(s, 'evaluatorName', local.q.EVALUATOR_NM);
						structinsert(s, 'evaluationDate', createodbcdatetime(local.q.EVALUATION_DT));
						structinsert(s, 'evaluationType', local.q.EVALUATION_TYPE_DS);
						structinsert(s, 'formId', local.formId);
						local.formName = listrest(local.q.FORM_NM, '-');
						structinsert(s, 'formName', local.formName);
						local.f = getFieldIdByFormIdAndFieldFilter(id=local.q.student_evaluation_id, filter='INSTRUCTOR EVALUATION', wildcard=true);
						local.rating = getAnswerByFormIdAndFieldId(studentId=local.q.student_evaluation_id,  fieldId=local.f);
						structinsert(s, "evaluatorRating", local.rating);
						// local.f = getFieldIdByFormIdAndFieldFilter(id=local.formId, filter='STUDENT 
						//SELF-EVALUATION', wildcard=true);
						// local.rating = getAnswerByFormIdAndFieldId(studentId=local.q.student_evaluation_id, 
						//fieldId=local.f);
						// structinsert(s, "studentRating", local.rating);
						structinsert(s, "isActive", local.q.IS_ACTIVE);
						arrayappend(local.retArray, s);
					}
				</cfscript>
				
			</cfloop>
		
			<cfset local.success = true/>
		<cfcatch type="any">
			<cfdump var="#cfcatch#">
			
			<cfscript>
				s = structnew();
				structinsert(s, 'error', cfcatch.message);
				structinsert(s, 'details', cfcatch.detail);
				structinsert(s, 'arguments', arguments);
				arrayappend(local.retArray, s);
			</cfscript>
			
		</cfcatch>
		</cftry>
		
		<cfscript>
			structinsert(local.stdata, 'rows', local.retArray);
			structinsert(local.stdata, 'success', local.success);
			structinsert(local.stdata, 'results', getCount(arguments.filter));
		</cfscript>
		
		<cfreturn representationOf(local.stdata).withStatus(200)>
	</cffunction>
	
	<cffunction name="getCount" access="private" returntype="numeric">
		<cfargument name="filter" type="any" requried="false" default=""/>
	
		<cfset var local = {}/>
		<cfset local.filter = arraynew(1)/>
		<cfif len(trim(arguments.filter))>
			<cfset local.filter = deserializeJSON(arguments.filter)/>
		</cfif>
	
		<cfquery name="local.q" datasource="#application.emsDSN#">
			select count(*) as thecount
			from Student_Evaluation s
				inner join Form f on right(s.student_evaluation_id,6) = f.form_id
			where s.tartan_id > <cfqueryparam cfsqltype="cf_sql_integer" value="0">
				and s.is_active = <cfqueryparam cfsqltype="cf_sql_bit" value="1">
				and f.form_id <> <cfqueryparam cfsqltype="cf_sql_varchar" value="k7s0r3">
			<cfif arraylen(local.filter)>
				and (
				<cfset delim = ""/>
				<cfloop array="#local.filter#" index="thisFilter">
					<cfif thisFilter.property is "AGE">
						<cfset newdt = dateadd('h', (0-thisFilter.value), now()) />
						#delim# evaluation_dt > <cfqueryparam cfsqltype="cf_sql_timestamp" value="#createodbcDateTime(newdt)#" > 
					<cfelseif thisFilter.property is "STARTDATE">
						<cfset newdt = thisFilter.value />
						#delim# evaluation_dt > <cfqueryparam cfsqltype="cf_sql_timestamp" value="#createodbcDateTime(newdt)#" > 
					<cfelseif thisFilter.property is "ENDDATE">
						<cfset newdt = dateadd('d', 1, thisFilter.value) />
						#delim# evaluation_dt < <cfqueryparam cfsqltype="cf_sql_timestamp" value="#createodbcDateTime(newdt)#" > 
					<cfelse>
						#delim#
						<cfif thisFilter.property is "LAST_NM">(</cfif>
						#thisFilter.property#
						<cfif isNumeric(thisFilter.value)>
							= <cfqueryparam cfsqltype="cf_sql_numeric" value="#thisFilter.value#">
						<cfelse>
							like <cfqueryparam cfsqltype="cf_sql_varchar" value="%#thisFilter.value#%">
						</cfif>
						<cfif thisFilter.property is "FIRST_NM">)</cfif>
					</cfif>
					<cfset delim = "AND"/>
					<cfif thisFilter.property is "LAST_NM">
						<cfset delim = "OR"/>
					</cfif>
				</cfloop>
				)
			</cfif>
		</cfquery>
	
		<cfreturn local.q.thecount>
	</cffunction>
	
</cfcomponent>