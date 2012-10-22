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
var DRAG=Class({
    Create:function(drag){
        this.drag=drag;
        this.handle=this.handle || this.drag
        this.offsetX=this.offsetY=0;
        this.posX=this.posY=0;
        this._fM=BindAsEventListener(this,this.Move);
        this._fS=Bind(this,this.Stop);
        addEventHandler(this.handle,"mousedown",BindAsEventListener(this,this.Start));
    },
    start:function(){},
    move:function(){this.setX();this.setY();},
    stop:function(){},
    Start:function(oEvent){
        this.offsetX=oEvent.clientX-this.drag.offsetLeft;
        this.offsetY=oEvent.clientY-this.drag.offsetTop;
        addEventHandler(document,"mousemove",this._fM);
        addEventHandler(document,"mouseup",this._fS);
        addEventHandler(window,"blur",this._fS);
        oEvent.preventDefault();
        this.start()
    },
    Move:function(oEvent){
        window.getSelection?window.getSelection().removeAllRanges() :document.selection.empty();
        this.posX=oEvent.clientX-this.offsetX
        this.posY=oEvent.clientY-this.offsetY
        this.move()
    },
    Stop:function(oEvent){
        removeEventHandler(document,"mousemove",this._fM);
        removeEventHandler(document,"mouseup",this._fS);
        this.posX=oEvent.clientX-this.offsetX
        this.posY=oEvent.clientY-this.offsetY
        this.stop()
    },
    setX:function(value){
        this.drag.style.left=value!=null?value:this.posX+"px"
    },
    setY:function(value){
        this.drag.style.top=(value!=null?value:this.posY)+"px"
    },
});
var Drag=Class(DRAG,{
    defaultOptions:{
        start:null,
        move:null,
        stop:null,
        handle:null,
        limit:null,
        activeX:false,
        activeY:false,
        magnet:null,
    },
    Create:function(drag,userOptions){
        this.options={}
        for(i in this.defaultOptions){
            this.options[i]=userOptions[i]!=null ? userOptions[i] :this.defaultOptions[i]
        }
        this.handle=this.options.handle || this.drag;
        this.base(drag);
        this.limit=this.options.limit
        if(this.limit){
            var limitObj=this.limit.obj
            if(limitObj){
                this.limit.T=limitObj.scrollTop+(limitObj.offsetHeight>this.drag.offsetHeight)?0:limitObj.offsetHeight-this.drag.offsetHeight;
                this.limit.B=limitObj.scrollTop+(limitObj.offsetHeight<this.drag.offsetHeight)?0:limitObj.offsetHeight-this.drag.offsetHeight;
                this.limit.L=limitObj.scrollLeft+(limitObj.offsetWidth>this.drag.offsetWidth)?0:limitObj.offsetWidth-this.drag.offsetWidth;
                this.limit.R=limitObj.scrollLeft+(limitObj.offsetWidth<this.drag.offsetWidth)?0:limitObj.offsetWidth-this.drag.offsetWidth;
            }
        }
    },
    start:function(){
        this.options.start && this.options.start.apply(this,arguments);
    },
    move:function(){
        if(this.limit){
            if(this.options.activeX){
                this.posX=Math.min(Math.max(this.posX, this.limit.L), this.limit.R);
                this.setX()
            }
            if(this.options.activeY){
                this.posY=Math.min(Math.max(this.posY, this.limit.T), this.limit.B);
                this.setY()
            }
        }else{
            if(this.options.activeX){this.setX()}
            if(this.options.activeY){this.setY()}
        }

        this.options.move && this.options.move.apply(this,arguments);
    },
    stop:function(){
        if(this.limit && this.limit.magnet){
            if(this.options.activeX){
                if(this.posX<=this.limit.L+this.limit.magnet){this.posX=this.limit.L}
                else if(this.posX>=this.limit.R-this.limit.magnet){this.posX=this.limit.R}
                this.setX()
            }
            if(this.options.activeY){
                if(this.posY<=this.limit.T+this.limit.magnet){this.posY=this.limit.T}
                else if(this.posY>=this.limit.B-this.limit.magnet){this.posY=this.limit.B}
                this.setY()
            }
        }
        this.options.stop && this.options.stop.apply(this,arguments);
    },
    ratio:function(){
        if(this.limit){
            if(this.options.activeX){
                return Math.round(this.posX/(this.limit.R-this.limit.L)*100)
            }
             if(this.options.activeY){
                return Math.round(this.posY/(this.limit.B-this.limit.T)*100)
            }
        }
        
    }
})
