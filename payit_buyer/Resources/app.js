/*
* A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
* A starting point for tab-based application with multiple top-level windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var self = Ti.UI.createWindow({
		title : "Pay It",
		backgroundColor : 'white'
	});

	function priceFormatter(x) {
		return x.toFixed(2);
	}

	//load scanner view
	//it should scan information, and return info back
	//to this view via some event

	if (Ti.Platform.model == 'google_sdk' || Ti.Platform.model == 'Simulator') {
		// if simulator skip bar code
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function() {
			var response = JSON.parse(this.responseText);
			Ti.App.fireEvent('getBarCodeData', response);
			scannerWindow.close();

			if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
				Ti.UI.iPhone.statusBarHidden = false;
			}
		};
		xhr.onerror = function() {
			alert("Please make sure you are connected to the internet.");
		}
		xhr.open("GET", "http://pay-pay-it.appspot.com/pull-products?semail=demo@bookstore.com&pid=1&pid=2&pid=3&pid=3");
		xhr.send();
	} else {
		barCodeScanner = require('modules/pages/barcode');
		barCodeScanner.startScan();

	}
	//add listener for product data from server
	Ti.App.addEventListener('getBarCodeData', function(data) {

		var payPalButtonWindow = Ti.UI.createWindow({
			title : "Pay It",
			backgroundColor : 'white'
		});

		var sellerName = data["seller"]["merchantName"];
		var sellerEmail = data["seller"]["email"];

		var productListData = data["product_list"];

		var totalPrice = 0;

		for (var i = 0; i < productListData.length; i++) {
			totalPrice += productListData[i]["itemPrice"];
		}

		var u = "";
		var Paypal = require('ti.paypal');

		Ti.API.info("addPayPalButton");

		var productListTableData = [];

		var row = Ti.UI.createTableViewRow({
			height : 50
		});
		var labelCell = Ti.UI.createLabel({
			left : 0,
			width : "100%",
			text : "Order Summary",
			font : {
				fontSize : 30,
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});

		row.add(labelCell);
		productListTableData.push(row);

		for (var i = 0, j = productListData.length; i < j; i++) {
			var row = Ti.UI.createTableViewRow({
				height : 20
			});
			var labelCell = Ti.UI.createLabel({
				left : 0,
				width : "50%",
				text : productListData[i].name + " (ID #" + productListData[i].itemID + ")",
				font : {
					fontSize : 16,
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			});
			var priceCell = Ti.UI.createLabel({
				left : "50%",
				width : "50%",
				text : priceFormatter(productListData[i]["itemPrice"]),
				font : {
					fontSize : 16
				},
				textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
			});

			row.add(labelCell);
			row.add(priceCell);

			productListTableData.push(row);

		}

		var row = Ti.UI.createTableViewRow({
			height : 20
		});
		var labelCell = Ti.UI.createLabel({
			left : 0,
			width : "50%",
			text : "Total:",
			font : {
				fontSize : 16,
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		var priceCell = Ti.UI.createLabel({
			left : "50%",
			width : "50%",
			text : "$" + priceFormatter(totalPrice),
			font : {
				fontSize : 16
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		});

		row.add(labelCell);
		row.add(priceCell);

		productListTableData.push(row);

		var orderSummaryTable = Ti.UI.createTableView({
			data : productListTableData,
			top : 20,
			footerTitle : "",
			width : width - 40,
			height : Ti.UI.SIZE,
			scrollable : false
		});

		payPalButtonWindow.add(orderSummaryTable);
		var button = Paypal.createPaypalButton({
			width : 152 + u,
			height : 43 + u,
			bottom : 40 + u,
			buttonStyle : Paypal.BUTTON_152x33,
			language : 'en_US',
			textStyle : Paypal.PAYPAL_TEXT_PAY,
			appID : "APP-80W284485P519543T",
			paypalEnvironment : Paypal.PAYPAL_ENV_SANDBOX, // : Paypal.PAYPAL_ENV_LIVE
			enableShipping : false,
			payment : {
				merchantName : sellerName,
				paymentType : Paypal.PAYMENT_TYPE_GOODS,
				subtotal : totalPrice,
				tax : 0,
				shipping : 0,
				currency : 'USD',
				recipient : sellerEmail,
				//customID : strSellerId + "-" + Ti.App.Properties.getString("user_id") + "-" + objConversationData.posting_id,
				invoiceItems : productListData
			},
			//ipnUrl : Ti.App.Properties.getString("local_address") + 'mobile/transaction/complete',
			memo : 'transaction via PayIt kiosk'
		});

		// Events available
		button.addEventListener('paymentCancelled', function(e) {
			Ti.API.info('Payment Cancelled.');

		});
		button.addEventListener('paymentSuccess', function(e) {
			Ti.API.info(JSON.stringify(e));
			Ti.API.info('Payment Success.  TransactionID: ' + e.transactionID + ', Reloading...');

			payPalButtonWindow.remove(button);

			var success_image = Ti.UI.createImageView({
				image : "/images/success.jpg",
				width : "auto",
				height : "auto",
				bottom : 20 + u,
			});

			payPalButtonWindow.add(success_image);
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

		payPalButtonWindow.add(button);

		button.fireEvent("click");
		payPalButtonWindow.open();

		button.fireEvent("click");
	});

	self.open();
})();
