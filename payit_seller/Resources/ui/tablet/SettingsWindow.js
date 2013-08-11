function SettingsWindow(title) {

	var email = Ti.App.Properties.getString('email');

	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',		
		barColor:'#333',
		layout:'vertical'
	});
	var cover = Ti.UI.createButton({
		top:10,
		title:"Upload cover",
		width:250,
		height:40,
		backgroundColor:'#CCC',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});
	var email = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
  		color: '#336699',
  		width: 250, height: 40,
  		top:20,
  		hintText: 'Paypal email address',
  		value: email
	});
	var confirmButton = Ti.UI.createButton({
		top:10,
		title:"Confirm",
		width:250,
		height:40,
		backgroundColor:'red',
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN
	});

	cover.addEventListener('click', function(e) {
		alert("Just kidding!");
	});
	confirmButton.addEventListener('click', function(e) {
		email.blur();
		Ti.App.Properties.setString('email',email.getValue());
		alert("Your info has been updated.");
	});
	
	self.add(cover);
	self.add(email);
	self.add(confirmButton);
	return self;
};

module.exports = SettingsWindow;
