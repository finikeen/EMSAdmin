Ext.define('Adm.controller.security.LoginViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        accessTypesStore: 'accessTypesStore',
        authenticatedUser: 'authenticatedUser',
        formUtils: 'formRendererUtils',
        rolesStore: 'rolesStore',
        securityService: 'securityService'
    },
    // add listeners to each button on the form
    control: {
        loginButton: {
            selector: '#loginButton',
            listeners: {
                click: 'onLoginButtonClick'
            }
        },
        resetButton: {
            selector: '#resetButton',
            listeners: {
                click: 'onResetButtonClick'
            }
        },
        
        usernameField: '#username',
        passwordField: {
            selector: '#password',
            listeners: {
                specialkey: function(f, e){
                    if (e.getKey() == e.ENTER) {
                        // console.log('enter key pressed');
                        this.doLogin();
                    }
                }
            }
        },
        errorField: '#errorLabel'
    },
    init: function(){
        var me = this;
        
        return me.callParent(arguments);
    },
    
    onLoginButtonClick: function(comp, e, eOpts){
        var me = this;
        
        this.doLogin();
    },
    
    onResetButtonClick: function(comp, e, eOpts){
        var me = this;
        
        me.getUsernameField().setValue('');
        me.getPasswordField().setValue('');
    },
    
    doLogin: function(){
        var me = this;
        var loginForm = me.getView().getForm();
        var username = me.getUsernameField().getValue();
        var password = me.getPasswordField().getValue();
        /**
         * validate the form and submit
         */
        if (loginForm.isValid()) {
            me.securityService.doLogin({
                username: username,
                password: password
            }, {
                success: me.loginSuccess,
                failure: me.loginFailure,
                scope: me
            });
        }
        else {
            me.getErrorField().setText('Correct the item(s) in red above.');
        }
    },
    
    loginSuccess: function(response, scope){
        var me = scope;
        
        if (response.ERROR) {
            /**
             * display an error message, if it exists
             */
            me.getErrorField().setText('Error: ' + response.DETAIL);
        }
        else {
            /**
             * populate the auth user object and available roles store
             */
            me.authenticatedUser.populateFromGenericObject(response);
            me.rolesStore.loadData(response.AVAILABLEROLES);
            
            /**
             * If no roles, then deny access
             */
            if (me.rolesStore.count == 0) {
                me.getErrorField().setText('You do not have access to this application.');
            }
            else 
             /**
             * if only one role, assign it to current and load the dashboard
             */
                if (me.rolesStore.count() == 1) {
                    me.authenticatedUser.set('CURRENTROLE', me.rolesStore.first().get('ROLE'));
                    me.authenticatedUser.set('CURRENTACCESSTYPES', me.rolesStore.first().get('ACCESS'));
                    
                    me.loadDashboard();
                }
                /**
             * if more then one role, load the role selection screen
             */
                else {
                    me.loadRoleScreen();
                }
            // console.log(me.authenticatedUser);
        }
    },
    
    loginFailure: function(response, scope){
        var me = scope;
        
        // console.log("Error: ");
        // console.log(response);
    },
    
    loadDashboard: function(){
        var comp = this.formUtils.loadDisplay('mainview', 'dashboard', true, {
            height: '100%',
            flex: 1
        });
    },
    
    loadRoleScreen: function(){
        var comp = this.formUtils.loadDisplay('mainview', 'roleform', true, {});
    }
});
