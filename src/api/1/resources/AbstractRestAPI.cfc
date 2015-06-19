<cfcomponent displayname="AbstractRestAPI" extends="taffy.core.resource">
	
	<cfset variables.dataTypeUtil = Application.beanFactory.getBean('dataTypeUtil') >
	
	<cffunction name="sendError" access="remote" returntype="void">
		<cfargument name="prop1" type="any" required="false" default="#structnew()#">
		<cfargument name="prop2" type="any" required="false" default="#structnew()#">
		<cfargument name="funcName" type="string" required="false" default="wtf">
		
<cfmail to="brian.cooney@sinclair.edu"
		from="mac.emsadmin@sinclair.edu"
		subject="error :: #arguments.funcName#"
		type="html">
		<cfdump var="#arguments.prop1#">
		<cfdump var="#arguments.prop2#">
</cfmail>
	</cffunction>
</cfcomponent>