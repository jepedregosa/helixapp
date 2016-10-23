var SERVER_ADDRESS = "http://192.168.0.104:8080/helixapp";
//var SERVER_ADDRESS = "http://116.93.120.29:8080/helixapp";
var USERNAME;

var TODAY = new Date();
var dd = TODAY.getDate();
var mm = TODAY.getMonth() + 1;
var yyyy = TODAY.getFullYear();
TODAY = yyyy + '-' + mm + '-' + dd;

// Export selectors engine
var $$ = Dom7;
var virtualList;

// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
    // Code for About page
    if (page.name === 'index') {
	   try{
	   $$('.navbar').hide();   
	   var storedData = window.localStorage['f7form-'+ 'form-login'];
	   if(storedData) {
			$$.ajax({
					url: SERVER_ADDRESS + "/loginservlet?option=AUTHLOGIN",
					contentType: 'jsonp',
					method: 'POST',
					type: 'POST',
					dataType : 'jsonp',
					crossDomain: true,
					xhrFields: {withCredentials: true},
					data: storedData,
					success: function( response ) {
					var r = JSON.parse(response);
					var username;
					if(r.success){
						 $$.ajax({
								url: SERVER_ADDRESS + "/infolist",
								contentType: 'jsonp',
								method: 'POST',
								type: 'POST',
								dataType : 'jsonp',
								crossDomain: true,
								xhrFields: {withCredentials: true},
						 success: function( response1 ) {
							 //myApp.alert(response1, 'DEBUG');
							 var r1 = JSON.parse(response1);
								username = r1.username;
								sessionStorage.setItem("username",r1.username);
								sessionStorage.setItem("connection",r1.connection);
								sessionStorage.setItem("dbname",r1.dbname);
								sessionStorage.setItem("UserID",r1.UserID);
								sessionStorage.setItem("UserClass",r1.UserClass);
								sessionStorage.setItem("branchid",r1.branchid);
								sessionStorage.setItem("whseid",r1.whseid);
								sessionStorage.setItem("clientid",r1.clientid);
								sessionStorage.setItem("companyid",r1.companyid);
								sessionStorage.setItem("companyname",r1.companyname);
								sessionStorage.setItem("clientdbtype",r1.clientdbtype);
								sessionStorage.setItem("reportpath",r1.reportpath);
								sessionStorage.setItem("imagepath",r1.imagepath);
								sessionStorage.setItem("theme",r1.theme);
								sessionStorage.setItem("fiscalperiod",r1.fiscalperiod);
								sessionStorage.setItem("rsplink",r1.rsplink);
								sessionStorage.setItem("isadmin",r1.isadmin);
							 $$('.navbar').show();
							 mainView.router.loadPage({url:'./main.html?username='+username, ignoreCache:true, reload:true});
							 
						 }});
					}else{
						alert(r.message);
					}
				}
			});
		}
	   }catch(e){
		   alert(e);
	   }
    }
});

// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    template7Data: {
        // Will be applied for page with "forapproval.html" url
    },
	showToolbar: false,
	// Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr){
        myApp.hideIndicator();
    }
});

function validate(){
   var formData = myApp.formToJSON('#form-login');
	 $$.ajax({
		url: SERVER_ADDRESS + "/loginservlet?option=AUTHLOGIN",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		xhrFields: {withCredentials: true},
		data: JSON.stringify(formData),
		success: function( response ) {
			var r = JSON.parse(response);
			var username;
			if(r.success){
				 $$.ajax({
						url: SERVER_ADDRESS + "/infolist",
						contentType: 'jsonp',
						method: 'POST',
						type: 'POST',
						dataType : 'jsonp',
						crossDomain: true,
						xhrFields: {withCredentials: true},
				 success: function( response1 ) {
					 var r1 = JSON.parse(response1);
						username = r1.username;
						sessionStorage.setItem("username",r1.username);
						sessionStorage.setItem("connection",r1.connection);
						sessionStorage.setItem("dbname",r1.dbname);
						sessionStorage.setItem("UserID",r1.UserID);
						sessionStorage.setItem("UserClass",r1.UserClass);
						sessionStorage.setItem("branchid",r1.branchid);
						sessionStorage.setItem("whseid",r1.whseid);
						sessionStorage.setItem("clientid",r1.clientid);
						sessionStorage.setItem("companyid",r1.companyid);
						sessionStorage.setItem("companyname",r1.companyname);
						sessionStorage.setItem("clientdbtype",r1.clientdbtype);
						sessionStorage.setItem("reportpath",r1.reportpath);
						sessionStorage.setItem("imagepath",r1.imagepath);
						sessionStorage.setItem("theme",r1.theme);
						sessionStorage.setItem("fiscalperiod",r1.fiscalperiod);
						sessionStorage.setItem("rsplink",r1.rsplink);
						sessionStorage.setItem("isadmin",r1.isadmin);
					 myApp.formStoreData('form-login', formData);
					 $$('.navbar').show();
					 mainView.router.loadPage({url:'./main.html?username='+username, ignoreCache:true, reload:true});
				 }});
				
			}else{
				myApp.alert(r.message, 'Error');
			}
		}
	});
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
	showToolbar: false
});

