import TypeTools from "./typeTools";
import { getNow } from '@/api/login.js'
function isAddZero(num) {
    return Number(num) < 10 ? `0${num}` : num;
}
/**
 * 获取时间戳计算的具体日期时间
 * @param {number} timestamp 时间戳参数
 * 传参1  YYYYMMDDhhmmss
 */
function getCurrentTimes(timestamp = new Date().getTime()) {
    const year = new Date(timestamp).getFullYear();
    const month = new Date(timestamp).getMonth() + 1;
    const day = new Date(timestamp).getDate();
    const hours = new Date(timestamp).getHours();
    const minutes = new Date(timestamp).getMinutes();
    const seconds = new Date(timestamp).getSeconds();
    return `${year}-${isAddZero(month)}-${isAddZero(day)} ${isAddZero(hours)}:${isAddZero(minutes)}:${isAddZero(seconds)}`;
}
/**
 * 获取时间戳计算的具体日期时间----YYYYMMDDhhmmss
 * @param {number} timestamp 时间戳参数
 */
async function getCurrentTimesData() {
    let realTime = ''
    const reslut =await getNow()
    realTime = reslut.sysRealTime.split(' ')
    let year = realTime[0].replace(/-/g, '')
    let times = realTime[1].replace(/:/g, '')
    return year + times

}

/**
 * 获取年月日
 * @param {number} timestamp 时间戳参数
 */
function getYMD(timestamp) {
    return getCurrentTimes(timestamp).split(' ')[0];
}
/**
 * 获取年月
 * @param {number} timestamp 时间戳参数
 */
function getYM(timestamp) {
    return getYMD(timestamp).slice(0, 7);
}
/**
 * getNearDay 获取附近的日期
 * @param {string} date
 * @example '2022-02-10'
 * @param {number} day 相隔的天数, 正为day天后, 负为day天前
 */
function getNearDay(date, day) {
    if (typeof (day) !== 'number') {
        return date;
    }
    return getYMD(new Date(date).getTime() + day * 24 * 60 * 60 * 1000);
}

/**
 * 常规格式如下
 * 2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803,20170906165655
 */

export default {
    getCurrentTimes,
    getCurrentTimesData,
    getYMD,
    getYM,
    getNearDay,
    /**
     * 日期字符串转日期对象
     * 支持6种常规格式日期字符串
     * @param {String} str
     * @returns {Date}
     */
    str2Date(str) {
        try {
            str = str.replace(/-/g, "/");
            if (str.length == 8) {
                str =
                    str.substring(0, 4) +
                    "/" +
                    str.substring(4, 6) +
                    "/" +
                    str.substring(6, 8);
            }
            if (str.length == 10) {
                str = str + " 00:00:00";
            }
            if (str.length == 14) {
                str =
                    str.substring(0, 4) +
                    "/" +
                    str.substring(4, 6) +
                    "/" +
                    str.substring(6, 8) +
                    " " +
                    str.substring(8, 10) +
                    ":" +
                    str.substring(10, 12) +
                    ":" +
                    str.substring(12, 14);
            }
            return new Date(str);
        } catch (error) {
            return null;
        }
    },

    /**
     * 格式化时间字符串
     * @param {any} str 时间字符串
     * @param {string} [exp="YYYY-MM-DD hh:mm:ss"] 表达式
     * @returns 格式化后的时间字符串
     */
    str2DateStr(str, exp = "YYYY-MM-DD hh:mm:ss") {
        if (str == "" || str == undefined || str == null) {
            return "";
        }
        let date = this.str2Date(str);
        return this.date2Str(date, exp);
    },

    /**
     * 日期对象转日期字符串(日期对象)
     * 表达式【YYYY年份 MM月份 DD日期 hh小时 mm分钟 ss秒钟 自由组合，如 YYYY-MM-DD hh:mm:ss】
     * @param {Date} date
     * @param {Sting} exp
     * @returns {String}
     */
    date2Str(date, exp) {
        try {
            let year = this.getYear(date);
            exp = exp.replace(/YYYY/, year);
            let month = this.getMonth(date);
            exp = exp.replace(/MM/, month);
            let day = this.getDay(date);
            exp = exp.replace(/DD/, day);
            let hour = this.getHours(date);
            exp = exp.replace(/hh/, hour);
            let minutes = this.getMinutes(date);
            exp = exp.replace(/mm/, minutes);
            let seconds = this.getSeconds(date);
            exp = exp.replace(/ss/, seconds);
            return exp;
        } catch (error) {
            return null;
        }
    },

    /**
     * 获取年份
     * 支持 Date对象 及 日期字符串
     * @param {any} obj
     * @returns
     */
    getYear(obj) {
        try {
            if (TypeTools.isString(obj)) {
                obj = this.str2Date(obj);
            }
            return obj.getFullYear() + "";
        } catch (error) {
            return "";
        }
    },

    /**
     * 获取月份 【01~12】
     * 支持 Date对象 及 日期字符串
     * @param {any} obj
     * @returns {String}
     */
    getMonth(obj) {
        try {
            if (TypeTools.isString(obj)) {
                obj = this.str2Date(obj);
            }
            let month = obj.getMonth() + 1;
            return month > 9 ? "" + month : "0" + month;
        } catch (error) {
            return "";
        }
    },

    /**
     * 获取天 【01~31】
     * 支持 Date对象 及 日期字符串
     * @param {any} obj
     * @returns {String}
     */
    getDay(obj) {
        try {
            if (TypeTools.isString(obj)) {
                obj = this.str2Date(obj);
            }
            let day = obj.getDate();
            return day > 9 ? "" + day : "0" + day;
        } catch (error) {
            return "";
        }
    },

    /**
     * 获取小时
     * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
     * @param {any} obj
     * @returns {String}
     */
    getHours(obj) {
        try {
            if (TypeTools.isString(obj)) {
                obj = this.str2Date(obj);
            }
            let hour = obj.getHours();
            return hour > 9 ? "" + hour : "0" + hour;
        } catch (error) {
            return "";
        }
    },

    /**
     * 获取分钟
     * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
     * @param {any} obj
     * @returns {String}
     */
    getMinutes(obj) {
        try {
            if (TypeTools.isString(obj)) {
                obj = this.str2Date(obj);
            }
            let minutes = obj.getMinutes();
            return minutes > 9 ? "" + minutes : "0" + minutes;
        } catch (error) {
            return "";
        }
    },

    /**
     * 获取秒钟
     * 支持 Date对象 及 日期字符串【2017-08-03 12:00:00, 2017/08/03 12:00:00, 2017-08-03, 2017/08/03, 20170803】
     * @param {any} obj
     * @returns {String}
     */
    getSeconds(obj) {
        try {
            if (TypeTools.isString(obj)) {
                obj = this.str2Date(obj);
            }
            let second = obj.getSeconds();
            return second > 9 ? "" + second : "0" + second;
        } catch (error) {
            return "";
        }
    }
};