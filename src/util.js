export default {
    install(Vue) {
        Vue.prototype.timestampToTime = function (timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为12位的话不需乘1000
            var Y = date.getFullYear();
            return Y;
        };
        Vue.prototype.timeToTimestamp = function (time) {
            var timestamp = new Date(time);
            return timestamp.getTime();
        };
        Vue.prototype.goUp = function () {
            let nowTop = document.body.scrollTop || document.documentElement.scrollTop; // 获取当前滚动条位置
            if (nowTop > 0) {
                window.requestAnimationFrame(this.goUp);
                window.scrollTo (0,nowTop - (nowTop / 5));
            }
        };
    }
}