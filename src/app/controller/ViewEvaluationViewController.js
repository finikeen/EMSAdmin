Ext.define('Adm.controller.ViewEvaluationViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        authenticatedUser: 'authenticatedUser',
        appEventsController: 'appEventsController',
        formUtils: 'formRendererUtils',
        evaluationService: 'evaluationService',
        formBuilderService: 'formBuilderService',
        submissionBuilderService: 'submissionBuilderService',
        evaluationsStore: 'evaluationsStore'
    },
    control: {
        view: {
            show: 'onViewShow'
        },
        leftCol: '#leftColumn',
        rightCol: '#rightColumn',
        messageLabel: '#messageLbl',
        
        closeButton: {
            selector: '#closeBtn',
            listeners: {
                click: 'onCloseButtonClick'
            }
        },
        printButton: {
            selector: '#printBtn',
            listeners: {
                click: 'onPrintButtonClick'
            }
        }
    },
    config: {
        record: null,
        printData: null
    },
    
    setRecord: function(data){
        this.record = data;
    },
    
    getRecord: function(){
        return this.record;
    },
    
    setPrintData: function(data){
        this.printData = data;
    },
    
    getPrintData: function(){
        return this.printData;
    },
    
    init: function(){
        var me = this;
        
        me.appEventsController.assignEvent({
            eventName: 'updateEval',
            callBackFunc: me.onUpdateEval,
            scope: me
        });
        
        return me.callParent(arguments);
    },
    
    onViewShow: function(){
        var me = this;
        var formId = this.getRecord().get('formId');
        
        me.getView().setLoading(true);
        
        me.formBuilderService.get(formId, {
            success: me.onFormBuilderSuccess,
            failure: me.onFormBuilderFailure,
            scope: me
        });
    },
    
    onFormBuilderSuccess: function(response, scope){
        var me = scope;
        var evalData = [];
        var submissionId = me.getRecord().get('studentEvaluationId');
        var leftCol = Ext.ComponentQuery.query('#leftColumn')[0];
        var rightCol = Ext.ComponentQuery.query('#rightColumn')[0];
        
        me.setPrintData([]);
        // add the form fields
        Ext.each(response.rows, function(record, index){
            // filter only "Fieldxxxxx" items???
            var formItem = me.formUtils.getEvaluationFormItem(record, me.authenticatedUser.isAdmin());
            if (index > 4) {
                evalData.push(formItem);
                me.getPrintData().push(formItem);
            }
        });
        // add the buttons to the left side
        if (me.authenticatedUser.isAdmin()) {
            var subBtn = Ext.create('Ext.button.Button', {
                text: 'Update',
                handler: function(){
                    me.appEventsController.getApplication().fireEvent('updateEval');
                }
            });
            // leftSideData.push(subBtn);
        }
        // load the "editable" data into the display
        leftCol.getForm().loadRecord(me.getRecord());
        // add the array to the display
        rightCol.add(evalData);
        // get the form's answers
        me.submissionBuilderService.get(submissionId, {
            success: me.onSubmissionBuilderSuccess,
            failure: me.onSubmissionBuilderFailure,
            scope: me
        });
    },
    
    onSubmissionBuilderSuccess: function(response, scope){
        var me = scope;
        var answers = response.rows[0].answers;
        
        me.formUtils.setEvaluationFormItems(answers);
        
        me.getView().setLoading(false);
    },
    
    onSubmissionBuilderFailure: function(response, scope){
        var me = scope;
        // console.log('sub failure');
        // console.log(response);
        
        me.getView().setLoading(false);
    },
    
    onFormBuilderFailure: function(response, scope){
        var me = scope;
        // console.log('form failure');
        // console.log(response);
        
        me.getView().setLoading(false);
    },
    
    onUpdateEval: function(){
        var me = this;
        var form = Ext.ComponentQuery.query('#leftColumn')[0].getForm();
        var values = form.getValues();
        var validateResult = me.formUtils.validateForms([form]);
        var success = validateResult.valid;
        if (success) {
            // console.log(values);
            me.evaluationService.update(values, {
                success: me.onUpdateEvalSuccess,
                failure: me.onUpdateEvalFailure,
                scope: me
            });
        }
        else {
            me.formUtils.displayErrors(validateResult.fields);
        }
    },
    
    onUpdateEvalSuccess: function(response, scope){
        var me = scope;
        // console.log('update success');
        // console.log(response);
        Ext.ComponentQuery.query('#messageLbl')[0].setText('Update successful');
        me.evaluationsStore.reload();
    },
    
    onUpdateEvalFailure: function(response, scope){
        var me = scope;
        // console.log('update failure');
        // console.log(response);
        Ext.ComponentQuery.query('#messageLbl')[0].setText(response.error + ': ' + response.message);
    },
    
    onCloseButtonClick: function(){
        var me = this;
        
        me.getView().close();
    },
    
    onPrintButtonClick: function(){
        var me = this;
		var url = 'assets/printEvaluation.cfm?form=' + me.getRecord().get('studentEvaluationId');
		
		window.open(url, 'width=800, height=600');
    }
});
