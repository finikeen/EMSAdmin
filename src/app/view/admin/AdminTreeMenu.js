Ext.define('Adm.view.admin.AdminTreeMenu', {
	extend: 'Ext.tree.Panel',
	alias : 'widget.admintreemenu',
	id: 'AdminTreeMenu',
    mixins: [ 'Deft.mixin.Injectable',
              'Deft.mixin.Controllable'],
    controller: 'Adm.controller.AdminViewController',
    inject: {
    	store: 'adminTreeMenusStore'
    },    
	initComponent: function() {	
		Ext.apply(this, 
				{
					store: this.store,
					singleExpand: true,
					fields: ['title','form','text']
				});
		
	     this.callParent(arguments);
	}	
}); 