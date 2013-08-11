function SettingsWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',		
		barColor:'#333',
		layout:'vertical'
	});
	
	return self;
};

module.exports = SettingsWindow;
