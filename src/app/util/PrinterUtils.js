Ext.define("Adm.util.PrinterUtils", {
    extend: 'Ext.Component',
    
    config: {
        buffer: null,
        closeAutomaticallyAfterPrint: false
    },
    
    setBuffer: function(html){
        this.buffer = html;
    },
    getBuffer: function(){
        return this.buffer;
    },
    
    initComponent: function(){
        this.resetBuffer();
        
        return this.callParent(arguments);
    },
    
    /**
     * call this before starting any print job
     */
    resetBuffer: function(){
        var me = this;
        
        me.setBuffer('<html><head><link rel="stylesheet" type="text/css" href="js/libs/ext-4.2/resources/css/ext-all-gray.css"><script type="text/javascript" src="js/libs/ext-4.2/ext-all-debug-w-comments.js"></script></head><body>');
    },
    
    /**
     * adds html of a component to the "print buffer"
     * followed by a line break
     *
     * @param {Object} comp - component with content to print
     */
    addToBuffer: function(comp){
        var me = this;
        var currBuffer = me.getBuffer();
        var html = comp.getEl().getHTML();
        var newBuffer = currBuffer + html + '<br/>';
        
        me.setBuffer(newBuffer);
    },
    
    /**
     * creates a new window
     * adds the "print buffer" contents to the window
     * prints the window
     *
     * @param {Boolean} printAutomatically
     */
    print: function(printAutomatically){
        var me = this;
        var win = window.open('', 'Print Panel');
		var buffer = me.getBuffer() + '</body></html>';
        
        win.document.open();
        win.document.write(buffer);
        win.document.close();
        
        if (printAutomatically) {
            win.print();
        }
        
        if (me.closeAutomaticallyAfterPrint) {
            if (Ext.isIE) {
                window.close();
            }
            else {
                win.close();
            }
        }
    }
});
