<cfcomponent extends="AbstractCollectionsAPI" hint="base resource class">

	<cffunction name="getCurrentQuarter" access="private" returntype="void" output="true">
		<cfset var local = {} />
		<cfset local.cDate = now() />
		
		<cfquery name="local.qGetCurrentQuarter" datasource="datawarehouseView">
			select term_id_cd, reporting_yr, term_ds
			from term_c
			where term_start_dt < <cfqueryparam cfsqltype="cf_sql_date" value="#local.cdate#">
				and term_end_dt > <cfqueryparam cfsqltype="cf_sql_date" value="#local.cdate#">
		</cfquery>
		<cfscript>
			if (local.qGetCurrentQuarter.recordCount) {
				application.currentQtr = local.qGetCurrentQuarter.term_id_cd;
				application.currentYear = local.qGetCurrentQuarter.reporting_yr;
				application.currentQtrName = rereplacenocase(local.qGetCurrentQuarter.term_ds, listfirst(application.currentQtr,'/'), '20'&listfirst(application.currentQtr,'/'), 'ALL');
			} else {
				application.currentQtr = '12/FA';
				application.currentYear ='2012';
				application.currentQtrName = 'Fall 2012';
			}
		</cfscript>
	</cffunction>
	
	
	<cffunction name="setCurrentQuarter" access="private" returntype="void" output="true">
		<cfargument name="currQtr" type="string" required="true">
		
		<cfset var local = {} />
		<cfset local.qtrString = left(arguments.currQtr, 2) & '/' & rereplacenocase(arguments.currQtr, left(arguments.currQtr, 2), '', 'ALL') />
		
		<cfquery name="local.qGetCurrentQuarter" datasource="datawarehouseView">
			select term_id_cd, reporting_yr, term_ds
			from term_c
			where term_id_cd = <cfqueryparam cfsqltype="cf_sql_varchar" value="#local.qtrString#">
		</cfquery>
		<cfscript>
			if (local.qGetCurrentQuarter.recordCount) {
				application.currentQtr = local.qGetCurrentQuarter.term_id_cd;
				application.currentYear = local.qGetCurrentQuarter.reporting_yr;
				application.currentQtrName = rereplacenocase(local.qGetCurrentQuarter.term_ds, listfirst(application.currentQtr,'/'), '20'&listfirst(application.currentQtr,'/'), 'ALL');
			}
		</cfscript>
	</cffunction>
	
	
	<cffunction name="getScheduleData" access="private" output="true">
		<cfargument name="tartanid" type="numeric" hint="divide by 4567">
		<cfargument name="term" type="string" default="#application.currentQtr#" hint="current term, in YYTT format (ex: 12FA)">
		
		<cfset var local = {} />
		<cfset local.retQuery = querynew('subjectcode, courseno, sectionno','varchar, varchar, varchar') />
		<cfset local.tempQuery = querynew('subjectcode, courseno, sectionno', 'varchar, varchar, varchar') />
		<cftry>
		
		<cfquery name="local.qGetColleagueIDs" datasource="datawarehouseView">
			select scs.course_section_id_nb
			from student_academic_credit_c sac
			inner join student_academic_credit_status_c sacs
				ON sac.student_academic_credit_id = sacs.student_academic_credit_id
				and sacs.status_line_ct = <cfqueryparam cfsqltype="cf_sql_integer" value="1">
				and sacs.status_cd in ('A','N')
			inner join student_course_section_c scs
				ON scs.student_course_section_id = sac.student_course_section_id
			where sac.student_id_nb = <cfqueryparam cfsqltype="cf_sql_varchar" value="#numberformat((arguments.tartanid/4567),'0000000')#">
			  and sac.term_id_cd like <cfqueryparam cfsqltype="cf_sql_varchar" value="#left(arguments.term,2)#/#ucase(right(arguments.term,2))#%">
		</cfquery>
		
		<cfloop query="local.qGetColleagueIDs">
			<cfset coursekey = qGetColleagueIDs.course_section_id_nb />
			
			<cfquery name="local.qGetCourses" datasource="bulletin">
				select deptid, courseno, sectionno, alttitle, credithours, starttime, endtime, days, building, faculty, startdate, enddate
				from schedules
				where coursekey = <cfqueryparam cfsqltype="cf_sql_varchar" value="#coursekey#">
			</cfquery>
			
			<cfscript>
				queryaddrow(local.tempQuery,1);
				querysetcell(local.tempQuery, 'subjectCode', local.qGetCourses.deptid, local.qGetColleagueIDs.currentRow);
				querysetcell(tempQuery, 'courseNo', qGetCourses.courseno, qGetColleagueIDs.currentRow);
				if (len(trim(local.qGetCourses.courseno)) lt 3 and isnumeric(qGetCourses.courseno)) {
					local.qGetCourses.courseno = numberformat(local.qGetCourses.courseno,'000');
				}
				querysetcell(local.tempQuery, 'sectionNo', local.qGetCourses.sectionno, local.qGetColleagueIDs.currentRow);
			</cfscript>
		</cfloop>
		
		<cfquery name="local.q" dbtype="query">
			select subjectcode, courseno, sectionno
			from tempQuery
			order by subjectcode, courseno
		</cfquery>
		<cfcatch type="any">
			<!--- <cfset temp = senderror(tempQuery,cfcatch,'getCurrentSchedule') /> --->
			<cfdump var="#cfcatch#"><cfabort>
		</cfcatch>
		</cftry>
		
		<cfreturn local.q>
	</cffunction>
	
	
	<cffunction name="getFormNameByFormId" access="private" returntype="string" output="false" hint="
		">
		<cfargument name="formid" type="string" required="true">
		<cfset var local = {} />
		<cfset local.retString = ''>
		
		<cfquery name="local.q" datasource="#application.emsDSN#">
			select form_nm
			from Form
			where form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.formid#">
		</cfquery>
		<cfif local.q.recordcount>
			<cfset local.retString = local.q.form_nm />
		</cfif>
		
		<cfreturn local.retString>
	</cffunction>
	
	
	<cffunction name="getFieldIdByFormIdAndFieldFilter" access="private" returntype="string" output="false" hint="
		requires: student evaluation id
		optional: filter (string: question description keyword)
				  wildcard (boolean: wrap the filter in wildcards)
		gets all questionIds from the local database
		filtered by formId and keyword
		returns: string (comma-delimited list of questionIds)">
		<cfargument name="id" type="string" required="true">
		<cfargument name="filter" type="string" required="false" default="">
		<cfargument name="wildcard" type="boolean" required="false" default="false">
		<cfset var local = {} />
		<cfset local.retVal = 'Not Found' />
		<cfset local.filter = arguments.filter />
		<cfif arguments.wildcard>
			<cfset local.filter = '%' & local.filter & '%' />
		</cfif>
		
		<cfquery name="local.q" datasource="#application.emsDSN#">
			select form_question_id
			from form_question
			where form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#trim(listlast(arguments.id,'*'))#">
			<cfif len(trim(arguments.filter))>
				and question_ds like <cfqueryparam cfsqltype="cf_sql_varchar" value="#trim(local.filter)#">
			</cfif>
			union
			select subfield_id as form_question_id
			from form_question_subfield
			where form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#trim(listlast(arguments.id,'*'))#">
			<cfif len(trim(arguments.filter))>
				and subfield_ds like <cfqueryparam cfsqltype="cf_sql_varchar" value="#trim(local.filter)#">
			</cfif>
		</cfquery>
		<cfif local.q.recordcount>
			<cfset local.retVal = local.q.form_question_id />
			<!--- <cfset local.retVal = getAnswerByFormIdAndFieldId(studentId=arguments.id, fieldId=local.q.form_question_id) /> --->
		</cfif>

		<cfreturn local.retVal>
	</cffunction>
	
	
	<cffunction name="getAnswerByFormIdAndFieldId" access="private" returntype="string" output="false" hint="
		">
		<cfargument name="studentId" type="string" required="true">
		<cfargument name="fieldId" type="string" required="true">
		<cfset var local = {} />
		<cfset local.retString = '' />
		
		<cfquery name="local.q" datasource="#application.emsDSN#">
			select answer_ds
			from student_evaluation_question
			where student_evaluation_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.studentId#">
				and form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#listlast(arguments.studentId, '*')#">
				and form_question_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.fieldId#">
		</cfquery>
		<cfset local.retString = local.q.answer_ds />
		
		<cfreturn local.retString>
	</cffunction>
	
	
	<cffunction name="createErrorStruct" access="private" output="false" returntype="struct">
		<cfargument name="catchObject" type="any" required="true" hint="the cfcatch object">
		<cfargument name="argObject" type="any" required="true" hint="the arguments object">
		<cfscript>
			var local = {};
			local.retQuery = querynew("error, details, arguments");
			queryaddrow(local.retQuery, 1);
			querysetcell(local.retQuery, "error", arguments.catchObject.message, 1);
			querysetcell(local.retQuery, "details", arguments.catchObject.detail, 1);
			querysetcell(local.retQuery, "arguments", arguments.argObject, 1);
			
			local.stdata = {
				rows = arrayfromquery(local.retQuery),
				success = false,
				results = local.retQuery.recordCount
			};
			return local.stdata;
		</cfscript>
	</cffunction>
	
	
	<cffunction name="arrayFromQuery" access="private" output="false" displaymethod="false" returntype="array" hint="Takes the input query and writes its values to an array of structures">
		<cfargument name="objectQuery" type="query" required="true">
		<cfscript>
			var ary = arraynew(1);
		</cfscript>

		<cfloop query="objectQuery">
			<cfset indx = structnew() />
			<cfloop list="#objectQuery.columnlist#" index="x">
				<cfset "indx.#x#" = evaluate("objectQuery." & #x#) />
			</cfloop>
			<cfset temp = arrayappend(ary, indx) />
		</cfloop>

		<cfreturn ary>
	</cffunction>
</cfcomponent>