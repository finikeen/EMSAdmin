<cfcomponent displayname="form" hint="Form Logic" extends="AbstractService" >
	
	<cfset variables.config = APPLICATION.security.objectFactory.getObjectByName("config","dao","config")>
	<cfset variables.dtc = APPLICATION.security.objectFactory.getObjectByName("datatypeconvert","","util")>
	
	<cffunction name="getAll" access="remote" returntype="array" output="true">
		
		<cfset var local = {} />
		<cfset local.results = arraynew(1) />
		
		<cfquery name="local.q" datasource="#variables.config.getDSN()#">
			select Form_Id as id, Form_Nm as title, Form_Ds as description
			from Form
			where Start_Dt < <cfqueryparam cfsqltype="cf_sql_date" value="#now()#" > 
				and End_Dt > <cfqueryparam cfsqltype="cf_sql_date" value="#now()#" >
			order by Form_Nm
		</cfquery>
		
		<!--- <cfloop query="local.q">
			<cfscript>
				local.stdata = structnew();
				local.copy = stripHTML(local.q.description,'TEXTFORMAT,FONT');
				
				local.stdata = structnew();
				StructInsert(local.stdata, 'id', local.q.id);
				StructInsert(local.stdata, 'title', local.q.title);
				StructInsert(local.stdata, 'policyCopy', local.copy);
				StructInsert(local.stdata, 'categoryId', local.q.categoryId);
				
				arrayappend(local.results, local.stdata);
			</cfscript>
		</cfloop> --->
		
		<cfset local.results = variables.dtc.queryToArrayOfStructures(local.q, local.results)>
		
		<cfreturn local.results>
	</cffunction>
</cfcomponent>