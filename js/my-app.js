var SERVER_ADDRESS = "http://116.93.120.29:8080/helixapp";
var USERNAME;

// Let's register Template7 helper so we can pass json string in links
Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
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
		forapproval: [
			{
			TranID: 'Volkswagen',
			TranDate: 'Passat',
			DocAmount: 152,
			TranType: 280.,
			DocOwner: '123'
			}
		],

        // Will be applied for page with data-page="contacts"
        'page:contacts': {
            tel: '+1 (222) 333-44-55',
            email: 'john@doe.com',
            country: 'USA',
            city: 'San Francisco',
            zip: '12345',
            street: 'Awesome st'
        },

        // Just plain data object that we can pass for other pages using data-contextName attribute
        cars: [
            {
                vendor: 'Volkswagen',
                model: 'Passat',
                power: 152,
                speed: 280,
                weight: 1400,
                color: 'black',
                year: 2012,
                description: ''
            },
            {
                vendor: 'Skoda',
                model: 'Superb',
                power: 152,
                speed: 260,
                weight: 1600,
                color: 'white',
                year: 2013,
                description: ''
            },
            {
                vendor: 'Ford',
                model: 'Mustang',
                power: 480,
                speed: 320,
                weight: 1200,
                color: 'red',
                year: 2014,
                description: ''
            },
        ],

        // Another plain data object, used in "about" link in data-contextName object 
        about: {
            name: 'John Doe',
            age: 32,
            position: 'CEO',
            company: 'Google',
            interests: ['swimming', 'music', 'JavaScript', 'iMac', 'iOS apps', 'sport']
        }
    }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
});

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
					mainView.router.loadPage({url:'./index.html', ignoreCache:true, reload:true });
				},
				failure: function(){
					myApp.alert('Failed to logout current session', 'Error');
				}
			});
		}
	);
}

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
					 mainView.router.load({url:'./main.html?username='+username, ignoreCache:true, reload:true});
				 }});
				
			}else{
				myApp.alert(r.message, 'Error');
			}
		}
	});
	//
}

function requisitionlist(){
	$$.ajax({
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
	});
}

function requisitiondetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=requisition&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/requisition/requisitiondetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}
function procurementlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=procurement&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/procurement/procurement.html', ignoreCache:true,
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
}

function procurementdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=procurement&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/procurement/procurementdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}
function voucherlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=voucher&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/voucher/voucher.html', ignoreCache:true,
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
}

function voucherdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=voucher&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/voucher/voucherdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function paymentlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=payment&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/payment/payment.html', ignoreCache:true,
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
}

function paymentdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=payment&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/payment/paymentdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function goodsreceiptlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=goodsreceipt&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/goodsreceipt/goodsreceipt.html', ignoreCache:true,
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
}

function goodsreceiptdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=goodsreceipt&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/goodsreceipt/goodsreceiptdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function journallist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=journal&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/journal/journal.html', ignoreCache:true,
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
}

function journaldetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=journal&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/journal/journaldetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function salesorderlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=salesorder&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/salesorder/salesorder.html', ignoreCache:true,
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
}

function salesorderdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=salesorder&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/salesorder/salesorderdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function deliverylist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=delivery&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/delivery/delivery.html', ignoreCache:true,
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
}

function deliverydetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=delivery&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/delivery/deliverydetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function saleslist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=sales&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/sales/sales.html', ignoreCache:true,
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
}

function salesdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=sales&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/sales/salesdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
}

function receiptlist(){
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=receipt&limitindex=0&limitcount=100",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			mainView.router.loadPage({url:'./modules/receipt/receipt.html', ignoreCache:true,
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
}

function receiptdetaillist(obj){
	//myApp.alert(obj.title, 'Debug');
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=receipt&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			//myApp.alert(response, 'Debug');
			mainView.router.loadPage({url:'./modules/receipt/receiptdetail.html', ignoreCache:true,
				context:{
					forapproval: JSON.parse(response),
					username: sessionStorage.getItem("username")
				}
			});
			
			
		},
		failure: function(){
			myApp.alert('Failed to load approval list detail', 'Error');
		}
	});
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
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " has been approved!", 'Test');
		}
		if(action=="Reject"){
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " has been rejected!", 'Test');
		}
		if(action=="Return To Maker"){
			var SeqID = $$('.dataToBePassed')[0].id;
			myApp.alert(SeqID + " was returned to maker for editing!", 'Test');
		}
		//myApp.alert(action, 'Test');
	}
}	
	


