/*
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.DataView=Ext.extend(Ext.BoxComponent,{selectedClass:"x-view-selected",emptyText:"",deferEmptyText:true,trackOver:false,blockRefresh:false,last:false,initComponent:function(){Ext.DataView.superclass.initComponent.call(this);if(Ext.isString(this.tpl)||Ext.isArray(this.tpl)){this.tpl=new Ext.XTemplate(this.tpl)}this.addEvents("beforeclick","click","mouseenter","mouseleave","containerclick","dblclick","contextmenu","containercontextmenu","selectionchange","beforeselect");this.store=Ext.StoreMgr.lookup(this.store);this.all=new Ext.CompositeElementLite();this.selected=new Ext.CompositeElementLite()},afterRender:function(){Ext.DataView.superclass.afterRender.call(this);this.mon(this.getTemplateTarget(),{click:this.onClick,dblclick:this.onDblClick,contextmenu:this.onContextMenu,scope:this});if(this.overClass||this.trackOver){this.mon(this.getTemplateTarget(),{mouseover:this.onMouseOver,mouseout:this.onMouseOut,scope:this})}if(this.store){this.bindStore(this.store,true)}},refresh:function(){this.clearSelections(false,true);var b=this.getTemplateTarget(),a=this.store.getRange();b.update("");if(a.length<1){if(!this.deferEmptyText||this.hasSkippedEmptyText){b.update(this.emptyText)}this.all.clear()}else{this.tpl.overwrite(b,this.collectData(a,0));this.all.fill(Ext.query(this.itemSelector,b.dom));this.updateIndexes(0)}this.hasSkippedEmptyText=true},getTemplateTarget:function(){return this.el},prepareData:function(a){return a},collectData:function(b,e){var d=[],c=0,a=b.length;for(;c<a;c++){d[d.length]=this.prepareData(b[c].data,e+c,b[c])}return d},bufferRender:function(a,b){var c=document.createElement("div");this.tpl.overwrite(c,this.collectData(a,b));return Ext.query(this.itemSelector,c)},onUpdate:function(f,a){var b=this.store.indexOf(a);if(b>-1){var e=this.isSelected(b),c=this.all.elements[b],d=this.bufferRender([a],b)[0];this.all.replaceElement(b,d,true);if(e){this.selected.replaceElement(c,d);this.all.item(b).addClass(this.selectedClass)}this.updateIndexes(b,b)}},onAdd:function(f,d,e){if(this.all.getCount()===0){this.refresh();return}var c=this.bufferRender(d,e),g,b=this.all.elements;if(e<this.all.getCount()){g=this.all.item(e).insertSibling(c,"before",true);b.splice.apply(b,[e,0].concat(c))}else{g=this.all.last().insertSibling(c,"after",true);b.push.apply(b,c)}this.updateIndexes(e)},onRemove:function(c,a,b){this.deselect(b);this.all.removeElement(b,true);this.updateIndexes(b);if(this.store.getCount()===0){this.refresh()}},refreshNode:function(a){this.onUpdate(this.store,this.store.getAt(a))},updateIndexes:function(d,c){var b=this.all.elements;d=d||0;c=c||((c===0)?0:(b.length-1));for(var a=d;a<=c;a++){b[a].viewIndex=a}},getStore:function(){return this.store},bindStore:function(a,b){if(!b&&this.store){if(a!==this.store&&this.store.autoDestroy){this.store.destroy()}else{this.store.un("beforeload",this.onBeforeLoad,this);this.store.un("datachanged",this.onDataChanged,this);this.store.un("add",this.onAdd,this);this.store.un("remove",this.onRemove,this);this.store.un("update",this.onUpdate,this);this.store.un("clear",this.refresh,this)}if(!a){this.store=null}}if(a){a=Ext.StoreMgr.lookup(a);a.on({scope:this,beforeload:this.onBeforeLoad,datachanged:this.onDataChanged,add:this.onAdd,remove:this.onRemove,update:this.onUpdate,clear:this.refresh})}this.store=a;if(a){this.refresh()}},onDataChanged:function(){if(this.blockRefresh!==true){this.refresh.apply(this,arguments)}},findItemFromChild:function(a){return Ext.fly(a).findParent(this.itemSelector,this.getTemplateTarget())},onClick:function(c){var b=c.getTarget(this.itemSelector,this.getTemplateTarget()),a;if(b){a=this.indexOf(b);if(this.onItemClick(b,a,c)!==false){this.fireEvent("click",this,a,b,c)}}else{if(this.fireEvent("containerclick",this,c)!==false){this.onContainerClick(c)}}},onContainerClick:function(a){this.clearSelections()},onContextMenu:function(b){var a=b.getTarget(this.itemSelector,this.getTemplateTarget());if(a){this.fireEvent("contextmenu",this,this.indexOf(a),a,b)}else{this.fireEvent("containercontextmenu",this,b)}},onDblClick:function(b){var a=b.getTarget(this.itemSelector,this.getTemplateTarget());if(a){this.fireEvent("dblclick",this,this.indexOf(a),a,b)}},onMouseOver:function(b){var a=b.getTarget(this.itemSelector,this.getTemplateTarget());if(a&&a!==this.lastItem){this.lastItem=a;Ext.fly(a).addClass(this.overClass);this.fireEvent("mouseenter",this,this.indexOf(a),a,b)}},onMouseOut:function(a){if(this.lastItem){if(!a.within(this.lastItem,true,true)){Ext.fly(this.lastItem).removeClass(this.overClass);this.fireEvent("mouseleave",this,this.indexOf(this.lastItem),this.lastItem,a);delete this.lastItem}}},onItemClick:function(b,a,c){if(this.fireEvent("beforeclick",this,a,b,c)===false){return false}if(this.multiSelect){this.doMultiSelection(b,a,c);c.preventDefault()}else{if(this.singleSelect){this.doSingleSelection(b,a,c);c.preventDefault()}}return true},doSingleSelection:function(b,a,c){if(c.ctrlKey&&this.isSelected(a)){this.deselect(a)}else{this.select(a,false)}},doMultiSelection:function(c,a,d){if(d.shiftKey&&this.last!==false){var b=this.last;this.selectRange(b,a,d.ctrlKey);this.last=b}else{if((d.ctrlKey||this.simpleSelect)&&this.isSelected(a)){this.deselect(a)}else{this.select(a,d.ctrlKey||d.shiftKey||this.simpleSelect)}}},getSelectionCount:function(){return this.selected.getCount()},getSelectedNodes:function(){return this.selected.elements},getSelectedIndexes:function(){var b=[],d=this.selected.elements,c=0,a=d.length;for(;c<a;c++){b.push(d[c].viewIndex)}return b},getSelectedRecords:function(){return this.getRecords(this.selected.elements)},getRecords:function(c){var b=[],d=0,a=c.length;for(;d<a;d++){b[b.length]=this.store.getAt(c[d].viewIndex)}return b},getRecord:function(a){return this.store.getAt(a.viewIndex)},clearSelections:function(a,b){if((this.multiSelect||this.singleSelect)&&this.selected.getCount()>0){if(!b){this.selected.removeClass(this.selectedClass)}this.selected.clear();this.last=false;if(!a){this.fireEvent("selectionchange",this,this.selected.elements)}}},isSelected:function(a){return this.selected.contains(this.getNode(a))},deselect:function(a){if(this.isSelected(a)){a=this.getNode(a);this.selected.removeElement(a);if(this.last==a.viewIndex){this.last=false}Ext.fly(a).removeClass(this.selectedClass);this.fireEvent("selectionchange",this,this.selected.elements)}},select:function(d,f,b){if(Ext.isArray(d)){if(!f){this.clearSelections(true)}for(var c=0,a=d.length;c<a;c++){this.select(d[c],true,true)}if(!b){this.fireEvent("selectionchange",this,this.selected.elements)}}else{var e=this.getNode(d);if(!f){this.clearSelections(true)}if(e&&!this.isSelected(e)){if(this.fireEvent("beforeselect",this,e,this.selected.elements)!==false){Ext.fly(e).addClass(this.selectedClass);this.selected.add(e);this.last=e.viewIndex;if(!b){this.fireEvent("selectionchange",this,this.selected.elements)}}}}},selectRange:function(c,a,b){if(!b){this.clearSelections(true)}this.select(this.getNodes(c,a),true)},getNode:function(b){if(Ext.isString(b)){return document.getElementById(b)}else{if(Ext.isNumber(b)){return this.all.elements[b]}else{if(b instanceof Ext.data.Record){var a=this.store.indexOf(b);return this.all.elements[a]}}}return b},getNodes:function(e,a){var d=this.all.elements,b=[],c;e=e||0;a=!Ext.isDefined(a)?Math.max(d.length-1,0):a;if(e<=a){for(c=e;c<=a&&d[c];c++){b.push(d[c])}}else{for(c=e;c>=a&&d[c];c--){b.push(d[c])}}return b},indexOf:function(a){a=this.getNode(a);if(Ext.isNumber(a.viewIndex)){return a.viewIndex}return this.all.indexOf(a)},onBeforeLoad:function(){if(this.loadingText){this.clearSelections(false,true);this.getTemplateTarget().update('<div class="loading-indicator">'+this.loadingText+"</div>");this.all.clear()}},onDestroy:function(){this.all.clear();this.selected.clear();Ext.DataView.superclass.onDestroy.call(this);this.bindStore(null)}});Ext.DataView.prototype.setStore=Ext.DataView.prototype.bindStore;Ext.reg("dataview",Ext.DataView);Ext.list.ListView=Ext.extend(Ext.DataView,{itemSelector:"dl",selectedClass:"x-list-selected",overClass:"x-list-over",scrollOffset:undefined,columnResize:true,columnSort:true,maxColumnWidth:Ext.isIE?99:100,initComponent:function(){if(this.columnResize){this.colResizer=new Ext.list.ColumnResizer(this.colResizer);this.colResizer.init(this)}if(this.columnSort){this.colSorter=new Ext.list.Sorter(this.columnSort);this.colSorter.init(this)}if(!this.internalTpl){this.internalTpl=new Ext.XTemplate('<div class="x-list-header"><div class="x-list-header-inner">','<tpl for="columns">','<div style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on" id="',this.id,'-xlhd-{#}">',"{header}","</em></div>","</tpl>",'<div class="x-clear"></div>',"</div></div>",'<div class="x-list-body"><div class="x-list-body-inner">',"</div></div>")}if(!this.tpl){this.tpl=new Ext.XTemplate('<tpl for="rows">',"<dl>",'<tpl for="parent.columns">','<dt style="width:{[values.width*100]}%;text-align:{align};">','<em unselectable="on"<tpl if="cls"> class="{cls}</tpl>">',"{[values.tpl.apply(parent)]}","</em></dt>","</tpl>",'<div class="x-clear"></div>',"</dl>","</tpl>")}var k=this.columns,g=0,h=0,l=k.length,b=[];for(var f=0;f<l;f++){var m=k[f];if(!m.isColumn){m.xtype=m.xtype?(/^lv/.test(m.xtype)?m.xtype:"lv"+m.xtype):"lvcolumn";m=Ext.create(m)}if(m.width){g+=m.width*100;if(g>this.maxColumnWidth){m.width-=(g-this.maxColumnWidth)/100}h++}b.push(m)}k=this.columns=b;if(h<l){var d=l-h;if(g<this.maxColumnWidth){var a=((this.maxColumnWidth-g)/d)/100;for(var e=0;e<l;e++){var m=k[e];if(!m.width){m.width=a}}}}Ext.list.ListView.superclass.initComponent.call(this)},onRender:function(){this.autoEl={cls:"x-list-wrap"};Ext.list.ListView.superclass.onRender.apply(this,arguments);this.internalTpl.overwrite(this.el,{columns:this.columns});this.innerBody=Ext.get(this.el.dom.childNodes[1].firstChild);this.innerHd=Ext.get(this.el.dom.firstChild.firstChild);if(this.hideHeaders){this.el.dom.firstChild.style.display="none"}},getTemplateTarget:function(){return this.innerBody},collectData:function(){var a=Ext.list.ListView.superclass.collectData.apply(this,arguments);return{columns:this.columns,rows:a}},verifyInternalSize:function(){if(this.lastSize){this.onResize(this.lastSize.width,this.lastSize.height)}},onResize:function(c,e){var b=this.innerBody.dom,f=this.innerHd.dom,d=c-Ext.num(this.scrollOffset,Ext.getScrollBarWidth())+"px",a;if(!b){return}a=b.parentNode;if(Ext.isNumber(c)){if(this.reserveScrollOffset||((a.offsetWidth-a.clientWidth)>10)){b.style.width=d;f.style.width=d}else{b.style.width=c+"px";f.style.width=c+"px";setTimeout(function(){if((a.offsetWidth-a.clientWidth)>10){b.style.width=d;f.style.width=d}},10)}}if(Ext.isNumber(e)){a.style.height=Math.max(0,e-f.parentNode.offsetHeight)+"px"}},updateIndexes:function(){Ext.list.ListView.superclass.updateIndexes.apply(this,arguments);this.verifyInternalSize()},findHeaderIndex:function(f){f=f.dom||f;var a=f.parentNode,d=a.parentNode.childNodes,b=0,e;for(;e=d[b];b++){if(e==a){return b}}return -1},setHdWidths:function(){var d=this.innerHd.dom.getElementsByTagName("div"),c=0,b=this.columns,a=b.length;for(;c<a;c++){d[c].style.width=(b[c].width*100)+"%"}}});Ext.reg("listview",Ext.list.ListView);Ext.ListView=Ext.list.ListView;Ext.list.Column=Ext.extend(Object,{isColumn:true,align:"left",header:"",width:null,cls:"",constructor:function(a){if(!a.tpl){a.tpl=new Ext.XTemplate("{"+a.dataIndex+"}")}else{if(Ext.isString(a.tpl)){a.tpl=new Ext.XTemplate(a.tpl)}}Ext.apply(this,a)}});Ext.reg("lvcolumn",Ext.list.Column);Ext.list.NumberColumn=Ext.extend(Ext.list.Column,{format:"0,000.00",constructor:function(a){a.tpl=a.tpl||new Ext.XTemplate("{"+a.dataIndex+':number("'+(a.format||this.format)+'")}');Ext.list.NumberColumn.superclass.constructor.call(this,a)}});Ext.reg("lvnumbercolumn",Ext.list.NumberColumn);Ext.list.DateColumn=Ext.extend(Ext.list.Column,{format:"m/d/Y",constructor:function(a){a.tpl=a.tpl||new Ext.XTemplate("{"+a.dataIndex+':date("'+(a.format||this.format)+'")}');Ext.list.DateColumn.superclass.constructor.call(this,a)}});Ext.reg("lvdatecolumn",Ext.list.DateColumn);Ext.list.BooleanColumn=Ext.extend(Ext.list.Column,{trueText:"true",falseText:"false",undefinedText:"&#160;",constructor:function(e){e.tpl=e.tpl||new Ext.XTemplate("{"+e.dataIndex+":this.format}");var b=this.trueText,d=this.falseText,a=this.undefinedText;e.tpl.format=function(c){if(c===undefined){return a}if(!c||c==="false"){return d}return b};Ext.list.DateColumn.superclass.constructor.call(this,e)}});Ext.reg("lvbooleancolumn",Ext.list.BooleanColumn);Ext.list.ColumnResizer=Ext.extend(Ext.util.Observable,{minPct:0.05,constructor:function(a){Ext.apply(this,a);Ext.list.ColumnResizer.superclass.constructor.call(this)},init:function(a){this.view=a;a.on("render",this.initEvents,this)},initEvents:function(a){a.mon(a.innerHd,"mousemove",this.handleHdMove,this);this.tracker=new Ext.dd.DragTracker({onBeforeStart:this.onBeforeStart.createDelegate(this),onStart:this.onStart.createDelegate(this),onDrag:this.onDrag.createDelegate(this),onEnd:this.onEnd.createDelegate(this),tolerance:3,autoStart:300});this.tracker.initEl(a.innerHd);a.on("beforedestroy",this.tracker.destroy,this.tracker)},handleHdMove:function(h,d){var c=5,b=h.getPageX(),i=h.getTarget("em",3,true);if(i){var g=i.getRegion(),f=i.dom.style,a=i.dom.parentNode;if(b-g.left<=c&&a!=a.parentNode.firstChild){this.activeHd=Ext.get(a.previousSibling.firstChild);f.cursor=Ext.isWebKit?"e-resize":"col-resize"}else{if(g.right-b<=c&&a!=a.parentNode.lastChild.previousSibling){this.activeHd=i;f.cursor=Ext.isWebKit?"w-resize":"col-resize"}else{delete this.activeHd;f.cursor=""}}}},onBeforeStart:function(a){this.dragHd=this.activeHd;return !!this.dragHd},onStart:function(f){var d=this,b=d.view,c=d.dragHd,a=d.tracker.getXY()[0];d.proxy=b.el.createChild({cls:"x-list-resizer"});d.dragX=c.getX();d.headerIndex=b.findHeaderIndex(c);d.headersDisabled=b.disableHeaders;b.disableHeaders=true;d.proxy.setHeight(b.el.getHeight());d.proxy.setX(d.dragX);d.proxy.setWidth(a-d.dragX);this.setBoundaries()},setBoundaries:function(i){var j=this.view,g=this.headerIndex,c=j.innerHd.getWidth(),i=j.innerHd.getX(),b=Math.ceil(c*this.minPct),k=c-b,e=j.columns.length,d=j.innerHd.select("em",true),f=b+i,a=k+i,h;if(e==2){this.minX=f;this.maxX=a}else{h=d.item(g+2);this.minX=d.item(g).getX()+b;this.maxX=h?h.getX()-b:a;if(g==0){this.minX=f}else{if(g==e-2){this.maxX=a}}}},onDrag:function(c){var b=this,a=b.tracker.getXY()[0].constrain(b.minX,b.maxX);b.proxy.setWidth(a-this.dragX)},onEnd:function(h){var f=this.proxy.getWidth(),g=this.headerIndex,k=this.view,c=k.columns,b=k.innerHd.getWidth(),j=Math.ceil(f*k.maxColumnWidth/b)/100,d=this.headersDisabled,l=c[g],i=c[g+1],a=l.width+i.width;this.proxy.remove();l.width=j;i.width=a-j;delete this.dragHd;k.setHdWidths();k.refresh();setTimeout(function(){k.disableHeaders=d},100)}});Ext.ListView.ColumnResizer=Ext.list.ColumnResizer;Ext.list.Sorter=Ext.extend(Ext.util.Observable,{sortClasses:["sort-asc","sort-desc"],constructor:function(a){Ext.apply(this,a);Ext.list.Sorter.superclass.constructor.call(this)},init:function(a){this.view=a;a.on("render",this.initEvents,this)},initEvents:function(a){a.mon(a.innerHd,"click",this.onHdClick,this);a.innerHd.setStyle("cursor","pointer");a.mon(a.store,"datachanged",this.updateSortState,this);this.updateSortState.defer(10,this,[a.store])},updateSortState:function(c){var f=c.getSortState();if(!f){return}this.sortState=f;var e=this.view.columns,g=-1;for(var d=0,a=e.length;d<a;d++){if(e[d].dataIndex==f.field){g=d;break}}if(g!=-1){var b=f.direction;this.updateSortIcon(g,b)}},updateSortIcon:function(b,a){var d=this.sortClasses;var c=this.view.innerHd.select("em").removeClass(d);c.item(b).addClass(d[a=="DESC"?1:0])},onHdClick:function(c){var b=c.getTarget("em",3);if(b&&!this.view.disableHeaders){var a=this.view.findHeaderIndex(b);this.view.store.sort(this.view.columns[a].dataIndex)}}});Ext.ListView.Sorter=Ext.list.Sorter;