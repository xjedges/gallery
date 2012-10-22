self.onmessage=function(event){
	var a
	if(event.data==="1"){
		a="result is 1"
	}
	if(event.data==="2"){
		a="result is 2"
	}
	self.postMessage(a)
}