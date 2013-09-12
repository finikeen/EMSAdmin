<cfcomponent extends="emsadmin.api.1.resources._base" taffy_uri="/emsForm/{formId}">

	<cffunction name="get" access="public" output="false" hint="returns an EMS form by hash (mined from Wufoo)">
		<cfargument name="formId" type="string" required="true" hint="form hash value from Wufoo">
		<cfset var local = {} />
		<cfset local.stData = {} />
		<cfset local.success = true />
		<cfset local.retQuery = querynew("formId, formName, formDesc, startDate, endDate, isPublic, createDate, updateDate, ownerEmail", "varchar, varchar, varchar, date, date, bit, date, date, varchar") />
		
		<cftry>
			<cfquery name="local.retQuery" datasource="#application.emsDSN#">
				select *
				from Form
				where form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.formId#">
			</cfquery>
		<cfcatch type="any">
			<cfscript>
				local.retQuery = querynew("error, details");
				queryaddrow(local.retQuery, 1);
				querysetcell(local.retQuery, "error", cfcatch.message, 1);
				querysetcell(local.retQuery, "details", cfcatch.detail, 1);
				local.success = false;
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
	
	<cffunction name="put" access="public" output="false" hint="update function">
		
		<cfset var local = {} />
		<cfset local.stdata = {} />
		<cfset temp = sendError(arguments,structnew(),'put') />
		<cftry>
		<cfquery name="local.q" datasource="#application.emsDSN#">
			update student_evaluation
			set tartan_id = <cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.tartanId#">
				, first_nm = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.firstName#"> 
				, last_nm = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.lastName#"> 
				, evaluator_nm = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.evaluatorName#"> 
				, evaluator_id = <cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.evaluatorId#"> 
				, is_active = <cfqueryparam cfsqltype="cf_sql_bit" value="#arguments.isActive#">
			where student_evaluation_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.studentEvaluationId#"> 
		</cfquery>
		
		<cfscript>
			structinsert(local.stdata, 'success', true);
		</cfscript>
		<cfcatch type="any">
			<cfscript>
				structinsert(local.stdata, 'success', false);
				structinsert(local.stdata, 'error', cfcatch.message);
				structinsert(local.stdata, 'detail', cfcatch.detail);
			</cfscript>
		</cfcatch>
		</cftry> 
		<cfreturn representationOf(local.stdata).withStatus(200)>
	</cffunction>

</cfcomponent>