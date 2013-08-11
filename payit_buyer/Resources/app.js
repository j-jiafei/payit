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

	function priceFormatter(x) {
		return x.toFixed(2);
	}

	//add listener for product data from server
	Ti.App.addEventListener('getBarCodeData', function(data) {
		var tabGroup = Ti.UI.createTabGroup();

		var payPalButtonWindow = Ti.UI.createWindow({
			title : "Order Summary",
			backgroundColor : 'white',
			layout : 'vertical',
			tabBarHidden : true
		});

		var sellerName = data["seller"]["merchantName"];
		var sellerEmail = data["seller"]["email"];

		var productListData = data["product_list"];

		var totalPrice = 0;
		var emailBody = "Here is a summary of your sale.<br><TABLE><TR><TH>ITEM</TH><TH>PRICE</TH></TR>"

		var u = "";
		var Paypal = require('ti.paypal');

		Ti.API.info("addPayPalButton");

		var productListTableData = [];

		for (var i = 0, j = productListData.length; i < j; i++) {
			totalPrice += productListData[i]["itemPrice"];

			var row = Ti.UI.createTableViewRow({
				height : 25
			});
			var labelCell = Ti.UI.createLabel({
				left : 0,
				width : "60%",
				text : productListData[i].name + " (ID #" + productListData[i].itemID + ")",
				font : {
					fontSize : 16
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

			// update email too
			emailBody += "<TR><TD>" + productListData[i].name + " (ID #" + productListData[i].itemID + ")" + "</TD><TD>" + priceFormatter(productListData[i]["itemPrice"]) + "</TD></TR>";

		}

		emailBody += "</TABLE>"

		var emailBody = Ti.Network.encodeURIComponent(emailBody);

		var row = Ti.UI.createTableViewRow({
			height : 20
		});
		var labelCell = Ti.UI.createLabel({
			left : 0,
			width : "50%",
			text : "Total:",
			font : {
				fontSize : 16,
				fontWeight : "bold"
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		});
		var priceCell = Ti.UI.createLabel({
			left : "50%",
			width : "50%",
			text : "$" + priceFormatter(totalPrice),
			font : {
				fontSize : 16,
				fontWeight : "bold"
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
			scrollable : false,
			allowsSelection : false
		});

		payPalButtonWindow.add(orderSummaryTable);
		var button = Paypal.createPaypalButton({
			width : 152,
			height : 43,
			bottom : 40,
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

			payPalButtonWindow.remove(button);

			var success_image = Ti.UI.createImageView({
				image : "/images/success.jpg",
				width : "auto",
				height : "auto",
				top : 30,
			});

			payPalButtonWindow.add(success_image);

			// send receipt
			var xhr = Ti.Network.createHTTPClient();
			xhr.onload = function() {
			};
			xhr.onerror = function() {
				alert("Please make sure you are connected to the internet.");
			}
			var emailSubject = Ti.Network.encodeURIComponent("Receipt for Transaction " + e.transaction);
			
			var sendGridAddress="https://sendgrid.com/api/mail.send.json?api_user=conniefan&api_key=antigone&to=" + sellerEmail + "&subject=" + emailSubject + "&html=" + emailBody + "&from=payit.notices@gmail.com&fromname=PayIt&replyto=payit.notices@gmail.com";
			
			xhr.open("GET", sendGridAddress);
			xhr.send();
			
			alert(sendGridAddress);

			var doneButton = Ti.UI.createButton({
				title : "Done",
				width : 200,
				height : 30,
				top : 40,
				backgroundColor : '#CCC',
				color : "#000",
				style : Ti.UI.iPhone.SystemButtonStyle.PLAIN
			});

			doneButton.addEventListener('click', restartApp);
			payPalButtonWindow.add(doneButton);

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

		var tab = Ti.UI.createTab({
			window : payPalButtonWindow,
			title : 'Order Summary'
		});

		tabGroup.addTab(tab);
		tabGroup.open();
	});

	function restartApp() {
		openScannerWindow();
	}

	function openScannerWindow() {
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
	}

	var blankWindow = Ti.UI.createWindow({
		title : "Pay It",
		backgroundColor : 'white'
	});

	blankWindow.open();
	openScannerWindow();

})();
