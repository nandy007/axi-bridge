var window = require("Window");
var document = require("Document");
var time = require("Time");
var console = require("Console");
var $ = require('JQLite');
var BaseComponent = $.BaseComponent;

document.refreshTimeout = 20;

$.vm.addEventFilter({
    'default': function(el, e, param){
        if(!e.detail) e.detail = param || {};
        return this.getComponent();
    }
}, 'before');

$.vm.addEventFilter({
    'default': function(rs, isCatch, el, e, param){
        if(isCatch) return false;
        var parent = el.getParent(), args = $.util.copyArray(arguments), params = args.slice(4);
        parent && parent.fire(e.type, params);
    }
}, 'after');

$.vm.setVMPre({
    data: '',
    method: ''
});

// 简单实现tap事件
function hackTapEvent(){
    var root = document.getRootElement();
    root.on('click', function(e){
        e.target.fire('tap');
    });
}

module.exports = {
    Component: function(MyClass){
        MyClass = BaseComponent.wrapperClass(MyClass);

        var cp = MyClass.prototype;

        cp.addPre = function(val, $el){
            var arr = ['private', this.jsDom.getTag(), val];
            var className = arr.join('-');
            $el && $el.addClass(className);
            return className;
        };

        cp.addClass = function($el, className, enums){
            for(var i=0, len=enums.length;i<len;i++){
                $el.removeClass(this.addPre(enums[i]));
            }
            $el.addClass(this.addPre(className));
        };

        cp.loaded = function(cb){
            if(!this.loadedArr) this.loadedArr = [];
            if(cb) {
                if(this.__isloaded){
                    cb();
                }else{
                    this.loadedArr.push(cb);
                }
            }else{
                for(var i=0, len=this.loadedArr.length;i<len;i++){
                    this.loadedArr[i]();
                }
            }
        };

        cp.__frameChanged = function(frame){
            // {x,y,width,height}
            if(!this.__isloaded){
                this.__isloaded = true;
                this.loaded && this.loaded();
            }
            this.frameChanged && this.frameChanged(frame);
        };

        function Wrapper(){
    
        }
    
        Wrapper.prototype = {
            created: function(){
                var myClass = this.myClass = new MyClass(this);
                this.funcWrapper();
                myClass.created && myClass.created();
            },
            funcWrapper: function(){
                var funcs = ['attrChanged', 'styleChanged', 'textChanged', 'orientationChanged', 'frameChanged'];
                var myClass = this.myClass, jsDom = this;
                for(var i=0, len=funcs.length;i<len;i++){
                    var funcName = funcs[i], func = myClass['__'+funcName] || myClass[funcName];
                    if(typeof func!=='function') continue;
                    (function(funcName, func){
                        jsDom[funcName] = function(){
                            func.apply(myClass, arguments);
                        }
                    })(funcName, func);
                }
            }
        };
    
        return Wrapper;
    },
    Page: function(MyClass){

        MyClass = BaseComponent.wrapperClass(MyClass);

        window.on('loaded', function(e) {
            var jsDom = document;
            var page = new MyClass(jsDom);
            page.created && page.created();
            window.on('animator', function(e) {
                jsDom.fire('enter');
            });
    
            window.on('destroy', function(){
                jsDom.fire('leave');
            });

            hackTapEvent();
        });

        return MyClass;
        
    }
};