Ext.define('Adm.controller.SearchViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        authenticatedUser: 'authenticatedUser',
        appEventsController: 'appEventsController',
        agesStore: 'agesStore',
        formsStore: 'formsStore',
        formGroupsStore: 'formGroupsStore',
        searchData: 'searchData',
        evaluationsStore: 'evaluationsStore'
    },
    control: {
        setFilterButton: {
            selector: '#setFilterBtn',
            listeners: {
                click: 'onSetFilterBtnClick'
            }
        },
        clearFilterButton: {
            selector: '#clearFilterBtn',
            listeners: {
                click: 'onClearFilterBtnClick'
            }
        },
        resetFormButton: {
            selector: '#resetFormBtn',
            listeners: {
                click: 'onResetFormBtnClick'
            }
        }
    },
    
    init: function(){
        var me = this;
        var ageItems = [{
            id: "1",
            name: "1 Hour"
        }, {
            id: "2",
            name: "2 Hours"
        }, {
            id: "4",
            name: "4 Hours"
        }, {
            id: "6",
            name: "6 Hours"
        }, {
            id: "12",
            name: "12 Hours"
        }, {
            id: "24",
            name: "24 Hours"
        }, {
            id: "48",
            name: "48 Hours"
        }, {
            id: "72",
            name: "72 Hours"
        }];
        
        me.agesStore.loadData(ageItems);
        
        me.formsStore.load({
            params: {
                limit: 100
            }
        });
        
        return me.callParent(arguments);
    },
    
    onSetFilterBtnClick: function(button){
        var me = this;
        var form = me.getView().getForm();
        var values = form.getValues();
        var filters = [];
        
        me.evaluationsStore.clearFilter(true);
        
        if (values.studentName.length) {
            if (!isNaN(values.studentName)) {
                var nameFilter = new Ext.create('Ext.util.Filter', {
                    property: "TARTAN_ID",
                    value: values.studentName,
                    id: 1,
                    anyMatch: true
                });
                filters.push(nameFilter);
            }
            else {
				var nameFilterA = new Ext.create('Ext.util.Filter', {
                    property: "LAST_NM",
                    value: values.studentName,
                    id: 2,
                    anyMatch: true
                });
				var nameFilterB = new Ext.create('Ext.util.Filter', {
                    property: "FIRST_NM",
                    value: values.studentName,
                    id: 3,
                    anyMatch: true
                });
                filters.push(nameFilterA);
                filters.push(nameFilterB);
                
            }
        }
        if (values.evaluatorName.length) {
            if (!isNaN(values.evaluatorName)) {
				var evalFilter = new Ext.create('Ext.util.Filter', {
                    property: "EVALUATOR_ID",
                    value: values.evaluatorName,
                    id: 4,
                    anyMatch: true
                });
                filters.push(evalFilter);
            }
            else {
				var evalFilter = new Ext.create('Ext.util.Filter', {
                    property: "EVALUATOR_NM",
                    value: values.evaluatorName,
                    id: 5,
                    anyMatch: true
                });
                filters.push(evalFilter);
            }
        }
        if (values.formId.length) {
			var formFilter = new Ext.create('Ext.util.Filter', {
                property: "STUDENT_EVALUATION_ID",
                value: values.formId,
                id: 6,
                anyMatch: true
            });
            filters.push(formFilter);
        }
        if (values.age.length) {
			var ageFilter = new Ext.create('Ext.util.Filter', {
                property: "AGE",
                value: values.age,
                id: 7,
                anyMatch: true
            });
            filters.push(ageFilter);
        }
        if (values.startDate.length) {
			var sdateFilter = new Ext.create('Ext.util.Filter', {
                property: "STARTDATE",
                value: values.startDate,
                id: 8,
                anyMatch: true
            });
            filters.push(sdateFilter);
        }
        if (values.endDate.length) {
			var edateFilter = new Ext.create('Ext.util.Filter', {
                property: "ENDDATE",
                value: values.endDate,
                id: 9,
                anyMatch: true
            });
            filters.push(edateFilter);
        }
        else {
            var dt = new Date();
            var dtString = (dt.getUTCMonth() + 1) + '/' + dt.getUTCDate() + '/' + dt.getUTCFullYear();
			var edateFilter = new Ext.create('Ext.util.Filter', {
                property: "ENDDATE",
                value: dtString,
                id: 9,
                anyMatch: true
            });
            filters.push(edateFilter);
        }
        console.log(filters);
        me.evaluationsStore.filter(filters);
		console.log(me.evaluationsStore.filters);
    },
    
    onClearFilterBtnClick: function(button){
        var me = this;
        
        me.onResetFormBtnClick(null);
        me.onSetFilterBtnClick(null);
    },
    
    onResetFormBtnClick: function(button){
        var me = this;
        
        me.getView().getForm().reset();
    }
});
