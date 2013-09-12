/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial
Software License Agreement provided with the Software or, alternatively, in accordance with the
terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-03-11 22:33:40 (aed16176e68b5e8aa1433452b12805c0ad913836)
*/
/**
 * A simple class that provides the basic implementation needed to make any element draggable.
 */
Ext.define('Ext.dd.DragSource', {
    extend: 'Ext.dd.DDProxy',
    requires: [
        'Ext.dd.StatusProxy',
        'Ext.dd.DragDropManager'
    ],

    /**
     * @cfg {String} ddGroup
     * A named drag drop group to which this object belongs.  If a group is specified, then this object will only
     * interact with other drag drop objects in the same group.
     */

    /**
     * @cfg {String} dropAllowed
     * The CSS class returned to the drag source when drop is allowed.
     */
    dropAllowed : Ext.baseCSSPrefix + 'dd-drop-ok',
    /**
     * @cfg {String} dropNotAllowed
     * The CSS class returned to the drag source when drop is not allowed.
     */
    dropNotAllowed : Ext.baseCSSPrefix + 'dd-drop-nodrop',

    /**
     * @cfg {Boolean} animRepair
     * If true, animates the proxy element back to the position of the handle element used to trigger the drag.
     */
    animRepair: true,

    /**
     * @cfg {String} repairHighlightColor
     * The color to use when visually highlighting the drag source in the afterRepair
     * method after a failed drop (defaults to light blue). The color must be a 6 digit hex value, without
     * a preceding '#'.
     */
    repairHighlightColor: 'c3daf9',

    /**
     * Creates new drag-source.
     * @param {String/HTMLElement/Ext.Element} el The container element or ID of it.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(el, config) {
        this.el = Ext.get(el);
        if(!this.dragData){
            this.dragData = {};
        }

        Ext.apply(this, config);

        if(!this.proxy){
            this.proxy = new Ext.dd.StatusProxy({
                id: this.el.id + '-drag-status-proxy',
                animRepair: this.animRepair
            });
        }
        this.callParent([this.el.dom, this.ddGroup || this.group,
              {dragElId : this.proxy.id, resizeFrame: false, isTarget: false, scroll: this.scroll === true}]);

        this.dragging = false;
    },

    /**
     * Returns the data object associated with this drag source
     * @return {Object} data An object containing arbitrary data
     */
    getDragData : function(e){
        return this.dragData;
    },

    // @private
    onDragEnter : function(e, id){
        var target = Ext.dd.DragDropManager.getDDById(id),
            status;
        this.cachedTarget = target;
        if (this.beforeDragEnter(target, e, id) !== false) {
            if (target.isNotifyTarget) {
                status = target.notifyEnter(this, e, this.dragData);
                this.proxy.setStatus(status);
            } else {
                this.proxy.setStatus(this.dropAllowed);
            }

            if (this.afterDragEnter) {
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * when the dragged item enters the drop target by providing an implementation.
                 * @param {Ext.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dragged element
                 * @method afterDragEnter
                 */
                this.afterDragEnter(target, e, id);
            }
        }
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action
     * before the dragged item enters the drop target and optionally cancel the onDragEnter.
     * @param {Ext.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     * @template
     */
    beforeDragEnter: function(target, e, id) {
        return true;
    },

    // @private
    onDragOver: function(e, id) {
        var target = this.cachedTarget || Ext.dd.DragDropManager.getDDById(id),
            status;
        if (this.beforeDragOver(target, e, id) !== false) {
            if(target.isNotifyTarget){
                status = target.notifyOver(this, e, this.dragData);
                this.proxy.setStatus(status);
            }

            if (this.afterDragOver) {
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * while the dragged item is over the drop target by providing an implementation.
                 * @param {Ext.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dragged element
                 * @method afterDragOver
                 */
                this.afterDragOver(target, e, id);
            }
        }
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action
     * while the dragged item is over the drop target and optionally cancel the onDragOver.
     * @param {Ext.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     * @template
     */
    beforeDragOver: function(target, e, id) {
        return true;
    },

    // @private
    onDragOut: function(e, id) {
        var target = this.cachedTarget || Ext.dd.DragDropManager.getDDById(id);
        if (this.beforeDragOut(target, e, id) !== false) {
            if (target.isNotifyTarget) {
                target.notifyOut(this, e, this.dragData);
            }
            this.proxy.reset();
            if (this.afterDragOut) {
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * after the dragged item is dragged out of the target without dropping.
                 * @param {Ext.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dragged element
                 * @method afterDragOut
                 */
                this.afterDragOut(target, e, id);
            }
        }
        this.cachedTarget = null;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action before the dragged
     * item is dragged out of the target without dropping, and optionally cancel the onDragOut.
     * @param {Ext.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     * @template
     */
    beforeDragOut: function(target, e, id){
        return true;
    },

    // @private
    onDragDrop: function(e, id){
        var target = this.cachedTarget || Ext.dd.DragDropManager.getDDById(id);
        if (this.beforeDragDrop(target, e, id) !== false) {
            if (target.isNotifyTarget) {
                if (target.notifyDrop(this, e, this.dragData) !== false) { // valid drop?
                    this.onValidDrop(target, e, id);
                } else {
                    this.onInvalidDrop(target, e, id);
                }
            } else {
                this.onValidDrop(target, e, id);
            }

            if (this.afterDragDrop) {
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * after a valid drag drop has occurred by providing an implementation.
                 * @param {Ext.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dropped element
                 * @method afterDragDrop
                 */
                this.afterDragDrop(target, e, id);
            }
        }
        delete this.cachedTarget;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action before the dragged
     * item is dropped onto the target and optionally cancel the onDragDrop.
     * @param {Ext.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag drop event is valid, else false to cancel
     * @template
     */
    beforeDragDrop: function(target, e, id){
        return true;
    },

    // @private
    onValidDrop: function(target, e, id){
        this.hideProxy();
        if(this.afterValidDrop){
            /**
             * An empty function by default, but provided so that you can perform a custom action
             * after a valid drop has occurred by providing an implementation.
             * @param {Object} target The target DD
             * @param {Event} e The event object
             * @param {String} id The id of the dropped element
             * @method afterValidDrop
             */
            this.afterValidDrop(target, e, id);
        }
    },

    // @private
    getRepairXY: function(e, data){
        return this.el.getXY();
    },

    // @private
    onInvalidDrop: function(target, e, id) {
        // This method may be called by the DragDropManager.
        // To preserve backwards compat, it only passes the event object
        // Here we correct the arguments.
        if (!e) {
            e = target;
            target = null;
            id = e.getTarget().id;
        }
        this.beforeInvalidDrop(target, e, id);
        if (this.cachedTarget) {
            if(this.cachedTarget.isNotifyTarget){
                this.cachedTarget.notifyOut(this, e, this.dragData);
            }
            this.cacheTarget = null;
        }
        this.proxy.repair(this.getRepairXY(e, this.dragData), this.afterRepair, this);

        if (this.afterInvalidDrop) {
            /**
             * An empty function by default, but provided so that you can perform a custom action
             * after an invalid drop has occurred by providing an implementation.
             * @param {Event} e The event object
             * @param {String} id The id of the dropped element
             * @method afterInvalidDrop
             */
            this.afterInvalidDrop(e, id);
        }
    },

    // @private
    afterRepair: function() {
        var me = this;
        if (Ext.enableFx) {
            me.el.highlight(me.repairHighlightColor);
        }
        me.dragging = false;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action after an invalid
     * drop has occurred.
     * @param {Ext.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the invalid drop should proceed, else false to cancel
     * @template
     */
    beforeInvalidDrop: function(target, e, id) {
        return true;
    },

    // @private
    handleMouseDown: function(e) {
        if (this.dragging) {
            return;
        }
        var data = this.getDragData(e);
        if (data && this.onBeforeDrag(data, e) !== false) {
            this.dragData = data;
            this.proxy.stop();
            this.callParent(arguments);
        }
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action before the initial
     * drag event begins and optionally cancel it.
     * @param {Object} data An object containing arbitrary data to be shared with drop targets
     * @param {Event} e The event object
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     * @template
     */
    onBeforeDrag: function(data, e){
        return true;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action once the initial
     * drag event has begun.  The drag cannot be canceled from this function.
     * @param {Number} x The x position of the click on the dragged object
     * @param {Number} y The y position of the click on the dragged object
     * @method
     * @template
     */
    onStartDrag: Ext.emptyFn,

    alignElWithMouse: function() {
        this.proxy.ensureAttachedToBody(true);
        return this.callParent(arguments);
    },

    // @private
    startDrag: function(x, y) {
        this.proxy.reset();
        this.proxy.hidden = false;
        this.dragging = true;
        this.proxy.update("");
        this.onInitDrag(x, y);
        this.proxy.show();
    },

    // @private
    onInitDrag: function(x, y) {
        var clone = this.el.dom.cloneNode(true);
        clone.id = Ext.id(); // prevent duplicate ids
        this.proxy.update(clone);
        this.onStartDrag(x, y);
        return true;
    },

    /**
     * Returns the drag source's underlying {@link Ext.dd.StatusProxy}
     * @return {Ext.dd.StatusProxy} proxy The StatusProxy
     */
    getProxy: function() {
        return this.proxy;
    },

    /**
     * Hides the drag source's {@link Ext.dd.StatusProxy}
     */
    hideProxy: function() {
        this.proxy.hide();
        this.proxy.reset(true);
        this.dragging = false;
    },

    // @private
    triggerCacheRefresh: function() {
        Ext.dd.DDM.refreshCache(this.groups);
    },

    // @private
    b4EndDrag: function(e) {
    },

    // @private
    endDrag : function(e){
        this.onEndDrag(this.dragData, e);
    },

    // @private
    onEndDrag : function(data, e){
    },

    // @private
    autoOffset : function(x, y) {
        this.setDelta(-12, -20);
    },

    destroy: function(){
        this.callParent();
        Ext.destroy(this.proxy);
    }
});
