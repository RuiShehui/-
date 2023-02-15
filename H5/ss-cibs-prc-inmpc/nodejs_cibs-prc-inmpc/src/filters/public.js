/*
 * @Author: zhangcheng
 * @Date: 2022-03-26 16:04:27
 * @LastEditTime: 2022-11-03 10:24:28
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\filters\public.js
 */
export default {
  // 账户格式化
  formatBankNo(bankNo) {
    if (bankNo) {
      return `${bankNo.slice(0,3)}-${bankNo.slice(3,5)}-${bankNo.slice(5)}`;
    }
  },
  // 币种格式化
  ccyFilter(val) {
    switch (val) {
      case 'HKD':
        return '港幣'
      case 'AUD':
        return '澳洲元'
      case 'CAD':
        return '加拿大元'
      case 'CNY':
        return '人民幣'
      case 'EUR':
        return '歐羅'
      case 'GBP':
        return '英鎊'
      case 'JPY':
        return '日圓'
      case 'NZD':
        return '紐西蘭元'
      case 'SGD':
        return '新加坡元'
      case 'TWD':
        return '新台幣'
      case 'USD':
        return '美元'
      case 'CHF':
        return '瑞士法郎'
      case 'CNH':
        return '人民幣（離岸）'
      case 'DKK':
        return '丹麥克朗'
      case 'SEK':
        return '瑞典克朗'
      case 'THB':
        return '泰國銖'
      default:
        return val
    }
  },
  filtersType(val,cur){
    if(val=='MULTICURRENCY'){
      return ''
    }else{
      this.ccyFilter(cur)
      return  this.ccyFilter(cur)
    }
  },
  accountType(value) {
    switch (value) {
      case 'SAVING':
        return '儲蓄賬戶';
      case 'MULTICURRENCY':
        return '多種貨幣儲蓄賬戶';
      case 'CURRENT':
        return '往來賬戶';
      case 'FIXED':
        return '定期賬戶';
      case 'LOAN':
        return '貸款賬戶';
      case 'SECURITIES':
        return '股票賬戶';
      case 'INVESTMENT':
        return '投資賬戶';
      default:
        return value;
    }
  },  
  status(val){
    switch(val){
      case "10":
      return '已接收';
      case "20":
      return '處理中';
      case "21":
      return '通過';
      case "29":
      return '拒絕';
    }
  }
}