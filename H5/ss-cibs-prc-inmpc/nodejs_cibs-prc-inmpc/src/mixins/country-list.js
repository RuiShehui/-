/*
 * @Author: ZhangZhen
 * @Date: 2022-05-26 16:44:01
 * @LastEditTime: 2022-06-10 17:34:49
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\mixins\country-list.js
 */
import _ from 'lodash';
import { useStorage } from '@/hooks';
import { getCountryInfoList } from '@/api/customer-management/common';
import { getBankList } from '@/api/customer-management/third-register';
import { ShowMessage } from '@/plugins';

const COUNTRY_LIST = 'COUNTRY_LIST';

/**
 * COUNTRY_LIST （一次请求, 之外不发请求, 从session/local取值）
 */

const [
  getCountries,
  setCountries,
  // initCountries
] = useStorage(
  COUNTRY_LIST,
  []
)

export default {
  data() {
    return {
      countryList: [],
      bankList: [],
      params: {
        countryCode: '',
        payeeCountryCode: ''
      },
    };
  },
  mounted() {
    this.initCountryList();
  },
  methods: {
    initCountryList() {
      /**
       * 我的会话缓存里面是否有国家列表
       *   1. 有, 拿会话缓存中的数据, 不发请求
       *   2. 没有, 发请求获取, 把数据缓存到会话缓存中
       */
      const countryList = getCountries();
      if (countryList && countryList.length) {
        this.countryList = countryList;
      } else {
        this.queryCountryList();
      }
    },
    async queryCountryList() {
      try {
        const result = await getCountryInfoList(),
          { countries } = result.body;
        if (countries) {
          this.countryList = countries;
          setCountries(countries);
        }
      } catch (err) {
        ShowMessage({
          message: `error:${err}`,
          type: 'error'
        });
      }
    },
    handleChangeCountry(countryCode) {
      // this.setBankList(countryCode, '');
    },
    // async setBankList(countryCode = '', institution = '') {
    //   this.$set(this.params, 'bankName', '');
    //   const result = await getBankList({
    //     countryCode,
    //     institution
    //   });
    //   if (result.body) {
    //     this.bankList = result.body;
    //   }
    // },
    handleSearchBankList: _.throttle(function(value = '') {
      this.bankList = [];
      this.setBankList(this.params.countryCode, value);
    }, 500)
  }
};