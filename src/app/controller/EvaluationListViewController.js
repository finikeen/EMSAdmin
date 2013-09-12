Ext.define('Adm.controller.EvaluationListViewController', {
    extend: 'Deft.mvc.ViewController',
    mixins: ['Deft.mixin.Injectable'],
    inject: {
        authenticatedUser: 'authenticatedUser',
        appEventsController: 'appEventsController',
        evaluationService: 'evaluationService',
        evaluationsStore: 'evaluationsStore',
        formUtils: 'formRendererUtils'
    },
    config: {
        deleteData: null
    },
    control: {
        viewDetailIcon: {
            selector: '#viewDetailIcn',
            listeners: {
                click: 'onViewDetailIconClick'
            }
        },
        deleteIcon: {
            selector: '#deleteIcn',
            listeners: {
                click: 'onDeleteIconClick'
            }
        }
    },
    
    setDeleteData: function(data){
        this.deleteData = data;
    },
    getDeleteData: function(){
        return this.deleteData;
    },
    
    init: function(){
        var me = this;
        // clear any filters on initial load
        me.evaluationsStore.clearFilter(true);
        // load the first page
		// add the toolbar
		// set the title based on the role
        me.evaluationsStore.loadPage(1, {
            callback: function(records, operation, success){
                // me.addToolbar();
                var title = "Evaluations";
				
                if (me.authenticatedUser.isStudent()) {
                    // for testing only
                    // me.evaluationsStore.filter('TARTAN_ID', 745557);
                    me.evaluationsStore.filter('TARTAN_ID', me.authenticatedUser.get('TARTANID'));
                    title += ' for ' + me.authenticatedUser.getFullname();
                }
				
                me.getView().setTitle(title);
            }
        });
        
        return me.callParent(arguments);
    },
    
    onViewDetailIconClick: function(grid, b, rowIndex, colIndex){
        var store = grid.getStore();
        var record = store.getAt(rowIndex);
        var popup = Ext.create('Adm.view.ViewEvaluation');
        // pass the data to the popup window
        popup.getController().setRecord(record);
		// load the popup window
        popup.show();
    },
    
    onDeleteIconClick: function(grid, b, rowIndex, colIndex){
        var me = this;
        var store = grid.getStore();
        var data = store.getAt(rowIndex).getData();
        // put the data into "temporary" storage
		me.setDeleteData(data);
        // show the confirmation window
		Ext.Msg.confirm({
            title: 'Warning Message',
            msg: 'Are you sure you want to delete this evaluation?',
            buttons: Ext.Msg.YESNO,
            fn: me.onDeleteConfirm,
            scope: me
        });
    },
    
    onDeleteConfirm: function(btnId){
        var me = this;
		var data = me.getDeleteData();
		// if the user clicks "Yes", set the record to inactive
		// and hand it off to the update service
        if (btnId == "yes") {
        	data.isActive = false;
            me.evaluationService.update(data, {
                success: me.onDeleteSuccess,
                failure: me.onDeleteFailure,
                scope: me
            });
        }
    },
    
    onDeleteSuccess: function(response, scope){
        var me = scope;
        // console.log('delete success');
        // console.log(response);
        // reload the store
        me.evaluationsStore.reload();
    },
    
    onDeleteFailure: function(response, scope){
        var me = scope;
        // console.log('delete failure');
        // console.log(response);
    },
    
    addToolbar: function(){
        var me = this;
        
        var tbar = Ext.create('Ext.toolbar.Paging', {
            store: me.evaluationsStore,
            displayInfo: true,
            dock: 'bottom'
        });
        me.getView().addDocked(tbar);
    }
});
