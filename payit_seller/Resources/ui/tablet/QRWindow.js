function QRWindow(itemid, itemtitle, itemprice) {
	
	//get the seller email
	var email = Ti.App.Properties.getString('email');

	var self = Ti.UI.createWindow({
		backgroundColor:'#EEE',
		layout:'vertical',
		top:45,
		height:'90%'
	});
	var top = Ti.UI.createView({
		top:20,
		margin:20,
		width:'80%',
		height:400,
		borderColor:'white',
		backgroundColor:'white',
		borderWidth:5,
		borderRadius:10,
		layout:'vertical'
	});
	var bottom = Ti.UI.createView({
		top:20,
		margin:20,
		width:'80%',
		height:400,
		borderColor:'white',
		backgroundColor:'white',
		borderWidth:5,
		borderRadius:10,
		layout:'vertical'
	});
	var title = Ti.UI.createLabel({
		top:10,
		text: itemtitle,
		width:'100%',
		height:45,
		width:500,
		minimumFontSize:35,
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
	});	
	var container = Ti.UI.createView({
		layout:'horizontal',
		width:'100%'
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

	var arrayToEncode = [email, String(itemid)];
	var stringToEncode = csvGen(arrayToEncode);
	var qrCodeView = qrcode.createQRCodeView({
		width:300,
		height:300,
		margin:4,
		top:50,
		text:stringToEncode
	})

	//add stuff
	top.add(qrCodeView);

	//button to close the window
	var rightView = Ti.UI.createView({
		layout:'vertical',
		left:20,
	});
	var infoLabel = Ti.UI.createLabel({
		text: 'Price:  $'+String(itemprice)+
			  '\nTax:    $'+String(tax)+
			  '\nTotal:  $'+String(total),
		top:20,	
		left:40,	
		width:200
	});
	var closeButton = Ti.UI.createButton({
		top:20,
		title:"Back to store",
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
		email=null;
		self.remove(qrCodeView);
		self.remove(closeButton);
		self.close({
			transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
		self=null;
	});	

	rightView.add(closeButton);
	rightView.add(confirmButton);
	container.add(infoLabel);
	container.add(rightView);
	bottom.add(title);
	bottom.add(container);
	self.add(top);
	self.add(bottom);

	return self;
}

module.exports = QRWindow;