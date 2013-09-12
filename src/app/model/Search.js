Ext.define('Adm.model.Search', {
    extend: 'Adm.model.AbstractBase',
    fields: [{
        name: 'studentName',
        type: 'string'
    }, {
        name: 'evaluatorName',
        type: 'string'
    }, {
        name: 'formId',
        type: 'string'
    }, {
        name: 'sortBy',
        type: 'string'
    }]
});
