Ext.define('Adm.model.security.Role', {
    extend: 'Adm.model.AbstractBase',
    fields: [{name: 'ROLEID', type: 'numeric'},
			 {name: 'ROLE', type: 'string'},
			 {name: 'ACCESS', type: 'array'}]
});