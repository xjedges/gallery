function Browser(){
	var self={}
	var browser=null,version=""
	var regArr={
		ie:new RegExp("ie|InternetExplorer","i"),
		Gecko:new RegExp("ff|Firefox","i"),
		sa:new RegExp("sa|Safria","i"),
		op:new RegExp("op|Opera","i"),
		Webkit:new RegExp("gc|Chrome","i")
	}
	var sUA=navigator.userAgent;
    if ((navigator.appName == "Microsoft Internet Explorer")) {
        if (sUA.indexOf('Opera')!=-1)browser='Opera';
        browser='IE';
    }else if(sUA.indexOf('Chrome')!=-1){
    	browser="Webkit";
    }else if(sUA.indexOf('Gecko')!=-1) {
        if(navigator.vendor=="Mozilla")browser="Mozilla";
        if (sUA.indexOf('Firefox')!=-1)browser='Firefox';
        browser="Gecko";
    }else if(sUA.indexOf('Netscape')!=-1) {browser='Netscape';
	}else if(sUA.indexOf('Safari') != -1) {browser='Safari';
	}
	getBrowser=function(){
		return browser
	}
	isBrowser=function(exp){
		if(typeof exp!="string")return false;
		var arr=exp.split("|")
		for(var i in arr){
			var browserInfo=arr[i]
			var browserName="",ver="";
			browserInfo.replace(/([a-zA-Z]*)([\d]*)/,function(){
				ver=arguments[2]
				browserName=arguments[1]
			})
			if(browserName.match(regArr[browser]) && (ver==""||ver==version))return true;
		}
		return false;
	}

	return self
}