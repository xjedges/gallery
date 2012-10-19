debug()
window.onload=function(){
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
	var nav=getNav()
	var css3={
		transform:"",
		linearGradient:"",
	}
	var transform
	if (nav=="Gecko"){
		css3={
			transform:"MozTransform",
			linearGradient:"-moz-linear-gradient",
		}
	}
	else if(nav=="WebKit"){
		css3={
			transform:"-webkit-transform",
			linearGradient:"-webkit-linear-gradient",
		}
	}

	var body=$("body")
	var gallery=Gallery()
	gallery.switchAlbum(Math.floor((albumInfoArr.length-1)/2))
	var playBox=PlayBox()
	body.append(gallery,playBox)
	//musicBox.play()
	function Gallery(){
		var self=$("div",{cls:"gallery"})

		var coverFlow=CoverFlow()
		var album=Album()

		curIndex=0
		self.append(coverFlow,album)
		
		self.switchAlbum=function(index){
			coverFlow.switch(index)
			album.show(albumInfoArr[index])
			album.unturn()
		}
		self.insideAlbum=function(){
			album.turn(albumInfoArr[curIndex])
			coverFlow.turn()
		}
		self.outsideAlbum=function(){
			album.unturn()
			coverFlow.unturn()
		}
		return self
	}
	function CoverFlow(){
		var self=$("ul",{cls:"coverFlow"})
		var extra=5
		for(i in albumInfoArr){
			var albumInfo=albumInfoArr[i]
			var cover=Cover(i,albumInfo.cover)
			self.append(cover)
		}
		self.turn=function(){
			self.getChildren(curIndex).turn()
		}
		self.unturn=function(){
			self.getChildren(curIndex).unturn()
		}
		self.switch=function(index){
			var index=parseInt(index)
			if(curIndex==index){return false}
			self.getChildren(curIndex).untrigger()
			curIndex=index
			self.getChildren(curIndex).trigger()
			for(i in self.getChildren()){
				var style={}
				var obj=self.getChildren(i)
				if(i<index-extra){
					if(!obj.freeze){obj.freeze=true;style[css3.transform]="translateX(-"+((extra+1)*50+50)+"px) translateZ(-200px) rotateY(45deg)"}
				}
				else if(i>index+extra){
					if(!obj.freeze){obj.freeze=true;style[css3.transform]="translateX("+((extra+1)*50+50)+"px) translateZ(-200px) rotateY(-45deg)"}
				}
				else{
					obj.freeze=false;
					if(i==index)		{	style[css3.transform]="translateX(0) translateZ(0) rotateY(0)"}
					else if(i==index-1)	{	style[css3.transform]="translateX(-"+120+"px) translateZ(-150px) rotateY(70deg)"}
					else if(i==index+1)	{	style[css3.transform]="translateX("+120+"px) translateZ(-150px) rotateY(-70deg)"}
					else if(i<index)	{	style[css3.transform]="translateX(-"+((index-i)*50+50)+"px) translateZ(-200px) rotateY(45deg)"}
					else if(i>index)	{	style[css3.transform]="translateX("+((i-index)*50+50)+"px) translateZ(-200px) rotateY(-45deg)"}
				}
				self.getChildren(i).css(style)
			}
		}
		return self
	}
	function Cover(index,coverLink){
		var self=$("li",{cls:"cover"})
		var reflectCover=$("div",{cls:"reflect"})
		var turnState=false
		self.freeze=false
		self.click(function(){
			gallery.switchAlbum(index)
		})
		self.turn=function(){
			turnState=true
			self.addClass("turn")
		}
		self.unturn=function(){
			turnState=false
			self.removeClass("turn")
		}
		self.trigger=function(){
		}
		self.untrigger=function(){
			if(turnState){self.unturn()}
		}
		self.css({backgroundImage:"url(images/"+coverLink+")"})
		reflectCover.css({backgroundImage:css3.linearGradient+"(top,rgba(0,0,0,1) 50%,rgba(0,0,0,0.4) 100%),url(images/"+coverLink+")"})
		self.append(reflectCover)
		return self
	}
	function Album(info){
		var self=$("div",{cls:"album"})
		var title=$("div",{cls:"title"})
		var singer=$("div",{cls:"singer"})
		var songList=$("ol",{cls:"songList"})
		var listState=false
		var turnState=false
		var miniPlayBox=MiniPlayBox()

		self.append(title,singer,songList,miniPlayBox)
		songList.click(function(){
			if(!turnState){
				gallery.insideAlbum()
			}else{
				gallery.outsideAlbum()
			}
		})
		self.show=function(info){
			title.html(info.title)
			singer.html(info.singer)
		}
		self.turn=function(info){
			turnState=true;
			if(!listState){
				self.update(info)
			}
			songList.addClass("turn")
		}
		self.unturn=function(){
			turnState=false
			songList.removeClass("turn")
			listState=false
		}
		self.update=function(info){
			listState=true
			songList.clear()
			for(i in info.song){
				var song=Song(info.song[i])
				songList.append(song)
			}
		}
		self.play=function(title,musicSrc){
			if(turnState){
				miniPlayBox.play(title,musicSrc)
			}
		}
		return self
	}
	function Song(title){
		var self=$("li",{cls:"song",text:title})
		var musicSrc="audio/Summertrain.mp3"
		self.click(function(){
			self.getParent().getParent().play(title,musicSrc)
		})
		return self
	}
	function MiniPlayBox(){
		var self=$("div",{cls:"miniPlayBox"})
		var playBtn=$("div",{cls:"playBtn"})
		var musicTitle=$("div",{cls:"musicTitle"})
		var playing=false
		self.append(musicTitle,playBtn)
		playBtn.click(function(){
			if(playing){self.pause()}
			else{self.pause()}
		})
		self.play=function(title,musicSrc){
			playing=true
			playBtn.addClass("playing")
			musicTitle.html(title)
		}
		self.pause=function(){
			playing=false
			playBtn.removeClass("playing")
		}
		return self
	}
	function PlayBox(){
		var self=$("div",{id:"playBox"})
		var audioInfo=$("span",{cls:"audioInfo"})
		var media=new Audio()

		var playBtn=$("div",{cls:"playBtn"})

		var process=$("div",{cls:"process"})
		var processBar=$("div",{cls:"processBar"})
		processBar.append(process)

		var timeProcess=$("span",{cls:"timeProcess",text:"00:00"})
		var timeEnd=$("span",{cls:"timeEnd",text:"00:00"})

		var mediaInfo=$("div",{cls:"mediaInfo"})
		mediaInfo.append(timeProcess,timeEnd,processBar)

		self.append(audioInfo,mediaInfo)
		var curMedia=null
		self.play=function(){
			curMedia={name:"Summertrain",src:"audio/Summertrain.mp3"}
			media.src=curMedia.src 
			media.play();
		}
		self.next=function(){
	        media.src=curMedia.src 
	        media.play()
	    }
	    self.loadStart=function(){
	        audioInfo.html("loading...");
	    }
	    self.playing=function(){
	        audioInfo.html("playing "+curMedia.name);
	    } 
	    self.pausePaly=function(){
	        audioInfo.html("pause "+curMedia.name);
	    }
	    self.loadError=function(){
	        audioInfo.html("load "+curMedia.name+" error");
	    }
		return self
	}

}