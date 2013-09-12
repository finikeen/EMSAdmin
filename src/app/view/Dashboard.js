Ext.define('Adm.view.Dashboard', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashboard',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
    controller: 'Adm.controller.DashboardViewController',
    width: '100%',
    height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    
    initComponent: function(){
        Ext.apply(this, {
            collapsible: false,
            dockedItems: {
                xtype: 'controlbar',
                dock: 'top'
            },
            items: [{
                xtype: 'search',
                flex: 1,
				itemId: 'searchPanel',
				margins: '10 10 0 10'
            }, {
				xtype: 'evaluationlist',
				flex: 4,
				itemId: 'evalListPanel',
				margins: '0 10 10 10'
			}]
        });
        return this.callParent(arguments);
    }
});
