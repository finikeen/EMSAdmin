Ext.define('Adm.controller.security.RoleViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        authenticatedUser: 'authenticatedUser',
        formUtils: 'formRendererUtils',
        securityService: 'securityService'
    },
    // add listeners to each button on the form
    control: {
        roleButton: {
            selector: '#roleButton',
            listeners: {
                click: 'onRoleButtonClick'
            }
        },
        
        availableRolesField: '#availableRoles'
    },
    
    init: function(){
        var me = this;
        
        return me.callParent(arguments);
    },
    
    onRoleButtonClick: function(comp, e, eOpts){
        var me = this;
        var btn = comp;
        // var cmp;
        var roleForm = me.getView().getForm();
        var store = me.getAvailableRolesField().getStore();
        var id = me.getAvailableRolesField().getValue();
        var roleRecord = store.findRecord('ROLEID', id);
        /**
         * validate the form
         * if valid, assign the current role and accessTypes to the auth user object
         * load the dashbaord
         */
        if (roleForm.isValid()) {
            me.authenticatedUser.set('CURRENTROLE', roleRecord.get('ROLE'));
            me.authenticatedUser.set('CURRENTACCESSTYPES', roleRecord.get('ACCESS'));
            
            me.loadDashboard();
        }
    },
    
    loadDashboard: function(){
        var comp = this.formUtils.loadDisplay('mainview', 'dashboard', true, {
            height: '100%',
            flex: 1
        })
    }
});
