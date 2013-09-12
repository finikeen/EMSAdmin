Ext.define('Adm.view.ViewEvaluation', {
    extend: 'Ext.window.Window',
    alias: 'widget.viewevaluation',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
    controller: 'Adm.controller.ViewEvaluationViewController',
    inject: {
        authenticatedUser: 'authenticatedUser',
        appEventsController: 'appEventsController'
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    title: 'View Evaluation',
    /* header: {
        titlePosition: 2,
        titleAlign: 'left'
    }, */
	tools: [{
		xtype: 'button',
		text: 'Print',
		itemId: 'printBtn'
	}, {
		xtype: 'tbspacer',
		width: 50
	}, {
		xtype: 'button',
		text: 'Close',
		itemId: 'closeBtn'
	}],
	width: 800,
	height: 600,
	closable: false,
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            collapsible: false,
            items: [{
                xtype: 'form',
                itemId: 'leftColumn',
                cls: 'wrappable-cell',
                autoScroll: true,
                bodyPadding: 10,
                bodyStyle: 'background-color: #cecece;',
                layout: {
                    type: 'anchor'
                },
                items: [{
                    xtype: 'hidden',
                    name: 'studentEvaluationId'
                }, {
                    xtype: 'hidden',
                    name: 'isActive'
                }, {
                    xtype: 'displayfield',
                    name: 'formName',
                    fieldStyle: 'font-weight: bold !important; font-size: 1.1em !important;'
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        width: 130
                    },
                    fieldLabel: 'Student',
                    labelAlign: 'left',
                    labelStyle: 'font-weight: bold;',
                    labelSeparator: '',
					labelWidth: 60,
                    items: [{
                        xtype: 'textfield',
                        margins: '0 10 0 10',
                        fieldLabel: 'First',
                        labelWidth: 36,
                        name: 'firstName',
                        readOnly: !me.authenticatedUser.isAdmin(),
                        editable: me.authenticatedUser.isAdmin(),
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        margins: '0 10 0 0',
                        fieldLabel: 'Last',
                        labelWidth: 36,
                        name: 'lastName',
                        readOnly: !me.authenticatedUser.isAdmin(),
                        editable: me.authenticatedUser.isAdmin(),
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        margins: '0 0 0 0',
                        fieldLabel: 'Tartan ID',
                        labelWidth: 66,
                        name: 'tartanId',
                        readOnly: !me.authenticatedUser.isAdmin(),
                        editable: me.authenticatedUser.isAdmin(),
                        allowBlank: false
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        width: 130
                    },
                    fieldLabel: 'Evaluator',
                    labelAlign: 'left',
					labelWidth: 60,
                    labelStyle: 'font-weight: bold;',
                    labelSeparator: '',
                    items: [{
                        xtype: 'textfield',
                        margins: '0 10 0 10',
                        fieldLabel: 'Name',
                        labelWidth: 46,
                        width: 260,
                        name: 'evaluatorName',
                        readOnly: !me.authenticatedUser.isAdmin(),
                        editable: me.authenticatedUser.isAdmin(),
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        margins: '0 10 0 10',
                        fieldLabel: 'Tartan ID',
                        labelWidth: 66,
                        name: 'evaluatorId',
                        hidden: me.authenticatedUser.isStudent(),
                        readOnly: !me.authenticatedUser.isAdmin(),
                        editable: me.authenticatedUser.isAdmin(),
                        allowBlank: false
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        width: 180
                    },
                    fieldLabel: 'Evaluation',
                    labelStyle: 'font-weight: bold;',
                    labelSeparator: '',
                    labelAlign: 'left',
					labelWidth: 60,
                    items: [{
                        xtype: 'datefield',
                        margins: '0 10 0 10',
                        fieldLabel: 'Date',
                        labelWidth: 40,
                        name: 'evaluationDate',
                        format: "m/d/Y g:i A",
                        editable: false,
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        margins: '0 10 0 10',
                        fieldLabel: 'Type',
                        labelWidth: 40,
                        name: 'evaluationType',
                        editable: false,
                        readOnly: true,
						flex: 1
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        text: 'Update',
                        width: 60,
                        handler: function(){
                            me.appEventsController.getApplication().fireEvent('updateEval');
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 20
                    }, {
                        xtype: 'button',
                        text: 'Reset',
                        width: 60,
                        handler: function(){
                            me.down('#leftColumn').getForm().loadRecord(me.getController().getRecord());
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 20
                    }, {
                        xtype: 'button',
                        text: 'Close',
                        width: 60,
                        handler: function(){
                            me.close();
                        }
                    }, {
                        xtype: 'tbspacer',
                        width: 20
                    }, {
                        xtype: 'label',
                        itemId: 'messageLbl',
                        flex: 1,
						style: 'font-size: 1.1em; font-weight: bold; color: red;'
                    }],
                    hidden: !this.authenticatedUser.isAdmin()
                }]
            }, {
                xtype: 'form',
                flex: .5,
                itemId: 'rightColumn',
                cls: 'wrappable-cell',
                autoScroll: true,
                bodyPadding: 10
            }]
        });
        return this.callParent(arguments);
    }
});
