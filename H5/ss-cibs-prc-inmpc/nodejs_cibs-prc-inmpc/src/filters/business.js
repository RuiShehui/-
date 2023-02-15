/*
 * @Author: ZhangZhen
 * @Date: 2021-11-08 14:47:17
 * @LastEditTime: 2022-11-14 20:20:28
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\filters\business.js
 */
/**
 * 业务管理相关的过滤器 (merchant-maintain-filters)
 */
import i18nIns from "@/i18n/instance";

export default {
  /** 根据属性获取标签 */
  propToLabels(prop) {
    switch (prop) {
      case 'merchartTypeCode':
        return i18nIns.t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_CODE');
      case 'merchartTypeName':
        return i18nIns.t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME');
      case 'merchartName':
        return i18nIns.t('BUSINESS_MANAGEMENT.MERCHANT_NAME');
      case 'merchartCode':
        return i18nIns.t('BUSINESS_MANAGEMENT.MERCHANT_CODE');
      case 'billNumberInfo':
        return i18nIns.t('BUSINESS_MANAGEMENT.BILL_NUMBER_INFO');
      case 'billType':
        return i18nIns.t('BUSINESS_MANAGEMENT.BILL_TYPE');
      case 'billTypeInfo':
        return i18nIns.t('BUSINESS_MANAGEMENT.BILL_TYPE_DETAIL'); // 账单类别详情
      case 'commEpsMerchantBills':
        return i18nIns.t('BUSINESS_MANAGEMENT.COMM_EPS_MERCHANT_BILLS'); // 账单明细
      case 'outwardMerchartCode':
        return i18nIns.t('BUSINESS_MANAGEMENT.OUTWARD_MERCHART_CODE'); // 商户编号
      default:
        return '';
    }
  },
  /** 处理状态 */
  dealStatusText(dealStatus) {
    //00:已处理;01:待处理,02:无需处理
    switch (dealStatus) {
      case '00':
        return i18nIns.t('COMMON.IS_HANDLED');
      case '01':
        return i18nIns.t('COMMON.PREPEAR_HANDLE'); // 待处理
      case '02':
        return i18nIns.t('COMMON.NO_PRO_REQ'); // 无需处理
      default:
        return '';
    }
  },
  /** 交易场景 */
  tradeTypeNameFilter(value) {
    //处理类型:01:客户帐 到 内部帐;02:内部帐 到 客户帐;03:内部账 到 目标客户账;04:手续费 到 行内手续费帐；
    switch (value) {
      case '030101':
        return i18nIns.t('COMMON.TYPE_NAME_030101');
      case '03010201':
        return i18nIns.t('COMMON.TYPE_NAME_03010201');
      case '03010202':
        return i18nIns.t('COMMON.TYPE_NAME_03010202');
      case '030103':
        return i18nIns.t('COMMON.TYPE_NAME_030103');
      case '03010401':
        return i18nIns.t('COMMON.TYPE_NAME_03010401');
      case '03010501':
        return i18nIns.t('COMMON.TYPE_NAME_03010501');
      case '03020101':
        return i18nIns.t('COMMON.TYPE_NAME_03020101');
      case '0303':
        return i18nIns.t('COMMON.TYPE_NAME_0303');
      case '0402':
        return i18nIns.t('COMMON.TYPE_NAME_0402');
      case '0403':
        return i18nIns.t('COMMON.TYPE_NAME_0403');
      case '050102':
        return i18nIns.t('COMMON.TYPE_NAME_050102');
      case '050201':
        return i18nIns.t('COMMON.TYPE_NAME_050201');
      case '050202':
        return i18nIns.t('COMMON.TYPE_NAME_050202');
      case '060101':
        return i18nIns.t('COMMON.TYPE_NAME_060101');
      case '060103':
        return i18nIns.t('COMMON.TYPE_NAME_060103');
      case '030107':
        return i18nIns.t('COMMON.TYPE_NAME_060107');
      case '060102':
        return i18nIns.t('COMMON.TYPE_NAME_060102');
      case '090401':
        return i18nIns.t('COMMON.TYPE_NAME_090401');
      case '0902':
        return i18nIns.t('COMMON.TYPE_NAME_0902');
      case '0901':
        return i18nIns.t('COMMON.TYPE_NAME_0901');
      case '10':
        return i18nIns.t('COMMON.TYPE_NAME_10');
      case '090301':
        return i18nIns.t('COMMON.TYPE_NAME_090301');
      case '090302':
        return i18nIns.t('COMMON.TYPE_NAME_090302');
      case '090403':
        return i18nIns.t('COMMON.TYPE_NAME_090403');
      case '090404':
        return i18nIns.t('COMMON.TYPE_NAME_090404');
      case '090405':
        return i18nIns.t('COMMON.TYPE_NAME_090405');
      case '090406':
        return i18nIns.t('COMMON.TYPE_NAME_090406');
        case '16':
          return '特殊指令遞交申請'
      case 'ALL':
      case 'All':
        return i18nIns.t('COMMON.TYPE_NAME_ALL');
      default:
        return value;
    }
  },
  /** 交易状态 */
  tradeStatusText(tradeStatus) {
    // 状态:00:成功;01:失败;02:可疑;03:正在处理
    switch (tradeStatus) {
      case '00': //cehngg
        return i18nIns.t('BUSINESS_MANAGEMENT.ACC_STATUS_SUCC');
      case '01':
        return i18nIns.t('BUSINESS_MANAGEMENT.ACC_STATUS_FAIL');
      case '02':
        return i18nIns.t('BUSINESS_MANAGEMENT.ACC_STATUS_SUS');
      case '03':
        return i18nIns.t('BUSINESS_MANAGEMENT.ACC_STATUS_PRO');
      default:
        return '';
    }
  },
  /** 交易状态 */
  tradeTypeText(tradeTypeText) {
    // 状态:00:场景A;01:场景C;02:场景B;03:场景D
    switch (tradeTypeText) {
      case '01': //cehngg
        return i18nIns.t('BUSINESS_MANAGEMENT.DESC_TYPE_1');
      case '03':
        return i18nIns.t('BUSINESS_MANAGEMENT.DESC_TYPE_2');
      case '02':
        return i18nIns.t('BUSINESS_MANAGEMENT.DESC_TYPE_3');
      case '04':
        return i18nIns.t('BUSINESS_MANAGEMENT.DESC_TYPE_4');
      default:
        return '';
    }
  },
  /** 交易状态 */
  accountTypeFilter(tradeTypeText) {
    // 状态:00:场景A;01:场景C;02:场景B;03:场景D
    switch (tradeTypeText) {
      case 'SAVING': //cehngg
        return i18nIns.t('CUSTOMER_MANAGEMENT.SAVING_ACCOUNT');
      case 'MULTICURRENCY': //cehngg
        return i18nIns.t('CUSTOMER_MANAGEMENT.MULTICURRENCY_ACCOUNT');
      case 'CURRENT': //cehngg
        return i18nIns.t('CUSTOMER_MANAGEMENT.CURRENT_ACCOUNT');
      case 'FIXED': //cehngg
        return i18nIns.t('CUSTOMER_MANAGEMENT.FIXED_ACCOUNT');
      case 'LOAN':
        return i18nIns.t('CUSTOMER_MANAGEMENT.LOAN_ACCOUNT');
      case 'SECURITIES':
        return i18nIns.t('CUSTOMER_MANAGEMENT.SECURITIES_ACCOUNT');
      case 'INVESTMENT':
        return i18nIns.t('CUSTOMER_MANAGEMENT.INVESTMENT_ACCOUNT');
      default:
        return '';
    }
  },
  /** 账单号码 */
  merchartCodeLabel(merchartCode) {
    return i18nIns.t('CUSTOMER_MANAGEMENT.BILL_NO') + (merchartCode || Math.random() * 100);
  },
  /** format-t-time */
  fomtmatTtime(timeStr = 'YYYY-MM-DDThh:mm:ss') {
    return timeStr.split('T').join(' ');
  }
}