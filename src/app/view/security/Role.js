Ext.define('Adm.view.security.Role', {
    extend: 'Ext.form.Panel',
    alias: 'widget.roleform',
    mixins: ['Deft.mixin.Controllable', 'Deft.mixin.Injectable'],
    controller: 'Adm.controller.security.RoleViewController',
    inject: {
        rolesStore: 'rolesStore',
        applicationName: 'applicationName'
    },
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
                title: me.applicationName,
                items: [{
                    xtype: 'label',
                    text: 'Please select a role to continue:'
                }, {
					xtype: 'tbspacer',
					height: 10
				}, {
                    xtype: 'combobox',
                    width: 260,
                    fieldLabel: 'Role',
                    labelAlign: 'right',
                    labelPad: 2,
                    labelWidth: 70,
                    margins: '0 20 0 0',
                    itemId: 'availableRoles',
                    displayField: 'ROLE',
                    valueField: 'ROLEID',
                    emptyText: 'Select One',
                    name: 'currentRole',
                    store: me.rolesStore,
                    mode: 'local',
                    typeAhead: false,
                    editable: false,
                    queryMode: 'local',
                    allowBlank: false,
                    blankText: 'Please select a role'
                }, {
                    xtype: 'container',
                    layout: {
                        align: 'middle',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [{
                        xtype: 'button',
                        margins: '2 10 2 10',
                        padding: '2 8 2 8',
                        text: 'Select Role',
                        itemId: 'roleButton'
                    }]
                }]
            }]
        });
        
        return this.callParent(arguments);
    }
    
});
