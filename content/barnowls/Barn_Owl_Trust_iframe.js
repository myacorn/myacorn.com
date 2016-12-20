Ext.BLANK_IMAGE_URL = 's.gif';

var scrollBottom;
var displayInfoWindow;
var info_win;

Ext.onReady(function() {

    	Ext.QuickTips.init();
	
	var infoPanel = new Ext.Panel({
		//split: true,
		contentEl: "info-div",
		//id: 'infopanelid',
		//title: 'mypanel',
		autoScroll: true,
		border: true,
		margins:'3 0 3 3',
		cmargins:'3 3 3 3',
		bodyStyle:'padding:10px;'
	});
	
	displayInfoWindow = function(){
		if(!info_win){
			info_win = new Ext.Window({
			applyTo:'info-win',
			layout:'fit',
			width:300,
			height:300,
			closeAction:'hide',
			//closeable: 'true',
			items:[infoPanel],
			//plain: true,
			buttons: [{
			    text: 'Close',
			    handler: function(){
			    //alert('here');
				info_win.hide();
			    }
			}]
		    });
		}
		info_win.alignTo(document.getElementById('mytree'),"tl");
		info_win.show();
	};
	
	//displayInfoWindow();
	//----------------------------------------------------------------------------------------------------------------------------------------------- TREE	
	var tree = new Ext.tree.TreePanel({
		renderTo: 'treediv',
		useArrows: true,
		autoScroll: true,
		animate: true,
		id: 'mytree',
		//enableDD: true,
		draggable: false,
		containerScroll: false,
		border: false,
		// auto create TreeLoader
		//dataUrl: 'get-nodes.php',
		loader: new Ext.tree.TreeLoader(),
		root: new Ext.tree.AsyncTreeNode({
		    expanded: true,
		    text: 'Barn Owl Videos',
		    children: [{
			text: 'Introduction',
			id: "video0",
			expanded: true,
			leaf: false,
			children: [{
				text: 'Barn Owl adaptations',
				id: "video0-0",
				//jumpto:"19",
				//checked: false,
				leaf: true
				},
				{
				text: 'Decline',
				id: "video0-1",
				//jumpto:"95",
				//checked: false,
				leaf: true
				},
				{
				text: 'An indicator species',
				id: "video0-2",
				//jumpto:"150",
				//checked: false,
				leaf: true
				}
			]
		    }, 
		    {
			text: 'Where can you find them?',
			id: "video1",
			expanded: true,
			leaf: false,
			children: [{
				text: 'Rural locations',
				id: "video1-0",
				leaf: true
				},
				{
				text: 'Farm environments',
				id: "video1-1",
				leaf: true
				},
				{
				text: 'Nesting sites',
				id: "video1-2",
				leaf: true
				},
				{
				text: 'Roads',
				id: "video1-3",
				leaf: true
				}
			]
		    }, 
		    {
			text: 'Where do Barn Owls feed?',
			id: "video2",
			expanded: true,
			leaf: false,
			children: [
				{
				text: 'Rough grassland',
				id: "video2-0",
				leaf: true
				},
				{
				text: 'Hedgerows',
				id: "video2-1",
				leaf: true
				},
				{
				text: 'Food availability',
				id: "video2-2",
				leaf: true
				},
				{
				text: 'Hunting area',
				id: "video2-3",
				leaf: true
				}
			]
		    },
		      {
			text: 'Field signs of Barn Owls',
			id: "video3",
			expanded: true,
			leaf: false,
			children: [{
				text: 'Surveying safety',
				id: "video3-0",
				leaf: true
				},
				{
				text: 'Barn Owl licence',
				id: "video3-1",
				leaf: true
				},
				{
				text: 'Barn Owl signs',
				id: "video3-2",
				leaf: true
				}
			]
		    }, 
		      {
			text: 'What is a Barn Owl pellet?',
			id: "video4",
			expanded: true,
			leaf: false,
			children: [{
				text: 'How is a pellet formed?',
				id: "video4-0",
				leaf: true
				},
				{
				text: 'Pellet identification',
				id: "video4-1",
				leaf: true
				},
				{
				text: 'Ageing pellets',
				id: "video4-2",
				leaf: true
				},
				{
				text: 'Analysing pellets', //What have the owls been eating? 
				id: "video4-3",
				//Reference to slideshow on website
				leaf: true
				}
			]
		    }, 
		      {
			text: 'Providing a home',
			id: "video5",
			expanded: true,
			leaf: false,
			children: [{
				text: 'Choosing a building', //66 seconds
				id: "video5-0",
				leaf: true
				},
				{
				text: 'Positioning the nest box', //89 seconds
				id: "video5-1",
				leaf: true
				},
				{
				text: 'Installation safety', //123 seconds
				id: "video5-2",
				leaf: true
				}
			]
		    }
		    ]
		}),
		rootVisible: false,
		listeners: {
			//~ 'checkchange': function(node, checked){
				//~ if(checked){
				    //~ //node.getUI().addClass('complete');
				    //~ alert('you checked a box');
				//~ }else{
				   //~ // node.getUI().removeClass('complete');
				//~ }
			//~ }
			'render': function(tp){
				tp.getSelectionModel().on('selectionchange', function(tree, node){
				//var el = Ext.getCmp('details-panel').body;
				   switch (node.id){
					case 'video0': playmyvideo(barnOwlPlaylist[0],0); break; //good
					case 'video0-0': playmyvideo(barnOwlPlaylist[0],19); break; //best can do
					case 'video0-1': playmyvideo(barnOwlPlaylist[0],95); break; //good
					case 'video0-2': playmyvideo(barnOwlPlaylist[0],142); break; //good
					//playmyvideo(barnOwlPlaylist[0],parseInt(node.attributes.jumpto));
					case 'video1': playmyvideo(barnOwlPlaylist[1],0); break; //good
					case 'video1-0': playmyvideo(barnOwlPlaylist[1],28); break; //best can do
					case 'video1-1': playmyvideo(barnOwlPlaylist[1],46); break; //best can do
					case 'video1-2': playmyvideo(barnOwlPlaylist[1],66); break; //best can do
					case 'video1-3': playmyvideo(barnOwlPlaylist[1],129); break; //good
					case 'video2': playmyvideo(barnOwlPlaylist[2],0); break; //good
					case 'video2-0': playmyvideo(barnOwlPlaylist[2],23); break; //good
					case 'video2-1': playmyvideo(barnOwlPlaylist[2],71); break; //good
					case 'video2-2': playmyvideo(barnOwlPlaylist[2],95); break; //good
					case 'video2-3': playmyvideo(barnOwlPlaylist[2],144); break; //good
					case 'video3': playmyvideo(barnOwlPlaylist[3],0); break;  //good
					case 'video3-0': playmyvideo(barnOwlPlaylist[3],27); break; //good
					case 'video3-1': playmyvideo(barnOwlPlaylist[3],50); break; //best can do
					case 'video3-2': playmyvideo(barnOwlPlaylist[3],109); break; //best can do
					case 'video4': playmyvideo(barnOwlPlaylist[4],0); break; //good
					case 'video4-0': playmyvideo(barnOwlPlaylist[4],15); break; //best can do
					case 'video4-1': playmyvideo(barnOwlPlaylist[4],66); break; //good
					case 'video4-2': playmyvideo(barnOwlPlaylist[4],118); break; //best can do
					case 'video4-3': playmyvideo(barnOwlPlaylist[4],151); break; //good
					case 'video5': playmyvideo(barnOwlPlaylist[5],0); break; //good
					case 'video5-0': playmyvideo(barnOwlPlaylist[5],66); break; //good
					case 'video5-1': playmyvideo(barnOwlPlaylist[5],88); break; //best can do
					case 'video5-2': playmyvideo(barnOwlPlaylist[5],123); break; //good
				   }				
				    //if(node && node.leaf){
					//alert('you selected ' + node.id);
//					alert(node.attributes.jumpto);
					//barnOwlPlayer is not delare yet, but it will exist by the time user clicks a node
					//alert('hello');
					// barnOwlPlayer.seek(parseInt(node.attributes.jumpto));
					//eval('barnOwlPlayer.seek(120)');
				//	tpl.overwrite(el, node.attributes);
				    //~ }else{
				   // alert('you selected ' +node.text);

				   // el.update(detailsText);
				   // }
				})
			}

		}
	});

	tree.getRootNode().expand();

	var myTreePanel = new Ext.Panel({
		xtype: "panel",
		//layout: 'border',
		autoScroll: true,
		region: 'center',
		//id: 'homepanelid',
		border: false,
		contentEl: "treediv"
	});
	
	//~ var translationPanel = new Ext.ux.BubblePanel({
		//~ //renderTo: 'bubbleCt',
		//~ padding: 8,
		//~ //width: 800,
		//~ autoWidth: true,
		//~ //autoHeight: true,
		//~ height: 178,//108,
		//~ //bodyStyle:'padding:10px;',
		//~ contentEl: 'translationdiv'
	//~ });

	//------------------------------------------------------------------------------------------------------------------------------------------- VIEWPORT  
	new Ext.Viewport({
		layout: 'border',
		//region: 'center',
		border: false,
		items:[
			{	
			region: 'center',
			layout: 'border',
			border: false,
			items:[{
				region: 'west',
				id: 'west',
				//title: 'Tree',
				bodyStyle:'padding:5px;',
				items:[myTreePanel],
				collapsible: true,
				//title: 'ymypanel',
				autoScroll: true,
				width: 200//320
				},
				{
				region: 'center',
				layout: 'border',
				items:[{
					region: 'north',
					border: false,
					height: 1
					},
					{
					region: 'center',
					id: 'centerpanel',
					listeners: {
						resize: function(panel, w, h) {
							// Player height should always be 0.56 x width
							// determine which length is limiting
							//alert(w+' '+h);
							// the panel is wider than video outerdiv, therefore subtract 10 px
							//~ document.getElementById("videoouterdiv").style.width = w-10;
							//~ document.getElementById("videoouterdiv").style.height = h;
							
							new_w = (h-20)/0.56;
							new_h = (w-20)*0.56;
							if (new_w <= w && new_h >= h){
								//alert('new_h is no use');
//								document.getElementById("introdiv").style.width = w-40;
//								document.getElementById("introdiv").style.height = h;
								document.getElementById("videodiv").style.width = new_w     -20;
								document.getElementById("videodiv").style.height = h-20;
							} else {
								// either (new_w >= w && new_h <= h) or both are okay
								//alert('new_w is no use');
//								document.getElementById("introdiv").style.width = w-40;
//								document.getElementById("introdiv").style.height = h;								
								document.getElementById("videodiv").style.width = w-20      -20;
								document.getElementById("videodiv").style.height = new_h;
								// manually align the video in the center vertically
								//~ pad = (h - new_h)/2;
								//~ document.getElementById("videodiv").style.paddingTop = pad;
							}
							
						}
					},
					//title: 'Video player',
					bodyStyle:'padding:10px;',
					contentEl: "videoouterdiv",
					autoScroll: true
//					height: 450
					}
					//~ {
					//~ region: 'south',
					//~ id: 'translationpanelid',
					//~ bodyStyle:'padding:0px;',
					//~ //contentEl: "translationdiv",
					//~ items:[translationPanel],
					//~ height: 160
					//~ //title: 'Translation'
					//~ }
				]
			},
			{
			region: 'south',
			//title: 'title',
			contentEl: 'headingdiv',
			bodyStyle:'padding:0px 0px 0px 10px;',
			height: 110
			}
			]
			
		}]
	}); //closes viewport

	scrollBottom = function(){
		var content = Ext.get('videoouterdiv');
		var bottom = content.getHeight();
		var panel = Ext.getCmp('centerpanel');
		panel.body.scroll("b",bottom,true);
	}

}); // end Ext.onReady