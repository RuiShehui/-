import i18n from '@/i18n';
const CONSTANTS = {
  uploadType: function () {
    return [
      {
        value: 0,
        label: i18n.t('DRAFT_TRANSACTION.MANUAL_INPUT')
      },
      {
        value: 1,
        label: i18n.t('DRAFT_TRANSACTION.FILE_UPLOAD')
      }
    ]
  },
  uploadMethod: {
    0: i18n.t('DRAFT_TRANSACTION.MANUAL_INPUT'),
    1: i18n.t('DRAFT_TRANSACTION.FILE_UPLOAD'),
  },
  filterTransType: function () {
    return [
      {
        value: 1,
        label: i18n.t('OPERATORLOG.TRANSFER_WITHIN_THE_BANK')
      },
      {
        value: 2,
        label: i18n.t('OPERATORLOG.FASTER_PAYMENT_SYSTEM')
      },
      {
        value: 3,
        label: i18n.t('OPERATORLOG.FOREIGN_CURRENCY_TRANSFER')
      },
      {
        value: 4,
        label: i18n.t('OPERATORLOG.TELEGRAPHIC_TRANSFER')
      },
      {
        value: 5,
        label: i18n.t('OPERATORLOG.BULK_TRANSFER')
      },
      {
        value: 6,
        label: i18n.t('OPERATORLOG.BULK_PAYROLL')
      },
      {
        value: 7,
        label: i18n.t('OPERATORLOG.AUTOPAY_IN_SERVICE')
      }
    ]
  },
  transactionType: {
    1: i18n.t('OPERATORLOG.TRANSFER_WITHIN_THE_BANK'),
    2: i18n.t('OPERATORLOG.FASTER_PAYMENT_SYSTEM'),
    3: i18n.t('OPERATORLOG.FOREIGN_CURRENCY_TRANSFER'),
    4: i18n.t('OPERATORLOG.TELEGRAPHIC_TRANSFER'),
    5: i18n.t('OPERATORLOG.BULK_TRANSFER'),
    6: i18n.t('OPERATORLOG.BULK_PAYROLL'),
    7: i18n.t('OPERATORLOG.AUTOPAY_IN_SERVICE')
  },
  modeType: {
    0: i18n.t('AUTHORIZE.AUTH_MONEYMODEN'),
    1: i18n.t('AUTHORIZE.AUTH_MONEYMODEY'),
  },
  dateList: function () {
    return [
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

    ]
  },
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
  SELECT_DATE_CUR: [
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
    }
  ],
  SELECT_DATE_LISTS: [
    {
      value: '1D',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.ONE_DAY')
    },
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
    },
    {
      value: '36M',
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.THIRD_SIX')
    }
  ],
  CONTACT_TYPE_LIST: [
    {
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
  processType: function () {
    return [
      {
        value: '',
        label: ''
      },
      {
        value: '1',
        label: i18n.t('PAYMENT.MY_ACCOUNT')
      },
      {
        value: "2",
        label: i18n.t('PAYMENT.REGISTERED_ACCOUNT')
      },
      {
        value: "3",
        label: i18n.t('PAYMENT.NO_REGISTERED_ACCOUNT')
      }
    ]
  },
  getAccountType: function () {
    return [
      {
        value: '',
        label: i18n.t('RIGHTS_TEMPLATE.ALL')
      },
      {
        value: 'SAVING',
        label: i18n.t('USER_MANAGEMENT.SAVINGS_ACCOUNT')
      },
      {
        value: 'MULTICURRENCY',
        label: i18n.t('USER_MANAGEMENT.CURRENCY_SAVINGS_ACCOUNTS')
      },
      {
        value: 'CURRENT',
        label: i18n.t('USER_MANAGEMENT.CURRENT_ACCOUNT')
      },
      {
        value: 'FIXED',
        label: i18n.t('USER_MANAGEMENT.FIXED')
      },
      {
        value: 'LOAN',
        label: i18n.t('USER_MANAGEMENT.LOAN_ACCOUNT')
      },
      {
        value: 'SECURITIES',
        label: i18n.t('USER_MANAGEMENT.LOAN_ACCOUNT')
      },
      {
        value: 'INVESTMENT',
        label: i18n.t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
      }
    ]
  },
  ACCOUNT_TYPE_LIST: [
    {
      value: '',
      label: i18n.t('RIGHTS_TEMPLATE.ALL')
    },
    {
      value: 'SAVING',
      label: i18n.t('USER_MANAGEMENT.SAVINGS_ACCOUNT')
    },
    {
      value: 'MULTICURRENCY',
      label: i18n.t('USER_MANAGEMENT.CURRENCY_SAVINGS_ACCOUNTS')
    },
    {
      value: 'CURRENT',
      label: i18n.t('USER_MANAGEMENT.CURRENT_ACCOUNT')
    },
    {
      value: 'FIXED',
      label: i18n.t('USER_MANAGEMENT.FIXED')
    },
    {
      value: 'LOAN',
      label: i18n.t('USER_MANAGEMENT.LOAN_ACCOUNT')
    },
    {
      value: 'SECURITIES',
      label: i18n.t('USER_MANAGEMENT.LOAN_ACCOUNT')
    },
    {
      value: 'INVESTMENT',
      label: i18n.t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
    }
  ],

  ACCOUNT_TYPE_ARRAY: [
    'CNY', 'AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'HKD', 'JPY', 'NZD', 'USD'
  ],
  ACCOUNT_TYPE: function () {
    return [
      { value: 'NORMAL' },
      { value: 'DORMANT' },
      { value: 'FROZEN' },
      { value: 'ACTIVE' },
      { value: 'CLOSED' },
      { value: 'STATUS_CLOSE' },
      { value: 'O' },
      { value: 'C' },
      { value: 'F' },
      { value: 'OPEN' },
      { value: 'CLOSE' },
    ]
  },

  getMaturity: function () {
    return [
      // 1-本息自动续存，2-本金自动续存，利息转入指定账户，3-本息转入指定账户
      {
        value: 1,
        label: i18n.t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL')
      },
      {
        value: 2,
        label: i18n.t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS')
      },
      {
        value: 3,
        label: i18n.t('FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL')
      },
      {
        value: 6,
        label: 'To Be Confirmed At Maturity'
      }
    ]
  },
  MATURITY_TRUCIONS: [
    // 1-本息自动续存，2-本金自动续存，利息转入指定账户，3-本息转入指定账户
    {
      value: 1,
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL')
      // label:'FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPAL'
    },
    {
      value: 2,
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS')
      // label:'FIXED_DEPOSIT_OVERVIEW.RENEW_PRINCIPALS'
    },
    {
      value: 3,
      label: i18n.t('FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL')
      // label:'FIXED_DEPOSIT_OVERVIEW.TRANSFER_PRINCIPAL'
    },
    {
      value: 6,
      label: 'To Be Confirmed At Maturity'
    }
  ],
  userType: function () {
    return [{
      label: i18n.t('FIRST_LOGIN.BIRTH_CER'),
      value: 0
    },
    {
      label: i18n.t('FIRST_LOGIN.DRIVING_LICENSE'),
      value: 1
    },
    {
      label: i18n.t('FIRST_LOGIN.EXPORT_LICENSE'),
      value: 2
    },
    {
      label: i18n.t('FIRST_LOGIN.HKID'),
      value: 3
    },
    {
      label: i18n.t('FIRST_LOGIN.OHER_HKID'),
      value: 4
    },
    {
      label: i18n.t('FIRST_LOGIN.MAINLAND_PREMIT'),
      value: 5
    },
    {
      label: i18n.t('FIRST_LOGIN.MAINLAND_SILDIER'),
      value: 6
    },
    {
      label: i18n.t('FIRST_LOGIN.RESIDENT_PERMIT'),
      value: 7
    },
    {
      label: i18n.t('FIRST_LOGIN.OHER'),
      value: 8
    },
    {
      label: i18n.t('FIRST_LOGIN.PASSWORD'),
      value: 9
    },
    {
      label: i18n.t('FIRST_LOGIN.IDENTIY_CARD'),
      value: 10
    },
    {
      label: i18n.t('FIRST_LOGIN.IDENTIY_CARD'),
      value: 11
    }
    ]
  },
  BATCH_TRANS_TYPE: [
    {
      label: 'TRANSFR_INFO.ALL',
      value: ''
    },
    {
      label: 'TRANSFR_INFO.SUCCESS_TEXT',
      value: '90'
    },
    {
      label: 'TRANSFR_INFO.HALF_SUCCESS',
      value: '95'
    },
    {
      label: 'TRANSFR_INFO.FAILED',
      value: '91'
    },
    {
      label: 'TRANSFR_INFO.AUTHORISATION_REJECTED',
      value: '11'
    },
    {
      label: 'TRANSFR_INFO.BANKCANCLE',
      value: '50'
    },
    {
      label: 'TRANSFR_INFO.WAIT',
      value: '20'
    },
    {
      label: 'TRANSFR_INFO.BANK_REJECTED',
      value: '04'
    }
  ]
};

export default CONSTANTS;