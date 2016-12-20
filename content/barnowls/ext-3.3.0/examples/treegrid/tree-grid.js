/*!
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
 
 
Ext.onReady(function() {
    Ext.QuickTips.init();

var xg = Ext.grid;

var sm = new xg.CheckboxSelectionModel();
sm.handleMouseDown = Ext.emptyFn; // checkOnly:true is not available in this version of Ext, so add the missing code to this object.

    var tree = new Ext.ux.tree.TreeGrid({
        title: 'Core Team Projects',
        width: 500,
        height: 300,
        renderTo: Ext.getBody(),
        enableDD: true,
        columns:[{
            header: 'Task',
	 //  sm,
            dataIndex: 'task',
            width: 430
        }],

        dataUrl: 'treegrid-data-helen.json'

    });
});