<template>
  <div class="mySubmit">
    <!-- 查询区 -->
    <el-form ref="mySubmitFormRef" :model="mySubmitForm" label-width="auto">
      <el-row style="margin-left: 40px">
        <el-col :span="6">
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
        <el-col :span="6" :push="2">
          <el-form-item
            :label="$t('COMMON.AUTHORIZATION_STATUS')+':'"
            prop="authStatus"
            :style="langstatus=='en'?'margin-left: 40px;':''"
          >
            <el-select v-model="mySubmitForm.authStatus" :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING',{
            select:$t('COMMON.AUTHORIZATION_STATUS')
          })">
              <el-option
                v-for="(item,index) in authStatusList"
                :key="index"
                :label="item.authStatus"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="1" class="flexc" :style="langstatus=='en'?'margin-left: 161px':''">
          <v-button
            size="w70"
            @click="resetClick('mySubmitFormRef')"
            class="mr16"
          >{{$t('COMMON.RESET')}}</v-button>
          <v-button size="w96" type="primary" @click="queryClick">{{$t('COMMON.SEARCH')}}</v-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 列表数据区 -->
    <el-table :data="mySubData" style="width：100%" stripe>
      <el-table-column type="index" :label="$t('COMMON.SERIAL_NUMBER')" width="80"></el-table-column>
      <el-table-column prop="flowNo" :label="$t('COMMON.FLOW_NO')" width="220"></el-table-column>
      <el-table-column prop="businessName" :label="$t('COMMON.TRADE_TYPE')" width="280"></el-table-column>
      <el-table-column prop="operationType" :label="$t('AUTHORIZE.OPERATE_TYPE')"  width="150">
        <template slot-scope="scope">{{ scope.row.operationType | operationType }}</template>
      </el-table-column>
      <el-table-column prop="createTime" :label="$t('COMMON.SUBMIT_TIME')" width="180"></el-table-column>
      <el-table-column
        prop="authState"
        :label="$t('FIXED_DEPOSIT_OVERVIEW.STATUS')"
       width="180"
      >
        <template slot-scope="scope">{{ scope.row.authState | authorizeCenterType }}</template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" width="200"  fixed="right" style="display: flex">
        <template slot-scope="scope">
          <div style="display: flex">
            <el-button
              class="but-detail"
              @click="detailBtn(scope.row)"
              type="text"
              size="small"
            >{{$t('COMMON.DETAIL')}}</el-button>
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
import { queryAuthsInManagment } from '@/api/authorizeCenter';
import { queryMenuBy } from '@/api/transactionAuthorization.js';
import filter from '@/filters/accountManagement';
export default {
  components: {},
  filters: {
    ...filter,
    authorizeCenterType: filter.authorizeCenterType,
    operationType: filter.operationType
  },
  data() {
    return {
      mySubmitForm: {
        tradeType: '',
        authStatus: '0',
        submitDate: ''
      },
      min: '',
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t('BILLPAYMENT.A_WEEK'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('BILLPAYMENT.A_MONTH'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('BILLPAYMENT.THREE_MONTHS'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ],
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过3个月的
        disabledDate: time => {
          let m = 3 * 30 * 24 * 60 * 60 * 1000;
          if (this.min) {
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
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
          authStatus: this.$t('AUTHORIZE.REFUSE'),
          value: '2'
        }
      ],
      totalCount: 0,
      mySubData: [],
      langstatus: '',
      // 分页
      page: {
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.langstatus = localStorage.getItem('lang');
    //默认选近一个月的日期
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.mySubmitForm.submitDate = [start, end];
    //列表查詢接口
    this.submitManagmentInit();
    this.queryTransType();
  },
  methods: {
    //列表查詢接口
    submitManagmentInit() {
      let params = {
        // flowNo: '',
        tcAuthQueue: {
          authState: this.mySubmitForm.authStatus,
          businessCode: this.mySubmitForm.tradeType
        },
        transType: '9',
        current: this.page.currentPage,
        size: this.page.pageSize
      };

      queryAuthsInManagment(params).then(resp => {
        this.totalCount = resp.total || 0;
        this.mySubData = resp.records;
      });
    },

    //重置按钮
    resetClick(mySubmitFormRef) {
      //默认选近一个月的日期
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.mySubmitForm.submitDate = [start, end];
      this.$refs[mySubmitFormRef].resetFields();
    },
    //查询
    queryClick() {
      console.log('this.mySubmitForm', this.mySubmitForm);
      this.submitManagmentInit();
    },
    //详情
    detailBtn(row) {
      row.authorizationType = 'WAIT_AUTH';
      console.log('打印row', row);
      this.$router.push({
        path: '/_businessManagement/authorizeCenter/detail',
        query: row
      });
    },
    fSizeChange(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.submitManagmentInit();
    },
    fCurrentChange(start) {
      this.page.currentPage = start;
      this.submitManagmentInit();
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
     bussinessTypeFilter(val){
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
  },
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>