function $(tag,attr){
    var self={};
    var frame=20
    var queue=[]
    var queueState=true
    var children=[]
    var parent=null
    var drag=null
    if(tag[0]!="#"){
        switch(tag){
            case "body" : self=document.body;break;
            case "head" : self=document.head;break;
            default     : self=document.createElement(tag);
        };
    }else{
        self=document.getElementById(tag.slice(1))
    }
    for(var i in attr||{}){
        var value=attr[i];
        switch(i){
            case "cls"  : self.className=value;break;
            case "text" : self.innerHTML=value;break;
            default     : self[i]=value;
        };
    };
    self.animation=function(param){
        queue.push(function(){
            queueState=false
            var time=param.time || 200
            if(param.attr){
                var attr={}
                for(var i in param.attr){
                    var startValue
                    switch(i){
                        case"width":case"height":case"top":case"left":case"bottom":case"right":
                            var attrName="offset"+i.replace(/(\w)/,function(s){return s.toUpperCase();})
                            startValue=self[attrName];
                            break;
                        case"opacity":
                            startValue=parseInt(self.ownerDocument.defaultView.getComputedStyle(self, null)['opacity'])
                            break;
                        default:
                            var startValue=parseInt(self.style[i].match(/[0-9]*/))
                    }
                    var endValue=param.attr[i]
                    var stepValue=(endValue-startValue)/frame/time*1000
                    attr[i]={start:startValue,end:endValue,step:stepValue,accumulate:startValue}
                }
                var animation=window.setInterval(function(){
                    var cssSetting={}
                    for(var i in attr){
                        attr[i].accumulate+=attr[i].step
                        cssSetting[i]=attr[i].accumulate
                    }
                    self.css(cssSetting)

                },1000/frame)
            }
            window.setTimeout(function(){
                animation && window.clearInterval(animation)
                queue.shift()
                param.callback && param.callback()
                queueState=true
                queueState && queue[0] && queue[0]() 
            },time)
        })
        queueState && queue[0]()
    };
    self.attr=function(attrName,attr){
        self.setAttribute(attrName,attr)
    };
    self.addClass=function(cls){
        if( !self.className.match( cls )) {
            self.className += ' ' + cls;
        }
    }
    self.removeClass=function(cls){
        self.className = self.className.replace( cls, '' );
    };
    self.append=function(){
        for(var i in arguments){
            self.appendChild(arguments[i]);
            children.push(arguments[i])
            arguments[i].setParent(self)
        };
    };
    self.getChildren=function(i){
        if(i!=null){return children[i]}
        else{return children}
    }
    self.getParent=function(){
        return parent
    }
    self.setParent=function(obj){
        parent=obj
    }
    self.remove=function(){
        var _parentElement = self.parentNode;
        if(_parentElement){
            _parentElement.removeChild(self);
        };
    };
    self.clear=function(){
        for(i in children){
            children[i].remove()
        }
    }
    self.html=function(str){
        self.innerHTML=str;
    };
    self.show=function(){
        self.css({display:"block"});
    };
    self.hide=function(){
        self.css({display:"none"});
    };
    self.css=function(attr){
        for(var stl in attr){
            value=attr[stl];
            switch(typeof value){
                case "string":
                    self.style[stl]=value;break;
                case "number":
                    if(stl!="zIndex"&&stl!="opacity"&&value!=0){self.style[stl]=value+"px";}
                    else{self.style[stl]=value}break;
                case "object":
                    var str="";
                    for(var i in value){
                        str+=value[i];
                        if(typeof value[i]=="number"&&value[i]!=0){
                            str+="px";
                        };
                        str+=" ";
                    };
                    self.style[stl]=str;break;
            };
        };
    };
    self.click=function(callback){
        self.addEventListener("click",callback)
    };
    self.drag=function(options){
        if(!drag){drag=new Drag(self,options);}
        return drag
    }
    return self;
};


// Dragger plugin 
var Class={create:function(){return function(){ this.initialize.apply(this,arguments); }}}
var Drag=Class.create();
Drag.prototype={
    defaultOptions:{
        start:function(){},
        move:function(){return true},
        stop:function(){return true},
        handle:null,
        limit:null,
        activeX:false,
        activeY:false,
        magnet:null,
    },
    initialize:function(drag,userOptions){
        this.options={}
        for(i in this.defaultOptions){
            this.options[i]=userOptions[i]!=null ? userOptions[i] :this.defaultOptions[i]
        }
        this.Drag=drag;
        this.offsetX=this.offsetY=0;
        this.posX=this.posY=0;
        this._fM=BindAsEventListener(this,this.Move);
        this._fS=Bind(this,this.Stop);
        this._handle=this.options.handle || this.Drag;
        this.limit=this.options.limit
        if(this.limit){
            var limitObj=this.limit.obj
            if(limitObj){
                this.limit.T=limitObj.offsetTop;
                this.limit.B=limitObj.offsetTop+limitObj.offsetHeight-this.Drag.offsetHeight ;
                this.limit.L=limitObj.offsetLeft;
                this.limit.R=limitObj.offsetLeft+limitObj.offsetWidth -this.Drag.offsetWidth ;
            }
        }
        addEventHandler(this._handle,"mousedown",BindAsEventListener(this,this.Start));
    },
    Start:function(oEvent){
        this.offsetX=oEvent.clientX-this.Drag.offsetLeft;
        this.offsetY=oEvent.clientY-this.Drag.offsetTop;
        addEventHandler(document,"mousemove",this._fM);
        addEventHandler(document,"mouseup",this._fS);
        addEventHandler(window,"blur",this._fS);
        oEvent.preventDefault();
        this.options.start(this)
    },
    Move:function(oEvent){
        window.getSelection?window.getSelection().removeAllRanges() :document.selection.empty();

        this.posX=oEvent.clientX-this.offsetX
        this.posY=oEvent.clientY-this.offsetY
        
        if(this.options.move(this)){
            if(this.limit){
                if(this.options.activeX && this.posX>=this.limit.L && this.posX<=this.limit.R){this.setX(this.posX)}
                if(this.options.activeY && this.posY>=this.limit.T && this.posY<=this.limit.B){this.setY(this.posY)}
            }
            else{
                if(this.options.activeX){this.setX(this.posX)}
                if(this.options.activeY){this.setY(this.posY)}
            }
        }
    },
    Stop:function(oEvent){
        removeEventHandler(document,"mousemove",this._fM);
        removeEventHandler(document,"mouseup",this._fS);
        
        this.posX=oEvent.clientX-this.offsetX
        this.posY=oEvent.clientY-this.offsetY

        if(this.options.stop(this)){
            if(this.limit && this.limit.magnet){
                if(this.options.activeX)
                    if(this.posX<=this.limit.L+this.limit.magnet){this.setX(this.limit.L)}
                    else if(this.posX>=this.limit.R-this.limit.magnet){this.setX(this.limit.R)}
                if(this.options.activeY){
                    if(this.posY<=this.limit.T+this.limit.magnet){this.setY(this.limit.T)}
                    else if(this.posY>=this.limit.B-this.limit.magnet){this.setY(this.limit.B)}
                }
            }
        }
    },
    setX:function(value){
        this.Drag.style.left=value+"px"
    },
    setY:function(value){
        this.Drag.style.top=value+"px"
    }
};
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
function Bind(object,fun){return function(){return fun.apply(object,arguments);}}
function BindAsEventListener(object,fun){
    var args=Array.prototype.slice.call(arguments).slice(2);
    return function(event){return fun.apply(object,[event || self.window.event].concat(args));}
}