try{
	var myCalendar = myApp.calendar({
		input: '#calendar-input'
	});
}catch(e){
	alert(e);
}

function doLogout(){
	
	myApp.closePanel('right');
	
	myApp.confirm('Are you sure you want to logout?', 'Logout Helix', 
		function () {
			
			$$.ajax({
				url: SERVER_ADDRESS + "/logoutservlet",
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				/*data: {
					q: "select title,abstract,url from search.news where query=\"cat\"",
					format: "json",
					callback:function(){
					   return true;
					}
				},*/
				success: function( response ) {
					myApp.formDeleteData('form-login');
					//mainView.router.back({url:mainView.history[0],ignoreCache:true, reload:true});
					//mainView.history = [];
					mainView.router.loadPage({url:'index.html',ignoreCache:true, reload:true, force:true});
				},
				failure: function(){
					myApp.alert('Failed to logout current session', 'Error');
				}
			});
		}
	);
}


/***************************************************************REQUISITION*********************************************************/



function requisitionlist(){
		
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/requisition/requisition.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
	
	/*$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=requisition&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/requisition/requisition.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});*/
}

function requisitiondetaillist(obj){
	
	
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header&q="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			var rec = JSON.parse(response)[0];
			console.log(rec);
			$$.ajax({
				url: SERVER_ADDRESS + "/requisition?option=detail&BatNbr="+rec.BatNbr,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
										
					mainView.router.loadPage({url:'./modules/requisition/requisitioneditdetail.html?BatNbr=' + rec.BatNbr + '&SeqID=' + rec.SeqID, ignoreCache:true,
					context:{
						header: JSON.parse(response),
						detail: JSON.parse(response2),
						username: sessionStorage.getItem("username")
					}
					});
				},
				failure: function(){
					myApp.alert('Failed to load approval list detail', 'Error');
			}});
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

myApp.onPageInit('requisition', function (page) {
 	myApp.showIndicator();
	
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			try{
				myApp.hideIndicator();
			}catch(e){
				myApp.alert(e,'Debug');
			}
			
			try{
			var test = "requsition";	
			var moduleList = test+"detaillist(this)"	
			// Create virtual list
			virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
				// Pass array with items
				items: JSON.parse(response),
				// Custom search function for searchbar
				searchAll: function (query, items) {
					var found = [];
					for (var i = 0; i < items.length; i++) {
						if (items[i].TranID.trim().toLowerCase().indexOf(query) >= 0 || query.trim().toLowerCase() === ''){ found.push(i);}
						else{}
					}
					return found; //return array with mathced indexes
				},
				// List item Template7 template
				template: '<li title={{SeqID}} class="item-content" onclick="requisitiondetaillist(this)">'+
					'<div class="item-inner">'+
						'<div class="item-media">'+
							'<div class="item-title tranIDMaster">{{TranID}}</div>'+
						'</div>'+
						'<div class="item-title-row">'+
							'<div class="vendorNameMaster">{{VendorName}}</div>'+
						'</div>'+
						'<div class="amountMaster">{{CurCode}} {{DocAmount}}</div>'+
						'<div class="item-subtitle">{{TranDate}}</div>'+
						'<div class="item-subtitle">{{Details}}</div>'+
						'<!--<span class="badge">Vendor: {{VendorName}}</span>-->'+
					'</div>'+
				  '</li>',
				  height: 150
			});
			//myApp.alert(virtualList.items,'Debug');
			}catch(e){
				//myApp.alert(e,'Debug');
			}		
		},
		failure: function(){
			myApp.alert('Failed to load approval list', 'Error');
		}
	});
});
/*
function requisitioneditdetail(obj){
	$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			()
			$$.ajax({
				url: SERVER_ADDRESS + "/requsition?option=detail&BatNbr="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/goodsreceipt/goodsreceiptdetail.html', ignoreCache:true,
					context:{
						forapproval: JSON.parse(response),
						forapprovaldetail: JSON.parse(response2),
						username: sessionStorage.getItem("username")
					}
					});
				},
				failure: function(){
					myApp.alert('Failed to load approval list detail', 'Error');
			}});
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}
*/

