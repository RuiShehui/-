/*
 * @Author: ZhangZhen
 * @Date: 2022-02-17 16:24:06
 * @LastEditTime: 2022-06-10 11:05:22
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\mixins\bankInfos.js
 */
import {
  getBankList,
  queryChatsBanks
} from '@/api/paymentRemittance';
import {
  mapState
} from 'vuex';
import {
  useLocalStorage
} from '@/utils/hooks';
import _ from 'lodash';

const BANK_INFOS = 'BANK_INFOS';

/**
 * fps银行列表 + chats银行列表 (使用transferWay进行分隔 (03010201/03010202))
 */
export default {
  data() {
    return {
      // 收款银行国家/地区
      bankInfoList: [],
      // transfer
    };
  },
  computed: {
    ...mapState('app', ['lang']),
    currentBankName() {
      switch (this.lang) {
        case 'zh-CN':
          return 'chsName';
        case 'zh-HK':
          return 'chtName';
        default:
          return 'engName';
      }
    },
    /** filter bank infos */
    filterTransBank() {
      const filterTransBank = [];
      const ctx = this;

      const transferWay = this.payType === 'fast' ? '03010201' : '03010202';

      filterTransBank.unshift({
        bankName: this.$t('PAYMENT.CHUANGXING_BANK_CPY'),
        value: '041',
        ccy: 'HKD'
      }, ...this.bankInfoList);
      return (
        filterTransBank
          .filter(item => item.transferWay === transferWay)
          .filter(item => item.ccy === ctx.bankCcy)
          .reduce((prev, cur) => {
          // item.clearingCode !== cur.clearingCode
          if (prev.every(item =>
            item.value !== cur.value
          )) {
            prev.push(cur);
          }
          return prev;
        }, [])
        .map(item => ({
          ...item,
          bankName: `${item.clearingCode} ${item.bankName}`
        }))
      );
    },
    /**
     * @override 转账涉及到银行的要重写
     */
    bankCcy() {
      return 'HKD';
    }
  },
  watch: {
    filterTransBank(newVal) {
      if (this.formsData && this.formsData.hasOwnProperty('creditBankCode')) {
        // this.$set(this.formsData, 'creditBankCode', '');
        // this.$set(this.formsData, 'creditBankInstitution', '');
      }
      if (this.formData && this.formData.hasOwnProperty('payeeBankCode')) {
        this.$set(this.formData, 'payeeBankCode', '');
      }
    },
    payType(newval,oldval){
      console.log(newval,oldval)
    }
  },
  created() {
    this.getBankInfos();
  },
  methods: {
    async getBankInfos(params = {}) {
      this.bankInfoList = [];

      const [GET_STORAGE_BANKS, SET_STORAGE_BANKS] = useLocalStorage(BANK_INFOS);
      const storageBanks = GET_STORAGE_BANKS();

      if (storageBanks && storageBanks.length > 0) {
        this.bankInfoList = [...storageBanks].map(item => {
          return {
            ...item,
            bankName: item[this.currentBankName], // `${item[this.currentBankName]} ${item.ccy ? item.ccy : ''}`
          };
        });
      } else {
        // 请求
        const { body } = await getBankList(params);
        const { bankList } = await queryChatsBanks({});
        if (Array.isArray(body) && body.length) {

          const fpsBanks = this.initFpsBanks(body),
            chatsBanks = this.initChatsBanks(bankList);

          const origin = [
            ...fpsBanks,
            ...chatsBanks
          ];
          this.bankInfoList = origin;

          console.log(this.bankInfoList);

          SET_STORAGE_BANKS(origin);
        }
      }
    },
    /** 2022-06-07新增 获取FPS银行数据 */
    initFpsBanks(bankList = []) {
      return bankList.map((item, index) => {
        const _item = _.cloneDeep(item);

        delete _item.cyy;

        return {
          ..._item,
          bankName: `${item[this.currentBankName]}`, // `${item.clearingCode} ${item.ccy ? item.ccy : ''} ${item[this.currentBankName]}` // `${item[this.currentBankName]} ${item.cyy ? item.cyy : ''}`
          value: item.clearingCode || index, // item.serId
          ccy: item.cyy,
          transferWay: '03010201'
        };
      })
    },
    initChatsBanks(bankList = []) {
      return bankList.reduce((prev, cur, index) => {
        if (cur.isHKDChats === 'Y') {
          prev.push({
            ...cur,
            bankName: `${cur[this.currentBankName]}`, // `${cur.clearingCode} ${cur.ccy ? cur.ccy : ''} ${cur[this.currentBankName]}`
            value: cur.clearingCode || index, // cur.serId
            ccy: 'HKD',
            transferWay: '03010202'
          });
        }
        if (cur.isCNYChats === 'Y') {
          prev.push({
            ...cur,
            bankName: `${cur[this.currentBankName]}`, // `${cur.clearingCode} ${cur.ccy ? cur.ccy : ''} ${cur[this.currentBankName]}`
            value: cur.clearingCode || index, // cur.serId
            ccy: 'CNY',
            transferWay: '03010202'
          });
        }
        if (cur.isEURChats === 'Y') {
          prev.push({
            ...cur,
            bankName: `${cur[this.currentBankName]}`, // `${cur.clearingCode} ${cur.ccy ? cur.ccy : ''} ${cur[this.currentBankName]}`
            value: cur.clearingCode || index, // cur.serId
            ccy: 'EUR',
            transferWay: '03010202'
          });
        }
        if (cur.isUSDChats === 'Y') {
          prev.push({
            ...cur,
            bankName: `${cur[this.currentBankName]}`, // `${cur.clearingCode} ${cur.ccy ? cur.ccy : ''} ${cur[this.currentBankName]}`
            value: cur.clearingCode || index, // cur.serId
            ccy: 'USD',
            transferWay: '03010202'
          });
        }
        return prev;
      }, []);
    },
    filterBankInfo(value) {
      if (value === '') {
        return this.$t('PAYMENT.PRESET_PAYEE_BANK');
      } 
      if (value === '041') {
        return this.$t('PAYMENT.CHUANGXING_BANK_CPY');
      }
      const tarItem = this.bankInfoList.find(item => item.value === value);
      if (tarItem && tarItem.bankName) {
        return tarItem.bankName;
      }
      return '';
    },
    /** 改变银行信息后的回调函数 */
    changeBankCB() {}
  },
};