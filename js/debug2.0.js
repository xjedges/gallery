/*
 * 2012-2-17
 * {W:宽度, H:高度, P:面板位置, O:信息流方向, C:颜色}
 * D(信息) F(函数追踪) T(时间) J(对象数组) A(数组) Z(DOM对象); N(浏览器);
 * V(变量追踪) Q(变量名)
 */
 var self={}
 A=self.A
 AA=self.AA
 D=self.D
 DD=self.DD
 T=self.T
 J=self.J
 Z=self.Z
 S=self.S
function debug(){
	self=this;
	//参数定义
	var param={};
	var fun;
	for(var i=0;i< arguments.length;i++){
		if(typeof arguments[i]=="object"){param=arguments[i];}
		else if(typeof arguments[i]=="function"){fun=arguments[i];}
	};
	var orient=(param.O!=null)?param.O:0;
	var color=(param.C!=null)?param.C:"dark";
	//公用变量
	var nav=getNav();
	var startTime;
	var num=0;
	
	var msgHtml=" ";
	var debugDiv;
	var debugState=0;
	
	//静态变量
	var theme={};
	if(color=="dark"){
		theme={
			str:'#E6DB74',obj:'#FD971F',fun:'#66D9EF',num:'#AE81FF',boo:'#F92672',arr:"#FD971F",
			bg:'#272822',time:'#A6E22E',index:'#F92672',txt:'#F8F8F2',warm:"#F00",
			cls:"#A6E22E",id:'#66D9EF',tag:'#F92672'};
	}
	else if(color=="light"){
		theme={
			str:'#690',obj:'#008B8B',fun:'#C96',num:'#A061F0',boo:'#F92672',arr:"#FD971F",
			time:'#A6E22E',index:'#F92672',txt:'#333',warm:"#F00",
			cls:"#690",id:'#008B8B',tag:'#F92672'};
	}
	else{theme={bg:'#FFF',txt:'#333'}}
	
	
	window.onload=function(){
		startTime=new Date();
		if(typeof fun=="function"){getError(fun);}
	};
	this.AA=function(table){
		var html="<span class='arr'>"+table.name+":</span>"
		html+="<table class='table'><tr><th>#</th>"
		for(var i in table.header){
			html+="<th>"+table.header[i]+"</th>"
		}
		html+="</tr>"
		for(var i in table.data){
			html+="<tr><td>"+msgStyle(parseInt(i))+"</td>"
			for(var j in table.data[i]){
				html+="<td><a title='"+table.data[i][j]+"'>"+msgStyle(table.data[i][j])+"</a></td>"
			}
			html+="</tr>"
		}
		html+="</table>"
		msgInset(html);
	}
	this.A=function(arr){
		var html=getNum()+style("arr","[array]");
		if(isArray(arr)){
			html+="<table class='arr'>";
			var maxlen=0;
			for(var i in arr){
				var len=0;
				if(isArray(arr[i])){
					len=arr[i].length;
				}
				else{len=1}
				if(len>maxlen)maxlen=arr[i].length;
			}
			for(var i in arr){
				if(isArray(arr[i])){
					html+=(i!=0)?"<tr><td>&nbsp;[</td>":"<tr><td>[[</td>";
					for(var j in arr[i]){
						if(j!=arr[i].length-1){
							html+="<td>"+msgStyle(arr[i][j])+","+"</td>";
						}
						else{
							html+="<td colspan="+(maxlen-arr[i].length+1)+">"+msgStyle(arr[i][j])+"</td>";
						}
					}
					html+=(i!=arr.length-1)?"<td>],</td></tr>":"<td>]]</td></tr>";
				}
				else{
					html+=(i!=0)?"<tr><td>&nbsp;</td>":"<tr><td>[&nbsp;</td>";
					html+="<td colspan="+maxlen+">"+msgStyle(arr[i])+"</td>";
					html+=(i!=arr.length-1)?"<td>&nbsp;,</td></tr>":"<td>&nbsp;]</td></tr>";
				}
			}
			html+="</table>";
		}
		else{html+=style("warm","! A ( array )"+"<br/>");
		}
		msgInset(html);
	};
	this.D=function(){
		var html=getNum()+getMsg(arguments)+/*getFun(D.caller)+*/"<br/>";
		msgInset(html);
	};
	this.DD=function(d){
		var html=getNum()+getMsg(arguments)+/*getFun(DD.caller)+*/"<br/>";
		msgInset(html);
		showMsg();
	};
	this.T=function(){
		var endTime=new Date();
		var start=startTime.getMilliseconds()+startTime.getSeconds()*1000;
		var end=endTime.getMilliseconds()+endTime.getSeconds()*1000;
		var space=end-start;
		var html=style("time","======== "+space+" ms"+" ========")+"<br/>";
		msgInset(html);
		startTime=endTime;
		showMsg();
	};
	/*
	this.J=function(obj,more){
	       var html=getNum();
	       if(obj.constructor==Object){
	           html+="<span>"+style("obj","{obj}")+"<br/>";
	           objTree(obj,[]);
	           html+="</span>";
	       }
	       else if(obj.constructor==Array){
	           html+="<span>"+style("arr","[array]")+"<br/>";
	           objTree(obj,[]);
	           html+="</span>";
	       }
	       else{html+=style("warm","! J ( object / array )");
	       }
	       msgInset(html);
	       function objTree(all,indexArr){
	           //计算长度
	           var len=0;
	           if(all.constructor==Object){for (var i in all){len++;}}//子对象长度
	           else if(all.constructor==Array){len=all.length;}//子数组长度
	           if(len==0)return false;
	           //循环 count++
	           var count=0;
	           //循环
	           for(var i in all){
	               var blank="";
	               for(var j=indexArr.length-1;j>=0;j--){
	                   if(indexArr[j]==false){blank="| "+blank;}
	                   else{blank="  "+blank;}
	               }
	               if(count!=(len-1)){
	                   var branch="|-";
	                   indexArr.push(false);
	               }
	               else{
	                   var branch="`-";
	                   indexArr.push(true);
	               }
	               
	               if(all[i].constructor==Array&&array2d(all[i])){
	                   var str=blank+branch+style("cls",i+": ")+style(theme.arr,"[array]");
	               }
	               else{
	                   var str=blank+branch+style("cls",i+": ")+msgStyle(all[i]);
	               }
	               html+=str+"<br/>";
	               
	               //数组不显示分支
	               if(more){
	                   objTree(all[i],indexArr);
	               }
	               else{
	                   if(all[i].constructor!=Array){objTree(all[i],indexArr);}
	                   else{
	                       if(array2d(all[i])){
	                           objTree(all[i],indexArr);
	                       }
	                   }
	               }
	               
	               indexArr.pop();
	               count++;
	           }
	       }
	   };*/
	this.J=function(obj,more){
		var html=getNum();
		html+="<span>"+style("obj","{obj}")+"<br/>";
		objTree(obj,[]);
		html+="</span>";
		msgInset(html);
		function objTree(all,indexArr){
			//计算长度
			var len=0;
			if(typeof all=="object"){for (var i in all){len++;}}//子对象长度
			if(len==0)return false;
			//循环 count++
			var count=0;
			//循环
			for(var i in all){
				var blank="";
				for(var j=indexArr.length-1;j>=0;j--){
					if(indexArr[j]==false){blank="|."+blank;}
					else{blank=".."+blank;}
				}
				//D(blank)
				if(count!=(len-1)){
					var branch="|-";
					indexArr.push(false);
				}
				else{
					var branch="`-";
					indexArr.push(true);
				}
				
				
				var str=blank+branch+style("cls",i+": ")+msgStyle(all[i]);
				
				html+=str+"<br/>";
				
				//数组不显示分支
				objTree(all[i],indexArr);
				
				
				indexArr.pop();
				count++;
			}
		}
	};
	this.Z=function(obj){
		var html=getNum()+"<span>"+style("tag","&lt;"+obj.nodeName.toLowerCase()+"&gt;")+"<br/>";
		domTree(obj,[]);
		html+="</span>";
		msgInset(html);
		function domTree(all,indexArr){
			var len=all.children.length;
			for(var i=0;i<len;i++){
				
				var blank="";
				for(var j=indexArr.length-1;j>=0;j--){
					if(indexArr[j]==false){blank="┃　"+blank;}
					else{blank="　　"+blank;}
				}
				if(i!=(len-1)){
					var branch="┣━";
					indexArr.push(false);
				}
				else{
					var branch="┗━";
					indexArr.push(true);
				}
				
				var selfNode=all.children[i];
				
				var id=(selfNode.getAttribute("id")!=null)?     style("id"," #"+selfNode.getAttribute("id")+"")    :"";
				var cls=(selfNode.getAttribute("class")!=null)? style("cls"," ."+selfNode.getAttribute("class")+""):"";
				
				var label=style("tag","&lt;"+selfNode.nodeName.toLowerCase()+"&gt;");
				var str=blank+branch+label+id+cls;
				
				html+=str+"<br/>";
				
				if(selfNode.children.length>0)domTree(selfNode,indexArr);
				indexArr.pop();
			}
		}
	};
	this.N=function(){
		var oCC=new TClientCheck();
		var html="Browse>>"+style("index",oCC.getBrowse())+"<br/>"+
				 "Kernel>>"+style("index",oCC.browseKernel)+"<br/>"+
				 "OS>>"+style("index",oCC.getOS())+"<br/>"+
				 "Agent>>"+style("index",oCC.userAgent)+"<br/>";
		msgInset(html)
	};
	this.F=function(){
		var html=getNum()+getMsg(arguments);
		var funHtml="";
		var funArr=[];
		fun(F.caller);
		function fun(fn){
			var fnName=fn+"";
			fnName=fnName.replace(/function\s*([a-zA-Z0-9_]*)\s*[\S\W]*/,"$1");
			funArr.push(fnName);
			
			if(fnName!="getError"){fun(fn.caller)}
		}
		for(var i=0;i<funArr.length-2;i++){
			var str=(funArr[i]=="")?style("fun","null ( )"):style("fun",funArr[i]+" ( )");
			funHtml+="<<"+str;
		}
		funHtml+="<br/>";
		msgInset(html+funHtml);
	};
	this.S=function(){
		showMsg();
	}
	function msgInset(msg){
		if(orient){msgHtml=msg+msgHtml;}
		else{msgHtml+=msg;}
	};
	function showMsg(){
		initPanel(function(){debugDiv.innerHTML=msgHtml;})
	};
	function initPanel(fun){
		if(debugState==0&&msgHtml!=""){
			debugState=1;
			initdebugPannel();
		}
		else if(debugState==1){}
		else{fun();}
		function initdebugPannel(){
			var W=(param.W?param.W:300),H=(param.H?param.H:150);
			var body=document.getElementsByTagName("body")[0];
			var iframe=document.createElement("iframe");
			var handle=document.createElement("div");
			var container=document.createElement("div");
			
			setStyle(iframe,{width:"100%",height:"100%",border:0});
			setStyle(handle,{width:"100%",height:5,position:"absolute",top:6,cursor:"move"});
			setStyle(container,{width:W,height:H,position:"fixed","z-index":10000});
			switch(param.P){
				case 1:container.style.top=0;container.style.left=0;break;
				case 2:container.style.top=0;container.style.right=0;break;
				case 3:default:container.style.bottom=0;container.style.right=0;break;
				case 4:container.style.bottom=0;container.style.left=0;break;
			};
			container.appendChild(iframe);
			container.appendChild(handle);
			body.appendChild(container);
			
			if(navigator.userAgent.indexOf("Firefox")>0){iframe.onload=function(){init();}}else{init();}
			function init(){
				var dom='\
				<table id="box">\
					<tr><td id="TL"></td><td id="TC"></td><td id="TR"></td></tr>\
					<tr><td id="CL"></td>\
						<td id="CC"><div id="debugDiv"></div></td>\
					</td><td id="CR"></td></tr>\
					<tr><td id="BL"></td><td id="BC"></td><td id="BR"></td></tr>\
				</table>\
				';
				var styleStr='\
				body{padding:0; margin:0;}\
				#box{border-collapse:collapse; position:absolute; width:100%; height:100%;background:'+theme.bg+';\
				-webkit-border-radius:5px ;-moz-border-radius:5px ;-webkit-box-shadow: 2px 2px 0px 2px rgba(0, 0, 0, 0.5);-moz-box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.5);}\
				#box td{padding:0;}\
				/*边框*/\
				#TL,#TR,#BL,#BR{width:8px; height:8px;}\
				#CC{vertical-align:top;}\
				#CC{width:'+(W-16)+'px; height:'+(H-16)+'px}\
				/*鼠标*/\
				#BL,#TR{cursor:ne-resize;}\
				#BR,#TL{cursor:nw-resize;}\
				#CR,#CL{cursor:e-resize;}\
				#TC,#BC{cursor:n-resize;}\
				/*debugDiv*/\
				#debugDiv{width:100%; height:100%; overflow:auto;}\
				table{font-weight:900; font-family:Courier New; font-size:16px; line-height:12px; color:'+theme.txt+';}\
				#debugDiv{border-collapse:collapse;}\
				.table,.str,.obj,.fun,.num,.boo,.arr,.time,.index,.txt,.warm,.cls,.id,.tag{font-family:sans-serif; font-size:12px;white-space:nowrap; }\
				.table{color:'+theme.cls+'; border:1px solid #444;}\
				.table th{text-align:left;}\
				.table td{max-width:200px; overflow:hidden}\
				.str{color:'+theme.str+';}\
				.obj{color:'+theme.obj+';}\
				.fun{color:'+theme.fun+';}\
				.num{color:'+theme.num+';}\
				.boo{color:'+theme.boo+';}\
				.arr{color:'+theme.arr+';}\
				.time{color:'+theme.time+';}\
				.index{color:'+theme.index+';}\
				.txt{color:'+theme.txt+';}\
				.warm{color:'+theme.warm+';}\
				.cls{color:'+theme.cls+';}\
				.id{color:'+theme.id+';}\
				.tag{color:'+theme.tag+';}\
				';
				var box=new Box(container,iframe,handle);
				box.addStyle(styleStr);
				box.html(dom);
				box.script(dom);
				debugDiv=box.div;
				debugState=3;
				fun()
			}
			
		};
	};
	function setStyle(obj,param){
		var styleStr="";
		for(var i in param){
			switch(i){
				case "width":case "height":
				case "font-size":
				case "margin-left":case "margin-top":case "margin-right":case "margin-bottom":
				case "top":case "bottom":case "left":case "right":
					if(param[i].toString().indexOf("%")<0){
						styleStr+=i+":"+param[i]+"px;";break;
					}
					else{styleStr+=i+":"+param[i]+";";break;}
				default:
					styleStr+=i+":"+param[i]+";";break;
			}
		}
		obj.setAttribute("style",styleStr);
	}
	function getMsg(args){
		var msg="";
		for(var i in args){
			if(i<args.length-1){msg+=msgStyle(args[i])+" ` ";}
			else{msg+=msgStyle(args[i]);}
		}
		return msg;
	};
	function isArray(value){
		if(value instanceof Array||value.constructor.toString().match(/function\sArray\(/))
			return true;
	}
	function msgStyle(msg){
		if(msg==null){return style("boo",msg);}
		else if(isArray(msg)){
			var str="";
			for(var i in msg){
				var comma=(i!=msg.length-1)?", ":"";
				str+=msgStyle(msg[i])+comma;
			}
			return style("arr",'['+str+']');
		}
		switch(typeof msg){
			case "string":return style("str",'"'+htmlReplace(msg)+'"');break;
			case "object":return style("obj",'{obj}');break;
			case "number":return style("num",msg);break;
			case "function":return style("fun",'(fun)');break;
			default:return style("boo",msg);
		}
	};
	function htmlReplace(str){
		str=str.replace(/</g,"&lt;")
		return str.replace(/>/g,"&gt;")
	}
	function array2d(arr){
		var aa=true;
		for(var i in arr){
			if(!isArray(arr[i])){aa=false;break;}	
		}
		return aa;
	};
	function style(str,text){
		if(color!=""){return "<span class='"+str+"'>"+text+"</span>";}
		else{return text}
	};
	function getFun(fn){
		fn=fn.toString();
		fn=fn.replace(/function\s*([a-zA-Z0-9_]*)\s*[\S\W]*/,"$1");
		fn=(fn=="")?fn:"------"+style("fun",fn+' ( )');
		return fn;
	};
	function getNum(){
		num++;
		var num_str=style("index",num);
		var numCount_str="";
		if(num<100){numCount_str=(num<10)?(num_str+"===>"):(num_str+"==>");}else{numCount_str=num_str+"=>";}
		return(numCount_str);
	};
	function getError(fn){
		if(nav=="Gecko"){
			try{fn();}
			catch(exception){
				var html="Error>>"+style("warm",exception.line)+"."+
						 style("warm",exception.message)+"<br/>"+
						 style("warm",exception.sourceURL)+"<br/>";
				msgInset(html);
		    }
		}
		else if(nav=="Firefox"){
		    try{fn();}
			catch(exception){
				var html="Error>>"+style("warm",exception.lineNumber)+"."+
						 style("warm",exception.message)+"<br/>"+
						 style("warm",exception.fileName)+"<br/>";
				msgInset(html);
		    }
		}
		else{
			window.onerror=function(msg,url,line){
				var html=style("warm",line)+"==>"+
						 style("warm",msg)+"<br/>"+
						 style("warm",url)+"<br/>";
				msgInset(html);
			};
			fn();
		}
		showMsg();
	};
	function getNav(){
		var sUA=navigator.userAgent;
	    if ((navigator.appName == "Microsoft Internet Explorer")) {
	        if (sUA.indexOf('Opera')!=-1) {return 'Opera';}
			return 'IE';
	    }
	    if(sUA.indexOf('Gecko')!=-1) {
	        if(navigator.vendor=="Mozilla") {return "Mozilla";}
	        if (sUA.indexOf('Firefox')!=-1) {return 'Firefox';}
	        return "Gecko";
	    }
	    if(sUA.indexOf('Netscape')!=-1) {return 'Netscape';}
	    if(sUA.indexOf('Safari') != -1) {return 'Safari';}
	};
 	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	function Box(container,iframe,handle){
		var self=this;
		this.window=iframe.contentWindow;
		this.document=iframe.contentDocument;
		this.body=this.document.getElementsByTagName("body")[0];
		if(navigator.userAgent.indexOf("Safari")>0){//safari <iframe>加载后没有自动生成<head>
			this.head=this.document.createElement("head");
			this.document.documentElement.appendChild(this.head);
		}else{
			this.head=this.document.getElementsByTagName("head")[0];
		}
		this.style=this.document.createElement("style");
		this.style.type="text/css";
		this.head.appendChild(this.style);
		this.html=function(str){
			this.body.innerHTML=str;
			this.center=$("CC");
			this.div=$("debugDiv")
		}
		this.addStyle=function(str){
			var str=this.document.createTextNode(str);//safari <style>只可读，不能直接innerHTML
			this.style.appendChild(str);
		}
		this.script=function(){
			var rs=new SimpleResize(container);
			rs.center=this.center;
			rs.Set($("BR"),"right-down");
			rs.Set($("BL"),"left-down");
			rs.Set($("TR"),"right-up");
			rs.Set($("TL"),"left-up");
			rs.Set($("CR"),"right");
			rs.Set($("CL"),"left");
			rs.Set($("TC"),"up");
			rs.Set($("BC"),"down");
			new Drag(container,{Handle:handle})
		}
		function $(id){return self.document.getElementById(id)};
		function addEventHandler(oTarget,sEventType,fnHandler){
			if (oTarget.addEventListener){
				oTarget.addEventListener(sEventType,fnHandler,false);
			} else if (oTarget.attachEvent){
				oTarget.attachEvent("on"+sEventType,fnHandler);
			} else{
				oTarget["on"+sEventType]=fnHandler;
			}
		};
		function removeEventHandler(oTarget,sEventType,fnHandler){
		    if (oTarget.removeEventListener){
		        oTarget.removeEventListener(sEventType,fnHandler,false);
		    } else if (oTarget.detachEvent){
		        oTarget.detachEvent("on"+sEventType,fnHandler);
		    } else{ 
		        oTarget["on"+sEventType]=null;
		    }
		};
		var Class={create:function(){return function(){ this.initialize.apply(this,arguments); }}}
		var SimpleResize=Class.create();
		var Drag=Class.create();
		SimpleResize.prototype={
			initialize:function(obj,options){
				this._obj=obj;
				this._fR=BindAsEventListener(this,this.Resize);
				this._fS=Bind(this,this.Stop);
			},
			Set:function(obj,side){
				var fun;
				if (!obj) return;
				switch (side.toLowerCase()){
				case "up":fun=this.Up;break;
				case "down":fun=this.Down;break;
				case "left":fun=this.Left;break;
				case "right":fun=this.Right;break;
				case "left-up":fun=this.LeftUp;break;
				case "right-up":fun=this.RightUp;break;
				case "left-down":fun=this.LeftDown;break;
				case "right-down":default:fun=this.RightDown;};
				addEventHandler(obj,"mousedown",BindAsEventListener(this,this.Start,fun));
			},
			Start:function(e,fun){
				this._fun=fun;
				this._styleWidth=this._obj.clientWidth;
				this._styleHeight=this._obj.clientHeight;
				this._styleLeft=this._obj.offsetLeft;
				this._styleTop=this._obj.offsetTop;
				this._sideLeft=e.clientX-this._styleWidth;
				this._sideRight=e.clientX+this._styleWidth;
				this._sideUp=e.clientY-this._styleHeight;
				this._sideDown=e.clientY+this._styleHeight;
				this._fixLeft=this._styleWidth+this._styleLeft;
				this._fixTop=this._styleHeight+this._styleTop;
		
				addEventHandler(self.document,"mousemove",this._fR);
				addEventHandler(self.document,"mouseup",this._fS);
			},
			Resize:function(e){
				this._fun(e);
				this.center.style.width=this._styleWidth-16+"px";
				this.center.style.height=this._styleHeight-16+"px";
				this._obj.style.width=this._styleWidth+"px";
				this._obj.style.height=this._styleHeight+"px";
				this._obj.style.top=this._styleTop+"px";
				this._obj.style.left=this._styleLeft+"px";
			},
			Up:function(e){this._styleHeight=Math.max(this._sideDown-e.clientY,0);this._styleTop=this._fixTop-this._styleHeight;},
			Down:function(e){this._styleHeight=Math.max(e.clientY-this._sideUp,0);},
			Right:function(e){this._styleWidth=Math.max(e.clientX-this._sideLeft,0);},
			Left:function(e){this._styleWidth=Math.max(this._sideRight-e.clientX,0);this._styleLeft=this._fixLeft-this._styleWidth;},
			RightDown:function(e){this.Right(e);this.Down(e);},
			RightUp:function(e){this.Right(e);this.Up(e);},
			LeftDown:function(e){this.Left(e);this.Down(e);},
			LeftUp:function(e){this.Left(e);this.Up(e);},
			Stop:function(){
				removeEventHandler(self.document,"mousemove",this._fR);
				removeEventHandler(self.document,"mouseup",this._fS);
			}
		};
		Drag.prototype={
			initialize:function(drag,options){
				this.Drag=drag;
				this._x=this._y=0; 
				this._fM=BindAsEventListener(this,this.Move);
				this._fS=Bind(this,this.Stop);
				this._Handle=options.Handle || this.Drag;
				addEventHandler(this._Handle,"mousedown",BindAsEventListener(this,this.Start));
			},
			Start:function(oEvent){
				this._x=oEvent.clientX-this.Drag.offsetLeft;
				this._y=oEvent.clientY-this.Drag.offsetTop;
				addEventHandler(document,"mousemove",this._fM);
				addEventHandler(document,"mouseup",this._fS);
				addEventHandler(window,"blur",this._fS);
				oEvent.preventDefault();
			},
			Move:function(oEvent){
				window.getSelection?window.getSelection().removeAllRanges() :document.selection.empty();
				this.Drag.style.left=oEvent.clientX-this._x+ "px";
				this.Drag.style.top=oEvent.clientY-this._y+ "px";
			},
			Stop:function(){
				removeEventHandler(document,"mousemove",this._fM);
				removeEventHandler(document,"mouseup",this._fS);
			}
		};
		function Bind(object,fun){return function(){return fun.apply(object,arguments);}}
		function BindAsEventListener(object,fun){
			var args=Array.prototype.slice.call(arguments).slice(2);
			return function(event){return fun.apply(object,[event || self.window.event].concat(args));}
		}
	}
};