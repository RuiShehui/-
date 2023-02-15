/*
 * @Author: zhangcheng
 * @Date: 2022-03-01 17:05:51
 * @LastEditTime: 2022-04-11 11:31:30
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\filters\fund.js
 */
import i18n from "@/i18n";
export default {
  // 是否到期
  isDueDate(value) {
    switch (value) {
      case 'Y':
        return i18n.t('FUND.BE_EXPIRED');
      case 'N':
        return i18n.t('FUND.HAVE_EXPIRED');
      default:
        return value;
    }
  },
  // 基金资产类别
  assetTypeCodeFilter(value) {
    switch (value) {
      case '01':
        return i18n.t('FUND.BOND');
      case '02':
        return i18n.t('FUND.SECURITIES');
      case '03':
        return i18n.t('FUND.HYBRID_ASSET');
      case '04':
        return i18n.t('FUND.CURRENCY_MARKET');
      case '05':
        return i18n.t('FUND.OTHER');
      case '06':
        return 'Commodity'
      case '07':
        return 'Protected'
      default:
        return value;
    }
  },
  // 产品风险等级
  riskRatingFilter(value) {
    switch (value) {
      case '1':
        return i18n.t('FUND.OTHER');
      case '2':
        return i18n.t('FUND.LOW_MEDIUM');
      case '3':
        return i18n.t('FUND.MEDIUM');
      case '4':
        return i18n.t('FUND.MEDIUM_HIGH');
      case '5':
        return i18n.t('FUND.HIGH');
      default:
        return value;
    }
  },
  // 产品投资目标
  productObjFilter(value) {
    switch (value) {
      case '1':
        return i18n.t('FUND.INCOME_TYPE_ONE');
      case '2':
        return i18n.t('FUND.INCOME_TYPE_TWO');
      case '3':
        return i18n.t('FUND.INCOME_TYPE_THREE');
      case '4':
        return i18n.t('FUND.INCOME_TYPE_FOUR');
      case '5':
        return i18n.t('FUND.INCOME_TYPE_FIVE');
      default:
        return value;
    }
  },
  // 转换方式
  changeModeFilter(value) {
    switch (value) {
      case '0':
        return i18n.t('FUND.INPUT_FUND_NO');
      case '1':
        return i18n.t('FUND.FOND_TYPE');
      default:
        return value;
    }
  }
}