myApp.onPageInit('requisitioneditdetail', function (page) {
	
	console.log(page.query);
	
	myApp.showIndicator();
	if(page.query.SeqID){
		$$.ajax({
		url: SERVER_ADDRESS + "/requisition?option=header&q="+page.query.SeqID,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			try{
				myApp.hideIndicator();
			}catch(e){
				myApp.alert(e,'Debug');
			}
			
			console.log(JSON.parse(response)[0]);
			myApp.formFromJSON('#masterForm', JSON.parse(response)[0]);
			
			$$.ajax({
				url: SERVER_ADDRESS + "/requisition?option=detail&BatNbr="+page.query.BatNbr,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
										
					virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
						items: JSON.parse(response2),
						// List item Template7 template
						template: '<li class="swipeout">'+
							'<div class="swipeout-content item-content">'+
								'<div class="item-inner">'+
								  '<div class="item-title"><b>{{ItemID}}</b></div>'+	
								  '<div class="item-subtitle"><b>{{ItemDescription}}</b></div>'+
								  '<div class="item-subtitle"><b>{{Qty}} {{Unit}} X {{UnitCost}}</b></div>'+
								  '<div class="item-subtitle" style="display: none;">{{LineSeqID}}</div>'+
								  '<div class="item-subtitle" style="display: none;">{{SeqID}}</div>'+
								'</div>'+
								'<div class="item-after">{{Amount}}</div>'+
							'</div>'+
							'<div class="swipeout-actions-right">'+
								'<a href="#" onclick="openPopupEditDetail(this,{{LineSeqID}});"><i class="icon icon-pencil"></i></a>'+
								'<a href="#" onclick="removeDetailList(this,{{LineSeqID}});"><i class="icon icon-bin"></i></a>'+
							'</div>'+
						'</li>',
						height: 150
					});
				},
				failure: function(){
					myApp.alert('Failed to load list detail', 'Error');
			}});
			
			
			
			/*try{
				var test = "requisition";	
				var moduleList = test+"detaillist(this)"	
				// Create virtual list
				virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
					// Pass array with items
					items: JSON.parse(response),
					// Custom search function for searchbar
					searchAll: function (query, items) {
						var found = [];
						for (var i = 0; i < items.length; i++) {
							if (items[i].TranID.trim().toLowerCase().indexOf(query) >= 0 || query.trim().toLowerCase() === ''){ found.push(i);}
							else if (items[i].Details.trim().toLowerCase().indexOf(query) >= 0){ found.push(i);}
							else{}
						}
						return found; //return array with mathced indexes
					},
					// List item Template7 template
					template: '<li title={{SeqID}} class="item-content dataToBePassed" onclick="'+moduleList+'">'+
						'<div class="item-inner">'+
							'<div class="item-media">'+
								'<div class="item-title tranIDMaster">{{TranID}}</div>'+
							'</div>'+
							'<div class="item-title-row">'+
							'</div>'+
							'<div class="item-subtitle">{{TranDate}}</div>'+
							'<div class="item-subtitle">{{RequiredDate}}</div>'+
						'</div>'+
					  '</li>',
					  height: 150
				});
				//myApp.alert(virtualList.items,'Debug');
				}catch(e){
					//myApp.alert(e,'Debug');
				}*/		
			},
			failure: function(){
				myApp.alert('Failed to load list', 'Error');
			}
		});	
	}else{
		
		
		
		$$.ajax({
			url: SERVER_ADDRESS + "/trantypelist?module=requisition",
			contentType: 'jsonp',
			method: 'POST',
			type: 'POST',
			dataType : 'jsonp',
			crossDomain: true,
			success: function( response ) {
				var data = JSON.parse(response);
				if(data.data.length == 0){
					myApp.alert('No available transaction ID!', 'Error');
				}else{
					var rec = data.data[0];
					var obj = new Object();
					obj.TranID = rec.NextRefNbr;
					obj.TranType = rec.JournalType;
					obj.TranDate = TODAY;
					obj.RequiredDate = TODAY;
					myApp.formFromJSON('#masterForm', obj);
				}
			}
		});
		
	
		virtualList = myApp.virtualList($$(page.container).find('.virtual-list'), {
			items: [
			],
			// List item Template7 template
			template: '<li class="swipeout">'+
				'<div class="swipeout-content item-content">'+
					'<div class="item-inner">'+
					  '<div class="item-title"><b>{{ItemID}}</b></div>'+	
					  '<div class="item-subtitle"><b>{{ItemDescription}}</b></div>'+
					  '<div class="item-subtitle"><b>{{Qty}} {{Unit}} X {{UnitCost}}</b></div>'+
					  '<div class="item-subtitle" style="display: none;">{{LineSeqID}}</div>'+
					  '<div class="item-subtitle" style="display: none;">{{SeqID}}</div>'+
					'</div>'+
					'<div class="item-after">{{Amount}}</div>'+
				'</div>'+
				'<div class="swipeout-actions-right">'+
					'<a href="#" onclick="openPopupEditDetail(this,{{LineSeqID}});"><i class="icon icon-pencil"></i></a>'+
					'<a href="#" onclick="removeDetailList(this,{{LineSeqID}});"><i class="icon icon-bin"></i></a>'+
				'</div>'+
			'</li>',
			height: 150
		});
	}
});

