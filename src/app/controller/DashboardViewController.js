Ext.define('Adm.controller.DashboardViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        authenticatedUser: 'authenticatedUser',
        appEventsController: 'appEventsController'
    },
    control: {
        searchPanel: '#searchPanel'
    },
    
    init: function(){
        var me = this;
        
        me.setDisplayType();
        
        return me.callParent(arguments);
    },
    
    setDisplayType: function(){
        var me = this;
        var role = me.authenticatedUser.get('CURRENTROLE');
        var showSearch = true;
       	
        if (role == "Student") {
            me.getSearchPanel().hide();
        }
    }
});
