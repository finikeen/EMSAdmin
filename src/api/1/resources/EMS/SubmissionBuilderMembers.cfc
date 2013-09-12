<cfcomponent extends="emsadmin.api.1.resources._base" taffy_uri="/emsSubmissionBuilder/{entryId}">

	<cffunction name="get" access="public" output="true" hint="returns an EMS form data by hash mined from Wufoo.">
		<cfargument name="entryId" type="string" required="true" hint="student evaluation id from dbase">
		<cfset var local = {} />
		<cfset local.stdata = {} />
		<cfset local.retArray = arraynew(1) />
		<cfset local.success = true />
		<cftry>
			<cfquery name="local.q" datasource="#application.emsDSN#">
				select *
				from Student_Evaluation
				where Student_Evaluation_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.entryId#">
			</cfquery>
			<cfscript>
				local.evaluation = structnew();
				structinsert(local.evaluation, 'studentid', local.q.tartan_id);
				structinsert(local.evaluation, 'firstname', local.q.first_nm);
				structinsert(local.evaluation, 'lastname', local.q.last_nm);
				structinsert(local.evaluation, 'evaluator', local.q.evaluator_nm);
				structinsert(local.evaluation, 'evaluatorid', local.q.evaluator_id);
				structinsert(local.evaluation, 'date', local.q.evaluation_dt);
				structinsert(local.evaluation, 'type', local.q.evaluation_type_ds);
				structinsert(local.evaluation, 'answers', arraynew(1));
			</cfscript>
			<cfquery name="local.qq" datasource="#application.emsDSN#">
				select seq.form_question_id, seq.answer_ds
				from student_evaluation_question seq
				where seq.student_evaluation_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.entryId#">
			</cfquery>
			<cfloop query="local.qq">
				<cfscript>
					answer = structnew();
					structinsert(answer, 'questionid', local.qq.form_question_id);
					structinsert(answer, 'answer', local.qq.answer_ds);
					structinsert(answer, 'fieldtype', getSubfieldType(local.qq.form_question_id));
					arrayappend(local.evaluation.answers, answer);
				</cfscript>
			</cfloop>
			<cfset temp = arrayappend(local.retArray, local.evaluation) />
		<cfcatch type="any">
			<cfdump var="#cfcatch#"><cfabort>
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
	
	
	<cffunction name="getSubfieldType" access="private" returntype="string">
		<cfargument name="questionId" type="string" required="true">
		<cfset var local = {} />
		<cfset local.retValue = '' />
		<cfquery name="local.q" datasource="#application.emsDSN#">
			select subfield_type
			from form_question_subfield
			where form_question_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.questionId#">
		</cfquery>
		<cfset local.retValue = local.q.subfield_type />
		<cfreturn local.retValue />
	</cffunction>
</cfcomponent>