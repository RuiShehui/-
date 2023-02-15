/*
 * @Author: ZhangZhen
 * @Date: 2022-02-23 16:25:30
 * @LastEditTime: 2022-07-25 10:09:44
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\utils\constant.js
 */
import i18n from '@/i18n';

/** 转账类型 */
const TRANSFER_WAYS = {
  /** 行内转账 */
  INNER: 'intraTransfer',
  /** 转数快 (FPS) */
  FAST: 'fast',
  /** 外币转账 */
  CHATS: 'localtransfer',
  /** 电汇 */
  TT: 'remittance',
}

/**
 * 选择收款银行的方式
 */
const SELECT_BANK_TYPES = {
  /** 1. previous-预设收款银行机构 */
  PRE: 'PRE',
  /** 2.default-演示银行 */
  DEF: 'DEF',
  /** 3.optionnal-自定义收款银行机构 */
  OPT: 'OPT' //
}

/** 转数快-收款人识别方式映射 (使用对象维护字符串) */
const IDENTIFY_WAY_MAP = {
  payeeAccount: 'BBAN',
  mobilePhone: 'MOBN',
  emailAddress: 'EMAL',
  fpsId: 'SVID',
  creditCard: 'AIIN'
};

/** 识别方式列表 */
const identifyWayList = [{
    label: i18n.t('PAYMENT.RECEIVE_ACCOUNT'), // 收款账户
    value: IDENTIFY_WAY_MAP.payeeAccount
  },
  {
    label: 'FPS ID', // FPS ID
    value: IDENTIFY_WAY_MAP.fpsId
  },
  {
    label: i18n.t('PAYMENT.EMAIL_ADDRESS'), // 电邮地址
    value: IDENTIFY_WAY_MAP.emailAddress
  },
  {
    label: i18n.t('PAYMENT.MOBILE_PHONE_NUMBER'), // 流动电话号码
    value: IDENTIFY_WAY_MAP.mobilePhone
  },
  {
    label: i18n.t('PAYMENT.CREDIT_CARD'), // 信用卡
    value: IDENTIFY_WAY_MAP.creditCard
  }
];

/**
 * 指定收款银行机构-选择列表
 */
const designBankList = function () {
  return [{
      value: SELECT_BANK_TYPES.PRE,
      label: i18n.t('PAYMENT.PRESET_PAYEE_BANK')
    },
    {
      value: SELECT_BANK_TYPES.DEF,
      label: i18n.t('PAYMENT.CHUANGXING_BANK')
    },
    {
      value: SELECT_BANK_TYPES.OPT,
      label: i18n.t('PAYMENT.DESIGNATED_RECEIVE_BANK')
    },
  ]
};

/**
 * import { xxx } from '@bank-transfer/utils/constant';
 */

/**
 * 已登记账户字段对应转账字段的映射
 */
const REGISTER_TRANSFER_MAP = {
  /**
   * @description 登记第三者账户字段 -> 已登记收款账户字段
   */
  payeeIdentifyMethod: 'identifyWay', // 收款人识别方式
  payeeAccount: 'creditAcct', // 收款账户
  accountNo: 'creditAcct', // 电汇-收款账户
  payeeName: 'creditAcctName', // 收款户名
  payeeBank: 'creditBankInstitution', // 收款银行机构 
  payeeBankCode: 'creditBankInstitution', // 收款银行机构 
  /**
   * 以下情况(根据收款识别方式(payeeIdentifyMethod)来判断)
   * 收款账户
   * 流动电话
   * 电邮地址
   * FPS ID
   * 信用卡
   */
  mobilePhone: 'flowNumber',
  emailAddress: 'emailAddress',
  fpsId: 'fpsId',
  payeeCountryCode: 'creditRegion',
  payeeAddress: 'creditAddress',
  countryCode: 'countryCode',
  bankName: 'creditBankName',
  bankAddress: 'creditBankAddress',

  swiftCode: 'swiftCode',
  bankCode: 'creditBankCode',
};

/** 本地跨行账户类型 */
const INTRA_ACCT_TYPES = {
  /** 转数快 */
  FAST: '03010201',
  /** 转数快 */
  CHATS: '03010202',
};

/**
 * 收款人类型
 */
const PAYEEID_TYPE = {
  /** 收款账户 */
  'BBAN': i18n.t('PAYMENT.RECEIVE_ACCOUNT'),
  /** 流动电话号码 */
  'MOBN': i18n.t('PAYMENT.MOBILE_PHONE_NUMBER'),
  /** 电邮地址 */
  'EMAL': i18n.t('PAYMENT.EMAIL_ADDRESS'),
  /** FPS ID */
  'SVID': 'FPS ID',
  /** 信用卡 */
  'AIIN': i18n.t('PAYMENT.CREDIT_CARD'),
};

/**
 * 收款识别方式
 */
const CREDIT_TYPES = {
  /** 本人名下演示账户 */
  '1': i18n.t('PAYMENT.MY_ACCOUNT'),
  /** 已登记账户 */
  '2': i18n.t('PAYMENT.REGISTERED_ACCOUNT'),
  /** 未登记账户 */
  '3': i18n.t('PAYMENT.NO_REGISTERED_ACCOUNT'),
};

/**
 * 收款人识别方式映射
 */
const CREDIT_TYPE_MAP = {
  /** 本人名下演示账户 */
  MY_ACCOUNT: '1',
  /** 已登记账户 */
  REGISTERED_ACCOUNT: '2',
  /** 未登记账户 */
  NOT_REGISTERED_ACCOUNT: '3'
};

/**
 * 货币类型列表
 */
const ccyList = [{
    value: 'HKD',
    label: 'HKD'
  },
  {
    value: 'CNY',
    label: 'CNY'
  },
  {
    value: 'EUR',
    label: 'EUR'
  },
  {
    value: 'USD',
    label: 'USD'
  },
  {
    value: 'AUD',
    label: 'AUD'
  },
  {
    value: 'CAD',
    label: 'CAD'
  },
  {
    value: 'CHF',
    label: 'CHF'
  },
  {
    value: 'GBP',
    label: 'GBP'
  },
  {
    value: 'JPY',
    label: 'JPY'
  },
  {
    value: 'NZD',
    label: 'NZD'
  }
];

/**
 * China-ttPurposeCode-list
 */
const chinaTTList = [{
    label: i18n.t('PAYMENT.GOODS_TRADE'),
    value: 'GT' // Corporate - Goods Trade
  },
  {
    label: i18n.t('PAYMENT.SERVICE_TRADE'),
    value: 'ST' // Corporate - Service Trade
  },
  {
    label: i18n.t('PAYMENT.CAPITAL_TRANSFER'),
    value: 'CT' // Corporate - Capital Transfer
  },
  {
    label: i18n.t('PAYMENT.CURRENT_ACCOUNT_TRANSCATION'),
    value: 'CAT' // Corporate - Current Account Transaction
  },
  {
    label: i18n.t('PAYMENT.CHARITY_DONATION'),
    value: 'CD' // Corporate - Charity Donation
  },
];

export {
  identifyWayList,
  designBankList,
  ccyList,
  chinaTTList,

  TRANSFER_WAYS,
  IDENTIFY_WAY_MAP,
  REGISTER_TRANSFER_MAP,
  INTRA_ACCT_TYPES,
  CREDIT_TYPES,
  PAYEEID_TYPE,
  CREDIT_TYPE_MAP,
  SELECT_BANK_TYPES,
};