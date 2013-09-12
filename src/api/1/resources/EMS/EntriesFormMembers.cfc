<cfcomponent extends="emsadmin.api.1.resources._base" taffy_uri="/emsEntries/{evaluationid}">

	<cffunction name="get" access="public" output="true" hint="returns all EMS entries by formId">
		<cfargument name="evaluationid" type="string" required="true" hint="sccWufoo unique hash">
		
		<cfset var local = {} />
		<cfset local.stdata = {} />
		<cfset local.success = false />
		<cfset retquery = querynew("id, formname, formtype, formdate, studentname, studentId, evaluator, success") />
		
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#">
				select *
				from Student_Evaluation
				where tartan_id > <cfqueryparam cfsqltype="cf_sql_integer" value="0">
					and student_evaluation_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.evaluationid#">
			</cfquery>
			<cfset i = 0 />
			<cfloop query="local.q">
				<cfscript>
					i = (i+1);
					queryaddrow(retquery,1);
					querysetcell(retquery,"id",local.q.student_evaluation_id,i);
					querysetcell(retquery,"formName",getFormNameByFormId(listlast(local.q.student_evaluation_id, '*')),i);
					querysetcell(retquery,"formType",local.q.evaluation_type_ds,i);
					querysetcell(retquery,"formDate",local.q.evaluation_dt,i);
					nm = local.q.last_nm & ', ' & local.q.first_nm;
					querysetcell(retquery,"studentName",nm,i);
					querysetcell(retquery,"studentId",local.q.tartan_id,i);
					querysetcell(retquery,"evaluator",local.q.evaluator_nm,i);
					f = getFieldIdByFormIdAndFieldFilter(id=listlast(local.q.student_evaluation_id, '*'),filter='INSTRUCTOR EVALUATION', wildcard=true);
					querysetcell(retquery,"evaluatorSuccess",getAnswerByFormIdAndFieldId(studentId=local.q.student_evaluation_id, fieldId=f),i);
					f = getFieldIdByFormIdAndFieldFilter(id=listlast(local.q.student_evaluation_id, '*'),filter='STUDENT SELF-EVALUATION', wildcard=true);
					querysetcell(retquery,"studentSuccess",getAnswerByFormIdAndFieldId(studentId=local.q.student_evaluation_id, fieldId=f),i);
				</cfscript>
			</cfloop>
			<cfset local.success = true />
		<cfcatch type="any">
			<cfdump var="#cfcatch#">
			<cfscript>
				local.retQuery = querynew("error, details, arguments");
				queryaddrow(local.retQuery, 1);
				querysetcell(local.retQuery, "error", cfcatch.message, 1);
				querysetcell(local.retQuery, "details", cfcatch.detail, 1);
				querysetcell(local.retQuery, "arguments", arguments, 1);
			</cfscript>
		</cfcatch>
		</cftry>
		<cfset local.stdata = {
			rows = arrayfromquery(local.retQuery),
			success = local.success,
			results = local.retQuery.recordCount
		} />
		
		<cfreturn representationOf(local.stdata).withStatus(200)>
	</cffunction>
	
	<cffunction name="put" access="public" output="false" hint="update function s">
		
		<cfset var local = {} />
		<cfset local.stdata = {} />
		<cfset local.success = true />
		<cfset temp = sendError(arguments,structnew(),'put entries') />
		
	
		<cfscript>
			structinsert(local.stdata, 'success', local.success);
		</cfscript>
		
		<cfreturn representationOf(local.stdata).withStatus(200)>
	</cffunction>

</cfcomponent>