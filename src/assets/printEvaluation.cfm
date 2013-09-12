<html>
<cfoutput>
<head>
<cfsilent>
<cfquery name="local.q" datasource="EMSAdmin">
	select form_nm
	from Form
	where form_id = <cfqueryparam cfsqltype="cf_sql_varchar" value="#listlast(url.form,'*')#">
</cfquery>
</cfsilent>
<cfscript>
	form.formid = listlast(url.form,'*');
	form.entryid = url.form;
	formName = local.q.form_nm;
	
	restUrl = 'http://rest.sinclair.edu/api/1/index.cfm/emsFormBuilder/' & form.formid;
	httpCall = new http();
	httpCall.setMethod("get");
	httpCall.setUrl(restUrl);
	httpCall.addParam(type="header", name="accept", value="application/xml");
	result = httpCall.send().getPrefix();
	xmldata = xmlparse(result.filecontent);
	rows = xmlsearch(xmldata, 'XML_ELEMENT/ROWSES')[1].XmlChildren;
	success = xmlsearch(xmldata, 'XML_ELEMENT/SUCCESS')[1].XmlText;
	count = xmlsearch(xmldata, 'XML_ELEMENT/RESULTS')[1].XmlText;
	qArray = arraynew(1);
	
	restUrl2 = 'http://rest.sinclair.edu/api/1/index.cfm/emsSubmissionBuilder/' & form.entryid;
	httpCall2 = new http();
	httpCall2.setMethod("get");
	httpCall2.setUrl(restUrl2);
	httpCall2.addParam(type="header", name="accept", value="application/xml");
	result2 = httpCall2.send().getPrefix();
	xmldata2 = xmlparse(result2.filecontent);
	success2 = xmlsearch(xmldata2, 'XML_ELEMENT/SUCCESS')[1].XmlText;
	rows2 = xmlsearch(xmldata2, 'XML_ELEMENT/ROWSES')[1].XmlChildren;
	count2 = xmlsearch(xmldata2, 'XML_ELEMENT/RESULTS')[1].XmlText;
	
	items = arraynew(1);
	for (e=1; e lte count2; e=e+1) {
		data = rows2[e].XmlChildren;
		for (f=1; f lte arraylen(data); f=f+1) {
			if (data[f].XmlName is "Answerses") {
				answers = data[f].Xmlchildren;
				for (aa=1; aa lte arraylen(answers); aa=aa+1) {
					answer = answers[aa].XmlChildren;
					item = structnew();
					for (ab=1; ab lte arraylen(answer); ab=ab+1) {
						if (answer[ab].XmlName is "questionid") {
							item.question = answer[ab].XmlText;
						}
						if (answer[ab].XmlName is "answer") {
							item.answer = answer[ab].XmlText;
						}
						if (answer[ab].XmlName is "fieldtype") {
							item.type = answer[ab].XmlText;
						}
					}
					arrayappend(items, item);
				}
			}
		}
	}
</cfscript>
</head>
<body>

