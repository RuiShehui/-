/*
 * @Author: ZhangZhen
 * @Date: 2022-04-11 14:30:28
 * @LastEditTime: 2022-05-13 19:56:49
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\accountList\accountListMixin.js
 */

import './page.scss';

import SearchBar from './components/SearchBar';
import SelectFooter from './components/SelectFooter';

import {
  initQueryData,
  initTableColumns,
  getSearchBarData,
} from './utils/tools';
import { filterParams } from '@/utils/tools';

import {
  identifyWayList,
  IDENTIFY_WAY_MAP,
} from '@bank-transfer/utils/constant';

import { bankInfos, countryInfos } from '@/mixins';

export default {
  components: {
    SearchBar,
    SelectFooter
  },
  mixins: [bankInfos, countryInfos],
  inject: ['entType'],
  props: {
    /** 是否显示当前弹窗 */
    dialogVisible: Boolean,
    /** 转账类型 ('inline'-行内转账,'fast'-fps转账,'localtransfer'-外币转账,'remittance'-tt转账) */
    payType: [Number, String],
    /** 账户类型 (2-已登记账户,3-未登记账户(最近收款人)) */
    accountType: [Number, String]
  },
  data() {
    return {
      /** 查询区请求参数 */
      queryData: {},
      /** 账户列表-表头 */
      tableColumns: [],
      /** 账户列表-内容 */
      tableData: [],
      /** 是否正在请求 */
      isLoading: false,
      /** 分页请求参数 */
      pageInfo: {
        current: 1,
        size: 10,
        total: 0
      },
      /** 选择当前表格的索引 */
      selectIndex: 0
    };
  },
  filters: {
    identifyMethodFilter(value) {
      const item = identifyWayList.find(item => item.value === value);
      if (item) {
        return item.label;
      }
      return '';
    },
    identifyMethodValueFilter(row) {
      const { payeeIdentifyMethod, payeeAccount, fpsId, emailAddress, mobilePhone } = row;
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.payeeAccount) {
        return payeeAccount;
      }
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.fpsId) {
        return fpsId;
      }
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.emailAddress) {
        return emailAddress;
      }
      if (payeeIdentifyMethod === IDENTIFY_WAY_MAP.mobilePhone) {
        return mobilePhone;
      }
      return '';
    },
  },
  computed: {
    /** 搜索栏的参数 */
    searchBarData() {
      const searchBarData = getSearchBarData(this.queryData);
      return searchBarData;
    },
    /** 合并的搜索参数 */
    searchData() {
      const { current, size } = this.pageInfo;
      return filterParams({
        ...this.queryData,
        current,
        size
      });
    },
    /** 当前选中的账户 */
    selectItem() {
      const self = this,
        selectItem = self.tableData[self.selectIndex];

      return selectItem || null;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initQueryData();
      this.initTableColumns();
      this.getTableData();
    },
    initQueryData() {
      this.$set(
        this,
        'queryData',
        initQueryData(this.payType, this.accountType)
      );
    },
    initTableColumns() {
      this.tableColumns = initTableColumns(this.payType, this.accountType);
    },
    /**
     * @implements {} USER_TO_IMPLIMENT // TODO
     */
    getTableData() {},
    setPageInfo({ page = 1, size = 10, total = 0 }) {
      this.$set(this.pageInfo, 'page', page);
      this.$set(this.pageInfo, 'size', size);
      this.$set(this.pageInfo, 'total', total);
    },
    setTableData({ records = [] }) {
      const tableData = [...records];
      this.$set(this, 'tableData', tableData);
    },
    handleQuery(queryData) {
      for (let k in this.queryData) {
        if (queryData.hasOwnProperty(k)) {
          this.$set(this.queryData, k, queryData[k]);
        }
      }
      this.initPageInfo();
      this.getTableData();
    },
    initPageInfo() {
      this.$set(this, 'pageInfo', {
        current: 1,
        size: 10,
        total: 0
      });
    },
    changePageInfo(value, prop) {
      this.$set(this.pageInfo, prop, value);
      this.getTableData();
    },
    handleCancel() {
      /** 直接关闭弹窗即可 */
      this.$emit('toCancle');
    },
    onDialogClose() {
      this.handleReset();
      this.initPageInfo();
      this.$emit('update:dialogVisible', false);
    },
    handleReset() {
      /** 重置查询区内容 */
      if (this.$refs.searchBar && this.$refs.searchBar.handleReset) {
        this.$refs.searchBar.handleReset();
      }
    },
    handleConfirm() {
      const selectItem = this.selectItem;
      this.$emit('confirmClick', {
        ...selectItem,
        acctIdentificationType: '2',
      });
    }
  }
};
