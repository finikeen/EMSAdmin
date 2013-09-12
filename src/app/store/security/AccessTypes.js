Ext.define('Adm.store.security.AccessTypes', {
    extend: 'Ext.data.Store',
    model: 'Adm.model.security.AccessType',
    mixins: ['Deft.mixin.Injectable'],
    
    constructor: function(){
        Ext.apply(this, {
            autoLoad: false,
            autoSync: false
        });
        
        return this.callParent(arguments);
    }
});
