/*
 * @Autor: 朱涛
 * @Date: 2021-11-04 11:31:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-24 11:42:22
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\constant.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
import i18nIns from "@/i18n/instance";

const CONSTANTS = {
  //状态
  ENABLE: {
    0: i18nIns.t('COMMON.STOP_USING'),
    1: i18nIns.t('COMMON.USING')
  },

  RISK_LEVEL_LIST: [{
      label: 'LC',
      value: '0'
    },
    {
      label: 'LD',
      value: '1'
    },
    {
      label: 'HC',
      value: '2'
    }, {
      label: 'HD',
      value: '3'
    },
  ],
  //机构级别
  GROUPCLAZZ: {
    0: i18nIns.t('GROUP_MANAGEMENT.TOTAL_BANK'),
    1: i18nIns.t('GROUP_MANAGEMENT.CHILD_BANK'),
    2: i18nIns.t('GROUP_MANAGEMENT.DEPART')
  },
  //菜单级别
  MENULEVEL: {
    1: i18nIns.t("LEVEL_1"),
    2: i18nIns.t("LEVEL_2"),
    3: i18nIns.t("LEVEL_3"),
    4: i18nIns.t("LEVEL_4"),
    5: i18nIns.t("LEVEL_5"),
  },

  /** 业务类型数组 */
  BIZ_CODE_TYPE_LIST: [{
      value: '',
      label: i18nIns.t('COMMON.TOTAL')
    },
    /** 机构管理 */
    {
      value: '93235214',
      label: i18nIns.t('MENU_PAGE_ITEMS.GOVERMENT_MANAGEMENT')
    },
    // {
    //   value: '62458806',
    //   label: '菜单管理'
    // },
    /** 角色管理 */
    {
      value: '47407764',
      label: i18nIns.t('MENU_PAGE_ITEMS.ROLE_MANAGEMENT')
    },
    /** 用户管理 */
    {
      value: '33039760',
      label: i18nIns.t('MENU_PAGE_ITEMS.USER_MANAGEMENT')
    },
    /** 银行收费折扣 */
    {
      value: '67179386',
      label: i18nIns.t('MENU_PAGE_ITEMS.BANK_DISCOUNT')
    },
    /** 业务启停控制 */
    {
      value: '93752504',
      label: i18nIns.t('MENU_PAGE_ITEMS.BUSINESS_START')
    },
    /** 银行限额 */
    {
      value: '01349243',
      label: i18nIns.t('MENU_PAGE_ITEMS.BANK_QUOTA')
    },
    /** 業務管理 */
    {
      value: '62658864',
      label: '業務管理'
    },
    /** 客戶特殊限額管理 */
    {
      value: '97786696',
      label: '客戶特殊限額管理'
    },
    /** eps商家维护 */
    {
      value: '91442342',
      label: i18nIns.t('MENU_PAGE_ITEMS.EPS_MAINTAIN')
    },
    /** 客户维护 EPS商家维护*/
    {
      value: '45712611',
      label: i18nIns.t('MENU_PAGE_ITEMS.MERCHANTS_MAINTAIN')
    },
    /** 银行公告管理 */
    {
      value: '97783376',
      label: i18nIns.t('MENU_PAGE_ITEMS.ANNOUNCEMENT_MANAGE')
    },
    /** 批量交易异常处理 */
    {
      value: '79856235',
      label: i18nIns.t('MENU_PAGE_ITEMS.EXCEPTION')
    },
    /** 客户开户 */
    {
      value: '59427059',
      label: i18nIns.t('MENU_PAGE_ITEMS.CUSTOMER_ACCOUNT_OPEN')
    },
    /** 客户销户 */
    {
      value: '21521695',
      label: i18nIns.t('MENU_PAGE_ITEMS.CUSTOMER_ACCOUNT_DELETE')
    },
    /** 客户信息维护 */
    {
      value: '35877474',
      label: i18nIns.t('MENU_PAGE_ITEMS.CUSTOMER_QUERY_MAINTAIN')
    },
    /** 用户维护 */
    {
      value: '04419371',
      label: i18nIns.t('MENU_PAGE_ITEMS.USER_MAINTAIN')
    },
    /** 密码信封打印 */
    {
      value: '49631187',
      label: i18nIns.t('MENU_PAGE_ITEMS.CUSTOMER_ENVELOPE_PRINT')
    },
    /** 欢迎信封打印 */
    {
      value: '96687785',
      label: i18nIns.t('MENU_PAGE_ITEMS.CUSTOMER_WELCOME_PRINT')
    },
    {
      value: '97796701',
      label:'重設密碼重試次數'
    },
    {
      value:'97796722',
      label:'特殊指令申請'
    },
    /** 欢迎信封打印 */
    {
      value: '97776608',
      label: '流動保安認證服務'
    },
    /** 授权模板维护 */
    {
      value: '30945897',
      label: i18nIns.t('MENU_PAGE_ITEMS.AUTH_TEMPLATE_MAINTAIN')
    },
    /** 交易授权设置 */
    {
      value: '10009914',
      label: i18nIns.t('MENU_PAGE_ITEMS.TRS_AU_SETTINGS')
    },
    /** 账单维护 */
    {
      value: '55366532',
      label: i18nIns.t('MENU_PAGE_ITEMS.BILL_MAINTAIN')
    },
    /** 登记第三者账户 */
    {
      value: '93274600',
      label: i18nIns.t('MENU_PAGE_ITEMS.REGISTER_THIRD')
    },
    /** 定期存款预约编号信息生成 */
    {
      value: '59638701',
      label: i18nIns.t('MENU_PAGE_ITEMS.DESPOSTI_RESERVATION')
    },
  ],
  /** 商户维护类型数组 */
  MERCHART_TYPE_CODE_LIST: [],
  /*幣種*/
  CONTACT_CURRENCY: [{
      value: 'HKD',
      label: '港幣'
    },
    {
      value: 'USD',
      label: '美元'
    },
    {
      value: 'CNY',
      label: '人民幣'
    },
    {
      value: 'AUD',
      label: '澳元'
    },
    {
      value: 'CAD',
      label: '加元'
    },
    {
      value: 'CHF',
      label: '瑞士法郎'
    },
    {
      value: 'EUR',
      label: '歐元'
    },
    {
      value: 'GBP',
      label: '英鎊'
    },
    {
      value: 'JPY',
      label: '日元'
    },
    {
      value: 'NZD',
      label: '新西蘭幣'
    }
  ],
  /** 固定存款期列表 */
  CONTACT_TYPE_LIST: [{
      value: 'HKD',
      label: 'HKD'
    },
    {
      value: 'USD',
      label: 'USD'
    },
    {
      value: 'CNY',
      label: 'CNY'
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
      value: 'EUR',
      label: 'EUR'
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
  ],
  /** 固定存款期选择列表 */
  SELECT_DATE_LIST: [{
      value: '7D',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.ONE_WEEK')
    },
    {
      value: '14D',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.TWO_WEEK')
    },
    {
      value: '1M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.ONE_MONTH')
    },
    {
      value: '2M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.TWO_MONTH')
    },
    {
      value: '3M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.THREE_MONTH')
    },
    {
      value: '6M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.SIX_MONTH')
    },
    {
      value: '9M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.NINE_MONTH')
    },
    {
      value: '12M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.TWELVE_MONTH')
    },
    {
      value: '24M',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.TWIENTY_FOUR_MONTH')
    }
  ],

  //授权状态数组
  AUTHSTATUS: {
    WAIT_AUTH: i18nIns.t('AUTHORIZATION_CENTER.WAIT_AUTH'),
    CONSENT: i18nIns.t('AUTHORIZATION_CENTER.ADOPT'),
    REJECT: i18nIns.t('AUTHORIZATION_CENTER.REFUSE'),
    REVOCATION: i18nIns.t('AUTHORIZATION_CENTER.REVOKE'),
    OVERDUE: i18nIns.t('AUTHORIZATION_CENTER.OVERDUE'),
  },
  // 收款人识别方式列表
  PAYEE_IDENTIFY_METHOD_LIST: [{
      label: i18nIns.t('COMMON.TOTAL'),
      value: '',
    },
    {
      label: i18nIns.t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT'),
      value: 'BBAN'
    },
    {
      label: 'FPS ID',
      value: 'SVID'
    },
    {
      label: i18nIns.t('CUSTOMER_MANAGEMENT.PHONE_NO'),
      value: 'MOBN'
    },
    {
      label: i18nIns.t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS'),
      value: 'EMAL'
    },

  ],
  // 路由跳转匹配
  ROUTER_MATCH: {
    CustomerQueryOpen: 'CustomerAccountOpen',
    CustomerQueryDel: 'CustomerAccountDel',
    CustomerQueryCusMain: 'CustomerInfoMaintain',
    CustomerQueryUserMain: 'UserMaintain',
    CustomerQueryCusView: 'CustomerInfoView',
    CustomerQueryTemMain: 'AuthTemplateMaintain',
    CustomerQueryCusPrint: 'CustomerEnvelopePrint',
    CustomerQuerySerGen: 'DespostiReservation',
    CustomerQueryBillMain: 'BillMainrenace',
    CustomerQueryThird: 'RegisterThird',
    CustomerQueryTrsSet: 'TrsAuSettings'
  },
  /** 折扣方式列表 */
  discountMethodList: [{
      value: '0',
      label: i18nIns.t('BUSINESS_MANAGEMENT.PERCENT')
    },
    {
      value: '1',
      label: i18nIns.t('BUSINESS_MANAGEMENT.FIXED_AMOUNT')
    }
  ],
  /** 折扣渠道列表 */
  discountChannelList: [{
      value: '0',
      label: i18nIns.t('COMMON.ENT_BANK')
    },
    {
      value: '1',
      label: i18nIns.t('COMMON.ENTERPRISES_BANK')
    }
  ],
  // 折扣方式选择列表
  discountWayList: [
    // {
    //   value: '0',
    //   label: i18nIns.t('BUSINESS_MANAGEMENT.FUND')
    // },
    {
      value: '1',
      label: i18nIns.t('BUSINESS_MANAGEMENT.TT_PAY')
    },
    {
      value: '2',
      label: i18nIns.t('BUSINESS_MANAGEMENT.CHATS_PAY')
    },
    {
      value: '3',
      label: i18nIns.t('BUSINESS_MANAGEMENT.MULTI_TRANSFER')
    },
    {
      value: '4',
      label: i18nIns.t('BUSINESS_MANAGEMENT.MULTI_SALARY')
    },
    {
      value: '5',
      label: i18nIns.t('BUSINESS_MANAGEMENT.MULTI_RECEIVE')
    },
    // {
    //   value: '',
    //   label: i18nIns.t('COMMON.TOTAL')
    // },
  ],
  //操作日志-操作角色选择列表
  OPERATE_ROLE_LIST: [{
      value: '',
      label: i18nIns.t('COMMON.TOTAL')
    },
    {
      value: '1',
      label: i18nIns.t('header.SynstemAdministrator')
    },
    {
      value: '2',
      label: i18nIns.t('header.BusinessManageWriteAdministrator')
    },
    {
      value: '3',
      label: i18nIns.t('header.BusinessManageAuthAdministrator')
    },
    {
      value: '4',
      label: i18nIns.t('header.CustomerManageWriteAdministrator')
    },
    {
      value: '5',
      label: i18nIns.t('header.CustomerManageAuthAdministrator')
    },
    {
      value: '6',
      label: i18nIns.t('header.CustomerRateWriteAdministrator')
    },
    {
      value: '7',
      label: i18nIns.t('header.CustomerRateAuthAdministrator')
    },
    {
      value: '8',
      label: i18nIns.t('header.CustomerInfoQueryer')
    },
    {
      value: '9',
      label: i18nIns.t('header.TableInfoQueryer')
    }
  ],
  // 操作日志-系统模块选择列表
  OPERATION_TYPE_LIST: [{
      value: '',
      label: i18nIns.t('COMMON.TOTAL')
    },
    {
      value: '0',
      label: i18nIns.t('COMMON.ADD')
    },
    {
      value: '1',
      label: i18nIns.t('COMMON.DELETE')
    },
    {
      value: '2',
      label: i18nIns.t('COMMON.UPDATE')
    },
    {
      value: '3',
      label: i18nIns.t('COMMON.SEARCH')
    },
    {
      value: '4',
      label: i18nIns.t('AUTHORIZATION_CENTER.ADOPT')
    },
    {
      value: '5',
      label: i18nIns.t('AUTHORIZATION_CENTER.REVOKE')
    },
    {
      value: '6',
      label: i18nIns.t('AUTHORIZATION_CENTER.REFUSE')
    },
    {
      value: '7',
      label: i18nIns.t('LOGIN.LOGIN')
    },
    {
      value: '8',
      label: i18nIns.t('LOGIN.LOGOUT')
    },
    {
      value: '9',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.AUTH')
    },
    {
      value: '10',
      label: i18nIns.t('AUTHORIZATION_CENTER.OPEN_ACCOUNT')
    },
    {
      value: '11',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT')
    },
    {
      value: '12',
      label: i18nIns.t('COMMON.RESET_PASSWORD')
    },
    {
      value: '13',
      label: i18nIns.t('STATEMENT_QUERY.DOWN_LOAD')
    },
    {
      value: '14',
      label: i18nIns.t('OP_LOGS.STOP_USER')
    },
    {
      value: '15',
      label: i18nIns.t('OP_LOGS.REGIST_USER')
    },
    {
      value: '16',
      label: i18nIns.t('OP_LOGS.RE_REGIST_USER')
    },
    {
      value: '17',
      label: i18nIns.t('OP_LOGS.PRINT_PSD_EMAIL')
    }
  ],
  /** announcementStatusList */
  ANNOUNCEMENT_STATUS_LIST: [{
      label: i18nIns.t('COMMON.TOTAL'),
      value: 0
    },
    {
      label: i18nIns.t('BUSINESS_MANAGEMENT.WAIT_EFFECTIVE'),
      value: '0'
    },
    {
      label: i18nIns.t('BUSINESS_MANAGEMENT.EFFECTIVED'),
      value: '1'
    },
    {
      label: i18nIns.t('BUSINESS_MANAGEMENT.INVALID'),
      value: '2'
    }
  ],
  /** 系统模块数组 */
  SYSTEM_MODULES_LIST: [{
      value: '',
      label: i18nIns.t('COMMON.TOTAL'),
    },
    {
      value: '0',
      label: i18nIns.t('MENU_PAGE_ITEMS.CUSTOMER_MANAGEMENT')
    },
    {
      value: '1',
      label: i18nIns.t('MENU_PAGE_ITEMS.SYSTEM_MANAGEMENT')
    },
    {
      value: '2',
      label: i18nIns.t('MENU_PAGE_ITEMS.BUSINESS_MANAGEMENT')
    },
    {
      value: '3',
      label: i18nIns.t('MENU_PAGE_ITEMS.AUTH_CENTER')
    },
    {
      value: '4',
      label: i18nIns.t('MENU_PAGE_ITEMS.STATISCAL_QUERY')
    },
    {
      value:'7',
      label: '特殊指令遞交申請'
    },
    {
      value: '5',
      label: i18nIns.t('LOGIN.LOGIN')
    },
    {
      value: '6',
      label: i18nIns.t('LOGIN.LOGOUT')
    }
  ],
  /** 操作成功/失败列表 */
  OPERATTION_STATUS_LIST: [{
      value: '',
      label: i18nIns.t('COMMON.TOTAL'),
    },
    {
      value: '0',
      label: `${i18nIns.t('COMMON.SUCCESS')}${i18nIns.t('COMMON.OPERATION')}`
    },
    {
      value: '1',
      label: `${i18nIns.t('COMMON.FAIL')}${i18nIns.t('COMMON.OPERATION')}`
    },
  ],
  /** 授权状态列表 */
  BIZ_STATUS_LIST: [{
      value: null,
      label: i18nIns.t('COMMON.TOTAL')
    },
    {
      value: 'WAIT_AUTH',
      label: i18nIns.t('AUTHORIZATION_CENTER.WAIT_AUTH')
    },
    {
      value: 'CONSENT',
      label: i18nIns.t('AUTHORIZATION_CENTER.ADOPT')
    },
    {
      value: 'REJECT',
      label: i18nIns.t('AUTHORIZATION_CENTER.REFUSE')
    },
    {
      value: 'REVOCATION',
      label: i18nIns.t('AUTHORIZATION_CENTER.REVOKE')
    },
    {
      value: 'OVERDUE',
      label: i18nIns.t('AUTHORIZATION_CENTER.OVERDUE')
    }
  ],
  /** 密码信封打印状态列表 */
  PPS_STATUS_LIST: [{
      value: '',
      label: i18nIns.t('COMMON.TOTAL')
    },
    {
      value: '0',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.PRINT_PASS_NOTPRINTED')
    },
    {
      value: '1',
      label: i18nIns.t('CUSTOMER_MANAGEMENT.PRINT_PASS_PRINTED')
    }
  ],
  /** 账户类型 */
  accountTypes: {
    SAVING: i18nIns.t('CUSTOMER_MANAGEMENT.SAVING_ACCOUNT'),
    MULTICURRENCY: i18nIns.t('CUSTOMER_MANAGEMENT.MULTICURRENCY_ACCOUNT'),
    CURRENT: i18nIns.t('CUSTOMER_MANAGEMENT.CURRENT_ACCOUNT'),
    FIXED: i18nIns.t('CUSTOMER_MANAGEMENT.FIXED_ACCOUNT'),
    LOAN: i18nIns.t('CUSTOMER_MANAGEMENT.LOAN_ACCOUNT'),
    SECURITIES: i18nIns.t('CUSTOMER_MANAGEMENT.SECURITIES_ACCOUNT'),
    INVESTMENT: i18nIns.t('CUSTOMER_MANAGEMENT.INVESTMENT_ACCOUNT'),
  },

  //客户经理团队

  ACCOUNT_MANAGER_TEAM_LIST: [{
      accountManagerTeam: '全部',
      value: ''
    },
    {
      accountManagerTeam: 'JCC1',
      value: 'JCC1'
    },
    {
      accountManagerTeam: 'JCC2',
      value: 'JCC2'
    },
    {
      accountManagerTeam: 'BHC1U',
      value: 'BHC1U'
    },
    {
      accountManagerTeam: 'BHC1W',
      value: 'BHC1W'
    }, {
      accountManagerTeam: 'BHC1X',
      value: 'BHC1X'
    }, {
      accountManagerTeam: 'BHC1X',
      value: 'BHC1X'
    },
    {
      accountManagerTeam: 'BHC1Y',
      value: 'BHC1Y'
    }, {
      accountManagerTeam: 'BFC2E',
      value: 'BFC2E'
    }, {
      accountManagerTeam: 'BHC2F',
      value: 'BHC2F'
    }, {
      accountManagerTeam: 'BHC2G',
      value: 'BHC2G'
    }, {
      accountManagerTeam: 'BHC2P',
      value: 'BHC2P'
    }, {
      accountManagerTeam: 'BHC2R',
      value: 'BHC2R'
    }, {
      accountManagerTeam: 'BHC2S',
      value: 'BHC2S'
    },
    {
      accountManagerTeam: 'BHC2Z',
      value: 'BHC2Z'
    }, {
      accountManagerTeam: 'BHC3H',
      value: 'BHC3H'
    }, {
      accountManagerTeam: 'BHC3I',
      value: 'BHC3I'
    }, {
      accountManagerTeam: 'BHC3J',
      value: 'BHC3J'
    }, {
      accountManagerTeam: 'BHC3K',
      value: 'BHC3K'
    }, {
      accountManagerTeam: 'BHC4A',
      value: 'BHC4A'
    }, {
      accountManagerTeam: 'BHC4B',
      value: 'BHC4B'
    }, {
      accountManagerTeam: 'BHC4C',
      value: 'BHC4C'
    }, {
      accountManagerTeam: 'BHC4D',
      value: 'BHC4D'
    }, {
      accountManagerTeam: 'BHC4L',
      value: 'BHC4L'
    }, {
      accountManagerTeam: 'BHC4M',
      value: 'BHC4M'
    }, {
      accountManagerTeam: 'BHC4N',
      value: 'BHC4N'
    }, {
      accountManagerTeam: 'KSBD',
      value: 'KSBD'
    }, {
      accountManagerTeam: 'KFID',
      value: 'KFID'
    },
    {
      accountManagerTeam: 'ZBAM1',
      value: 'ZBAM1'
    },
    {
      accountManagerTeam: 'ZBAM2',
      value: 'ZBAM2'
    },
    {
      accountManagerTeam: 'ZBAM3',
      value: 'ZBAM3'
    }
  ],
  /** 推荐人类型 */
  REFFERRER_TYPE_LIST: [{
      label: i18nIns.t('RAO_CHECK.BANK_STAFF'),
      value: 'IBE'
    },
    {
      label: i18nIns.t('RAO_CHECK.PERSONAL_CUSTOMER'),
      value: 'IC'
    },
    {
      label: i18nIns.t('RAO_CHECK.INSTITUTION'),
      value: 'BC'
    },
  ],
  /** 邀请码使用状态 */
  REFERRAL_CODE_STATUS_LIST: [{
      label: i18nIns.t('RAO_CHECK.USING'),
      value: '1'
    },
    {
      label: i18nIns.t('RAO_CHECK.STOP_USING'),
      value: '0'
    },
  ],
  /** 审核状态列表 */
  CHECK_STATUS_LIST: [{
      label: 'Draft',
      value: 'Draft'
    },
    {
      label: 'Submitted',
      value: 'Submitted'
    },
    {
      label: 'In progress',
      value: 'In progress'
    },
    {
      label: 'Confirm completed',
      value: 'Confirm completed'
    },
    {
      label: 'Pending for info maker',
      value: 'Pending for info maker'
    },
    {
      label: 'Pending for info checker',
      value: 'Pending for info checker'
    },
    {
      label: 'Pending for PCSD',
      value: 'Pending for PCSD'
    },
    {
      label: 'Approved',
      value: 'Approved'
    },
    {
      label: 'Rejected',
      value: 'Rejected'
    },
    {
      label: 'Completed',
      value: 'Completed'
    },
    {
      label: 'System failure',
      value: 'System failure'
    },
  ],
  /** 证件类型 */
  CARD_TYPE_LIST: [{
      label: i18nIns.t('RAO_CHECK.PER_HK_ID_CARD'),
      value: 'HKPID'
    },
    {
      label: i18nIns.t('RAO_CHECK.NO_PER_HK_ID_CARD'),
      value: 'HKID'
    },
    {
      label: i18nIns.t('RAO_CHECK.MCN_ID_CARD'),
      value: 'PRCID'
    },
  ],
  /** 性别 */
  GENDER: {
    MALE: i18nIns.t('RAO_CHECK.MALE'),
    FEMALE: i18nIns.t('RAO_CHECK.FEMALE'),
  },
  /** 国籍 */
  NATIONAL_LIST: [{
      label: i18nIns.t('RAO_CHECK.CN_HK'),
      value: 'HK'
    },
    {
      label: i18nIns.t('RAO_CHECK.CN_CN'),
      value: 'CN'
    },
    // {
    //   label: i18nIns.t('RAO_CHECK.OTHERS'),
    //   value: 'OTHER'
    // }
  ],
  /** 资金来源列表 */
  CAPLTAL_SOURCE_LIST: [{
      label: i18nIns.t('RAO_CHECK.SAVINGS'),
      value: 'A'
    },
    {
      label: i18nIns.t('RAO_CHECK.SALARY'),
      value: 'B'
    },
    {
      label: i18nIns.t('RAO_CHECK.RETURN_ON_INVESTMENT'),
      value: 'D'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'F'
    }
  ],
  /** 主要交易类别 */
  TRADE_TYPE_LIST: [{
      label: i18nIns.t('RAO_CHECK.CASH'),
      value: 'D'
    },
    {
      label: i18nIns.t('RAO_CHECK.CHEQUE'),
      value: 'C'
    },
    {
      label: i18nIns.t('RAO_CHECK.REMITTANCE'),
      value: 'A'
    },
    {
      label: i18nIns.t('RAO_CHECK.CHATS'),
      value: 'B'
    },
    {
      label: i18nIns.t('RAO_CHECK.PAYMENT'),
      value: 'E'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'F'
    }
  ],
  /** 开户目的列表 */
  ACCT_OPEN_PUR_LIST: [{
      label: i18nIns.t('RAO_CHECK.SAVINGS'),
      value: 'A'
    },
    {
      label: i18nIns.t('RAO_CHECK.PAYROLL_ACCOUNT'),
      value: 'B'
    },
    {
      label: i18nIns.t('RAO_CHECK.INVESTMENT'),
      value: 'C'
    },
    {
      label: i18nIns.t('RAO_CHECK.PAYMENT'),
      value: 'D'
    },
    {
      label: i18nIns.t('RAO_CHECK.REMITTANCE'),
      value: 'E'
    },
    {
      label: i18nIns.t('RAO_CHECK.LOAN_REPAYMENT'),
      value: 'F'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'G'
    }
  ],
  /** 在港开户目的列表 */
  PURPOSE_HK_LIST: [{
      label: i18nIns.t('RAO_CHECK.PURPOSE_HK_A'),
      value: 'A'
    },
    {
      label: i18nIns.t('RAO_CHECK.PURPOSE_HK_B'),
      value: 'B'
    },
    {
      label: i18nIns.t('RAO_CHECK.PURPOSE_HK_C'),
      value: 'C'
    },
    {
      label: i18nIns.t('RAO_CHECK.PURPOSE_HK_D'),
      value: 'D'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'E'
    }
  ],
  /** 初次和持续收入来源列表 */
  INIT_ONG_SOURCE_LIST: [{
      label: i18nIns.t('RAO_CHECK.SAVINGS'),
      value: 'A'
    },
    {
      label: i18nIns.t('RAO_CHECK.SALARY'),
      value: 'B'
    },
    {
      label: i18nIns.t('RAO_CHECK.RETURN_ON_INVESTMENT'),
      value: 'E'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'F'
    }
  ],
  /** 我不希望银行使用我的个人资料向我促销 */
  MARKET_LIST: [{
      label: i18nIns.t('RAO_CHECK.TEL'),
      value: 'TEL'
    },
    // {
    //   label: i18nIns.t('RAO_CHECK.SMS'),
    //   value: 'SMS'
    // },
    {
      label: i18nIns.t('RAO_CHECK.EMAIL'),
      value: 'EMAIL'
    },
    {
      label: i18nIns.t('RAO_CHECK.DMAIL'),
      value: 'DMAIL'
    },
    {
      label: i18nIns.t('RAO_CHECK.PTY'),
      value: 'PTY'
    }
  ],
  /** 与银行关系 */
  BANK_RELATION: {
    A: i18nIns.t('RAO_CHECK.YES_A'),
    B: i18nIns.t('RAO_CHECK.YES_B'),
    C: i18nIns.t('RAO_CHECK.NO_C'),
  },
  // 与银行职员关系
  RELATION_SHIP_OBJ: {
    '01': i18nIns.t('RAO_CHECK.01'),
    '02': i18nIns.t('RAO_CHECK.02'),
    '03': i18nIns.t('RAO_CHECK.03'),
    '04': i18nIns.t('RAO_CHECK.04'),
    '05': i18nIns.t('RAO_CHECK.05'),
    '06': i18nIns.t('RAO_CHECK.06'),
    '07': i18nIns.t('RAO_CHECK.07'),
    '08': i18nIns.t('RAO_CHECK.08'),
    '09': i18nIns.t('RAO_CHECK.09'),
    '10': i18nIns.t('RAO_CHECK.10'),
    '11': i18nIns.t('RAO_CHECK.11'),
    '12': i18nIns.t('RAO_CHECK.12'),
    '13': i18nIns.t('RAO_CHECK.13'),
    '14': i18nIns.t('RAO_CHECK.14'),
    '15': i18nIns.t('RAO_CHECK.15'),
    '16': i18nIns.t('RAO_CHECK.16'),
    '17': i18nIns.t('RAO_CHECK.17'),
    '18': i18nIns.t('RAO_CHECK.18'),
    '19': i18nIns.t('RAO_CHECK.19'),
    '20': i18nIns.t('RAO_CHECK.20'),
    '21': i18nIns.t('RAO_CHECK.21'),
    '22': i18nIns.t('RAO_CHECK.22'),
    '23': i18nIns.t('RAO_CHECK.23'),
    '24': i18nIns.t('RAO_CHECK.24'),
  },
  /** 选择银行服务的原因 */
  REASON_FOR_BANK: [{
      label: i18nIns.t('RAO_CHECK.REASON_E'),
      value: 'E'
    },
    {
      label: i18nIns.t('RAO_CHECK.REASON_A'),
      value: 'A'
    },
    {
      label: i18nIns.t('RAO_CHECK.REASON_B'),
      value: 'B'
    },
    {
      label: i18nIns.t('RAO_CHECK.REASON_C'),
      value: 'C'
    },
    {
      label: i18nIns.t('RAO_CHECK.REASON_D'),
      value: 'D'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'F'
    },
  ],
  /** 美国税务声明 */
  TAX_DECLARATION_LIST: [{
      label: i18nIns.t('RAO_CHECK.US_TAX_DECLARARION_Y'),
      value: 'Y'
    },
    {
      label: i18nIns.t('RAO_CHECK.US_TAX_DECLARARION_N'),
      value: 'N'
    }
  ],
  /** 每个月个人入息 */
  MONTHLY_INCOME_LIST: [{
      label: i18nIns.t('RAO_CHECK.NONE'),
      value: 'P0'
    },
    {
      label: i18nIns.t('RAO_CHECK.MONTHLY_INCOME_P1'),
      value: 'P1'
    },
    {
      label: i18nIns.t('RAO_CHECK.MONTHLY_INCOME_P2'),
      value: 'P2'
    },
    {
      label: i18nIns.t('RAO_CHECK.MONTHLY_INCOME_P3'),
      value: 'P3'
    },
    {
      label: i18nIns.t('RAO_CHECK.MONTHLY_INCOME_P4'),
      value: 'P4'
    },
    {
      label: i18nIns.t('RAO_CHECK.MONTHLY_INCOME_P5'),
      value: 'P5'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'OTHER'
    }
  ],
  /** 估计资产净值 */
  NET_WORTH_LIST: [{
      label: i18nIns.t('RAO_CHECK.NONE'),
      value: 'W0'
    },
    {
      label: i18nIns.t('RAO_CHECK.NET_WORTH_W1'),
      value: 'W1'
    },
    {
      label: i18nIns.t('RAO_CHECK.NET_WORTH_W2'),
      value: 'W2'
    },
    {
      label: i18nIns.t('RAO_CHECK.NET_WORTH_W3'),
      value: 'W3'
    },
    {
      label: i18nIns.t('RAO_CHECK.NET_WORTH_W4'),
      value: 'W4'
    },
    {
      label: i18nIns.t('RAO_CHECK.NET_WORTH_W5'),
      value: 'W5'
    },
    {
      label: i18nIns.t('RAO_CHECK.OTHERS'),
      value: 'OTHER'
    }
  ],
  YES_NO: {
    Y: i18nIns.t('RAO_CHECK.YES'),
    N: i18nIns.t('RAO_CHECK.NO'),
  },
  /** ipq风险等级 */
  IPQ_OBJ: {
    1: i18nIns.t('RAO_CHECK.L1'),
    2: i18nIns.t('RAO_CHECK.L2'),
    3: i18nIns.t('RAO_CHECK.L3'),
    4: i18nIns.t('RAO_CHECK.L4'),
    5: i18nIns.t('RAO_CHECK.L5'),
  },
  ACCOUNT_TYPE_LIST: [{
    value: '',
    label: '全部'
  },
  {
    value: 'SAVING',
    label: '儲蓄賬戶'
  },
  {
    value: 'MULTICURRENCY',
    label: '多幣種賬戶'
  },
  {
    value: 'CURRENT',
    label: '往來賬戶'
  },
  {
    value: 'FIXED',
    label: '定期賬戶'
  },
  {
    value: 'LOAN',
    label: '貸款賬戶'
  },
  {
    value: 'SECURITIES',
    label: '股票賬戶'
  },
  {
    value: 'INVESTMENT',
    label: '投資賬戶'
  }
  ],
  //eCaraRiskReviewList
  ECARA_RISK_REVIEW_LIST: [
    {
      label: 'L1: 5 Years',
      value: 'L1: 5 Years'
    },
    {
      label: 'L2: 2 Years',
      value: 'L2: 2 Years'
    },
    {
      label: 'L3: 1 Year',
      value: 'L3: 1 Year'
    },
    {
      label: 'L4: 1 Month',
      value: 'L4: 1 Month'
    },
    {
      label: 'L5: 6 Months',
      value: 'L5: 6 Months'
    },
  ],
  // eCaraRiskRatingList
  ECARA_RISK_RATEING_LIST: [
    {
      label: 'High',
      value: 'High'
    },
    {
      label: 'Medium',
      value: 'Medium'
    },
    {
      label: 'Low',
      value: 'Low'
    },
  ]
};
export default CONSTANTS;