<h3 style="padding-left: 2px;">#formName#</h3>
<cftry>
<cfif success>
<form id="#form.formid#" name="#form.formid#">
<cfloop from="1" to="#count#" step="1" index="a">
	<cfset data = rows[a].XmlChildren />
	<dl><cfloop from="1" to="#arraylen(data)#" step="1" index="b">
	<!--- write the question on the page --->
	<cfif data[b].XmlName is "QUESTION"><dt style="font-family: Helvetica; font-size: .8em; font-weight: bold;">#a#. #data[b].XmlText#</dt></cfif>
	<!--- write the input fields on the page --->
	<dd style="font-family: Helvetica; font-size: .7em;"><cfif data[b].XmlName is "SUBFIELDSES">
		<cfset fields = data[b].XmlChildren />
		<cfloop from="1" to="#arraylen(fields)#" step="1" index="c">
			<cfset fielddata = fields[c].XmlChildren />
			<cfset fieldstruct = structnew() />
			<cfloop from="1" to="#arraylen(fielddata)#" step="1" index="d">
				<cfif fielddata[d].XmlName is "SUBFIELDTYPE">
					<cfset fieldstruct.type = fielddata[d].XmlText />
				</cfif>
				<cfif fielddata[d].XmlName is "SUBFIELDDESC">
					<cfset fieldstruct.desc = fielddata[d].XmlText />
				</cfif>
				<cfif fielddata[d].XmlName is "ID">
					<cfset fieldstruct.id = fielddata[d].XmlText />
				</cfif>
				<cfif fielddata[d].XmlName is "CHOICESES">
					<cfset choices = fielddata[d].XmlChildren />
					<cfset fieldstruct.choices = arraynew(1) />
					<cfloop from="1" to="#arraylen(choices)#" step="1" index="e">
						<cfset choice = choices[e].XmlChildren[2].XmlText />
						<cfset temp = arrayappend(fieldstruct.choices, choice) />
					</cfloop>
				</cfif>
			</cfloop>
			<!--- only show FIELDxxxx items??? --->
			<cfif fieldstruct.id contains "FIELD">
			<cfswitch expression="#fieldstruct.type#">
			<cfcase value="shortname,number,date,text" delimiters=",">
				<cfset fieldvalue = "" />
				<cfloop from="1" to="#arraylen(items)#" step="1" index="h">
					<cfif fieldstruct.id is items[h].question>
						<cfset fieldvalue = items[h].answer>
						<cfbreak>
					</cfif>
				</cfloop>
				#fieldvalue#
				<!--- #fieldstruct.desc# <input type="text" name="#fieldstruct.id#" value="#fieldvalue#"> --->
			</cfcase>
			<cfcase value="checkbox">
				<cfset fieldvalue = "" />
				<cfloop from="1" to="#arraylen(items)#" step="1" index="k">
					<cfif fieldstruct.id is items[k].question and len(trim(items[k].answer))>
						<cfset fieldvalue = "checked">
						<cfbreak>
					</cfif>
				</cfloop>
				<input type="checkbox" name="#fieldstruct.id#" #fieldvalue# readonly="readonly">#fieldstruct.desc#<br/>
			</cfcase>
			<cfcase value="textarea">
				<cfset fieldvalue = "" />
				<cfloop from="1" to="#arraylen(items)#" step="1" index="i">
					<cfif fieldstruct.id is items[i].question>
						<cfset fieldvalue = items[i].answer>
						<cfbreak>
					</cfif>
				</cfloop>
				#fieldvalue#
				<!--- <textarea name="#fieldstruct.id#" cols="60" rows="6">#fieldvalue#</textarea> --->
			</cfcase>
			<cfcase value="select">
				<cfset fieldvalue = "" />
				<cfloop from="1" to="#arraylen(items)#" step="1" index="m">
					<cfif fieldstruct.id is items[m].question>
						<cfset fieldvalue = items[m].answer>
						<cfbreak>
					</cfif>
				</cfloop>
				#fieldvalue#
				<!--- <select name="#fieldstruct.id#">
				<cfloop from="1" to="#arraylen(fieldstruct.choices)#" step="1" index="f">
					<option value="#fieldstruct.choices[f]#"<cfif fieldstruct.choices[f] is fieldvalue> selected</cfif>>#fieldstruct.choices[f]#</option>
				</cfloop>
				</select> --->
			</cfcase>
			<cfcase value="radio">
				<cfset fieldvalue = "" />
				<cfloop from="1" to="#arraylen(items)#" step="1" index="j">
					<cfif fieldstruct.id is items[j].question>
						<cfset fieldvalue = items[j].answer>
						<cfbreak>
					</cfif>
				</cfloop>
				<cfloop from="1" to="#arraylen(fieldstruct.choices)#" step="1" index="g">
					<cfif fieldstruct.choices[g] is fieldvalue>#fieldstruct.choices[g]#</cfif>
					<!--- <input type="radio" id="#fieldstruct.id#" value="#fieldstruct.choices[g]#"<cfif fieldstruct.choices[g] is fieldvalue> checked</cfif>>#fieldstruct.choices[g]#<br/> --->
				</cfloop>
			</cfcase>
			<cfdefaultcase>
				<cfdump var="#fieldstruct#">
			</cfdefaultcase>
			</cfswitch>
			</cfif>
		</cfloop>
	</cfif></dd>
	</cfloop></dl>
</cfloop>
</form>
</cfif>

<!--- <form id="#form.formname#" name="#form.formname#" method="post" onSubmit="#form.scriptname#(this); return false;">
	<input type="hidden" name="#form.fieldname#" value="<cfif isnumeric(form.id)>#numberformat(form.id,'0000000')#<cfelse>#form.id#</cfif>">
</form>
<div style="width: '100%'; margin: auto; text-align: center;"><a href="javascript:;" onClick="$('###form.formname#').submit();">Go Back</a></div> --->
<cfcatch type="any">
	<cfdump var="#cfcatch#">
</cfcatch>
</cftry>
</body></cfoutput>

</html>