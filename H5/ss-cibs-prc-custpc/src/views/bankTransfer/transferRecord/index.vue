<!-- 最近转账记录 列表-->
<template>
  <div class="g-transferrecord-container">
    <div v-if="!showDetail" class="mb20" v-loading="requestLoading">
      <!-- el-form start -->
      <el-form
        ref="queryForm"
        :model="queryFormData"
        label-suffix=":"
        :rules="queryFormRules"
        class="clearfix"
      >
        <el-form-item
          :label="$t('PAYMENT.PAYMENT_ACCOUNT')"
          prop="paymentAccount"
          label-width="70px"
          class="mr40"
        >
          <el-select v-model="queryFormData.paymentAccount" :filterable="true">
            <el-option v-for="(item, index) of acctList" :key="index + item.value" v-bind="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          label-width="70px"
          :label="$t('PAYMENT.AMOUNT_RANGE')"
          class="mr40 m-amountStyle"
        >
          <el-form-item prop="startAmount" label-width="0">
            <money-input
              :maxlength="17"
              :isSaveDot="true"
              v-model="queryFormData.startAmount"
              :placeholder="this.$t('COMMON.PLEASE_INPUT')"
            />
          </el-form-item>
          <el-col class="line"></el-col>
          <el-form-item prop="endAmount" label-width="0">
            <money-input
              :maxlength="17"
              :isSaveDot="true"
              v-model="queryFormData.endAmount"
              :placeholder="this.$t('COMMON.PLEASE_INPUT')"
            />
          </el-form-item>
        </el-form-item>
        <el-row class="fr mb24" v-show="showMoreField ? false : true">
          <el-row class="flexc mr24">
            <v-button type size="w70" @click="handleReset" class="mr16">
              {{
              $t('COMMON.RESET')
              }}
            </v-button>
            <v-button type="primary" size="w75" @click="handleQuery(1)">
              {{
              $t('COMMON.SEARCH')
              }}
            </v-button>
            <span
              class="u-expandBtn"
              v-show="showMoreField ? false : true"
              @click="showMoreField = true"
            >
              {{ $t('PAYMENT.UNFOLD_MENU') }}
              <i class="el-icon-expand"></i>
            </span>
          </el-row>
        </el-row>
        <el-form-item
          :label="$t('PAYMENT.PAYEE_NAME')"
          prop="creditInfo"
          label-width="100px"
          v-show="showMoreField ? true : false"
          class="mr40"
        >
          <el-input
            v-model="queryFormData.creditInfo"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.PAYEE_NAME')
              })
            "
          />
        </el-form-item>
        <el-form-item
          label-width="70px"
          :label="$t('PAYMENT.RECEIVE_ACCOUNT')"
          prop="creditAcct"
          v-show="showMoreField ? true : false"
          class="mr40"
        >
          <el-input
            v-model="queryFormData.creditAcct"
            :placeholder="
              $t('COMMON.PLEASE_INPUT_SOMETHING', {
                input: $t('PAYMENT.RECEIVE_ACCOUNT')
              })
            "
          />
        </el-form-item>
        <el-form-item
          label-width="70px"
          :label="$t('PAYMENT.DETAIL_DATE')"
          v-show="showMoreField ? true : false"
          class="mr20"
        >
          <el-date-picker
            style="width: 125px;"
            v-model="datespan[0]"
            :placeholder="$t('ACCOUNT_MANAGEMENT.START_DATE')"
            value-format="yyyy-MM-dd"
            :clearable="false"
            @change="changeTime1()"
            range-separator
          ></el-date-picker>
          <span class="line">-</span>
          <el-date-picker
            style="width: 125px;"
            v-model="datespan[1]"
            :placeholder="$t('ACCOUNT_MANAGEMENT.END_DATE')"
            value-format="yyyy-MM-dd"
            :clearable="false"
            @change="changeTime2()"
            range-separator
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0" v-show="showMoreField ? true : false">
          <el-radio-group v-model="payeeAcctType">
            <el-radio :label="7">{{ $t('COMMON.RECENT_7_DAYS') }}</el-radio>
            <el-radio :label="14">{{ $t('COMMON.RECENT_14_DAYS') }}</el-radio>
            <el-radio :label="30">{{ $t('COMMON.RECENT_30_DAYS') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-show="showMoreField ? true : false" class="fr mr40">
          <el-row class="flexc mb24">
            <v-button type size="w70" @click="handleReset" class="mr16">{{ $t('COMMON.RESET') }}</v-button>
            <v-button type="primary" size="w75" @click="handleQuery(1)">{{ $t('COMMON.SEARCH') }}</v-button>
            <span
              @click="showMoreField = false"
              class="u-expandBtn"
              v-show="showMoreField ? true : false"
            >
              {{ $t('PAYMENT.FOLD_MENU') }}
              <i class="el-icon-put-away"></i>
            </span>
          </el-row>
        </el-row>
      </el-form>
      <!-- el-form end -->
      <!-- el-table start -->
      <el-table
        :data="tableData"
        stripe
        style="width:100%;"
        height="398px"
        class="mb16"
        :empty-text="$t('COMMON.WITHOUT_DATA')"
      >
        <!-- 转账记录-交易流水号 -->
        <el-table-column prop="flowNo" :label="$t('PAYMENT.WEBBANK_FLOW_NO')" width="165" />
        <!-- 转账记录-付款账户 -->
        <el-table-column prop="debitAcct" :label="$t('PAYMENT.PAYMENT_ACCOUNT')" width="220">
          <template
            v-slot="{ row }"
          >{{ `${formatAcctNo(row.debitAcct)} ${typeFilter(row.debitAcctType,row.ccy)}` }} {{ row.debitAcctType | processAccountType }}</template>
        </el-table-column>
        <!-- 转账记录-收款户名 -->
        <el-table-column prop="displayCreditAcctName" :label="$t('PAYMENT.PAYEE_NAME')" width="150"></el-table-column>
        <!-- 转账记录-收款账户 -->
        <el-table-column prop="creditAcct" :label="$t('PAYMENT.RECEIVE_ACCOUNT')" width="220"></el-table-column>
        <!-- 转账记录-收款银行机构 -->
        <el-table-column prop="creditBankCode" :label="$t('PAYMENT.RECEIVE_BANK')" width="200">
          <template v-slot="{ row }">
            <!-- 行内转账显示 -->
            <span v-show="row.businessCode === '030101'">{{ $t('PAYMENT.CHUANGXING_BANK_CPY') }}</span>
            <!-- 外币转账 -->
            <span v-show="row.businessCode === '03010202'">{{ filterBankInfo(row.creditBankCode) }}</span>

            <!-- 转数快展示 -->
            <span v-show="row.businessCode === '03010201'">{{ filterFpsBank(row) }}</span>
            <span v-show="row.businessCode === '030103'">
              <!-- {{ `${row.creditBankAddress} ` }} -->
              {{ `${row.creditBankName}` }}
            </span>
          </template>
        </el-table-column>
        <!-- 转账记录-转账金额 -->
        <el-table-column prop="amount" :label="$t('PAYMENT.TRANSFER_AMOUNT')" width="150">
          <template
            v-slot="{ row }"
          >{{row.amount ?row.ccy+' '+ formatMoneyNew(row.amount) : '0.00' }}</template>
        </el-table-column>
        <!-- 转账记录-类型 -->
        <el-table-column :label="$t('PAYMENT.TRANS_TYPE')" width="120">
          <template slot-scope="scope">{{ scope.row.businessCode | tradeTypeFilter }}</template>
        </el-table-column>
        <!-- 转账记录-交易日期 -->
        <el-table-column prop="submitTime" :label="$t('PAYMENT.DETAIL_DATE')" width="250px">
          <template v-slot="{ row }">{{ row.submitTime | filterLinkTime }}</template>
        </el-table-column>
        <!-- 转账记录-操作 -->
        <el-table-column
          :label="$t('COMMON.OPERATION')"
          align="left"
          fixed="right"
          class="flexsb"
          width="180"
        >
          <template v-slot="{ row }">
            <span
              size="w70"
              @click="showDetailPage(row)"
              type="text"
              class="u-tableBtn"
            >{{ $t('COMMON.DETAIL') }}</span>
            <span
              v-show="row.businessCode !== '03010501' && row.businessCode !== '03010401'"
              style="font-size:12px; color:#CCCCCC;"
            >|</span>
            <span
              v-show="row.businessCode !== '03010501' && row.businessCode !== '03010401'"
              size="w70"
              @click="handleToTransferPage(row)"
              type="text"
              class="left-line u-tableBtn"
            >{{ $t('PAYMENT.ONE_MORE_TRANS') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.length > 0"
        :current-page="pageInfo.current"
        :page-sizes="[10, 20, 30, 50]"
        :total="pageInfo.total"
        layout="prev, pager, next, sizes, jumper"
        @size-change="changePageInfo($event, 'size')"
        @current-change="changePageInfo($event, 'current')"
      ></el-pagination>
      <!-- el-table end -->
    </div>
    <div v-else>
      <record-detail
        :rowFlowNo="rowFlowNo"
        :detailItem="detailItem"
        @returnBack="showDetail = false"
      />
    </div>
  </div>
</template>

<script>
import RecordDetail from './record-detail';
import {
  getRecentRecordsAccts,
  recentTransferListQuery
} from '@/api/paymentRemittance';
import { escapeTransType } from '@bank-transfer/utils/filters';
import { deepClone, filterParams, formatMoneyNew } from '@/utils/tools';
import combineUtils from '@/dataTools/tools';
import { bankInfos } from '@/mixins';
import { createNamespacedHelpers } from 'vuex';
import {
  formatAcctNo,
  transToCreditAcct,
  formatTransferType,
  getTransferPath
} from '@bank-transfer/utils/function';
import business from '@/filters/business.js';
import filters from '@/filters/public';
const { getYMD, getNearDay } = combineUtils;
const { mapState, mapMutations } = createNamespacedHelpers('app');

export default {
  name: 'RecentTransferRecordsList',
  components: {
    RecordDetail
  },
  mixins: [bankInfos],
  data() {
    const self = this;

    const endDate = getYMD(),
      startDate = getNearDay(endDate, -30);
    return {
      queryFormData: {
        paymentAccount: '', // 付款账户
        creditAcct: '', // 收款账户
        creditInfo: '', // 收款户名
        startAmount: '', // 开始金额
        endAmount: '' // 结束金额
      },
      datespan: [startDate, endDate], //交易日期
      payeeAcctType: 30, //快捷日期
      pageInfo: {
        total: 10,
        current: 1,
        size: 10
      },
      tableData: [],
      acctList: [],
      showDetail: false,
      detailItem: {},
      showMoreField: false, //展开表单
      rowFlowNo: '', // 当前的流水号
      queryFormRules: {
        startAmount: {
          required: true,
          validator: (rule, value, callback) => {
            const { endAmount } = self.queryFormData;
            console.log(endAmount);
            if (endAmount.length) {
              if (Number(value) > Number(endAmount)) {
                callback(new Error(self.$t('PAYMENT.AMOUNT_RANGE_ERROR')));
                return;
              }
            }
            callback();
          },
          trigger: 'blur'
        }
      }
    };
  },
  filters: {
    ...filters,
    filtersType: filters.filtersType,
    processAccountType: business.processAccountType
  },
  watch: {
    payeeAcctType(newVal) {
      this.changeShortcutTime(newVal);
    }
  },
  computed: {
    ...mapState(['requestLoading']),
    queryParams() {
      const _pageInfo = deepClone(this.pageInfo);
      const [startDate, endDate] = this.datespan;
      const { paymentAccount } = this.queryFormData;

      delete _pageInfo.total;

      return filterParams({
        startDate,
        endDate,
        ..._pageInfo,
        ...this.queryFormData,

        paymentAccount: paymentAccount.split(' ')[0],
        currency: paymentAccount.split(' ')[1]
      });
    },
    routeQueryParams() {
      const { query } = this.$route,
        params = query.params || {};
      return params;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    formatMoneyNew,
    escapeTransType,
    formatAcctNo,
    ...mapMutations(['setSliderMenusAct']),
    // 初始化
    init() {
      this.getAcctList();
      this.handleQuery();
      this.handleShowDetail();
    },
    async getAcctList() {
      const { debitAcctList } = await getRecentRecordsAccts({});
      if (Array.isArray(debitAcctList)) {
        this.acctList = debitAcctList.map(item => ({
          label: `${formatAcctNo(item.acctNo)} ${
            item.cur
          } ${business.processAccountType(item.typeLabel)}`,
          value: `${item.acctNo} ${item.cur}`
        }));
      }
    },
    async handleQuery(val, queryParams = this.queryParams) {
      if (val === 1) {
        queryParams.current = 1;
      }
      const [startDate, endDate] = this.datespan;
      const day = 1000 * 60 * 60 * 24;
      if (
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / day >
        90
      ) {
        this.$message({
          type: 'fail',
          message: this.$t('COMMON.QUERY_INTERVAL'),
          duration: 3000
        });
        return;
      }
      this.$refs['queryForm'].validate(async valid => {
        if (valid) {
          const {
            records,
            current, // pageNum
            size, // pageSize
            total
          } = await recentTransferListQuery(queryParams);
          this.pageInfo.current = current || 1;
          this.pageInfo.size = size || 10;
          this.pageInfo.total = total || 0;

          this.setTableData(records);
        }
      });
    },
    setTableData(records) {
      this.tableData = [];
      if (Array.isArray(records) && records.length) {
        this.tableData = records.map(item => {
          const detail = item.detail || '{}',
            detailItem = JSON.parse(detail);
          this.tableData.debitAcctType =
            JSON.parse(item.detail).debitAcctType || '';
          return {
            ...detailItem,
            ...item
          };
        });
      }
      console.log(this.tableData);
    },
    handleShowDetail() {
      const { showDetail } = this.routeQueryParams;
      if (showDetail === true) {
        this.rowFlowNo = this.routeQueryParams.flowNo;
        this.showDetail = showDetail;
        this.detailItem = this.routeQueryParams;
      }
    },
    handleReset() {
      this.$refs['queryForm'].resetFields();
      (this.pageInfo = {
        total: 0,
        current: 1,
        size: 10
      }),
        (this.queryFormData.startAmount = '');
      this.queryFormData.endAmount = '';
      this.payeeAcctType = 30;
      const endDate = getYMD(),
        startDate = getNearDay(endDate, -30);

      this.$set(this, 'datespan', [startDate, endDate]);
      console.log(this.queryFormData);

      this.init();
    },
    changePageInfo(value, prop) {
      this.pageInfo[prop] = value;
      this.handleQuery();
    },
    // 再转一笔
    handleToTransferPage(row) {
      const businessCode = formatTransferType(row.businessCode),
        path = getTransferPath(businessCode),
        totalParams = JSON.parse(row.detail || '{}');
      if (!path) {
        return;
      }

      this.setSliderMenusAct(businessCode);
      this.$router.push({
        path,
        query: {
          params: JSON.stringify({
            ...totalParams,
            isSwiftCode: !!totalParams.swiftCode,
            isScheduleTx: 'N',
            isJumpTo: true,
            JumpBusinessCode: businessCode
          })
        }
      });
    },
    // 详情
    showDetailPage(row) {
      this.detailItem = { ...row };
      this.showDetail = true;
    },

    changeShortcutTime(day = 30) {
      if (typeof day !== 'number') {
        return;
      }
      const endDate = getYMD(),
        startDate = getNearDay(endDate, -1 * day);

      this.$set(this, 'datespan', [startDate, endDate]);
    },
    /** 过滤fps银行 */
    filterFpsBank({
      creditBankCode,
      creditAcctIdentificationType,
      designBank
    }) {
      if (creditAcctIdentificationType === 'SVID') {
        return '--';
      }
      if (['MOBN', 'EMAL'].includes(creditAcctIdentificationType)) {
        if (designBank === 'PRE') {
          return this.$t('PAYMENT.PRESET_PAYEE_BANK');
        }
        if (designBank === 'DEF') {
          return this.$t('PAYMENT.CHUANGXING_BANK');
        }
      }
      const curBank = this.bankInfoList.find(
        item => item.value === creditBankCode
      );
      if (curBank && curBank.bankName) {
        return curBank.bankName;
      }
      return '--';
    },
    typeFilter(val, cur) {
      return filters.filtersType(val, cur);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
