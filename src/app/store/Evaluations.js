Ext.define('Adm.store.Evaluations', {
    extend: 'Adm.store.reference.AbstractReferences',
    model: 'Adm.model.Evaluation',
    sorters: [{
        property: 'LAST_NM',
        direction: 'ASC'
    }],
    buffered: false,
    pageSize: 20,
    autoLoad: true,
	remoteFilter: true,
	remoteSort: true,
    
    constructor: function(){
        this.callParent(arguments);
        Ext.apply(this.getProxy(), {
            url: this.getProxy().url + this.apiProperties.getItemUrl('entries')
        });
    }
});
