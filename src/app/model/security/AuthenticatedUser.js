Ext.define('Adm.model.security.AuthenticatedUser', {
    extend: 'Adm.model.AbstractBase',
    fields: [{name: 'USER', type: 'string'},
			 {name: 'FNAME', type: 'string'},
			 {name: 'LNAME', type: 'string'},
			 {name: 'TARTANID', type: 'numeric'},
			 {name: 'EMAIL', type: 'string'},
			 {name: 'PASS', type: 'string'},
			 {name: 'ROLES', type: 'string'},
			 {name: 'AVAILABLEROLES', type: 'array'},
			 {name: 'CURRENTROLE', type: 'string'},
			 {name: 'CURRENTACCESSTYPES', type: 'array'},
			 {name: 'ISSTUDENT', type: 'string'}
			 /*
			 // this is how to use "type: object"
			 {name: 'CURRENTROLE', 
			 	convert: function(value, record){
					return Ext.create('Adm.model.security.Role', {});
				}
			 } */
			],
	isAdmin: function() {
		var role = this.get('CURRENTROLE');
		if (role == 'Developer' || role == 'AppAdmin') {
			return true;
		} else {
			return false;
		}
	},
	isStudent: function() {
		var role = this.get('CURRENTROLE');
		if (role == 'Student') {
			return true;
		} else {
			return false;
		}
	},
	getFullname: function() {
		return this.get('FNAME') + ' ' + this.get('LNAME');
	}
});