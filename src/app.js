Ext.Loader.setConfig({
	enabled: true,
	paths: {
		'Adm': '/emsadmin/app', 
		'ContextName': 'adm'
	}
});

Ext.require([

	// VIEWS
	'Adm.view.Viewport',
    'Adm.view.admin.AdminMain',
    'Adm.view.admin.AdminTreeMenu',
    'Adm.view.admin.AdminForms',
    'Adm.view.Main',
	'Adm.view.Dashboard', 
	'Adm.view.ControlBar',
	'Adm.view.Search',
	'Adm.view.EvaluationList',
	'Adm.view.ViewEvaluation',
    'Adm.view.component.MappedTextField',
    'Adm.view.component.MappedTextArea',
    'Adm.view.component.MappedCheckBox',
    'Adm.view.component.MappedRadioButton',
    
    // ERROR DISPLAYS
    'Adm.view.ErrorWindow',
    
    // REPORT DISPLAY
    'Adm.view.Report',
    
	// MODELS
    'Adm.model.SimpleItemDisplay',
    'Adm.model.ObjectPermission',
    'Adm.model.AuthenticatedPerson',
    'Adm.model.Preferences',
    'Adm.model.FieldError',
    'Adm.model.Configuration',
	'Adm.model.TemplateModel',
	'Adm.model.Form',
	'Adm.model.Evaluation',
	'Adm.model.Search',
	'Adm.model.reference.AbstractReference',
	'Adm.model.reference.TemplateReferenceModel',
    'Adm.model.util.TreeRequest',
	
	// API
	'Adm.model.ApiUrl',
	'Adm.mixin.ApiProperties',
	
    // EXT OVERRIDES - This is includes static method that runs at the start of the application
    'Adm.util.Overrides',	
	
	// UTIL CLASSES
	'Adm.util.FormRendererUtils',
	'Adm.util.ColumnRendererUtils',
	'Adm.util.TreeRendererUtils',
	'Adm.util.PrinterUtils',
	'Adm.util.Constants',
	
	// STORES
	'Adm.store.admin.AdminTreeMenus',
	'Adm.store.TemplateModels',
	'Adm.store.Forms',
	'Adm.store.Evaluations',
	'Adm.store.reference.AbstractReferences',
	'Adm.store.reference.AbstractRemoteReferences',
	'Adm.store.reference.TemplateReferenceModels',
    'Adm.store.reference.YesNo',
    'Adm.store.reference.Ages',
    'Adm.store.reference.FormGroups',
	
	// SERVICES
    'Adm.service.AbstractService',
    'Adm.service.TemplateService',
    'Adm.service.EvaluationService',
    'Adm.service.FormBuilderService',
    'Adm.service.SubmissionBuilderService',
	
	// CONTROLLERS / EVENTS
    'Adm.controller.ApplicationEventsController',
	
	///////////////////////////////////////////////////////////
	// SECURITY 
	///////////////////////////////////////////////////////////
	// SECURITY VIEWS 
	'Adm.view.security.Login',
	'Adm.view.security.Role',
	
	// SECURITY MODELS
	'Adm.model.security.AuthenticatedUser',
	'Adm.model.security.Role',
	'Adm.model.security.AccessType',
	
	// SECURITY STORES
	'Adm.store.security.Roles',
	'Adm.store.security.AccessTypes',
	
	// SECURITY SERVICES
    'Adm.service.security.SecurityService',
	
	// SENCHA EXT UTIL CLASSES
     'Ext.tab.*',
	'Ext.util.Filter',
	'Ext.data.TreeStore',
	'Ext.dd.DropTarget',
	'Ext.data.Store',
	'Ext.form.field.VTypes',
	'Ext.form.field.Text',
	'Ext.form.field.TextArea',
	'Ext.form.FieldSet',
	// 'Ext.ux.CheckColumn', 
	// 'Ext.ux.form.MultiSelect', 
	// 'Ext.ux.form.ItemSelector',
	'Ext.ux.BoxReorderer',
	'Ext.ux.SlidingPager',
	'Ext.ux.ToolbarDroppable',
	'Ext.ux.data.PagingMemoryProxy',
	'Ext.util.MixedCollection',
	'Ext.util.TaskRunner',
	'Ext.tree.*',
	'Ext.toolbar.Paging',
	'Ext.toolbar.Spacer',
	'Ext.form.field.ComboBox',
	'Ext.grid.*'
]);

