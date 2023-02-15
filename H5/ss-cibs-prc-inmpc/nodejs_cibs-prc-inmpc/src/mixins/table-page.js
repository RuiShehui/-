/*
 * @Author: ZhangZhen
 * @Date: 2021-11-05 18:08:25
 * @LastEditTime: 2022-06-17 12:46:45
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\mixins\table-page.js
 */
import {
  ShowMessage
} from '@/plugins';
import {
  isType,
  // deepClone,
  getPrueObject,
  isAddZero,
  formatYMD
} from '@/utils/tools';
import mapValidators from '@/utils/stategies';
import {
  HEAD
} from '@/configs/keys';

/**
 * @module table-page-mixins
 * use-step
 * get-list-method-config: requestListFn: function() {}
 */
export default {
  data() {
    return {
      /** request-list-params (design in single-page) */
      requestParams: {
        current: 1,
        size: 10,
        total: 0,
      },
      /** is-loading ? */
      loading: false,
      /** table-columns */
      tableColumns: [],
      /** table-data */
      tableData: []
    };
  },
  computed: {},
  methods: {
    /** request-fn */
    requestListFn() {},
    /**
     * getContentData get-content-list-data
     * @param {[key: string]: number | string} params request-params
     * @param {([key: string]: number | string) => Promise<any>} fn request-function
     */
    async getContentData(params = {
      current: 1,
      size: 10
    }, fn = this.requestListFn) {
      this.loading = true;
      try {
        const result = await fn(getPrueObject(params));

        if (result && result.hasOwnProperty('body')) {
          const {
            body
          } = result;
          this._setPageInfo(body);

          this.tableData = [];
          this._setContentData(body);
        }
      } catch (err) {
        ShowMessage({
          type: 'error',
          message: `请求出错了, 错误提示: ${err}`
        });
      }
      this.loading = false;
    },
    /** set-page-info */
    _setPageInfo({
      total
    }) {
      this.requestParams.total = total || 0;
    },
    /** set-content-data */
    _setContentData({
      records,
      bankNoticeList,
      list
    }) {
      if (isType(records, 'Array') && records.length) {
        records.forEach((itm1, idx1) => {
          this.tableData.push({
            id: idx1 + 1,
            number: idx1 + 1,
            ...((itm1) => {
              if (isType(itm1.commEpsMerchantBills, 'Array') && itm1.commEpsMerchantBills.length) {
                itm1.children = itm1.commEpsMerchantBills.map((itm2, idx2) => {
                  return {
                    id: isAddZero(`${idx1 + 1}-${idx2 + 1}`),
                    ...itm2,
                    billEffectiveTime: formatYMD(itm2.billEffectiveTime),
                    billFailureTime: formatYMD(itm2.billFailureTime),
                  };
                });
                // itm1.hasChildren = true;
              } else {
                delete itm1.children;
              }
              return itm1;
            })(itm1),
            // commEpsMerchantBills: itm1.commEpsMerchantBills ?
            //   itm1.commEpsMerchantBills.map(itm3 => ({
            //     ...itm3,
            //     billEffectiveTime: formatYMD(itm3.billEffectiveTime),
            //     billFailureTime: formatYMD(itm3.billFailureTime),
            //   })) :
            //   []
          });
        });
        return;
      }
      if (isType(bankNoticeList, 'Array') && bankNoticeList.length) {
        this.tableData = bankNoticeList.map((item, index) => {
          return {
            number: index + 1,
            ...item
          };
        });
      }
      if (isType(list, 'Array') && list.length) {
        this.tableData = list.map((item, index) => {
          return {
            id: index +1,
            number: index + 1,
            ...item
          };
        });
      }
    },
    /** handle-menu-search */
    handleSearch(params, fn = this.requestListFn) {
      const {
        size,
        total
      } = this.requestParams;
      for (let k in this.requestParams) {
        if (params.hasOwnProperty(k)) {
          this.$set(this.requestParams, k, params[k]);
        } else {
          this.requestParams[k] = '';
        }
        this.requestParams.size = size;
        this.requestParams.total = total;
      }
      this.getContentData(this.requestParams, fn);
    },
    /** page-info-request */
    getContentByPageInfo(value, pageProperty) {
      this.requestParams[pageProperty] = value;
      const requestParams = {
        ...this.requestParams
      };
      this.getContentData(requestParams);
    },
    /**
     * checking-result-is-success
     * @param {{ [key: string]: any }} res return-result
     * @param {string} op operate-name
     * @param {any[]} args callback's arguments
     */
    checkResult(res, op, args = []) {
      const isSuccessed =
        res &&
        (res.body === true || (HEAD in res && !parseInt(res.head.code)));

      if (isSuccessed) {
        ShowMessage({
          type: 'success',
          message: `${op} ${this.$t('COMMON.SUCCESS')}`
        });
        // this.getContentData(...args);
      } else {
        ShowMessage({
          type: 'error',
          message: `${this.$t(
            'COMMON.SOMETHING_SUCCESS',
            { op: op + this.$t('COMMON.SUBMIT') }
          )}`
        });
      }
    },
    /**
     * is-valid-time 是否为合法的时间范围
     * @description 1. 开始时间必须要在两年内; 2. 时间范围不的超过90天
     * @return {boolean}
     */
    isValidTime() {
      const {
        START_IN_ONE_YEAR,
        TIMESPAN_IN_90_DAY
      } = mapValidators();

      const [start, end] = this.requestParams.timespan || [null, null];

      if (!START_IN_ONE_YEAR(start)) {
        this.$showBox({
          content: this.$t('COMMON.STARTTIME_LESS_IN_ONE_YEAR')
        });
        return false;
      }
      if (!TIMESPAN_IN_90_DAY(start, end)) {
        this.$showBox({
          content: this.$t('COMMON.TIMESPAM_LESS_THAN_90')
        });
        return false;
      }

      return true;
    },
  }
};