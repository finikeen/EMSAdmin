<cfcomponent extends="taffy.core.api">
    <cfscript>
		// extends="taffy.core.api"
        THIS.clientmanagement = 'yes';
        //THIS.applicationtimeout = CreateTimeSpan(0,2,0,0); // 0 hours for development, 2 hours for production
        THIS.sessionmanagement = 'yes';
        THIS.setclientcookies = 'yes';
        THIS.setdomaincookies = 'yes';
        THIS.clientmanagement = 'yes';
        THIS.clientstorage = 'clientStorage';
        this.scriptProtect = false;

        THIS.name = hash(getCurrentTemplatePath());
		APPLICATION.encryptSeed = 'cmt';
		APPLICATION.encryptKey = '3E9195BE-306E-11A1-E99F35FC4CD0AB0F';
		APPLICATION.encryptAlgorithm = 'CFMX_COMPAT';

        THIS.ormenabled = true;
        THIS.ormsettings = {datasource="EMSAdmin",
        					useDBForMapping=true,
                            logSQL=true,
                            schema="dbo", // dbo for MicrosoftSQLServer, public for PostreSQL
                            cfcLocation="edu",
                            dialect="MicrosoftSQLServer", // PostgreSQL
                            eventHandler = 'emsadmin.edu.sinclair.emsadmin.bean.AuditInterceptor'}; 
                            // flushAtRequestEnd=false 
                            // if you want to disable default CF ORM save at end of request behavior, then set flushAtRequestEnd=false

       
        //this function is called after the request has been parsed and all request details are known
        function onTaffyRequest(string verb, string cfc, struct requestArguments, string mimeExt){
            //this would be a good place for you to check API key validity and other non-resource-specific validation
            return true;
        }

        //called when taffy is initializing or when a reload is requested
        function configureTaffy(){
            enableDashboard(true);
            setBeanFactory(application.beanfactory);
            setUnhandledPaths('/flex2gateway');
            setDebugKey("debug");
            setReloadKey("reload");
            setReloadPassword("true");
            setDefaultRepresentationClass("emsadmin.api.1.resources.custom.CustomRepresentationClass");
        } 
    </cfscript>

<!--- 
    ************************
    **  OnApplicationStart()
    ************************
    --->
    <cffunction name="onApplicationStart" returntype="boolean" output="yes">
        <cfscript>
            var success = false;

            // PROJECT NAMESPACE
            APPLICATION.emsadmin = StructNew(); 
            application.emsdsn = 'EMSAdmin';
 
            // COLDSPRING
            APPLICATION.beanFactory = createObject("component","coldspring.beans.DefaultXmlBeanFactory");
            APPLICATION.beanFactory.loadBeans("/emsadmin/config/csbeans/beans.xml");
      
            // init the ObjectFactory
            // NOTE: Make sure the ObjectFactory is initialized before any component that uses
            // it to create objects. ie, the controller below this line...
            APPLICATION.emsadmin.objectFactory = APPLICATION.beanFactory.getBean('sinclairObjectFactory');
            APPLICATION.emsadmin.objectFactory.init();

			// initialize a bean factory in a security scope
			// for use with the security API
            APPLICATION.security.objectFactory = APPLICATION.beanFactory.getBean('sinclairObjectFactory');
            APPLICATION.security.objectFactory.init();

            // init the Controller
            APPLICATION.emsadmin.controller = APPLICATION.beanFactory.getBean('sinclairController');
            APPLICATION.emsadmin.controller.init();

            // Initialize Taffy
            super.onApplicationStart();
            
            success = true;
        </cfscript> 
        <cfreturn success>
    </cffunction>
</cfcomponent>