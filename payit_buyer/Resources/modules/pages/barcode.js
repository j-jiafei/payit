//bar code module - encapsulates a window too
//when it's done, fires a global event with the corresponding
//data

var scannerWindow = Ti.UI.createWindow({
	title : 'Scan QR Code on PayIt Kiosk',
	backgroundColor : '#fff'
});

//public interface
module.exports = {
	startScan : function() {
		var scanditsdk = require('com.mirasense.scanditsdk');

		if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
			Ti.UI.iPhone.statusBarHidden = false;
		}

		var picker = scanditsdk.createView({
			"width" : Ti.Platform.displayCaps.platformWidth,
			"height:" : Ti.Platform.displayCaps.platformHeight
		});
		picker.init("vRK9hC0PEeKMG7o7QRF4Ujs1ql6zpjctjqao/ZlsBlA", 0);
		picker.setSuccessCallback(function(e) {
			// parse bar code
			var code = e.barcode;
			var sellerAndProductsArray = code.split(",");

			var pidString = "";
			var i = 1;
			for ( i = 1; i < sellerAndProductsArray.length; i++) {
				pidString = pidString + "&pid=" + sellerAndProductsArray[i];
			}

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
			xhr.open("GET", "http://pay-pay-it.appspot.com/pull-products?semail=" + sellerAndProductsArray[0] + pidString);
			xhr.send();
		});
		picker.setCancelCallback(function(e) {
			scannerWindow.close();
		});
		picker.showToolBar(true);
		picker.startScanning();
		scannerWindow.add(picker);
		scannerWindow.open();
	},
	stopScan : function() {
		scannerWindow.close();
	}
}; 