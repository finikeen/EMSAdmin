Ext.define('Adm.view.ControlBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.controlbar',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
    controller: 'Adm.controller.ControlBarViewController',
    inject: {
        applicationName: 'applicationName',
        authenticatedPerson: 'authenticatedPerson',
        showNavLinks: 'showNavLinks',
        authenticatedUser: 'authenticatedUser'
    },
    height: 30,
    flex: 1,
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(me, {
            layout: 'hbox',
            items: [
			/* {
                xtype: 'button',
                text: 'Home',
                hidden: !me.authenticatedUser.showAdmin(),
                itemId: 'dashboardViewNav'
            }, {
                xtype: 'button',
                text: 'Admin',
                hidden: !me.authenticatedUser.showAdmin(),
                itemId: 'adminViewNav',
                action: 'displayAdmin'
            }, */
			{
				xtype: 'label',
				text: me.applicationName,
				style: 'font-size: 1.1em; font-weight: bold;'
			}, {
                xtype: 'tbspacer',
                flex: 1
            }, {
				xtype: 'label',
				text: 'Role:'
			}, {
                xtype: 'button',
                text: me.authenticatedUser.get('CURRENTROLE'),
                itemId: 'roleChangeNav',
                action: 'changeRole',
                hidden: ((me.authenticatedUser.get('AVAILABLEROLES').length > 1) ? false : true),
                toolTip: 'Click to change role'
            }, {
                xtype: 'button',
                text: 'Logout',
                itemId: 'logoutButton',
                action: 'logout'
            }]
        });
        
        return this.callParent(arguments);
    }
});
