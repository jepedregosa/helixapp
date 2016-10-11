var SERVER_ADDRESS = "http://116.93.120.29:8080/helixapp";

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
        // Will be applied for page with "projects.html" url
        'url:projects.html': {
            firstname: 'John',
            lastname: 'Doe',
            age: 32,
            position: 'CEO',
            company: 'Google',
            interests: ['swimming', 'music', 'JavaScript', 'iMac', 'iOS apps', 'sport'],
            projects: [
                {
                    title: 'Google',
                    description: 'Nice search engine'
                },
                {
                    title: 'YouTube',
                    description: 'Online video service'
                },
                {
                    title: 'Android',
                    description: 'Mobile operating system'
                }
            ]
        },

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
	
	//myApp.formToJSON('#form-login');
	
	//$$('.form-to-json').on('click', function(){
           var formData = myApp.formToJSON('#form-login');
           //alert(JSON.stringify(formData));
     //    });
	 
	 $$.ajax({
		url: SERVER_ADDRESS + "/loginservlet?option=AUTHLOGIN",
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		data: JSON.stringify(formData),
		/*data: {
			q: "select title,abstract,url from search.news where query=\"cat\"",
			format: "json",
			callback:function(){
			   return true;
			}
		},*/
		success: function( response ) {
			//alert( 'ok' );
			var r = JSON.parse(response);
			//mainView.router.loadPage(response);
			if(r.success){
				mainView.router.load({url:'./main.html', ignoreCache:true, reload:true });
				//window.location.href = SERVER_ADDRESS + "/main.html";
			}else{
				myApp.alert(r.message, 'Error');
			}
			
		}
	});
	//
}