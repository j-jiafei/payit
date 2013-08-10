function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});

	var QRCodeView = require('library/qrcode/qrcode');
	var qrCodeView = new QRCodeView('Hello World!');

	self.add(qrCodeView);
	
	// button.addEventListener('click', function() {
	// 	//containingTab attribute must be set by parent tab group on
	// 	//the window for this work
	// 	self.containingTab.open(Ti.UI.createWindow({
	// 		title: L('newWindow'),
	// 		backgroundColor: 'white'
	// 	}));
	// });
	
	return self;
};

module.exports = ApplicationWindow;
