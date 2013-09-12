Ext.define('Adm.store.reference.Ages', {
    extend: 'Ext.data.Store',
    model: 'Adm.model.reference.AbstractReference',
    constructor: function(){
    	var items= [{
            id: "1",
            name: "1 Hour"
        }, {
            id: "2",
            name: "2 Hours"
        }, {
            id: "4",
            name: "4 Hours"
        }, {
            id: "6",
            name: "6 Hours"
        }, {
            id: "12",
            name: "12 Hours"
        }, {
            id: "24",
            name: "24 Hours"
        }, {
            id: "48",
            name: "48 Hours"
        }, {
            id: "72",
            name: "72 Hours"
        }];
    	
    	Ext.apply(this,{
    		items: items 
    	});
    	Ext.apply(this, {autoLoad: false});
		this.callParent(arguments);
    }
});