/*
 * @Author: zhangcheng
 * @Date: 2022-02-25 10:07:44
 * @LastEditTime: 2022-09-27 20:38:14
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\filters\accountManagement.js
 */
import i18n from '@/i18n'
export default {
  // 账户类型
  accountType(value) {
    switch (value) {
      case 'SAVING':
        return i18n.t('ACCOUNT_MANAGEMENT.SAVING');
      case 'MULTICURRENCY':
        return i18n.t('ACCOUNT_MANAGEMENT.MULTICURRENCY');
      case 'CURRENT':
        return i18n.t('ACCOUNT_MANAGEMENT.CURRENT');
      case 'FIXED':
        return i18n.t('ACCOUNT_MANAGEMENT.FIXED');
      case 'LOAN':
        return i18n.t('ACCOUNT_MANAGEMENT.LOAN');
      case 'SECURITIES':
        return i18n.t('ACCOUNT_MANAGEMENT.SECURITIES');
      case 'INVESTMENT':
        return i18n.t('ACCOUNT_MANAGEMENT.INVESTMENT');
      default:
        return value;
    }
  },
  // 账户状态
  accountStateFilter(value) {
    switch (value) {
      case 'ACTIVE':
        return i18n.t('ACCOUNT_MANAGEMENT.STATUS_ACTIVE');
      case 'DORMANT':
        return i18n.t('ACCOUNT_MANAGEMENT.STATUS_DORMANT');
      case 'FROZEN':
        return i18n.t('ACCOUNT_MANAGEMENT.STATUS_FROZEN');
      case 'CLOSED':
        return i18n.t('ACCOUNT_MANAGEMENT.STATUS_CLOSE');
      default:
        return value;
    }
  },
  // 账户状态
  sharesFilter(value) {
    switch (value) {
      case 'O':
        return i18n.t('ACCOUNT_MANAGEMENT.ACCOUNT_OPEN');
      case 'C':
        return i18n.t('ACCOUNT_MANAGEMENT.ACCOUNT_CLOSE');
      case 'F':
        return i18n.t('ACCOUNT_MANAGEMENT.ACCOUNT_FROZEN');
      default:
        return value;
    }
  },
  // 转账交易类型 0:已登记账户 1 已登记第三者账户 3 未登记账户
  processCreditType(type) {
    switch (Number(type)) {
      case 1:
        return i18n.t('PAYMENT.MY_ACCOUNT');
      case 2:
        return i18n.t('PAYMENT.REGISTERED_ACCOUNT');
      case 3:
        return i18n.t('PAYMENT.NO_REGISTERED_ACCOUNT');
      default:
        return '--';
    }
  },
  //  币种
  ccyFilter(val) {
    switch (val) {
      case 'HKD':
        return i18n.t('ACCOUNT_MANAGEMENT.HKD')
      case 'AUD':
        return i18n.t('ACCOUNT_MANAGEMENT.AUD')
      case 'CAD':
        return i18n.t('ACCOUNT_MANAGEMENT.CAD')
      case 'CNY':
        return i18n.t('ACCOUNT_MANAGEMENT.CNY')
      case 'EUR':
        return i18n.t('ACCOUNT_MANAGEMENT.EUR')
      case 'GBP':
        return i18n.t('ACCOUNT_MANAGEMENT.GBP')
      case 'JPY':
        return i18n.t('ACCOUNT_MANAGEMENT.JPY')
      case 'NZD':
        return i18n.t('ACCOUNT_MANAGEMENT.NZD')
      case 'SGD':
        return i18n.t('ACCOUNT_MANAGEMENT.SGD')
      case 'TWD':
        return i18n.t('ACCOUNT_MANAGEMENT.TWD')
      case 'USD':
        return i18n.t('ACCOUNT_MANAGEMENT.USD')
      case 'CHF':
        return i18n.t('ACCOUNT_MANAGEMENT.CHF')
      case 'CNH':
        return i18n.t('ACCOUNT_MANAGEMENT.CNH')
      case 'DKK':
        return i18n.t('ACCOUNT_MANAGEMENT.DKK')
      case 'SEK':
        return i18n.t('ACCOUNT_MANAGEMENT.SEK')
      case 'THB':
        return i18n.t('ACCOUNT_MANAGEMENT.THB')
      default:
        return val
    }
  },

  paymentFreqType(val) {
    switch (val) {
      case 'YEAR':
        return i18n.t('ACCOUNT_MANAGEMENT.YEAR');
      case 'MNTH':
        return i18n.t('ACCOUNT_MANAGEMENT.MNTH');
      case 'QURT':
        return i18n.t('ACCOUNT_MANAGEMENT.QURT');
      case 'MIAN':
        return i18n.t('ACCOUNT_MANAGEMENT.MIAN');
      case 'WEEK':
        return i18n.t('ACCOUNT_MANAGEMENT.WEEK');
      case 'DAIL':
        return i18n.t('ACCOUNT_MANAGEMENT.DAIL');
      case 'ADHO':
        return i18n.t('ACCOUNT_MANAGEMENT.ADHO');
      case 'FRTN':
        return i18n.t('ACCOUNT_MANAGEMENT.FRTN');
      default:
        return '';
    }
  },
  // 用於管理中心-代辦管理-我提交/待授權的狀態展示
  authorizeCenterType(val) {
    switch (val) {
      case '0':
        return i18n.t('AUTHORIZE.WAIT_AUTHOR');
      case '1':
        return i18n.t('AUTHORIZE.AUTH_AGREE');
      case '2':
        return i18n.t('AUTHORIZE.REFUSE');
      case '3':
        return i18n.t('AUTHORIZE.AUTH_CANCLE');
      case '4':
        return i18n.t('AUTHORIZE.AUTHOR_OUTDATE');
      case '5':
        return i18n.t('AUTHORIZE.AUTH_PROCESS');
      case '6':
        return i18n.t('AUTHORIZE.CHECK_FAIL');
      case '':
        return '';
      default:
        return '';
    }
  },
  // 用於代办管理-我已提交-操作类型展示
  operationType(val) {
    switch (val) {
      case '1':
        return i18n.t('AUTHORIZE.ADD');
      case '2':
        return i18n.t('AUTHORIZE.UPDATE');
      case '3':
        return i18n.t('AUTHORIZE.DELETE');
      case '4':
        return i18n.t('USER_MANAGEMENT.ENABLE');
      case '5':
        return i18n.t('USER_MANAGEMENT.DEACTIVATE');
      case '6':
        return i18n.t('COMMON.RESET_PASSWORD');
      case '7':
        return i18n.t('AUTHORIZE.RESIGTER');
      case '8':
        return i18n.t('ACCOUNT_MAINTENACE.DEREGISTRATION');
      case '9':
        return i18n.t('AUTHORIZE.MY_REFUSE');
      case '10':
        return i18n.t('AUTHORIZE.MY_AGRESS');
      case '11':
        return i18n.t('USER_MANAGERMENT.UNBOUND');
      case '12':
        return i18n.t('USER_MANAGERMENT.BIND');
      default:
        return '';
    }
  },
  // 网银管理
  bussinessTypeFilter(val){
    switch (val) {
      case '0901':
        return i18n.t('OPERATORLOG.USER_MANAGEMENT');
      case '0902':
        return i18n.t('OPERATORLOG.ACCOUNT_MANAGEMENT');
      case '090301':
        return i18n.t('OPERATORLOG.AUTHORISATION_TEMPLATE_MANAGEMENT');
      case '090302':
        return i18n.t('OPERATORLOG.TRANSACTION_AUTHORISATION_SETTINGS');
      case '090401':
        return i18n.t('OPERATORLOG.SERVICE_LIMIT_SETTING');
      case '090402':
        return i18n.t('OPERATORLOG.FPS_ADDRESSING_SERVICE');
      case '090403':
        return i18n.t('OPERATORLOG.FUND_TRANSFER_LIMIT');
      case '090404':
        return i18n.t('OPERATORLOG.EDDA_SERVICE');
      case '090405':
        return i18n.t('OPERATORLOG.SET_UP_E_STATEMENT');
      case '090406':
        return i18n.t('OPERATORLOG.SET_UP_TRADING_ALERTS');
        case '0906': 
          return i18n.t('OPERATORLOG.ACTION_LOG_ENQUIRY');
      // default:
      //   return '';
    }
  },
  dateList(val){
    switch(val){
        case "7D":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_WEEK');
        case "14D":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWO_WEEK');
        case "1M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_MONTHS');
        case "2M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWO_MONTHS');
        case "3M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.THREE_MONTHS');
        case "6M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.SIX_MONTHS');
        case "9M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.NINE_MONTHS');
        case "12M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWELEVE_MONTHS');
        case "24M":
          return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWENTY_MONTHS');
    }
  },
  formatBankNo(bankNo) {
    if (bankNo) {
      return `${bankNo.slice(0,3)}-${bankNo.slice(3,5)}-${bankNo.slice(5)}`;
    }
  },
  formatAccountType(val){
    return this.accountType(val)
  }
}