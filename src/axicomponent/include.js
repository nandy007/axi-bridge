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
                return $(this.$jsDom[0].slotParent);
            };
            mod.exports = Component(MyComponent);
        }
    };
};