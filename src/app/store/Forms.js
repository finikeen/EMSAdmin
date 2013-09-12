Ext.define('Adm.store.Forms', {
    extend: 'Adm.store.reference.AbstractReferences',
    model: 'Adm.model.Form',
    sorters: ['title'],
	   
    constructor: function(){
        this.callParent(arguments);
        Ext.apply(this.getProxy(), {
            url: this.getProxy().url + this.apiProperties.getItemUrl('forms')
        });
    }
});
