<cfcomponent extends="emsadmin.api.1.resources._base" taffy_uri="/emsFormBuilder/{formId}">

	<cffunction name="get" access="public" output="true" hint="returns an EMS form data by hash mined from Wufoo. used to build the actual form w/ no data.">
		<cfargument name="formId" type="string" required="true" hint="form hash value from Wufoo">
		<cfset var local = {} />
		<cfset local.stdata = {} />
		<cfset local.retArray = arraynew(1) />
		<cfset local.success = true />
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#">
				select form_question_id, question_ds
				from Form_Question
				where form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.formId#">
					and form_question_id like <cfqueryparam cfsqltype="cf_sql_varchar" value="FIELD%">
			</cfquery>
			<cfloop query="local.q">
				<cfscript>
					questionData = structnew();
					structinsert(questionData, 'id', local.q.form_question_id);
					structinsert(questionData, 'question', local.q.question_ds);
					structinsert(questionData, 'subfields', getSubFields(arguments.formId, local.q.form_question_id));
					arrayappend(local.retArray, questionData);
				</cfscript>
			</cfloop>
		<cfcatch type="any">
			<cfdump var="#cfcatch#">
			<cfscript>
				local.success = false;
				local.retArray = arraynew(1);
				str = structnew();
				str.error = cfcatch.message;
				str.details = cfcatch.detail;
				arrayappend(local.retArray, str);
			</cfscript>
		</cfcatch>
		</cftry>
		<cfscript>
			structinsert(local.stdata, 'rows', local.retArray);
			structinsert(local.stdata, 'success', local.success);
			structinsert(local.stdata, 'results', arraylen(local.retArray));
		</cfscript>
		
		<cfreturn representationOf(local.stdata).withStatus(200)>
	</cffunction>
	
	
	<cffunction name="getSubFields" access="private" returntype="array">
		<cfargument name="formId" type="string" required="true">
		<cfargument name="questionId" type="string" required="true">
		<cfset var local = {} />
		<cfset local.retArray = arraynew(1) />
		
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#">
				select subfield_type, subfield_ds, subfield_id
				from Form_Question_Subfield
				where form_question_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.questionId#">
					and form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.formId#">
			</cfquery>
			<cfloop query="local.q">
				<cfscript>
					subfieldData = structnew();
					structinsert(subfieldData, 'id', local.q.subfield_id);
					structinsert(subfieldData, 'subfieldType', local.q.subfield_type);
					structinsert(subfieldData, 'subfieldDesc', local.q.subfield_ds);
					structinsert(subfieldData, 'choices', getChoices(arguments.formId, arguments.questionId));
					arrayappend(local.retArray, subfieldData);
				</cfscript>
			</cfloop>
		<cfcatch type="any">
			<cfscript>
				local.retQuery = querynew("error, details");
				queryaddrow(local.retQuery, 1);
				querysetcell(local.retQuery, "error", cfcatch.message, 1);
				querysetcell(local.retQuery, "details", cfcatch.detail, 1);
			</cfscript>
		</cfcatch>
		</cftry>
		
		<cfreturn local.retArray>
	</cffunction>
	
	
	<cffunction name="getChoices" access="private" returntype="array">
		<cfargument name="formId" type="string" required="true">
		<cfargument name="questionId" type="string" required="true">
		<cfset var local = {} />
		<cfset local.retArray = arraynew(1) />
		
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#">
				select choice_order, choice_ds
				from Form_Question_Choice
				where form_question_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.questionId#">
					and form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.formId#">
				order by choice_order
			</cfquery>
			<cfloop query="local.q">
				<cfscript>
					choiceData = structnew();
					structinsert(choiceData, 'orderId', local.q.choice_order);
					structinsert(choiceDesc, 'choiceDesc', local.q.choice_ds);
					arrayappend(local.retArray, choiceData);
				</cfscript>
			</cfloop>
		<cfcatch type="any">
			<cfscript>
				local.retQuery = querynew("error, details");
				queryaddrow(local.retQuery, 1);
				querysetcell(local.retQuery, "error", cfcatch.message, 1);
				querysetcell(local.retQuery, "details", cfcatch.detail, 1);
			</cfscript>
		</cfcatch>
		</cftry>
		
		<cfreturn local.retArray>
	</cffunction>
</cfcomponent>