/*
 * @Author: ZhangZhen
 * @Date: 2022-02-18 14:36:46
 * @LastEditTime: 2022-04-07 17:44:10
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\mixins\countryInfos.js
 */
import { getCountryList } from '@/api/paymentRemittance';
import { useLocalStorage } from '@/utils/hooks';
import { getLabelByValue } from '@/utils/tools';

const COUNTRY_INFOS_KEY = 'COUNTRY_INFOS_KEY';

export default {
  data() {
    return {
      countryInfoList: []
    };
  },
  created() {
    this.getCountryInfos();
  },
  methods: {
    async getCountryInfos(params = {}) {
      this.countryInfoList = [];

      const [GET_STORAGE_COUNTRIES, SET_STORAGE_COUNTRIES] = useLocalStorage(COUNTRY_INFOS_KEY);
      const storageCountries = GET_STORAGE_COUNTRIES();

      if (storageCountries && storageCountries.length) {
        this.countryInfoList = [...storageCountries];
      } else {
        // const { countries } = await getCountryList(params);
        const countries = await getCountryList(params);

        if (Array.isArray(countries) && countries.length) {
          const countryInfoList = countries.map(item => ({
            ...item,
            label: item.countryShortName,
            value: item.countryId,
          }));

          this.countryInfoList = [...countryInfoList];

          SET_STORAGE_COUNTRIES(countryInfoList);
        }
      }
    },
    findCountryName(value) {
      const target = this.countryInfoList.find(item => item.value === value);
      if (target) {
        return target.label;
      }
      return '';
    }
  },
};