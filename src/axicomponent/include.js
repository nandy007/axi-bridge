var $ = require('JQLite'), BaseComponent = $.BaseComponent;
var util = require('./util.js');
var Page = util.Page, Component = util.Component;

module.exports = function(mod, fullTag){

    if(!mod){
        return console.log('页面或组件创建失败，没有module上下文信息');
    }

    return {
        Page: function(options){
            var MyPage = BaseComponent.createClass(options, fullTag);
            mod.exports = Page(MyPage);
        },
        Component: function(options){
            var MyComponent = BaseComponent.createClass(options, fullTag);
            MyComponent.prototype.getSlotWrapper = function(){
                var slotParent = this.$jsDom[0].slotParent;
                return slotParent ? $(slotParent) : this.$jsDom;
            };
            mod.exports = Component(MyComponent);
        }
    };
};