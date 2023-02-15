/*
 * @Author: ZhangZhen
 * @Date: 2022-03-31 14:34:39
 * @LastEditTime: 2022-09-22 14:13:46
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\utils\filters.js
 */
import { SELECT_BANK_TYPES } from './constant';
import i18n from '@/i18n';

/**
 * 收款人地址 (国家/地区+收款人地址)
 */
function payeeAddressFilter(tableColumn = {}) {
  const {
    payeeAddress
  } = tableColumn;

  return ` ${payeeAddress}`;
}

/**
 * selectBackTypeFilter - 根据收款银行类型反显出来的收款银行
 */
function selectBackTypeFilter(type) {
  switch (type) {
    case SELECT_BANK_TYPES.PRE:
      return i18n.t('PAYMENT.PRESET_PAYEE_BANK');
    case SELECT_BANK_TYPES.DEF:
      return i18n.t('PAYMENT.CHUANGXING_BANK');
    case SELECT_BANK_TYPES.OPT:
      return i18n.t('PAYMENT.DESIGNATED_RECEIVE_BANK');
    default:
      return '';
  }
}
/**
 * 转账类型编号 -> 转账类型文字
 */
function escapeTransType(type) {
  switch (type) {
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
        case 'ALL': case 'All':
          return 'ALL';
      default:
        return '';
  }
}
export {
  payeeAddressFilter,
  selectBackTypeFilter,
  escapeTransType,
};
