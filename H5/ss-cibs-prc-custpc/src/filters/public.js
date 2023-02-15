/*
 * @Author: zhangcheng
 * @Date: 2022-03-26 16:04:27
 * @LastEditTime: 2022-11-10 16:59:09
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\filters\public.js
 */
import i18n from "@/i18n";

export default {
  yesOrNo(value) {
    switch (value) {
      case 'Y':
        return i18n.t('COMMON.YES');
      case 'N':
        return i18n.t('COMMON.NO');
      default:
        return value;
    }
  },

  //授权状态
  authStateFilter(value) {
    switch (value) {
      case '0':
        return i18n.t('AUTHORIZE.WAIT_AUTHOR');
      case '1':
        return i18n.t('AUTHORIZE.AUTH_AGREE');
      case '2':
        return i18n.t('AUTHORIZE.REFUSE');
      case '3':
        return i18n.t('AUTHORIZE.AUTH_CANCLE');
      case '4':
        return i18n.t('AUTHORIZE.AUTH_DATA_LAST');
      case '5':
        return i18n.t('AUTHORIZE.NOW_AUTHOR');
      case '6':
        return i18n.t('AUTHORIZE.CHECK_FAIL');
      case '01':
        return i18n.t('AUTHORIZE.BANK_CHU');
      case '02':
        return i18n.t('AUTHORIZE.fail');
      case '03':
        return i18n.t('AUTHORIZE.WAIT_AUTH');
      case '04':
        return i18n.t('AUTHORIZE.BANK_REJECT');
      case '05':
        return i18n.t('AUTHORIZE.YOU_CAN');
      case '09':
        return i18n.t('AUTHORIZE.AUTH_FAILURE');
      case '10':
        return i18n.t('AUTHORIZE.AUTH_PROCESS');
      case '11':
        return i18n.t('AUTHORIZE.REFUSE');
      case '12':
        return i18n.t('AUTHORIZE.AUTH_THROUGH');
      case '13':
        return i18n.t('AUTHORIZE.AUTH_FASONG');
      case '14':
        return i18n.t('AUTHORIZE.TRADING_CANCELLATION');
      case '15':
        return i18n.t('AUTHORIZE.TRANSACTION_EXPIRED');
      case '16':
        return i18n.t('AUTHORIZE.FILE_SCANNING');
      case '20':
        return i18n.t('AUTHORIZE.WAITING_SENDING');
      case '30':
        return i18n.t('AUTHORIZE.EXPIRED');
      case '50':
        // return '主机处理中'
        return i18n.t('AUTHORIZE.BANK_CHU');
      case '60':
        return i18n.t('AUTHORIZE.APPOINTMENT');
      case '61':
        return i18n.t('AUTHORIZE.CALL');
      case '62':
        return i18n.t('AUTHORIZE.THE_APPOINTMENT');
      case '63':
        return i18n.t('AUTHORIZE.APPOINTMENT_REJECTION');
      case '64':
        return i18n.t('AUTHORIZE.MODIFICATION_DATE');
      case '65':
        return i18n.t('AUTHORIZE.APPOINTMENT_CANCELLATION');
      case '66':
        return i18n.t('AUTHORIZE.APPOINTMENT_EXPIRED');
      case '90':
        return i18n.t('AUTHORIZE.SUCCESSFUL_TRANSACTION');
      case '91':
        return i18n.t('AUTHORIZE.FAILED_TRANSACTION');
      case '95':
        return i18n.t('AUTHORIZE.PARTIAL_SUCCESS');
      case '96':
        return i18n.t('AUTHORIZE.BANK_ACCEPTED');
      default:
        return value;
    }
  },
  creditorTypeFilter(value) {
    switch (value) {
      case '0':
        return i18n.t('AUTHORIZE.REGISTERED_ACCOUNT');
      case '1':
        return i18n.t('AUTHORIZE.UNREGISTERED_ACCOUNT');
      default:
        return value;
    }
  },
  operationTypeFilter(value) {
    switch (value) {
      case '1':
        return i18n.t('AUTHORIZE.ADD');
      case '2':
        return i18n.t('AUTHORIZE.UPDATE');
      case '3':
        return i18n.t('AUTHORIZE.DELETE');
    }
  },
  //交易状态
  tradeStateFilter(value) {
    switch (value) {
      case '03':
      case '12':
        return i18n.t('AUTHORIZE.WAIT_AUTHOR');//待授权
      case '04':
        return i18n.t('INTERESTRATEQUERY.PARTIALLY_FAILED');//交易失败
      case '11':
        return i18n.t('AUTHORIZE.REFUSE');//授权拒绝
      case '14':
        return i18n.t('AUTHORIZE.AUTH_CANCLE');//已撤销
      case '30':
      case '66':
        return i18n.t('AUTHORIZE.OUT_DATE');//已过期
      case '60':
        return i18n.t('TRANSFR_INFO.WAIT');//待执行
      case '61':
        return i18n.t('AUTHORIZE.CALL');//已取消
      case '90':
        return i18n.t('COMMON.TRANSACTION_SUCCESS');//交易成功
      case '91':
        return i18n.t('INTERESTRATEQUERY.PARTIALLY_FAILED');//交易失败
      case '95':
        return i18n.t('INTERESTRATEQUERY.PARTIALLY_SUCCESSFUL');//部分交易成功
      case '96':
        return i18n.t('AUTHORIZE.BANK_ACCEPTED');//银行已受理
      case '01':
      case '05':
      case '10':
      case '13':
      case '16':
      case '20':
      case '50':
      case '64':
      case '65':
      case '99':
        return i18n.t('AUTHORIZE.BANK_CHU');//银行处理中
      default:
        return value;//银行处理中
    }
  },
  tradeTypeFilter(value) {
    switch (value) {
      case '030101':
        return i18n.t('OPERATORLOG.TRANSFER_WITHIN_THE_BANK');
      case '03010201':
        return i18n.t('OPERATORLOG.FASTER_PAYMENT_SYSTEM');
      case '03010202':
        return i18n.t('OPERATORLOG.FOREIGN_CURRENCY_TRANSFER');
      case '030103':
        return i18n.t('OPERATORLOG.TELEGRAPHIC_TRANSFER');
      case '03010401':
        return i18n.t('OPERATORLOG.BULK_TRANSFER');
      case '03010501':
        return i18n.t('OPERATORLOG.BULK_PAYROLL');
      case '03020101':
        return i18n.t('OPERATORLOG.AUTOPAY_IN_SERVICE');
      case '0303':
        return i18n.t('OPERATORLOG.SCHEDULED_TRANSACTION_MANAGEMENT');
      case '0402':
        return i18n.t('OPERATORLOG.FIXED_DEPOSIT_PLACEMENT');
      case '0403':
        return i18n.t('OPERATORLOG.AMEND_MATURITY_INSTRUCTION');
      case '050102':
        return i18n.t('OPERATORLOG.CURRENCY_EXCHANGE');
      case '050201':
        return i18n.t('OPERATORLOG.FUND_SUBSCRIPTION');
      case '050202':
        return i18n.t('OPERATORLOG.MY_FUND');
      case '060101':
        return i18n.t('OPERATORLOG.BILL_PAYMENT');
      case '060103':
        return i18n.t('OPERATORLOG.SCHEDULED_PAYMENT_MANAGEMENT');
      case '030107':
        return i18n.t('OPERATORLOG.REGISTER_THIRD_PARTY_ACCOUNTS');
      case '060102':
        return i18n.t('OPERATORLOG.MY_PAYEE_LIST');
      case '10':
        return i18n.t('OPERATORLOG.REQUEST_FOR_CHEQUE_BOOK');
      case '030110':
        return i18n.t('AUTHORIZE.ELE_SETT_SYS');
      case '16':
        return i18n.t('SPECIAL_INSTRUACTION.SPECIAL_ORDER_APPLICATION')
      case 'ALL': case 'All':
        return 'ALL';
      default:
        return '';
    }
  },
  tradeTypeSmallFilter(value) {
    switch (value) {
      case '0101':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0101');
      case '010101':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_010101');
      case '0102':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0102');
      case '010201':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_010201');
      case '0201':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0201');
      case '020101':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_020101');
      case '0202':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0202');
      case '0301':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0301');
      case '0401':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0401');
      case '01':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_01');
      case '02':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_02');
      case '03':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_03');
      case '04':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_04');
      case '00':
        return i18n.t('USER_MANAGERMENT.TRADE_TYPE_SMALL_00');
      default:
        return '';
    }
  },
  // 账户格式化
  formatBankNo(bankNo) {
    if (bankNo) {
      return `${bankNo.slice(0, 3)}-${bankNo.slice(3, 5)}-${bankNo.slice(5)}`;
    }
  },
  // 币种格式化
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
  filtersType(val, cur) {
    if (val == 'MULTICURRENCY') {
      return ''
    } else {
      console.log(val, cur)
      this.ccyFilter(cur)
      return this.ccyFilter(cur)
    }
  },
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
  service(val) {

    switch (val) {
      case "0":
        return i18n.t('SPECIAL_INSTRUACTION.TWO_SERVCIE_SETTING');
      case "1":
        return i18n.t('SPECIAL_INSTRUACTION.BENEFICIARY_SETTING');
      case "2":
        return i18n.t('SPECIAL_INSTRUACTION.LIMIT_SETTING');
      case "3":
        return i18n.t('SPECIAL_INSTRUACTION.LOAN_REPAYMENT');
      case "4":
        return i18n.t('SPECIAL_INSTRUACTION.MANAGED_DIRECTIVES');
      case "5":
        return i18n.t('SPECIAL_INSTRUACTION.SAME_NAME');
      case "6":
        return i18n.t('SPECIAL_INSTRUACTION.FUND_TRANSFER');
      case "7":
        return i18n.t('SPECIAL_INSTRUACTION.LOAN_WITHDRAWAL');
      case "8":
        return i18n.t('SPECIAL_INSTRUACTION.OTHERS');
      default:
        return val;
    }
  },
  fixedTermType(val) {
    switch (val) {
      case "7D":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_WEEK')
      case "14D":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWO_WEEK')
      case "1M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_MONTHS')
      case "2M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWO_MONTHS')
      case "3M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.THREE_MONTHS')
      case "6M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.SIX_MONTHS')
      case "9M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.NINE_MONTHS')
      case "12M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWELEVE_MONTHS')
      case "24M":
        return i18n.t('FIXED_DEPOSIT_OVERVIEW.TWENTY_MONTHS')

    }
  }
}