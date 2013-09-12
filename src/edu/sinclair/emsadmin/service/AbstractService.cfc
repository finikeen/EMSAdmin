<cfcomponent hint="base helper functions for all services">


	<cffunction name="arrayFromQuery" access="public" output="false" displaymethod="false" returntype="array" hint="Takes the input query and writes its values to an array of structures">
		<cfargument name="objectQuery" type="query" required="true">
		<cfset var ary = arraynew(1) />

		<cfloop query="objectQuery">
			<cfset indx = structnew() />
			<cfloop list="#objectQuery.columnlist#" index="x">
				<cfset "indx.#x#" = evaluate("objectQuery." & #x#) />
			</cfloop>
			<cfset temp = arrayappend(ary, indx) />
		</cfloop>

		<cfreturn ary>
	</cffunction>


	<cffunction name="stripHTML" access="remote" output="true" returntype="string">
		<!--- Function Arguments --->
		<cfargument name="objectString" type="string" required="false" default="">
		<cfargument name="badTagList" type="string" required="false" default="" hint="comma delimited list of 'bad tags' to remove. (ie: 'div,span,float')">
		<cfargument name="startPos" type="numeric" required="false" default="1">
		<cfargument name="endPos" type="numeric" required="false" default="1">

		<cfscript>
			/* default variables */
			var retString = arguments.objectString;
			var testString = '';
			var hasHTML = true;
			var missingCount = 0;

			/* 'loop' over input string until no html found */
			for (;hasHTML is true;) {
				arguments.startPos = findnocase('<', arguments.objectString, arguments.startPos);
				arguments.endPos = findnocase('>', arguments.objectString, arguments.startPos);

				if (arguments.startPos gt 0 and arguments.endPos gt 0 and arguments.endPos gte arguments.startPos) {
					testString = removechars(arguments.objectString, arguments.endPos, 999999);
					testString = reverse(removechars(reverse(testString), (arguments.endPos-arguments.startPos), 999999));
					/* loop over 'bad tag list' */
					for (i=1; i lte listlen(arguments.badTagList,','); i=i+1) {
						if (findnocase(listgetat(arguments.badTagList, i, ','), testString, 0) gt 0) {
							/* backup the total count of all removed characters */
							killstart = arguments.startPos - missingCount;
							if (killstart gt 0) {
								/* remove the 'bad tag' */
								retString = removechars(retString, killstart, (arguments.endPos-arguments.startPos+1));
								/* increment the count of removed characters */
								missingCount = missingCount + (arguments.endPos-arguments.startPos+1);
							}
							/* only remove it once ;) */
							break;
						}
					}
				} else {
					/* no html found */
					hasHTML = false;
				}
				/* advance the start position to the next tag */
				arguments.startPos = arguments.endPos;
			}

			/* return string */
			return retString;
		</cfscript>
	</cffunction>
	
</cfcomponent>