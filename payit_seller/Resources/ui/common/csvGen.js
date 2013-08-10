function csvGen(arrayOfItems) {
	var res = ''; 
	for (var i=0; i<arrayOfItems.length; i++) {
		if (i==0) {
			res = arrayOfItems[i];
		} else {
			res = res+','+arrayOfItems[i];
		}
	}
	return res;
}

module.exports = csvGen;