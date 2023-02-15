/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-09-08 14:31:21
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\filters\business.js
 */
import i18n from '@/i18n';

export default {
  /**
   * 处理账户类型
   */
  processAccountType(type) {
    switch (type) {
      case 'SAVING':
        return i18n.t('ACCOUNT_MANAGEMENT.SAVING');//储蓄
      case 'MULTICURRENCY':
        return i18n.t('ACCOUNT_MANAGEMENT.MULTICURRENCY');//多币种
      case "CURRENT":
        return i18n.t('ACCOUNT_MANAGEMENT.CURRENT');//往来
      case "FIXED":
        return i18n.t('ACCOUNT_MANAGEMENT.FIXED');//定期
      case "LOAN":
        return i18n.t('ACCOUNT_MANAGEMENT.LOAN');//贷款
      default:
        return '';
    }
  },
  /**
   * 处理收款人类型
   */
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
  /**
   * ynToBoolean
   */
  ynToText(origin) {
    switch (origin) {
      case 'Y':
        return i18n.t('COMMON.YES');
      default:
        return i18n.t('COMMON.NO');
    }
  },
  /**
   * EDDA支付类型
   */
  supporyType(type) {
    switch (type) {
      case 'DISPOSABLE':
        return i18n.t('RIGHTS_TEMPLATE.DISPOSABLE');
      case 'REGULAR':
        return i18n.t('RIGHTS_TEMPLATE.REGULAR');
      default:
        return '--';
    }
  },
  /**
 * EDDA交易类别
 */
  tranTypeType(type) {
    switch (type) {
      case 'INITIATION':
        return i18n.t('RIGHTS_TEMPLATE.INITIATION');
      case 'CANCELLATION':
        return i18n.t('RIGHTS_TEMPLATE.CANCELLATION');
      case 'AMENDMENT':
        return i18n.t('RIGHTS_TEMPLATE.AMENDMENT');
      case 'SUSPENSION':
        return i18n.t('RIGHTS_TEMPLATE.SUSPENSION');
      default:
        return '--';
    }
  },
  /**
 * FPS收款人识别方式
 */
  FPStransTypeFilers(type) {
    switch (type) {
      case 'BBAN':
        // '收款账户'
        return i18n.t('AUTHORIZE.creditAcctName');
      case 'MOBN':
        // '流动电话号码'
        return i18n.t('AUTHORIZE.MOBN');
      case 'EMAL':
        // '电邮地址'
        return i18n.t('AUTHORIZE.EMAL');
      case 'SVID':
        return 'FPS ID';
      default:
        return '--';
    }
  },
}