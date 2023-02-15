// 下拉框枚举值
import i18n from "@/i18n/index"
const CONSTANTS = {
  //状态
  ENABLE: {
    0: i18n.t('USER_MANAGEMENT.DEACTIVATE'),
    1: i18n.t('USER_MANAGEMENT.ENABLE'),
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
  /** 固定存款期列表 */
  CONTACT_TYPE_LIST: [{
    value: '0',
    label: 'HKD'
  },
  {
    value: '1',
    label: 'USD'
  },
  {
    value: '2',
    label: 'CNY'
  },
  {
    value: '3',
    label: 'AUD'
  },
  {
    value: '4',
    label: 'CAD'
  },
  {
    value: '5',
    label: 'CHF'
  },
  {
    value: '6',
    label: 'EUR'
  },
  {
    value: '7',
    label: 'GBP'
  },
  {
    value: '8',
    label: 'JPY'
  },
  {
    value: '9',
    label: 'NZD'
  }
  ],
  /** 固定存款期选择列表 */
  SELECT_DATE_LIST: [
    {
      value: '7D',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_WEEK')
    },
    {
      value: '14D',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.TWO_WEEK')
    },
    {
      value: '1M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_MONTHS')
    },
    {
      value: "2M",
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.TWO_MONTHS')
    },
    {
      value: '3M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.THREE_MONTHS')
    },
    {
      value: '6M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.SIX_MONTHS')
    },
    {
      value: '9M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.NINE_MONTHS')
    },
    {
      value: '12M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.TWELEVE_MONTHS')
    },
    {
      value: '24M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.TWENTY_MONTHS')
    }
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
  options: [
    {
      value: '0301',
      // '付款'
      label: i18n.t('AUTHORIZE.PAY'),
      children: [
        {
          value: '030101',
          label: i18n.t('PAYMENT.INNER_TRANS')
        },
        {
          value: '03010201',
          label: i18n.t('APPOINTTRACTION.FPS_TRANSFEP')
        },
        {
          value: '03010202',
          label: i18n.t('APPOINTTRACTION.CHATS_TRANSFER')
        },
        {
          value: '030103',
          label: i18n.t('PAYMENT.REMMITANCE')
        },
        {
          value: '03010401',
          label: i18n.t('APPOINTTRACTION.BATCH_TRANSFER')
        },
        {
          value: '03010501',
          label: i18n.t('APPOINTTRACTION.BATCH_PAYDAY')
        },
        {
          value: '030107',
          label: i18n.t('AUTHORIZE.THIRED_ACCOUNT')
        }
      ]
    },
    // {
    //     value: '0302',
    //     label: i18n.t('AUTHORIZE.CUT_MOUNT'),
    //     children: [
    //         {
    //             value: '03020101',
    //             label: i18n.t('APPOINTTRACTION.BATCH_COLLECT')
    //         }
    //     ]
    // },
    {
      value: '0303',
      label: i18n.t('AUTHORIZE.APPOINT_TRANS_MANAGE')
    },
    {
      value: '10',
      label: i18n.t('AUTHORIZE.CHHECK_BOOK')
    },
    {
      value: '04',
      label: i18n.t('AUTHORIZE.FIXED_P'),
      children: [
        {
          value: '0402',
          label: i18n.t('AUTHORIZE.FIEXD')
        },
        {
          value: '0403',
          label: i18n.t('AUTHORIZE.UPDATE_DATE')
        }
      ]
    },
    {
      value: '0501',
      label: i18n.t('AUTHORIZE.FOREX'),
      children: [
        {
          value: '050102',
          label: i18n.t('AUTHORIZE.CURRCY')
        }
      ]
    },
    // {
    //     value: '0502',
    //     label: i18n.t('AUTHORIZE.FUND'),
    //     children: [
    //         {
    //             value: '050201',
    //             label: i18n.t('AUTHORIZE.FUND_BUY')
    //         },
    //         {
    //             value: '050202',
    //             label: i18n.t('AUTHORIZE.MY_FUND')
    //         }
    //     ]
    // },
    {
      value: '0601',
      label: i18n.t('AUTHORIZE.CHECK_DAN'),
      children: [
        {
          value: '060101',
          label: i18n.t('AUTHORIZE.CHECK_DAN')
        },
        {
          value: '060102',
          label: i18n.t('AUTHORIZE.MY_BILLS')
        },
        {
          value: '060103',
          label: i18n.t('AUTHORIZE.APPOINT_PAY_MANAGE')
        }
      ]
    }
  ]
};

export default CONSTANTS;