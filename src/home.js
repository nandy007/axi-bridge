var app = require("App");
var window = require("Window");

app.on("launch", function (e, jsonData) {

    var type = jsonData.type;
    if (type == "normal") {

        //正常桌面启动
        var json = {};
        json.url = "res:page/component/index.bui";
        json.target = "_blank";
        json.id = "auicomponent";
        json.statusBarColor = "#f9f9f9";
        json.openAnimation = "push_r2l";
        json.closeAnimation = "push_l2r";
        json.data = {};
        json.data.text = "传值参数";
        window.open(json);
    }
    else if (type == "app") {
        //其他应用调用启动

    }
    else if (type == "notification") {
        //推送消息启动
    }
    else if (type == "localNotification") {
        //本地通知启动
    }
});

