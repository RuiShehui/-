/*
 * @Author: ZhangZhen
 * @Date: 2022-05-26 16:42:01
 * @LastEditTime: 2022-06-09 15:24:39
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\mixins\bank-infos.js
 */
import { getFpsBanks, queryChatsBanks } from '@/api/customer-management/third-register';

const BANK_INFO_LIST = 'BANK_INFO_LIST';

const getHkBankLabel = (item, lang) => {
  switch (lang) {
    case 'zhCN':
      return item.chsName || '';
    case 'zhXG':
      return item.chtName || '';
    case 'en':
      return item.engName || '';
    default:
      return '';
  }
}

const getSessionHKBank = (key = BANK_INFO_LIST, lang) => {
  const bankInfoList = JSON.parse(sessionStorage.getItem(key) || '[]');

  return bankInfoList.map(item => ({
    ...item,
    label: item.chsName || item.chtName || item.engName,
    // label: getHkBankLabel(item, lang),
  }));
}

function getFilterList(origin, key) {
  if (!key) {
    return origin;
  }
  return origin.reduce((prev, cur) => {
    if (prev.every(prevItem => prevItem[key] !== cur[key])) {
      prev.push(cur);
    }

    return prev;
  }, []);
}

const setSessionHKBank = (key = BANK_INFO_LIST, value = []) => {
  const valueStr = JSON.stringify(value);

  sessionStorage.setItem(key, valueStr);
}

export default {
  data() {
    return {
      params: {
        payeeBank: [],
      },
      bankInfoList: [],
    };
  },
  computed: {
    fpsBankList() {
      const fpsBankList = this.bankInfoList.filter(item => item.transferWay === '03010201');
      return getFilterList(fpsBankList, 'label');
    },
    chatsBankList() {
      const chatsBankList = this.bankInfoList.filter(item => item.transferWay === '03010202');

      return getFilterList(chatsBankList, 'label');
    }
  },
  created() {
    this.getBankInfos();
  },
  methods: {
    async getBankInfos(params = {}) {
      const { lang } = this.$store.state.app;
      const bankInfoList = getSessionHKBank(BANK_INFO_LIST, lang);
      if (bankInfoList && bankInfoList.length) {
        this.bankInfoList = bankInfoList;
      } else {
        const newBankInfoList = [];

        const fpsBanks = await this.getFpsBankInfos(params);
        const chatsBanks = await this.getChatsBankInfos(params);

        newBankInfoList.push(...fpsBanks);
        newBankInfoList.push(...chatsBanks);

        this.$set(this, 'bankInfoList', newBankInfoList);
        setSessionHKBank(BANK_INFO_LIST, newBankInfoList);
      }
    },
    async getFpsBankInfos(params = {}) {
      const { body } = await getFpsBanks(params);
      if (Array.isArray(body) && body.length) {
        return body.map(item => ({
          value: item.clearingCode || item.serId,
          // label: getHkBankLabel(item, lang),
          label: `${item.chsName || item.chtName || item.engName} ${item.cyy ? item.cyy : ''}`,
          transferWay: '03010201',
          ccy: item.cyy || '',
          ...item
        }));
      }
      return [];
    },
    async getChatsBankInfos(params = {}) {
      const { body } = await queryChatsBanks(params),
        { bankList } = body;
      if (Array.isArray(bankList) && bankList.length) {
        return bankList.map(item => ({
          value: item.clearingCode || item.serId,
          // label: getHkBankLabel(item, lang),
          label: `${item.chsName || item.chtName || item.engName} ${item.cyy ? item.cyy : ''}`,
          transferWay: '03010202',
          ccy: item.cyy || '',
          ...item
        }));
      }
      return [];
    }
  },
};