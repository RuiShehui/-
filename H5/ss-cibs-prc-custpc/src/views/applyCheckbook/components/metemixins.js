import i18n from "@/i18n";
export default {
  data() {
    return {
      countryInfoList: []
    };
  },
  created() {

  },
  methods: {
    ccyFilter(val) {
        switch (val) {
          case 'HKD':
            return this.$t('ACCOUNT_MANAGEMENT.HKD');
          case 'AUD':
            return this.$t('ACCOUNT_MANAGEMENT.AUD');
          case 'CAD':
            return this.$t('ACCOUNT_MANAGEMENT.CAD');
          case 'CNY':
            return this.$t('ACCOUNT_MANAGEMENT.CNY');
          case 'EUR':
            return this.$t('ACCOUNT_MANAGEMENT.EUR');
          case 'GBP':
            return this.$t('ACCOUNT_MANAGEMENT.GBP');
          case 'JPY':
            return this.$t('ACCOUNT_MANAGEMENT.JPY');
          case 'NZD':
            return this.$t('ACCOUNT_MANAGEMENT.NZD');
          case 'SGD':
            return this.$t('ACCOUNT_MANAGEMENT.SGD');
          case 'TWD':
            return this.$t('ACCOUNT_MANAGEMENT.TWD');
          case 'USD':
            return this.$t('ACCOUNT_MANAGEMENT.USD');
          case 'CHF':
            return this.$t('ACCOUNT_MANAGEMENT.CHF');
          case 'CNH':
            return this.$t('ACCOUNT_MANAGEMENT.CNH');
          case 'DKK':
            return this.$t('ACCOUNT_MANAGEMENT.DKK');
          case 'SEK':
            return this.$t('ACCOUNT_MANAGEMENT.SEK');
          case 'THB':
            return this.$t('ACCOUNT_MANAGEMENT.THB');
          default:
            return val;
        }
      },
      i18nDate(){
       let options= [
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
          },
          {
            value:"16",
            label:i18n.t('SPECIAL_INSTRUACTION.SPECIAL_ORDER_APPLICATION')
          }

      ]
      return options
      }
  },
};