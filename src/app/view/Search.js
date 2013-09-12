Ext.define('Adm.view.Search', {
    extend: 'Ext.form.Panel',
    alias: 'widget.search',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
    controller: 'Adm.controller.SearchViewController',
    inject: {
        formsStore: 'formsStore',
        agesStore: 'agesStore',
        formGroupsStore: 'formGroupsStore'
    },
    flex: 1,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    title: 'Search Evaluations',
	header: {
		titlePosition: 2,
		titleAlign: 'left'
	},
    bodyPadding: '10, 10, 10, 10',
    
    initComponent: function(){
        Ext.apply(this, {
            collapsible: true,
            fieldDefaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Student Name/ID',
                labelAlign: 'top',
                name: 'studentName',
                width: 120,
                margins: '0 10 0 0',
                vtype: 'alphanum',
                vtypeText: 'Please use only letters and numbers'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Evaluator Name/ID',
                labelAlign: 'top',
                name: 'evaluatorName',
                width: 120,
                margins: '0 10 0 0',
                vtype: 'alphanum',
                vtypeText: 'Please use only letters and numbers'
            }, {
                xtype: 'combobox',
                flex: 1,
                maxWidth: 240,
                fieldLabel: 'Form Name',
                labelAlign: 'top',
                name: 'formId',
                labelWidth: 120,
                margins: '0 10 0 0',
                store: this.formsStore,
                displayField: 'FORMNAME',
                valueField: 'FORMID',
                emptyText: 'Select One',
                mode: 'local',
                typeAhead: true,
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                matchFieldWidth: false,
                listConfig: {
                    width: 340
                }
            }, {
                xtype: 'combobox',
                flex: 1,
                maxWidth: 120,
                fieldLabel: 'Not Older Than',
                labelAlign: 'top',
                name: 'age',
                labelWidth: 120,
                margins: '0 10 0 0',
				store: this.agesStore,
                displayField: 'name',
                valueField: 'id',
                emptyText: 'Select One',
                mode: 'local',
                typeAhead: true,
                queryMode: 'local',
                allowBlank: true,
                forceSelection: true,
                matchFieldWidth: true
            }, {
				xtype: 'datefield',
				flex: 1,
				maxWidth: 120,
				fieldLabel: 'From Date',
				labelAlign: 'top',
				name: 'startDate',
				labelWidth: 120,
				margins: '0 10 0 0',
                altFormats: 'm/d/Y',
                invalidText: '{0} is not a valid date - it must be in the format: 06/02/2012'
			}, {
				xtype: 'datefield',
				flex: 1,
				maxWidth: 120,
				fieldLabel: 'To Date',
				labelAlign: 'top',
				name: 'endDate',
				labelWidth: 120,
				margins: '0 10 0 0',
                altFormats: 'm/d/Y',
                invalidText: '{0} is not a valid date - it must be in the format: 06/02/2012',
				value: new Date()
			}, {
                xtype: 'tbspacer',
                width: 10
            }, {
                xtype: 'container',
                layout: 'vbox',
                items: [{
                    xtype: 'tbspacer',
                    flex: 1
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        text: 'Set Filter',
                        itemId: 'setFilterBtn'
                    }, {
                        xtype: 'tbspacer',
                        width: 10
                    }, {
                        xtype: 'button',
                        text: 'Clear Filter',
                        itemId: 'clearFilterBtn'
                    }, {
                        xtype: 'tbspacer',
                        width: 20
                    }, {
                        xtype: 'button',
                        text: 'Reset Form',
                        itemId: 'resetFormBtn'
                    }]
                }]
            }]
        });
        return this.callParent(arguments);
    }
});
