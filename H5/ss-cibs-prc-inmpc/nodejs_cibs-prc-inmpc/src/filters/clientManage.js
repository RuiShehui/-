/*
 * @Author: zhangcheng
 * @Date: 2021-11-17 14:50:02
 * @LastEditTime: 2022-09-26 09:40:01
 * @LastEditors: zhangcheng
 * @Description: 客户管理相关的过滤器
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\filters\clientManage.js
 */
import i18nIns from '@/i18n/instance';
import CONSTANTS from '@/utils/constant';
import { sliceAccount } from '@/utils/tools';

export default {
  /** 开通渠道 */
  ebankStatus(val) {
    switch (val) {
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.ENT_AND_MOBILE'); // 个人网银和手机银行
      default:
        return ''
    }
  },
  /** 个人类型 */
  entType(val) {
    switch (val) {
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.SIMPLEX_AUTH'); // 单式权限个人用户
      case '2':
        return i18nIns.t('CUSTOMER_MANAGEMENT.UNITE_AUTH'); // 联合权限个人用户
      default:
        return ''
    }
  },
  /** 管理员授权模式 */
  adminEmpower(val) {
    switch (val) {
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.NO_NEED_AUTH'); // 无需授权
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.MUTUAL_AUTH'); // 互为授权
      case '2':
        return i18nIns.t('CUSTOMER_MANAGEMENT.SIMPLE_AUTH_MODEL'); // 简易授权模式
      default:
        return ''
    }
  },
  /** 销户状态 */
  status(val) {
    switch (val) {
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT');
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.ENABLE');
      case '2':
        return i18nIns.t('CUSTOMER_MANAGEMENT.DISABLE');
      default:
        return ''
    }
  },
  modelType(val) {
    switch (val) {
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL');
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL');
      default:
        return ''
    }
  },
  tfaStatus(val) {
    switch (val) {
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.NO'); // 否
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.YES'); // 是
      default:
        return ''
    }
  },
  userStatus(val) {
    switch (val) {
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.DISABLE'); // 停用
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.ENABLE'); // 启用
      default:
        return ''
    }
  },
  userType(val) {
    switch (val) {
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.ADMAIN'); // 管理员
      case '2':
        return i18nIns.t('CUSTOMER_MANAGEMENT.AUTH_USER'); // 授权员
      case '3':
        return i18nIns.t('CUSTOMER_MANAGEMENT.INPUT_USER'); // 录入员
      default:
        return ''
    }
  },
  setStatusFilter(val){
    switch (val) {
      case '0':
        return '關';
      case '1':
        return '開';
      default:
        return val
    }
  },
  empowerGroup(val) {
    switch (val) {
      case 'A':
        return 'A';
      case 'B':
        return 'B';
      case 'C':
        return 'C';
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.NONE');
      default:
        return ''
    }
  },
  sequence(val) {
    switch (val) {
      case '1':
        return i18nIns.t('CUSTOMER_MANAGEMENT.ORDERED');
      case '0':
        return i18nIns.t('CUSTOMER_MANAGEMENT.DISORDER');
      default:
        return '';
    }
  },
  /** 账户类型过滤器 */
  filterAccount(item) {
    const { payeeAccount, payeeCcy, payeeType } = item;
    // return `${payeeAccount ? sliceAccount(payeeAccount) : ''} ${payeeCcy ? payeeCcy : ''} ${CONSTANTS.accountTypes[payeeType] ? CONSTANTS.accountTypes[payeeType] : ''}`;
    return `${payeeAccount ? sliceAccount(payeeAccount) : ''} ${CONSTANTS.accountTypes[payeeType] ? CONSTANTS.accountTypes[payeeType] : ''}`;
  }
};