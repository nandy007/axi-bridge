
var util = module.exports = {
    getBrforeDatDate: function getBrforeDatDate(day){
        var cur = new Date();
        var target = new Date(cur);
        target.setDate(cur.getDate()+day);
        var dateStr = target.getFullYear()+"-"+(target.getMonth()+1)+"-"+target.getDate();
        return dateStr;
    },
    getMonthLength: function getMonthLength(date) {
        let d = new Date(date);
        // 将日期设置为下月一号
        d.setMonth(d.getMonth()+1);
        d.setDate('1');
        // 获取本月最后一天
        d.setDate(d.getDate()-1);
        var len = d.getDate();
        var ds = date.split('-');
        if(ds[0]==='2001'&&ds[1]==='10') require('Console').log(len);
        return len;
    },
    patchZero: function(num){
        return (num<10?'0':'')+String(num);
    },
    formateValue: function(rs, splitStr){
        for(var i=0,len=rs.length;i<len;i++){
            rs[i] = rs[i].name.replace(/[^\d]/g, ''); 
        }
        return rs.join(splitStr);
    }
};