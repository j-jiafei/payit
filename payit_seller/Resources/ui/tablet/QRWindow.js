function QRWindow(itemid, itemtitle, itemprice) {

	var self = Ti.UI.createWindow({
		backgroundColor:'white',
		layout:'vertical'
	});
	var title = Ti.UI.createLabel({
		top:150,
		text: itemtitle,
		height:50,
		width:500,
		minimumFontSize:40
	});	
	var container = Ti.UI.createView({
		layout:'horizontal',
		width:'70%'
	});

	//compute stuff
	var tax = itemprice*0.085;
	var total = itemprice + tax;
	itemprice = itemprice.toFixed(2);
	tax = tax.toFixed(2);
	total=total.toFixed(2);

	//QR CODE *************************************
	var qrcode = require('/library/TiQR/Resources/qrcode').QRCode({
		typeNumber: 4,
		errorCorrectLevel: 'M'
	});
	var csvGen = require('/ui/common/csvGen');

	//get the seller email
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
	container.add(qrCodeView);

	//button to close the window
	var rightView = Ti.UI.createView({
		layout:'vertical'
	});
	var infoLabel = Ti.UI.createLabel({
		text: 'Price:  $'+String(itemprice)+
			  '\nTax:    $'+String(tax)+
			  '\nTotal:  $'+String(total),
		top:50,		
	});
	var closeButton = Ti.UI.createButton({
		top:50,
		title:"Close window",
		width:200,
		height:30,
		backgroundColor:'#CCC',
		style:Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	var confirmButton = Ti.UI.createButton({
		top:10,
		title:"Confirm purchase",
		width:200,
		height:30,
		backgroundColor:'red',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	closeButton.addEventListener('click',function() {
		QRCodeView = null;
		csvGen=null;
		self.remove(qrCodeView);
		self.remove(closeButton);
		self.close();
		self=null;
	});	
	rightView.add(infoLabel);
	rightView.add(closeButton);
	rightView.add(confirmButton);
	container.add(rightView);
	self.add(title);
	self.add(container);

	return self;
}

module.exports = QRWindow;