function openPopupEditDetail(container,lineseqId){
	
	console.log('dito');
	
	//alert(container +" - "+ seqId);
	//var myList = $$(container).find('.virtual-list');
	var popuphtml = '<div class="popup"><center><h3>Item Detail Form</h3></center><div class="list-block">'+
				'<form id="popup"><ul><li>'+
				'<div class="item-content">'+
					'<div class="item-inner">'+
					  '<!--<div class="item-title label">Item ID</div>-->'+
					  '<div class="item-input">'+
						'<input type="text" name="ItemID" placeholder="Item ID">'+
					  '</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content">'+
					'<div class="item-inner">'+
					  '<!--<div class="item-title label">Item Description</div>-->'+
					  '<div class="item-input">'+
						'<input type="text" name="ItemDescription" placeholder="Item Description">'+
					  '</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content">'+
					'<div class="item-inner">'+
						'<!--<div class="item-title label">Qty</div>-->'+
						'<div class="item-input">'+
							'<input type="text" name="Qty" placeholder="Quantity">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content">'+
					'<div class="item-inner">'+
						'<!--<div class="item-title label">Unit</div>-->'+
						'<div class="item-input">'+
							'<input type="text" name="Unit" placeholder="Unit">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content">'+
					'<div class="item-inner">'+
						'<!--<div class="item-title label">Unit Cost</div>-->'+
						'<div class="item-input">'+
							'<input type="text" name="UnitCost" placeholder="Unit Cost">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content">'+
					'<div class="item-inner">'+
						'<div class="item-input">'+
							'<input type="date" name="DeliveryDate" placeholder="Delivery Date">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content" style="display: none;">'+
					'<div class="item-inner">'+
						'<div class="item-input">'+
							'<input type="text" hidden name="SeqID" placeholder="SeqID">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="item-content" style="display: none;">'+
					'<div class="item-inner">'+
						'<div class="item-input">'+
							'<input type="text" name="LineSeqID" placeholder="LineSeqID">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'</li></ul></form></div>'+
				'<p class="buttons-row">'+
				  '<a href="#" class="button button-round close-popup" onclick="updateDetailList();">Save</a>'+
				  '<a href="#" class="button button-round close-popup">Cancel</a>'+
				'</p>'+
				'</div>';
	myApp.popup(popuphtml);
	
	
	var rec;
	
	console.log(rec);
	
	console.log(lineseqId);
	
	if(lineseqId){
		for(var i=0; i<virtualList.items.length; i++){
			tmprec = virtualList.items[i];
			if(tmprec.LineSeqID == lineseqId){
				rec = tmprec;
				break;
			}
		}
	}
	
	console.log(rec);
	
	if(rec){
		myApp.formFromJSON('#popup', rec);
	}else{
		var lineseqid =  virtualList.items.length + 1;
		
		var obj = new Object();
		obj.LineSeqID = lineseqid;
		
		console.log(obj);
		
		myApp.formFromJSON('#popup', obj);
		
	}
	
	
	
}

function removeDetailList(vlist, lineseqid){
	
	console.log(lineseqid);
	
	myApp.confirm('Are you sure you want delete this record?', 'Confirm Delete', 
		function () {
			for(var i=0; i<virtualList.items.length; i++){
				var rec = virtualList.items[i];
				if(rec.LineSeqID == lineseqid){
					virtualList.deleteItem(i);
					virtualList.update();
					break;
				}
			}
			
			/*KELANGAN IUPDATE LAHAT NG LINESEQID*/
			for(var i=0; i<virtualList.items.length; i++){
				var rec = virtualList.items[i];
				console.log(rec);
				rec.LineSeqID = i+1;
				virtualList.replaceItem(i, rec);
				virtualList.update();
			}
		}
	);
	
	//virtualList.deleteItem(formData);
	
}

