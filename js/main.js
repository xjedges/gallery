window.onload=function(){
	var nav=getNav()
	var css3=	(nav=="Gecko") && {transform:"MozTransform",linearGradient:"-moz-linear-gradient"} ||
				(nav=="WebKit") && {transform:"-webkit-transform",linearGradient:"-webkit-linear-gradient"}
	
	var curIndex=0
	var playIndex=0
	var body=$("body")
	var wrap=$("div",{cls:"wrap"})
	var gallery=Gallery().css({height:300})
	var playBox=PlayBox()
	var lyricBox=LyricBox().css({height:560-300})
	body.append(
		wrap.append(
			gallery,
			playBox,
			lyricBox
		)
	)
	
	gallery.switchAlbum(Math.floor((albumInfoArr.length-1)/2))

	playBox.initEvent()
	lyricBox.initEvent()

	playBox.play()


	function Gallery(){
		var self=$("div",{cls:"gallery"})
		var layer3d=$("div",{cls:"layer3d"})
		var center=$("div",{cls:"center"})
		var coverFlow=CoverFlow()
		var album=Album()
		self.append(
			center.append(
				layer3d.append(
					coverFlow,
					album
				)
			)
		);

		var insideAlbum=false
		var lock=false
		var scrollFunc=function(e){
		    e=e || window.event; 
			if(e.wheelDelta && !lock){//webkit
				lock=true
				setTimeout(function(){lock=false},1)
		        gallery.switchAlbum(curIndex-e.wheelDelta/120)
		    }else if(e.detail){//gecko
		        gallery.switchAlbum(curIndex+e.detail)
		    } 
		}
		self.addEventListener("mouseover",function(){
			document.addEventListener('DOMMouseScroll',scrollFunc,false);//gecko
			window.onmousewheel=document.onmousewheel=scrollFunc;//webkit
		})
		self.addEventListener("mouseout",function(){
			document.removeEventListener('DOMMouseScroll',scrollFunc,false); 
			window.onmousewheel=document.onmousewheel=function(){};
		})

		self.switchAlbum=function(index){
			if(!insideAlbum && index>=0 && index<albumInfoArr.length){
				coverFlow.switch(index)
				album.show(albumInfoArr[index])
				album.unturn()
			}
		}
		self.insideAlbum=function(){
			insideAlbum=true
			album.turn(albumInfoArr[curIndex])
			coverFlow.turn()
		}
		self.outsideAlbum=function(){
			insideAlbum=false
			album.unturn()
			coverFlow.unturn()
		}
		self.updateZAlbum=function(z){
			var style={}
			style[css3.transform]="scale("+z+")";
			layer3d.css(style)
		}
		return self
	}
	function CoverFlow(){
		var self=$("ul",{cls:"coverFlow"})
		var extra=5
		var z=-200;
		for(i in albumInfoArr){
			var albumInfo=albumInfoArr[i]
			var cover=Cover(i,albumInfo.cover)
			self.append(cover)
		}
		self.turn=function(){
			self.children[curIndex].turn()
		}
		self.unturn=function(){
			self.children[curIndex].unturn()
		}
		self.switch=function(index){
			var index=parseInt(index)
			if(curIndex==index){return false}
			self.children[curIndex].untrigger()
			curIndex=index
			self.children[curIndex].trigger()
			self.each(function(i){
				var style={}
				if(i<curIndex-extra){
					if(!this.freeze){this.freeze=true;style[css3.transform]="translateX(-"+((extra+1)*50+50)+"px) translateZ(-150px) rotateY(45deg)"}
				}
				else if(i>curIndex+extra){
					if(!this.freeze){this.freeze=true;style[css3.transform]="translateX("+((extra+1)*50+50)+"px) translateZ(-150px) rotateY(-45deg)"}
				}
				else{
					this.freeze=false;
					if(i==curIndex)			{	style[css3.transform]="translateX(0) translateZ(0px) rotateY(0)";}
					else if(i==curIndex-1)	{	style[css3.transform]="translateX(-"+120+"px) translateZ(-100px) rotateY(70deg)"}
					else if(i==curIndex+1)	{	style[css3.transform]="translateX("+120+"px) translateZ(-100px) rotateY(-70deg)"}
					else if(i<curIndex)		{	style[css3.transform]="translateX(-"+((curIndex-i)*50+50)+"px) translateZ(-150px) rotateY(45deg)"}
					else if(i>curIndex)		{	style[css3.transform]="translateX("+((i-curIndex)*50+50)+"px) translateZ(-150px) rotateY(-45deg)"}
				}
				this.css(style)
			})
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
		reflectCover.css({backgroundImage:css3.linearGradient+"(top,rgba(30,30,30,1) 40%,rgba(30,30,30,0.4) 100%),url(images/"+coverLink+")"})
		self.append(reflectCover)
		return self
	}
	function Album(info){
		var self=$("div",{cls:"album"})
		var title=$("div",{cls:"title"})
		var singer=$("div",{cls:"singer"})
		var player=$("div",{cls:"player"})
		var songList=$("ol",{cls:"songList"})
		var listState=false
		var turnState=false
		self.append(
			title,
			singer,
			player.append(
				songList)
		)
		player.click(function(){
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
			player.addClass("turn")
		}
		self.unturn=function(){
			turnState=false
			player.removeClass("turn")
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
				playBox.play(title,musicSrc)
			}
		}
		return self
	}
	function Song(title){
		var self=$("li",{cls:"song",text:title})
		var musicSrc="audio/Summertrain.mp3"
		self.click(function(){
			self.parent(3).play(title,musicSrc)
		})
		return self
	}
	function PlayBox(){
		var self=$("div",{cls:"playBox"})
		var audioInfo=$("p",{cls:"audioInfo",text:"song title"})
		var media=new Audio()
		var curMedia=null
		var time="1:1:20"
		var frames=getTimeFrames(time)
		// MoveHandle
		var moveHandle1=$("div",{cls:"moveHandle1"})
		var moveHandle2=$("div",{cls:"moveHandle2"})
		// PlayBtn
		var playBtn=$("div",{cls:"playBtn"})
		// Time Process
		var timeDurtion=$("span",{cls:"timeDurtion",text:"0"})
		var timeEnd=$("span",{cls:"timeEnd",text:setTimeFormat(time)})
		var timeProcess=$("div",{cls:"process"})
		var timeProcessKey=$("div",{cls:"processKey"})
		var timeProcessInfo=$("div",{cls:"processInfo"})
		var timeBar=$("div",{cls:"timeBar"})
		// Volume Process
		var volume=$("div",{cls:"volumeBtn"})
		var volumeProcess=$("div",{cls:"process"})
		var volumeProcessKey=$("div",{cls:"processKey"})
		var volumeProcessInfo=$("div",{cls:"processInfo"})
		var volumeBar=$("div",{cls:"volumeBar"})
		self.append(
			playBtn,
			moveHandle1,
			moveHandle2,
			audioInfo,
			timeBar.append(
				timeProcess,
				timeProcessKey.append(
					timeProcessInfo),
				timeDurtion,
				timeEnd
			),
			volume.append(
				volumeBar.append(
					volumeProcess,
					volumeProcessKey.append(
						volumeProcessInfo)
				)
			)
		)
		volumeState=false
		volume.click(function(){
			if(volumeState){volumeBar.css({display:"none"}); volumeState=false}
			else{volumeBar.css({display:"block"}); volumeState=true}
		})
		self.initEvent=function(){
			new Drag(timeProcessKey,{
				activeX:true,
				limit:{obj:timeBar,magnet:10},
				start:function(){
					timeProcessInfo.css({display:"none"})
				},
				move:function(){
					timeProcess.css({width:this.posX+8})
					timeProcessInfo.html(this.ratio()+"%")
					timeProcessInfo.css({display:"block"})
					timeDurtion.html(setTimeFormat(Math.round(this.ratio()*frames/100)))
				},
				stop:function(){
					timeProcess.css({width:this.posX+8})
					timeProcessInfo.css({display:"none"})
					timeDurtion.html(setTimeFormat(Math.round(this.ratio()*frames/100)))
				}
			})
			new Drag(volumeProcessKey,{
				activeY:true,
				limit:{obj:volumeBar,magnet:10},
				start:function(){
					volumeProcessInfo.css({display:"none"})
				},
				move:function(){
					volumeProcess.css({height:100-(this.posY+8)})
					volumeProcessInfo.html(100-this.ratio())
					volumeProcessInfo.css({display:"block"})
				},
				stop:function(){
					volumeProcess.css({height:100-(this.posY+8)})
					volumeProcessInfo.css({display:"none"})
				}
			})
			volumeBar.css({display:"none"})
			new Drag(self,{
				activeY:true,handle:moveHandle1,
				limit:{obj:wrap,magnet:160},
				move:function(){
					gallery.css({height:this.posY+20})
					lyricBox.css({height:560-this.posY})
					var scale=this.posY/300
					if(scale<0.5){gallery.css({opacity:0})}
					else if(scale>1.5){lyricBox.css({opacity:0})}
					else{gallery.css({opacity:1});lyricBox.css({opacity:1});gallery.updateZAlbum(scale)}
				},
				stop:function(){
					gallery.css({height:this.posY+20})
					lyricBox.css({height:560-this.posY})
					var scale=this.posY/300
					if(scale<0.5){gallery.css({opacity:0})}
					else if(scale>1.5){lyricBox.css({opacity:0})}
					else{gallery.css({opacity:1});lyricBox.css({opacity:1});gallery.updateZAlbum(scale)}
				}
			})
			new Drag(self,{
				activeY:true,handle:moveHandle2,
				limit:{obj:wrap,magnet:160},
				move:function(){
					gallery.css({height:this.posY+20})
					lyricBox.css({height:560-this.posY})
					var scale=this.posY/300
					if(scale<0.5){gallery.css({opacity:0})}
					else if(scale>1.5){lyricBox.css({opacity:0})}
					else{gallery.css({opacity:1});lyricBox.css({opacity:1});gallery.updateZAlbum(scale)}
				},
				stop:function(){
					gallery.css({height:this.posY+20})
					lyricBox.css({height:560-this.posY})
					var scale=this.posY/300
					if(scale<0.5){gallery.css({opacity:0})}
					else if(scale>1.5){lyricBox.css({opacity:0})}
					else{gallery.css({opacity:1});lyricBox.css({opacity:1});gallery.updateZAlbum(scale)}
				}
			})
		}
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
	    self.pausePlay=function(){
	        audioInfo.html("pause "+curMedia.name);
	    }
	    self.loadError=function(){
	        audioInfo.html("load "+curMedia.name+" error");
	    }
		return self
	}
	function LyricBox(){
		var self=$("div",{cls:"lyricBox"})
		var lyric=$("ul",{cls:"lyric"})
		var lyricStream=lyricData.split("\n")
		for(var i in lyricStream){
			var line=$("li",{cls:"line",text:lyricStream[i]})
			lyric.append(line)
		}
		self.append(lyric)
		self.initEvent=function(){
			new Drag(lyric,{
				activeY:true,
				limit:{obj:self},
				start:function(){
				},
				move:function(){
				},
				stop:function(){
				}
			})
		}
		return self
	}

}