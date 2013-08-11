function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',		
		barColor:'#333',
		layout:'vertical'
	});
	var logo = Ti.UI.createImageView({
		image:'/images/logo.jpg',
		top:20,
		width:'55%',
		// height:'20%'
	});

	var itemIds = ["0","1","2","3","4","5"];
	var itemTitles = ["Fermat\'s Enigma",
		"Algebra 2: A Teaching Textbook",
		"Educational Facilities Planning",
		"Veterinary Psychology",
		"Founders at Work",
		"The Brothers Karamazov"];
	var itemPrices = [50,20,30,60,50,90];
	var itemInventory = [1,2,1,2,1,1];
	var itemIds2 = ["6","7","8","9","10","11"];
	var itemTitles2 = ["The Legend of YAOTL",
		"Harry Potter Collection",
		"Donuts",
		"Godzilla!",
		"Green Eggs and Ham",
		"Identifying Wood"];		
	var itemInventory2 = [2,2,3,2,1,5];
	var itemPrices2 = [10,110,30,30,10,2000];

	//create a gridview with horizontal layout
	//to contain our images
	var gridTitle1 = Ti.UI.createButtonBar({
		labels: ["Classics"],
		backgroundColor:'#333',
		height:40,
		top:30,
		size:40,
		width:'100%',
		style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
	});
	var gridTitle2 = Ti.UI.createButtonBar({
		labels: ["Entertainment"],
		backgroundColor:'#333',
		height:40,
		top:30,
		size:40,
		width:'100%',
		style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
	});
	var gridView = Ti.UI.createScrollView({
		layout:'horizontal',
		contentWidth:'auto',
		scrollType:'horizontal',
		disableBounce:'true',
		showHorizontalScrollIndicator:true,
		top:0,
		height:250
	});
	var gridView2 = Ti.UI.createScrollView({
		layout:'horizontal',
		contentWidth:'auto',
		scrollType:'horizontal',
		disableBounce:'true',
		showHorizontalScrollIndicator:true,
		top:0,
		height:250
	});

	//create the images
	var qrWindow = require('/ui/tablet/QRWindow');
	for (var i=0; i<=itemTitles.length-1; i++) {
		//create a view with a picture
		var view = Ti.UI.createView({
			backgroundColor:'#CCC',
			width:200,
			height:200,
			left:20,
			top:20
		});
		var pic = Ti.UI.createImageView({
			id: i,
			itemTitle: itemTitles[i],
			itemPrice: itemPrices[i],
			itemInv: itemInventory[i],
			image: '/images/item' + String(i) + '.jpg'
		});
		pic.addEventListener('click', function(e) {
			var itemId = e.source.id;
			var itemTitle = e.source.itemTitle;
			var itemPrice = e.source.itemPrice;
			var itemInv = e.source.itemInv;
			qrWindow(itemId,itemTitle,itemPrice,itemInv).open({
				transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});
		view.add(pic);
		gridView.add(view);
	}
	for (var i=6; i<=11; i++) {
		//create a view with a picture
		var view = Ti.UI.createView({
			backgroundColor:'#CCC',
			width:200,
			height:200,
			left:20,
			top:20
		});
		var pic = Ti.UI.createImageView({
			id: i,
			itemTitle: itemTitles2[i-6],
			itemPrice: itemPrices2[i-6],
			itemInv: itemInventory2[i-6],
			image: '/images/item' + String(i) + '.jpg'
		});
		pic.addEventListener('click', function(e) {
			var itemId = e.source.id;
			var itemTitle = e.source.itemTitle;
			var itemPrice = e.source.itemPrice;
			var itemInv = e.source.itemInv;
			qrWindow(itemId,itemTitle,itemPrice,itemInv).open({
				transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});
		view.add(pic);
		gridView2.add(view);
	}

	self.add(logo);
	self.add(gridTitle1);
	self.add(gridView);
	self.add(gridTitle2);
	self.add(gridView2);
	
	return self;
};

module.exports = ApplicationWindow;
