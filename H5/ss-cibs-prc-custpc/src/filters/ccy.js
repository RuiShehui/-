/*
 * @Author: zhangcheng
 * @Date: 2022-03-26 16:04:27
 * @LastEditTime: 2022-04-22 17:51:30
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\filters\public.js
 */
import i18n from "@/i18n";

export default {
  ccyFilter(value) {
    switch (value) {
      case 'AUD':
        return i18n.t('REMITTANCECONFIRM.AUD');
      case 'CAD':
        return i18n.t('REMITTANCECONFIRM.CAD');
      case 'CNY':
        return i18n.t('REMITTANCECONFIRM.CNY');
      case 'EUR':
        return i18n.t('REMITTANCECONFIRM.EUR');
      case 'GBP':
        return i18n.t('REMITTANCECONFIRM.GBP');
      case 'JPY':
        return i18n.t('REMITTANCECONFIRM.JPY');
      case 'NZD':
        return i18n.t('REMITTANCECONFIRM.NZD');
      case 'SGD':
        return i18n.t('REMITTANCECONFIRM.SGD');
      case 'TWD':
        return i18n.t('REMITTANCECONFIRM.TWD');
      case 'USD':
        return i18n.t('REMITTANCECONFIRM.USD');
      case 'CHF':
        return i18n.t('REMITTANCECONFIRM.CHF');
      case 'HKD':
        return i18n.t('REMITTANCECONFIRM.HKD');
      default:
        return value;
    }
  }
}