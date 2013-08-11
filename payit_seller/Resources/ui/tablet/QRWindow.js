function QRWindow(itemid) {

	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		layout:'vertical'
	});

	var qrcode = require('/library/TiQRCodeView/Resources/qrcode').QRCode({
		typeNumber: 4,
		errorCorrectLevel: 'M'
	});
	var csvGen = require('/ui/common/csvGen');

	//get the seller email from local cache	
	var arrayToEncode = ['jack.hs.chua@gmail.com', String(itemid)];
	var stringToEncode = csvGen(arrayToEncode);
	var qrCodeView = qrcode.createQRCodeView({
		width:300,
		height:300,
		margin:4,
		top:50,
		text:stringToEncode
	})

	//add stuff
	self.add(qrCodeView);

	//button to close the window
	var closeButton = Ti.UI.createButton({
		title:"Close window"
	});
	var confirmButton = Ti.UI.createButton({
		title:"Confirm purchase"
	});
	closeButton.addEventListener('click',function() {
		QRCodeView = null;
		csvGen=null;
		self.remove(qrCodeView);
		self.remove(closeButton);
		self.close();
		self=null;
	});	
	self.add(closeButton);
	self.add(confirmButton);

	return self;
}

module.exports = QRWindow;