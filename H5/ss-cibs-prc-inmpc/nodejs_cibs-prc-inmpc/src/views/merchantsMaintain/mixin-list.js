/*
 * @Author: ZhangZhen
 * @Date: 2021-12-24 17:19:10
 * @LastEditTime: 2021-12-24 17:20:06
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\views\merchantsMaintain\mixin-list.js
 */
export default {
  data() {
    return {
      chargingTypeList: [
        {
          label: 'C',
          value: '0'
        },
        {
          label: 'D',
          value: '1'
        },
        {
          label: 'R',
          value: '2'
        }
      ],
      cardStandedList: [
        {
          label: 'C',
          value: '0'
        },
        {
          label: 'D',
          value: '1'
        },
      ],
    }
  }
};