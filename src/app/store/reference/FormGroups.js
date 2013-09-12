Ext.define('Adm.store.reference.FormGroups', {
    extend: 'Ext.data.Store',
    model: 'Adm.model.reference.AbstractReference',
    constructor: function(){
    	var items= [{id: "studentName", name: "Student Name"},
    			    {id: "evaluatorName", name: "Evaluator Name"},
    			    {id: "formId", name: "Form Name"},
    			    {id: "status", name: "Status"}];
    	
    	Ext.apply(this,{
    		items: items 
    	});
    	Ext.apply(this, {autoLoad: false});
		this.callParent(arguments);
    }
});