function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',		
	});

	var itemIds = ["0","1","2","3","4","5"];

	//create a gridview with horizontal layout
	//to contain our images
	var gridView = Ti.UI.createView({
		layout:'horizontal',
		top:30
	})

	//create the images
	var qrWindow = require('/ui/tablet/QRWindow');
	var i=0;
	// for (var i=0; i<=5; i++) {
		//create a view with a picture
		var view = Ti.UI.createView({
			backgroundColor:'#CCC',
			width:200,
			height:200,
			left:20,
			top:20
		});
		var pic = Ti.UI.createImageView({
			image: '/images/item' + String(i) + '.jpg'
		});
		pic.addEventListener('click', function() {
			//send to a screen with the QR code			
			qrWindow(i).open();
		});
		view.add(pic);
		gridView.add(view);
	// }

	self.add(gridView);

	// var QRCodeView = require('library/qrcode/qrcode');
	// var qrCodeView = new QRCodeView('Hello World!');

	// self.add(qrCodeView);
	
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
