Ext.define('Adm.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mainview',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
    inject: {
        authenticatedPerson: 'authenticatedPerson',
        showNavLinks: 'showNavLinks',
        authenticatedUser: 'authenticatedUser'
    },
    controller: 'Adm.controller.MainViewController',
    initComponent: function(){
        var me = this;
        /* Ext.apply(me, {
            title: me.applicationName
        }); */
        
        return me.callParent(arguments);
    }
});
