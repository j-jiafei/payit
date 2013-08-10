function QRWindow(itemid) {

	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		layout:'vertical'
	});

	var QRCodeView = require('/library/qrcode/qrcode');
	var csvGen = require('/ui/common/csvGen');

	//get the seller email from local cache	
	var arrayToEncode = ['jack.hs.chua@gmail.com', String(itemid)];
	var stringToEncode = csvGen(arrayToEncode);
	var qrCodeView = QRCodeView(stringToEncode);

	//button to close the window
	var closeButton = Ti.UI.createButton({
		title:"Close window"
	});
	closeButton.addEventListener('click',function() {
		// self.remove(qrCodeView);
		// self.remove(closeButton);
		self.close();
		// self=null;
	});	

	//add stuff
	self.add(qrCodeView);
	self.add(closeButton);

	return self;
}

module.exports = QRWindow;