Ext.define('Adm.store.admin.AdminTreeMenus',{
	extend: 'Ext.data.TreeStore',
    mixins: [ 'Deft.mixin.Injectable' ],
    inject: {
        columnRendererUtils: 'columnRendererUtils'
    },
	autoLoad: false,
    constructor: function(){
    	var me=this;
    	var items = {
    	    	text: 'Administrative Tools',
    	    	title: 'Administrative Tools',
    	    	form: '',
    	        expanded: true,
    	        children: [ {
    	        	            text: 'Default',
    	        	            title: 'Default',
    	        	            form: '',
    	        	            expanded: false,
    	        	            children: [{
									text: 'First Admin',
									title: 'First Admin',
									store: 'templateReferenceModels',
							        form: 'AbstractReferenceAdmin',
									leaf: true
							    }]
    	                    }]

    	    };
    	
    	Ext.apply(me,{
    		root: items,
    		folderSort: true,
    		sorters: [{
    		    property: 'text',
    		    direction: 'ASC'
    		}]
    	});
		return me.callParent(arguments);
    }


});