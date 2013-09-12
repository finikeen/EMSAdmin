Ext.define('Adm.store.security.Roles', {
    extend: 'Ext.data.Store',
    model: 'Adm.model.security.Role',
    mixins: ['Deft.mixin.Injectable'],
    
    constructor: function(){
        Ext.apply(this, {
            autoLoad: false,
            autoSync: false
        });
        
        return this.callParent(arguments);
    }
});
