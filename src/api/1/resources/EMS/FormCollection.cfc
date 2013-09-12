<cfcomponent extends="emsadmin.api.1.resources._base" taffy_uri="/emsForm">

	<cffunction name="get" access="public" output="false" hint="returns all EMS forms mined from Wufoo">
		
		<cfset var local = {} />
		<cfset local.retQuery = querynew("formId, formName, formDesc, startDate, endDate, isPublic, createDate, updateDate, ownerEmail", "varchar, varchar, varchar, date, date, bit, date, date, varchar") />
		<cfset local.retArray = arraynew(1) />
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#">
				select *
				from Form
				where form_id <> <cfqueryparam cfsqltype="cf_sql_varchar" value="k7s0r3">
				order by form_nm
			</cfquery>
			<cfloop query="local.q">
			<cfscript>
				queryaddrow(local.retQuery, 1);
				querysetcell(local.retQuery, "formid", local.q.form_id, local.q.currentrow);
				querysetcell(local.retQuery, "formName", listrest(local.q.form_nm,'-'), local.q.currentrow);
				querysetcell(local.retQuery, "formDesc", local.q.form_ds, local.q.currentrow);
				querysetcell(local.retQuery, "startDate", local.q.start_dt, local.q.currentrow);
				querysetcell(local.retQuery, "endDate", local.q.end_dt, local.q.currentrow);
				querysetcell(local.retQuery, "isPublic", local.q.is_public_in, local.q.currentrow);
				querysetcell(local.retQuery, "createDate", local.q.create_dt, local.q.currentrow);
				querysetcell(local.retQuery, "updateDate", local.q.update_dt, local.q.currentrow);
				querysetcell(local.retQuery, "ownerEmail", local.q.email_nm, local.q.currentrow);
			</cfscript>
			</cfloop>
			<cfset local.retArray = arrayfromquery(local.retQuery) />
		<cfcatch type="any">
			<cfscript>
				local.retQuery = querynew("error, details");
				queryaddrow(local.retQuery, 1);
				querysetcell(local.retQuery, "error", cfcatch.message, 1);
				querysetcell(local.retQuery, "details", cfcatch.detail, 1);
			</cfscript>
		</cfcatch>
		</cftry>
		
		<cfreturn representationOf(local.retArray).withStatus(200)>
	</cffunction>

</cfcomponent>