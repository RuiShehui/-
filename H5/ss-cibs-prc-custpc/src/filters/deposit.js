/*
 * @Author: zhangcheng
 * @Date: 2022-05-20 15:27:15
 * @LastEditTime: 2022-10-28 11:39:24
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\filters\deposit.js
 */
import i18n from "@/i18n";

export default {
  // 到期指示
  newMaturityInstructionsFilter(value) {
    let val = String(value)
    switch (val) {
      case '1':
        return i18n.t('AUTHORIZE.XUCUN');
      case '2':
        return i18n.t('AUTHORIZE.BENJIN');
      case '3':
        return i18n.t('AUTHORIZE.FIXED_ACCOUNT');
      case '6':
        return 'To Be Confirmed At Maturity';
      default:
        return value;
    }
  },
  getDay(val) {
    let nextTransferDate =val.substr(val.length-1, 1);
    let number = val.substr(0, val.length-1);
    console.log(nextTransferDate,'nextTransferDate')
    console.log(number,'number')
    if (number == '1') {
      if (nextTransferDate == 'D') {
        // console.log(item.deposiTime,'item.deposiTime')
        val = val.replace(
          /(.*)D/,
          `$1${i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_DAYS')}` //天
        );
        //  console.log(item.deposiTime,'item.deposiTim1e')
      }
      if (nextTransferDate == 'M') {
        val = val.replace(
          /(.*)M/,
          `$1${i18n.t('FIXED_DEPOSIT_OVERVIEW.MONTH')}` //个月
        );
      }
    } else {
      if (nextTransferDate == 'D') {
        // console.log(item.deposiTime,'item.deposiTime')
        val =val.replace(
          /(.*)D/,
          `$1${i18n.t('FIXED_DEPOSIT_OVERVIEW.DAY')}` //天
        );
        //  console.log(item.deposiTime,'item.deposiTim1e')
      }
      if (nextTransferDate == 'M') {
        val = val.replace(
          /(.*)M/,
          `$1${i18n.t('FIXED_DEPOSIT_OVERVIEW.DOUBLE_MOTH')}` //个月
        );
      }
    }
    return val
  }
}