function updateDetailList(){
	
	var formData = myApp.formToJSON($$('#popup')); 
	console.log(formData.LineSeqID);
	var lineSeqId = formData.LineSeqID;
	var found = false;
	
	for(var i=0; i<virtualList.items.length; i++){
		var rec = virtualList.items[i];
		if(rec.LineSeqID == lineSeqId){
			found = true;
			virtualList.replaceItem(i, formData);
			virtualList.update();
			break;
		}
	}
	
	if(!found){
		try{
			virtualList.appendItem(formData);
			virtualList.update();
			//alert(virtualList.items.length);
		}catch(e){
			myApp.alert(e,'Debug');	
		}
	}
	
}
	
function toggleactionbuttons(obj, action){
	var clicked = $$(obj);
	
	if (clicked.hasClass('floating-button') && clicked.parent().hasClass('speed-dial')) {
		clicked.parent().toggleClass('speed-dial-opened');
	}
	
	if(clicked.parent().hasClass('speed-dial-buttons')){
		clicked.parent().parent().toggleClass('speed-dial-opened');
	}
	
	if (clicked.hasClass('close-speed-dial')) {
		$$('.speed-dial-opened').removeClass('speed-dial-opened');
	}
	
	if(action){
		if(action=="Approve"){
			var obj = $$('.dataToBePassed')[0];
			var SeqID = obj.id;
			var Module = obj.title;
			
			myApp.modal({
			  title: 'Approval',
			  text: 'Enter Remarks',
			  afterText: '<textarea class="modal-text-input" style="width: 90%; height: 100px; overflow:auto; resize: none;"></textarea>',
			  buttons: [{
				text: 'OK',
				onClick: function() {
				  var rem = $$('.modal-text-input')[0].value; 	
				  if(rem){
					  $$.ajax({
						url: SERVER_ADDRESS + "/transervlet?module="+Module+"&SeqID="+SeqID+"&Action=APPROVED&Memo="+rem,
						contentType: 'jsonp',
						method: 'POST',
						type: 'POST',
						dataType : 'jsonp',
						crossDomain: true,
						success: function( response2 ) {
							myApp.alert(SeqID+' Approved', 'Notice');
							$$.ajax({
								url: SERVER_ADDRESS + "/tranlist?module="+Module+"&limitindex=0&limitcount=100",
								contentType: 'jsonp',
								method: 'POST',
								type: 'POST',
								dataType : 'jsonp',
								crossDomain: true,
								success: function( response ) {
									mainView.router.back({url:mainView.history[0],reload:true});
								},
								failure: function(){
									myApp.alert('Failed to load approval list', 'Error');
								}
							});
						},
						failure: function(){
							myApp.alert('Approval Failed', 'Error');
					}});
				  }else{
					  myApp.alert('Approval Failed. Remarks is required', 'Error');
				  }
				  
				}
			  }, {
				text: 'Cancel',
				onClick: function() {
				}
			  }]
			});
		}
		if(action=="Reject"){
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " has been rejected!", 'Test');
		}
		if(action=="Return To Maker"){
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " was returned to maker for editing!", 'Test');
		}
		if(action=="New"){
			var obj = $$('.floating-button')[0];
			var Module = obj.title;
			try{
				mainView.router.loadPage({url:'./modules/'+Module+'/'+Module+'editdetail.html', ignoreCache:true});	
			}catch(e){
				myApp.alert(e, 'Dubug');
			}
		}
		if(action=="Save"){
			var obj = $$('.floating-button')[0];
			var Module = obj.title;
			var formData = myApp.formToJSON('#masterForm');
			formData.data = virtualList.items;
			
			try{
				console.log(JSON.stringify(formData));
				
				$$.ajax({
					url: SERVER_ADDRESS + "/requisition?option=update",
					contentType: 'jsonp',
					method: 'POST',
					type: 'POST',
					dataType : 'jsonp',
					crossDomain: true,
					data: JSON.stringify(formData),
					success: function( response2 ) {
						console.log(response2);
						var rec = JSON.parse(response2);
						if(rec.success){
							myApp.alert('Sucessfully Updated!', '');
						}else{
							myApp.alert(rec.message, 'Error');
						}
					},
					failure: function(){
						myApp.alert('Approval Failed', 'Error');
					}
				});
				
				
				//mainView.router.loadPage({url:'./modules/'+Module+'/'+Module+'editdetail.html', ignoreCache:true});	
			}catch(e){
				myApp.alert(e, 'Dubug');
			}
		}
	}
}