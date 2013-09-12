Ext.define('Adm.store.reference.AbstractRemoteReferences', {
    extend: 'Ext.data.Store',
    model: 'Adm.model.reference.AbstractReference',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        apiProperties: 'apiProperties'
    },
    
    constructor: function(){
        var me = this;
        Ext.apply(me, {
            proxy: me.apiProperties.getRemoteProxy(''),
            autoLoad: false,
            autoSync: false,
            pageSize: me.apiProperties.getPagingSize(),
            params: {
                page: 0,
                start: 0,
                limit: me.apiProperties.getPagingSize()
            }
        });
        return me.callParent(arguments);
    }
});
