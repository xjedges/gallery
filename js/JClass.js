function Class(){
	var aDefine = arguments[arguments.length-1];
	if(!aDefine) return;
	var aBase = arguments.length>1 ? arguments[0] : object;
	
	function prototype_(){};
	prototype_.prototype = aBase.prototype;
	var aPrototype = new prototype_();
	
	for(var member in aDefine)
		if(member!="Create") 
			aPrototype[member] = aDefine[member];

	if(aDefine.Create)
		var aType = aDefine.Create
	else 
		aType = function()
		{
			this.base.apply(this, arguments);
		};

	aType.prototype = aPrototype;
	aType.Base = aBase;
	aType.prototype.Type = aType;
	return aType;
};

function object(){}
object.prototype.isA = function(aType)
{
	var self = this.Type;
	while(self)
	{
		if(self == aType) return true;
		self = self.Base;
	};
	return false;
};
object.prototype.base = function()
{
	var Caller = object.prototype.base.caller;
	Caller && Caller.Base && Caller.Base.apply(this, arguments);
};