var apiUrls = [
  {name: 'forms', url: 'emsForm.json'},
  {name: 'updateform', url: 'emsForm'},
  {name: 'entries', url: 'emsEntries.json'},
  {name: 'formbuilder', url: 'emsFormBuilder/'},
  {name: 'submissionbuilder', url: 'emsSubmissionBuilder/'}
];

Ext.onReady(function(){	

	// configure the application
	Deft.Injector.configure({
        overrides: {
            fn: function(){
                return new Adm.util.Overrides({});
            },
            singleton: true
        },
		showNavLinks: {
            value: true
        },		
		showAdminLink: {
            value: true
        },
		appParentDivId: {
			value: appParentDivId
		},
		renderAppFullScreen: {
			value: renderAppFullScreen
		},
        applicationName: {
            value: 'EMS Forms Administration'
        },
		apiUrlStore: {
			fn: function(){
				var urlStore = Ext.create('Ext.data.Store', {
					 model: 'Adm.model.ApiUrl',
					 storeId: 'apiUrlStore'
				 });
				
				urlStore.loadData( apiUrls );
				
				return urlStore;
			},
			singleton: true
		},
		admConfig: {
			fn: function(){
				return new Adm.model.Configuration({});
			},
			singleton: true
		},
		authenticatedPerson: {
			fn: function(){
				var p = new Adm.model.AuthenticatedPerson();
				// p.populateFromGenericObject( user );
				// p.setObjectPermissions();
				return p;
			},
			singleton: true
		},
		preferences: {
			fn: function(){
				return new Adm.model.Preferences();
			},
			singleton: true
		},
		searchData: {
			fn: function(){
				return new Adm.model.Search();
			},
			singleton: true
		},
		apiProperties: {
			fn: function(){
				return new Adm.mixin.ApiProperties({});
			},
			singleton: true
		},
		formRendererUtils:{
			fn: function(){
				return new Adm.util.FormRendererUtils({});
			},
			singleton: true
		},
		columnRendererUtils:{
			fn: function(){
				return new Adm.util.ColumnRendererUtils({});
			},
			singleton: true
		},
		treeRendererUtils:{
			fn: function(){
				return new Adm.util.TreeRendererUtils({});
			},
			singleton: true
		},
		appEventsController:{
			fn: function(){
				return new Adm.controller.ApplicationEventsController({});
			},
			singleton: true
		},
		treeStore:{
			fn: function(){
				return Ext.create('Ext.data.TreeStore',{
					root: {
					  text: 'root',
					  expanded: true,
					  children: []
					}
				});
			},
			singleton: true
		},
		errorsStore:{
			fn: function(){
				return Ext.create('Ext.data.Store',{
					model: 'Adm.model.FieldError'
				});
			},
			singleton: true
		},
		// STORES
		abstractReferencesStore: 'Adm.store.reference.AbstractReferences',
		adminTreeMenusStore: 'Adm.store.admin.AdminTreeMenus',
		templateModelsStore: 'Adm.store.TemplateModels',
		templateReferenceModelsStore: 'Adm.store.reference.TemplateReferenceModels',
		yesNoStore: 'Adm.store.reference.YesNo',
		agesStore: 'Adm.store.reference.Ages',
		formGroupsStore: 'Adm.store.reference.FormGroups',
		formsStore: 'Adm.store.Forms',
		evaluationsStore: 'Adm.store.Evaluations',
			
		// SERVICES
		templateService: 'Adm.service.TemplateService',
		evaluationService: 'Adm.service.EvaluationService',
		formBuilderService: 'Adm.service.FormBuilderService',
		submissionBuilderService: 'Adm.service.SubmissionBuilderService',
		
		///////////////////////////////
		// SECURITY OBJECTS
		authenticatedUser:{
			fn: function(){
				return new Adm.model.security.AuthenticatedUser();
			},
			singleton: true
		},
		
		// SECURITY STORES
		rolesStore: 'Adm.store.security.Roles',
		accessTypesStore: 'Adm.store.security.AccessTypes',
		
		// SECURTY SERVICES
		securityService: 'Adm.service.security.SecurityService'
		////////////////////////////////		
	});
				
	Ext.application({
		name: 'Adm',
		appFolder: Ext.Loader.getPath('Adm'),
		autoCreateViewport: true,
		launch: function( app ) {
			var me=this;
			Deft.Injector.providers.appEventsController.value.config.app=me;
			Deft.Injector.providers.appEventsController.value.app=me;
	   }
	});	
		
		
});