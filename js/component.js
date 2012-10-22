debug({o:0})

function getNav(){
	var sUA=navigator.userAgent;
    if ((navigator.appName == "Microsoft Internet Explorer")) {
        if (sUA.indexOf('Opera')!=-1) {return 'Opera';}
		return 'IE';
    }
    if(sUA.indexOf('Gecko')!=-1) {
        if(navigator.vendor=="Mozilla") {return "Gecko";}
        if (sUA.indexOf('Firefox')!=-1) {return 'Gecko';}
    }
    if(sUA.indexOf('Netscape')!=-1) {return 'Netscape';}
    if(sUA.indexOf('WebKit') != -1) {return 'WebKit';}
};

function setTimeFormat(time){
	var second=0,minute=0,hour=0
	if(typeof(time)=="number"){
		second=time%60
		minute=(time-second)/60%60
		hour=(time-second-minute*60)/3600
	}else if(typeof(time)=="string"){
		var timeArr=time.split(":")
		var len=timeArr.length
		timeArr[len-1] && (second=parseInt(timeArr[len-1]))
		timeArr[len-2] && (minute=parseInt(timeArr[len-2]))
		timeArr[len-3] && (hour=parseInt(timeArr[len-3]))
	}
	return	(hour			//hour
				?hour+":"
				:""
			)+
			(hour			//minute
				?(minute<10?"0"+minute:minute)+":"
				:minute?minute+":":""
			)+
			((hour||minute)	//second
				?(second<10?"0"+second:second)
				:second
			)
}
function getTimeFrames(time){
	if(typeof(time)!="string") return;
	var timeArr=time.split(":")
	var frames=0
	var len=timeArr.length
	for(var i=len;i>0;i--){
		var value=parseInt(timeArr[i-1])
		if(i>len-3){
			frames+=value*Math.pow(60,len-i)
		}
	}
	return frames
}