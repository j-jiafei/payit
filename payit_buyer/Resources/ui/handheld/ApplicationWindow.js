function ApplicationWindow() {
	var self = Ti.UI.createWindow({
		title : "Pay It",
		backgroundColor : 'white'
	});

	//load scanner view
	//it should scan information, and return info back
	//to this view via some event
	barCodeScanner = require('modules/pages/barcode');
	barCodeScanner.startScan();

	//add listener for product data from server
	// example data: [{"price": 43.0, "pid": 0, "name": "book1"}, {"price": 63.0, "pid": 1, "name": "book2"},
	//     {"price": 34.0, "pid": 2, "name": "book3"}]
	Ti.App.addEventListener('getBarCodeData', function(data) {
		alert(data);
		
		var sellerName=data["seller"]["name"];
		var sellerEmail=data["seller"]["email"];
		
		var productListData=data["product_list"];
		
		var i = 0;
		var totalPrice = 0;
		
		for (; i < productListData.length; i++) {
			totalPrice+=productListData[i].price
		}

		var u = "";
		var Paypal = require('ti.paypal');

		
		function processPaypalSale(response) {
			Ti.App.removeEventListener("paypal.sale.success", processPaypalSale);
		}

		Ti.API.info("addPayPalButton");

			button = Paypal.createPaypalButton({
				width : 152 + u,
				height : 43 + u,
				buttonStyle : Paypal.BUTTON_152x33, 
				top : 0 + u,
				left : 0 + u,
				language : 'en_US',
				textStyle : Paypal.PAYPAL_TEXT_PAY, 
				appID : "APP-80W284485P519543T",
				paypalEnvironment : Paypal.PAYPAL_ENV_SANDBOX,  // : Paypal.PAYPAL_ENV_LIVE 
				enableShipping : false,
				payment : {
					merchantName : sellerName,
					paymentType : Paypal.PAYMENT_TYPE_PERSONAL, 
					subtotal : totalPrice,
					tax : 0,
					shipping : 0,
					currency : 'USD',
					recipient : sellerEmail,
					//customID : strSellerId + "-" + Ti.App.Properties.getString("user_id") + "-" + objConversationData.posting_id,
					invoiceItems : [{
						name : 'Post Title',
						totalPrice : intProductPrice,
						itemPrice : intProductPrice,
						itemCount : 1
					}]
				},
				//ipnUrl : Ti.App.Properties.getString("local_address") + 'mobile/transaction/complete',
				memo : 'transaction via PayIt kiosk'
			});

			// Events available
			button.addEventListener('paymentCancelled', function(e) {
				Ti.API.info('Payment Cancelled.');
			
			});
			button.addEventListener('paymentSuccess', function(e) {
				alert("yay");
				Ti.API.info(JSON.stringify(e));
				Ti.API.info('Payment Success.  TransactionID: ' + e.transactionID + ', Reloading...');

				Ti.App.addEventListener("paypal.sale.success", processPaypalSale);	
			});
			button.addEventListener('paymentError', function(e) {
				Ti.API.info('Payment Error,  errorCode: ' + e.errorCode + ', errorMessage: ' + e.errorMessage);
			});

			button.addEventListener('buttonDisplayed', function() {
				Ti.API.info('The button was displayed!');
			});
			button.addEventListener('buttonError', function() {
				Ti.API.info('The button failed to display!');
			});

		
	});

	return self;
};

module.exports = ApplicationWindow;

