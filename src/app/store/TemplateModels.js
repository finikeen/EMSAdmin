Ext.define('Adm.store.TemplateModels', {
    extend: 'Ext.data.Store',
    model: 'Adm.model.TemplateModel',
    mixins: [ 'Deft.mixin.Injectable' ],
    inject: {
        apiProperties: 'apiProperties'
    },
	constructor: function(){
		Ext.apply(this, {
							proxy: this.apiProperties.getProxy(this.apiProperties.getItemUrl('url')),
							autoLoad: false
						});
		return this.callParent(arguments);
	}
});