/*
 * @Author: ZhangZhen
 * @Date: 2022-02-23 11:49:03
 * @LastEditTime: 2022-05-30 12:43:51
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\mixins\confirm.js
 */
import businessFilter from '@/filters/business';
import mathTools from '@/utils/mathTools';
import filtersIndex from '@/filters';
import countryInfos from '@/mixins/countryInfos';
import bankInfos from '@/mixins/bankInfos';
import { formatAcctNo } from '@bank-transfer/utils/function';
import { chinaTTList } from '@bank-transfer/utils/constant';
import { mapState } from 'vuex';
/** 特殊天气提示语，适用于外币转账/电汇 */
import { getTyphoonFlag } from '@/api/paymentRemittance';
import i18n from '@/i18n';
import { init } from 'echarts';
import ccyTool from '@/filters/accountManagement';


/** confirm-page-mixin */
export default {
  mixins: [countryInfos, bankInfos],
  props: {
    confirmData: {
      type: Object,
      default() {
        return {};
      }
    },
    showBtns: {
      type: Boolean,
      default: true,
    }
  },
  filters: {
    ...businessFilter,
    showLabelFilter(list) {
      return list.map(item => {
        if (typeof item === 'string') {
          return item;
        }

        return item.label;
      }).join(', ');
    },
    processPayType(type) {
      switch (type) {
        case 'SHA':
          return i18n.t('PAYMENT.PAYMENT_METHOD_TIP1');
        case 'BEN':
          return i18n.t('PAYMENT.PAYMENT_METHOD_TIP2');
        case 'OUR':
          return i18n.t('PAYMENT.PAYMENT_METHOD_TIP3');
        default:
          return '';
      }
    },


    //余额格式化
    formatMoney(val) {
      if (val) {
        return mathTools.addDecollator(filtersIndex.moneyFloatFormat(val));
      }
      return '';
    },
    filterCountry(val) {
      const countryInfoList = JSON.parse(localStorage.getItem('COUNTRY_INFOS_KEY')) || [];
      const tarItem = countryInfoList.find(item => item.value === val);
      if (tarItem) {
        return tarItem.label;
      }
      return '';
    },
    filterBankCode(val) {
      switch (val) {
        case 'CU': 
          return 'CHIPS UID';
        case 'FN': 
          return 'Fedwrire No./ABA No.';
        case 'GB': 
          return 'SORT Code';
        case 'CA': 
          return 'Transit Code';
        case 'AU':
          return 'BSB No.';
        default:
          return '';
      }
    },
    filterBank(val) {
      const bankInfosList = JSON.parse(localStorage.getItem('BANK_INFOS')) || [];
      const tarItem = bankInfosList.find(item => item.value === val);
      if (tarItem) {
        console.log(tarItem);
        return tarItem.bankName;
      }
      return '';
    },
    filterCheckArea(val) {
      const list = [
        {
          label: 'SWIFT Code',
          value: true,
        },
        {
          label: i18n.t('PAYMENT.PAYEE_COUNTRY_CODE'),
          value: false,
        }
      ];
      const tarItem = list.find(item => item.value === val);
      if (tarItem) {
        return tarItem.label;
      }
      return '';
    }
  },
  data() {
    return {
      formLoading: false,
      chinaTTList,
      TyphoonFlag:false,
    };
  },
  computed: {
    ...mapState('app', ['requestLoading']),

    authInfo() {
      const { authInfo } = this.confirmData;
      return authInfo || {};
    }
  },
  mounted() {

  },
  methods: {
    formatAcctNo,
    getProcessType: businessFilter.processAccountType,
    ccyFilter:ccyTool.ccyFilter,
    onConfirm() {
      this.formLoading = true;
      setTimeout(() => {
        this.$emit('next');
        this.formLoading = false;
      }, 800);
    },
    async getTyphoonFlagFun(){

      const result = await getTyphoonFlag({});
      if (result) {
        console.log('result----特殊天气',result)
        this.TyphoonFlag = result.flag
      }
    }
  },
};