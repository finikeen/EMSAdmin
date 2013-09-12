Ext.QuickTips.init();

Ext.define('Adm.view.EvaluationList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.evaluationlist',
    mixins: ['Deft.mixin.Injectable', 'Deft.mixin.Controllable'],
    controller: 'Adm.controller.EvaluationListViewController',
    inject: {
        evaluationsStore: 'evaluationsStore',
        authenticatedUser: 'authenticatedUser'
    },
    width: 750,
    height: 506,
    title: 'Evaluations List',
    autoScroll: true,
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            collapsible: false,
            store: me.evaluationsStore,
            loadMask: true,
            selModel: {
                pruneRemoved: false
            },
            /* features: [{
             ftype: 'grouping'
             }], */
            viewConfig: {
                trackOver: false,
                emptyText: '<h2 style="margin: 20px;">No matching results</h2>'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.evaluationsStore,
                displayInfo: true
            }),
            columns: {
                defaults: {
                    menuDisabled: true
                },
                items: [{
                    xtype: 'actioncolumn',
                    width: 20,
                    items: [{
                        icon: '/emsadmin/resources/images/view_detail.png'
                    }],
                    itemId: 'viewDetailIcn',
                    toolTip: 'Click to view details',
                    sortable: false
                }, {
                    xtype: 'gridcolumn',
                    text: 'Student Name',
                    dataIndex: 'LAST_NM',
                    width: 160,
                    hidden: me.authenticatedUser.isStudent(),
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                        return record.get('studentName');
                    }
                    /* ,
                     editor: {
                     allowBlank: false
                     } */
                }, {
                    xtype: 'gridcolumn',
                    text: 'Tartan ID',
                    dataIndex: 'TARTAN_ID',
                    width: 70,
                    hidden: me.authenticatedUser.isStudent(),
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                        return record.get('tartanId');
                    }
                    /* ,
                     editor: {
                     xtype: 'numberfield',
                     allowBlank: false,
                     minValue: 1,
                     maxValue: 999999999
                     } */
                }, {
                    xtype: 'templatecolumn',
                    text: 'Rating',
                    dataIndex: 'EVALUATOR_NM',
					sortable: false,
                    width: 90,
					tpl: '<div class="rating-{evaluatorRating}">{evaluatorRating}</div>'
					/* ,
                    editor: {
                        allowBlank: false
                    } */
                }, {
                    xtype: 'gridcolumn',
                    text: 'Evaluation Name',
                    dataIndex: 'FORM_NM',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                        return record.get('formName');
                    },
                    flex: 1
                }, {
                    xtype: 'gridcolumn',
                    text: 'Evaluation Type',
                    dataIndex: 'EVALUATION_TYPE_DS',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                        return record.get('evaluationType');
                    },
                    width: 140
                }, {
                    xtype: 'gridcolumn',
                    text: 'Evaluator',
                    dataIndex: 'EVALUATOR_NM',
                    width: 140,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                        return record.get('evaluatorName');
                    }/* ,
                    editor: {
                        allowBlank: false
                    } */
                }, {
                    xtype: 'gridcolumn',
                    text: 'Date/Time',
                    dataIndex: 'EVALUATION_DT',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
                        var dt = record.get('evaluationDate');
                        var fmtdt = Ext.util.Format.date(dt, "n/j/Y g:i A");
                        
                        return fmtdt;
                    },
                    width: 130
                }, {
                    xtype: 'actioncolumn',
                    width: 20,
                    items: [{
                        icon: '/emsadmin/resources/images/delete.png'
                    }],
                    hidden: !me.authenticatedUser.isAdmin(),
                    itemId: 'deleteIcn',
                    toolTip: 'Click to delete this record',
                    sortable: false
                }]
            }
        });
        return this.callParent(arguments);
    }
});
