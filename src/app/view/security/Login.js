Ext.define('Adm.view.security.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.loginform',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
	inject: {
		applicationName: 'applicationName'
	},
    controller: 'Adm.controller.security.LoginViewController',
    flex: 1,
    bodyPadding: 50,
    layout: {
        type: 'hbox',
        pack: 'center',
        align: 'middle'
    },
    border: 0,
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(me, {
            items: [{
                xtype: 'panel',
                frame: true,
                bodyBorder: false,
                height: 160,
                width: 300,
                layout: {
                    align: 'stretch',
                    pack: 'center',
                    type: 'vbox'
                },
                bodyPadding: 10,
				title: me.applicationName,
                items: [{
					xtype: 'label',
					text: 'Please sign in to continue:'
				}, {
					xtype: 'tbspacer',
					height: 10
				}, {
                    xtype: 'textfield',
                    width: 260,
                    fieldLabel: 'Username',
                    labelAlign: 'right',
                    labelPad: 2,
                    labelWidth: 70,
                    itemId: 'username',
                    allowBlank: false,
                    blankText: "Please type your username."
                }, {
                    xtype: 'textfield',
                    width: 260,
                    fieldLabel: 'Password',
                    labelAlign: 'right',
                    labelPad: 2,
                    labelWidth: 70,
                    inputType: 'password',
                    itemId: 'password',
                    allowBlank: false,
                    blankText: "Please type your password."
                }, {
                    xtype: 'container',
                    width: 280,
                    layout: {
                        align: 'middle',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        margins: '2 10 2 10',
                        padding: '2 8 2 8',
                        text: 'Login',
                        itemId: 'loginButton'
                    }, {
                        xtype: 'button',
                        margins: '2 10 2 10',
                        padding: '2 8 2 8',
                        text: 'Reset',
                        itemId: 'resetButton'
                    }]
                }, {
                    xtype: 'label',
                    flex: 1,
                    itemId: 'errorLabel',
                    text: '',
                    style: {
                        color: 'red',
                        fontWeight: 'bold'
                    }
                }]
            }]
        });
        
        return this.callParent(arguments);
    }
    
});
