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
	$$.ajax({
		url: SERVER_ADDRESS + "/tranlist?module=sales&limitindex=0&limitcount=100&SeqID="+obj.title,
		contentType: 'jsonp',
		method: 'POST',
		type: 'POST',
		dataType : 'jsonp',
		crossDomain: true,
		success: function( response ) {
			$$.ajax({
				url: SERVER_ADDRESS + "/tranlist?module=sales&option=detail&SeqID="+obj.title,
				contentType: 'jsonp',
				method: 'POST',
				type: 'POST',
				dataType : 'jsonp',
				crossDomain: true,
				success: function( response2 ) {
					mainView.router.loadPage({url:'./modules/sales/salesdetail.html', ignoreCache:true,
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