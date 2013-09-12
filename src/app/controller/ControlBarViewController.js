Ext.define('Adm.controller.ControlBarViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        appEventsController: 'appEventsController',
        formUtils: 'formRendererUtils',
        securityService: 'securityService',
		authenticatedUser: 'authenticatedUser'
    },
    control: {
        view: {
            add: 'setListeners'
        },
        
        /* 'dashboardViewNav': {
            click: 'onDashboardViewNavClick'
        },
        
        'adminViewNav': {
            click: 'onAdminViewNavClick'
        }, */
        
        'logoutButton': {
            click: 'onLogoutClick'
        },
        
        'roleChangeNav': {
            click: 'onRoleChangeClick'
        }
    },
    config: {
        personButtonsVisible: true
    },
    
    init: function(){
        var me = this;
        // console.log(me.authenticatedUser.get('AVAILABLEROLES').length);
        return me.callParent(arguments);
    },
    
    setListeners: function(container, component, index, obj){
		// console.log(me.authenticatedUser.get('AVAILABLEROLES').length);
    },
    
    destroy: function(){
        return this.callParent(arguments);
    },
    
    /* onDisplayDashboardView: function(){
        this.displayDashbaordView();
    },
    
    onDashboardViewNavClick: function(obj, eObj){
        this.displayDashboardView();
    },
    
    onAdminViewNavClick: function(obj, eObj){
        this.displayAdminView();
    }, */
    
    onRoleChangeClick: function(obj, eObj){
        this.displayRoleScreen();
    },
    
    onLogoutClick: function(obj, eObj){
        var me = this;
        
        me.securityService.doLogout({
            success: me.logoutSuccess,
            failure: me.logoutFailure,
            scope: me
        });
    },
    
    logoutSuccess: function(response, scope){
        var me = scope;
        
        // console.log("Success: " + response);
        
        me.displayLoginScreen();
    },
    
    logoutFailure: function(response, scope){
        var me = scope;
        
        // console.log("logoutFailure: " + response);
    },
    
    displayLoginScreen: function(){
        var comp = this.formUtils.loadDisplay('mainview', 'loginform', true, {});
        // loadDisplay (locationToLoadInto, componentToLoad, passParameters(true/false), parameters)
    },
    
    displayRoleScreen: function(){
        var comp = this.formUtils.loadDisplay('mainview', 'roleform', true, {});
    }
	/* ,
    
    displayDashboardView: function(){
        var me = this;
        var mainView = Ext.ComponentQuery.query('mainDisplay')[0];
        var arrViewItems;
        
        if (mainView.items.length > 0) {
            mainView.removeAll();
        }
        
        arrViewItems = [{
            xtype: 'dashboard',
            flex: 1
        }];
        
        mainView.add(arrViewItems);
    },
    
    displayAdminView: function(){
        var me = this;
        var mainView = Ext.ComponentQuery.query('mainDisplay')[0];
        var arrViewItems;
        
        if (mainView.items.length > 0) {
            mainView.removeAll();
        }
        
        arrViewItems = [{
            xtype: 'adminmain',
            items: [{
                xtype: 'admintreemenu',
                flex: 1
            }, {
                xtype: 'adminforms',
                flex: 3
            }],
            flex: 1
        }];
        
        mainView.add(arrViewItems);
    } */
});
