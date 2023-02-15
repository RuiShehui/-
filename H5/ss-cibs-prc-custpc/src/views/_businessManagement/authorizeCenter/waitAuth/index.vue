<template>
  <div class="waitAuth" v-loading="requestLoading">
    <!-- 查询区 -->
    <el-form ref="mySubmitFormRef" :model="mySubmitForm" label-width="auto">
      <el-row style>
        <el-col :span="lang === 'en' ? 8:7">
          <el-form-item :label="$t('COMMON.TRADE_TYPE')+':'" prop="tradeType">
            <el-select v-model="mySubmitForm.tradeType" :placeholder="$t('COMMON.PLEASE_SELECT')">
              <el-option
                v-for="(item,index) in tradeTypeList"
                :key="index"
                :label="item.tradeType"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="lang === 'en' ? 8:7">
          <el-form-item :label="$t('COMMON.AUTHORIZATION_STATUS')+':'" prop="authStatus">
            <el-select
              v-model="mySubmitForm.authState"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:$t('COMMON.AUTHORIZATION_STATUS')
          })"
            >
              <el-option
                v-for="(item,index) in authStatusList"
                :key="index"
                :label="item.authStatus"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('AUTHORIZE.UP_DATE')+':'" prop="subDate">
            <el-date-picker
              v-model="mySubmitForm.submitDate[0]"
              :placeholder="$t('ACCOUNT_MANAGEMENT.START_DATE')"
              value-format="yyyy-MM-dd"
              :clearable="false"
              range-separator
            ></el-date-picker>
            <span class="lines">-</span>
            <el-date-picker
              v-model="mySubmitForm.submitDate[1]"
              :placeholder="$t('ACCOUNT_MANAGEMENT.END_DATE')"
              value-format="yyyy-MM-dd"
              :clearable="false"
              range-separator
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <div class="flexc">
          <v-button
            size="w70"
            @click="resetClick('mySubmitFormRef')"
            class="mr16"
          >{{$t('COMMON.RESET')}}</v-button>
          <v-button size="w96" type="primary" @click="queryClick">{{$t('COMMON.SEARCH')}}</v-button>
        </div>
      </el-row>
    </el-form>
    <!-- 列表数据区 -->
    <el-table :data="mySubData" stripe>
      <el-table-column type="index" :label="$t('COMMON.SERIAL_NUMBER')" width="80"></el-table-column>
      <el-table-column prop="flowNo" :label="$t('COMMON.FLOW_NO')" width="220"></el-table-column>
      <el-table-column prop="businessName" :label="$t('COMMON.TRADE_TYPE')" width="280"></el-table-column>
      <el-table-column prop="operationType" :label="$t('AUTHORIZE.OPERATE_TYPE')" width="150">
        <template slot-scope="scope">{{ scope.row.operationType | operationType }}</template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('COMMON.SUBMIT_TIME')" width="180"></el-table-column>
      <el-table-column prop="authState" :label="$t('FIXED_DEPOSIT_OVERVIEW.STATUS')" width="180">
        <template slot-scope="scope">{{ scope.row.authState | authorizeCenterType }}</template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" width="200" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button
              class="but-detail"
              @click="detailBtn(scope.row)"
              type="text"
              size="small"
            >{{$t('COMMON.DETAIL')}}</el-button>
            <div v-if="scope.row.authState==='0'" class="line"></div>
            <el-button
              class="but-detail"
              v-if="scope.row.authState==='0'"
              @click="fCancle(scope.row)"
              type="text"
              size="small"
            >{{$t('COMMON.REVOKE')}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      class="mt16"
      @size-change="fSizeChange"
      @current-change="fCurrentChange"
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="[10,20,30,50]"
      layout="prev,pager,next,sizes,total,jumper"
      :total="totalCount"
    />
  </div>
</template>
<script>
// import { transactionRevoke, submitManagment } from '@/api/authorizeCenter';
import { searchBySubmitter, transactionRevoke } from '@/api/authorizeCenter.js';
import { queryMenuBy } from '@/api/transactionAuthorization.js';
import DateUtils from '@/utils/date-utils.js';
import filter from '@/filters/accountManagement';
import { mapState } from 'vuex';
export default {
  components: {},
  filters: {
    authorizeCenterType: filter.authorizeCenterType,
    operationType: filter.operationType,
    trademetType: filter.trademetType,
    bussinessTypeFilter: filter.bussinessTypeFilter
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  data() {
    return {
      mySubmitForm: {
        tradeType: '',
        authState: '',
        subDate: '',
        submitDate: []
      },
      min: '',
      tradeTypeList: [
        {
          tradeType: this.$t('COMMON.TOTAL'),
          value: ''
        }
      ],
      authStatusList: [
        {
          authStatus: this.$t('COMMON.TOTAL'),
          value: ''
        },
        {
          authStatus: this.$t('AUTHORIZE.AUTH_AGREE'),
          value: '1'
        },
        {
          authStatus: this.$t('AUTHORIZE.WAITE'),
          value: '0'
        },
        {
          authStatus: this.$t('AUTHORIZE.AUTH_CANCLE'),
          value: '3'
        },
        {
          authStatus: this.$t('AUTHORIZE.OUT_DATE'),
          value: '4'
        },
        {
          authStatus: this.$t('AUTHORIZE.REFUSE'),
          value: '2'
        }
      ],
      mySubData: [],
      totalCount: 0, //列表总条数
      // 分页
      page: {
        currentPage: 1,
        pageSize: 10
      },
      lang: ''
    };
  },
  created() {
    //默认选近一个月的日期
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    let startTime = DateUtils.format(start, 'yyyy-MM-dd');
    let endTime = DateUtils.format(end, 'yyyy-MM-dd');
    this.mySubmitForm.submitDate = [startTime, endTime];
    this.queryAuthsInManagmentInit();
    this.queryTransType();
    this.lang = localStorage.getItem('lang');
  },
  methods: {
    //列表查询
    queryAuthsInManagmentInit() {
      console.log('this.mySubmitForm.submitDate', this.mySubmitForm.submitDate);
      let params = {
        authState: this.mySubmitForm.authState,
        startTime: this.mySubmitForm.submitDate[0] + ' 00:00:00',
        endTime: this.mySubmitForm.submitDate[1] + ' 23:59:59',
        tcTransactionAbstract: {
          transactionType: this.mySubmitForm.tradeType
        },
        transType: '9',
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      // debugger

      searchBySubmitter(params).then(resp => {
        this.totalCount = resp.total;
        this.mySubData = resp.records;
      });
    },
    resetClick(mySubmitFormRef) {
      //默认选近一个月的日期
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.mySubmitForm.submitDate = [start, end];
      this.$refs[mySubmitFormRef].resetFields();
      this.$refs[mySubmitFormRef].resetFields();
    },
    //查询
    queryClick() {
      this.queryAuthsInManagmentInit();
    },
    //详情
    detailBtn(row) {
      row.authorizationType = 'MY_SUBMIT';
      console.log('row', row);
      this.$router.push({
        path: '/_businessManagement/authorizeCenter/detail',
        query: row
      });
    },
    //撤销
    fCancle(row) {
      console.log('row', row);
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: this.$t('USER_MANAGERMENT.IS_CANCEL_TRANSACTION'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.DETERMINE')
        },
        isCancle: true
      }).then(() => {
        let params = {
          bsnCode: row.businessCode,
          flowNo: row.flowNo
        };
        transactionRevoke(params).then(resp => {
          if (resp.authResultState === '14') {
            this.$message({
              type: 'success',
              message: this.$t('USER_MANAGERMENT.CANCEL_TRANSACTION_SUCCESS'),
              delay: 3000
            });
          } else {
            this.$message({
              type: 'fail',
              message: this.$t('USER_MANAGERMENT.CANCEL_TRANSACTION_FAIL'),
              delay: 3000
            });
          }
          this.queryAuthsInManagmentInit();
        });
      });
    },
    fSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = '1';
      this.queryAuthsInManagmentInit();
    },
    fCurrentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.queryAuthsInManagmentInit();
    },
    //查询交易类型
    queryTransType() {
      queryMenuBy({ transType: '9' }).then(resp => {
        console.log('resp:', resp);
        resp.menuList.forEach(item => {
          if (item.menuCode !== '090501' && item.menuCode !== '090502') {
            this.tradeTypeList.push({
              tradeType: this.bussinessTypeFilter(item.menuCode),
              value: item.menuCode
            });
          }
        });
      });
    },
    bussinessTypeFilter(val) {
      switch (val) {
        case '0901':
          return this.$t('OPERATORLOG.USER_MANAGEMENT');
        case '0902':
          return this.$t('OPERATORLOG.ACCOUNT_MANAGEMENT');
        case '090301':
          return this.$t('OPERATORLOG.AUTHORISATION_TEMPLATE_MANAGEMENT');
        case '090302':
          return this.$t('OPERATORLOG.TRANSACTION_AUTHORISATION_SETTINGS');
        case '090401':
          return this.$t('OPERATORLOG.SERVICE_LIMIT_SETTING');
        case '090402':
          return this.$t('OPERATORLOG.FPS_ADDRESSING_SERVICE');
        case '090403':
          return this.$t('OPERATORLOG.FUND_TRANSFER_LIMIT');
        case '090404':
          return this.$t('OPERATORLOG.EDDA_SERVICE');
        case '090405':
          return this.$t('OPERATORLOG.SET_UP_E_STATEMENT');
        case '090406':
          return this.$t('OPERATORLOG.SET_UP_TRADING_ALERTS');
        case '0906':
          return this.$t('OPERATORLOG.ACTION_LOG_ENQUIRY');
        default:
          return '';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>