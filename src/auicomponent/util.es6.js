const window = require("Window");
const document = require("Document");
const $ = require('JQLite');


var util = module.exports = {
    _lifecycleHandler: function(myClass, jsDom){
        myClass.jsDom = jsDom;
        myClass.created && myClass.created();
        if(myClass.viewData && myClass.jsDom){
            $(myClass.jsDom).render(myClass.viewData);
            jsDom.refresh();
        }
    },
    classWrapper: function classWrapper(MyClass){

        class ViewBase extends MyClass{

            constructor(...args){
                super(...args);
                this.$ = $;
            }

            created(){
                this.initProto();
                super.created && super.created();
            }

            initProto(){
                super.initProto && super.initProto();
                if(!this.protos) return;
                var __props = [];
                this.__props = __props;
                for(var k in this.protos){
                    __props.push(k);
                    var proto = this.protos[k];
                    proto.handler && proto.handler(this.getAttrValue(k));
                }
                for(var k in this.events){
                    var event = this.events[k];
                    event.handler && event.handler();
                }
            }

            getAttrValue(name){
                const proto = this.protos[name], defaultValue = proto.defaultValue, type = (proto.type||'string').toLowerCase();
                let attrValue = this.jsDom.getAttr(name);
                if(attrValue===null||attrValue===''){
                    attrValue = defaultValue;
                }
                let rs = attrValue;
                if(type==='boolean'){
                    rs = attrValue==='true'||attrValue===true?true:false;
                }else if(type==='number'){
                    try{
                        const cur = Number(attrValue);
                        rs = typeof cur==='number'?cur:null;
                    }catch(e){
                        rs = null;
                    }
                }
                return rs;
            }

            attrChanged(attrName, attrValue){
                if(this.__props&&this.__props.indexOf(attrName)>-1){
                    const proto = this.protos[attrName];
                    proto.handler && proto.handler(this.getAttrValue(attrName));
                    super.attrChanged && super.attrChanged(attrName, attrValue);
                }
            }
        }

        function Wrapper(){
    
        }
    
        Wrapper.prototype = {
            created: function(){
                var myClass = this.myClass = new ViewBase(this);
                this.funcWrapper();
                util._lifecycleHandler(myClass, this);
            },
            funcWrapper: function(){
                var funcs = ['attrChanged', 'styleChanged', 'textChanged', 'orientationChanged'];
                var myClass = this.myClass, jsDom = this;
                for(var i=0, len=funcs.length;i<len;i++){
                    var funcName = funcs[i];
                    if(typeof myClass[funcName]!=='function') continue;
                    (function(funcName){
                        jsDom[funcName] = function(){
                            myClass[funcName].apply(myClass, arguments);
                        }
                    })(funcName);
                }
            }
        };
    
        return Wrapper;
    },
    pageWrapper: function pageWrapper(MyClass){
        var page;


        class PageBase extends MyClass{
            constructor(...args){
                super(...args);
                this.$ = $;
            }
        }

        window.on('loaded', function(e) {
            var jsDom = document.getRootElement();
            page = new PageBase(jsDom);
            util._lifecycleHandler(page, jsDom);
        });
        window.on('animator', function(e) {
            page.jsDom.fire('enter');
        });

        window.on('destroy', function(){
            page.jsDom.fire('leave');
        });
    }
};