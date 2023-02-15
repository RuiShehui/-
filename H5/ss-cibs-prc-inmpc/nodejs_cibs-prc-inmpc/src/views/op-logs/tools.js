/*
 * @Author: ZhangZhen
 * @Date: 2022-01-18 15:40:30
 * @LastEditTime: 2022-01-18 16:47:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\op-logs\tools.js
 */
import dateTools from '@/utils/dateTools';

/**
 * 初始化开始时间和结束时间 (90天内容的开始时间和结束时间)
 */
function get90TimeSpan() {
  const { formatDate, getDateStr } = dateTools;

  const endDate = formatDate(new Date()),
    startDate = getDateStr(new Date, -90);

  return [startDate, endDate];
}

/**
 * 判断开始时间-结束时间的范围是否超过day天
 * @param {[string, string]} timeSpan 时间范围
 * @param {number} day 允许的时间范围, 默认为90天
 */
function isOverday([startDate, endDate], day = 90) {

  const startTimeStamp = new Date(startDate),
    endTimeStamp = new Date(endDate);

  const maxTimeStamp = day * 1000 * 60 * 60 * 24;

  if (endTimeStamp - startTimeStamp > maxTimeStamp) {
    return true;
  }
  return false;
}

export {
  get90TimeSpan,
  isOverday,
};
