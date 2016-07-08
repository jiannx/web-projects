var So = function(){

}

So.prototype = {
	start : function(){
		var data = {
			url : 'http://www.kaola.com/product/4772.html?ri=8775&rt=product&zid=zid_2449476692&zp=product1&zn=%E7%89%99%E5%88%B7%E5%95%86%E5%93%81'
		};
		$.post('/start', data, function(res){
			console.log(res);
		});
	},
	loading : function(){

	},
	close : function(){

	}
}
var socket = new So();
socket.start();