<template>
  <div class="g-payDay">
    <el-form
      ref="formData"
      :model="formData"
      class="m-fromData"
      label-width="95px"
    >
      <div>
        <el-form-item :label="$t('PAYMENT.PAYMENT_ACCOUNT')" prop="payeeNo">
          <el-select v-model="formData.payeeNo" @change="payeeNo">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="date"
          class="sel-data"
          :label="$t('PAYMENT.DETAIL_DATE')"
          v-show="this.type ? true : false"
        >
          <el-date-picker class="picker" v-model="startDate" @change="changPicker1" :clearable="false" range-separator></el-date-picker>
          <span class="line">-</span>
          <el-date-picker class="picker" v-model="stopDate" @change="changPicker2" :clearable="false" range-separator></el-date-picker>

        </el-form-item>
      </div>
      <div>
        <el-form-item
          :label="$t('PAYMENT.BATCH_DEAL_STATUS')"
          class="m-status"
          prop="payeeStatus"
        >
          <el-select v-model="formData.payeeStatus" @change="payeeStatus">
            <el-option
              v-for="item in status"
              :label="$t(item.label)"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-radio-group
          v-model="formData.resource"
          class="u-marginL"
          @change="stortCutChange"
          v-show="this.type ? true : false"
        >
          <el-radio label="1">{{ $t('PAYMENT.CURRENT_DATE') }}</el-radio>
          <el-radio label="7">{{
            $t('ACCOUNT_MANAGEMENT.LATELY_SEVEN_DAYS')
          }}</el-radio>
          <el-radio label="30">{{
            $t('ACCOUNT_MANAGEMENT.LATELY_THIRTY_DAYS')
          }}</el-radio>
        </el-radio-group>
      </div>
      <div :class="[type ? 'tac' : 'searchBtn']">
        <v-button size="w70" class="resetBtn" @click="resetForm">{{
          $t('COMMON.RESET')
        }}</v-button>
        <v-button
          size="w75"
          style="margin-left:16px;"
          class="search"
          type="primary"
          @click="submitForm('ruleForm')"
          >{{ $t('COMMON.SEARCH') }}</v-button
        >
        <span
          class="u-show-search-btn"
          v-show="this.type ? false : true"
          @click="showTime"
        >
          {{ $t('PAYMENT.UNFOLD_MENU') }}
          <i class="el-icon-expand"></i>
        </span>
        <span
          class="u-show-search-btn"
          v-show="this.type ? true : false"
          @click="showTime"
        >
          {{ $t('PAYMENT.FOLD_MENU') }}
          <i class="el-icon-put-away"></i>
        </span>
      </div>
    </el-form>
    <div class="m-table">
      <batch-table
        :tableData="tableData"
        @replaceToDetails="replaceToDetails"
      />
      <div class="pageNation">
        <page-nation
          v-if="total"
          class="mt16"
          :total="total"
          :page_index="current"
          @sizeChange="sizeChange"
          @pageChange="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  acctList,
  bthTranPage,
  detail,
  executeTransfer,
  executeCharge
} from '@/api/cashManage';
import BatchTable from './batch-table.vue';
import { confirm } from '@bank-transfer/mixins';
import CONSTANTS from '@/utils/contants.js';
import i18n from '@/i18n';
import filters from '@/filters/public';
import filter from '@/filters/accountManagement';

export default {
  name: 'BatchPayday',
  components: {
    BatchTable
  },
  filters: {
    authStateFilter:filters.authStateFilter,
    tradeStateFilter:filters.tradeStateFilter,
    accountType:filter.accountType,
  },
  mixins: [confirm],
  data() {
    return {
      formData: {
        payeeNo: '',
        payeeStatus: '',
        transOutDate: '',
        resource: '30',
        date: {}
      },
      creditAcct: '', //付款账户
      current: 1, //分页
      size: 10, //条数
      startDate: '', //开始日期
      state: '', //批量状态
      stopDate: '', //结束日期
      options: [],
      status: CONSTANTS.BATCH_TRANS_TYPE,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 31536000000 ||
            time.getTime() > Date.now()
          );
        }
      },
      type: false,
      tableData: [],
      total: 0,
      loading: false
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
    this.startDate = this.dateFromat(start);
    this.stopDate = this.dateFromat(end);
    this.formData.date.startDate = this.startDate;
    this.formData.date.stopDate = this.stopDate;
    this.pageInit();
    this.acctListInit();
    
  },
  methods: {
    dateFromat(date) {
      let y = date.getFullYear();
      let m =
        Number(date.getMonth()) + 1 > 9
          ? Number(date.getMonth()) + 1
          : '0' + (Number(date.getMonth()) + 1);
      let d =
        Number(date.getDate()) > 9
          ? Number(date.getDate())
          : '0' + Number(date.getDate());
      return y + '-' + m + '-' + d;
    },
    //付款账户
    acctListInit() {
      acctList().then(res => {
        const data = res;
        let typeLabel = '';
        res &&
          res.forEach((item, index) => {
            this.options.push({
              value: index,
              label: `${this.formatAcctNo(item.acctNo)} ${
                item.cur
              } ${this.$options.filters['accountType'](item.typeLabel)}`,
              acctName: item.acctName,
              acctNo: item.acctNo,
              cur: item.cur,
              type: item.type,
              typeLabel: item.typeLabel
            });
          });
      });
    },
    //查詢
    pageInit() {
      let params = {
        creditAcct: this.creditAcct,
        current: this.current,
        size: this.size,
        startDate: this.startDate,
        state: this.state,
        stopDate: this.stopDate,
        tradeType: '02' //01:批量发薪,02:批量转账,03:自动转账收款
      };
      //分页查询批量交易
      bthTranPage(params).then(res => {
        this.total = res.total;
        this.tableData = res.list; 
        this.tableData.map((item, index) => {
          item.inputType = this.fangfile(item.inputType);
          item.state= this.$options.filters['tradeStateFilter'](item.state) 
        });
        console.log('查詢接口数据', this.tableData);
      });
      console.log('查詢参数', params);
    },

    showTime() {
      if (this.type) {
        this.type = false;
      } else {
        this.type = true;
      }
    },
    fangfile(val){
          switch (val) {
            case '1':
             return i18n.t('BRANCH_TRANSFER.ONLINE_EDIT');
              break;
            default:
             return i18n.t('BRANCH_TRANSFER.FILE_ENTERING');
          }
    },
    stortCutChange(e) {
      //快捷日期
      this.setDefaultDate(+e);
    },
    setDefaultDate(day) {
      //设置默认查询日期 => 开始日期day~当天
      // console.log(day, 'day')
      if (day == 1) {
        this.startDate = this.formatDate(Date.now() - 0 * 24 * 3600 * 1000);
        this.stopDate = this.formatDate();
        this.formData.date.startDate = this.formatDate(Date.now() - 0 * 24 * 3600 * 1000);
        this.formData.date.stopDate = this.formatDate();
      } else if (day == 7) {
        this.startDate = this.formatDate(Date.now() - 6 * 24 * 3600 * 1000);
        this.stopDate = this.formatDate();
        this.formData.date.startDate = this.formatDate(Date.now() - 6 * 24 * 3600 * 1000);
        this.formData.date.stopDate = this.formatDate();
      } else if (day == 30) {
        const end = this.formatDate(new Date());
        const start = new Date();
        this.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 29));
        this.stopDate = end;
        this.formData.date.startDate = this.formatDate(start.setTime(start.getTime() - 3600 * 1000 * 24 * 29));
        this.formData.date.stopDate = end;
      }
    },
    formatDate(ops) {
      //格式化日期,ops时间戳
      let gDate = new Date(ops || Date.now());
      console.log('gDate.getMonth',gDate.getMonth())
      let y = gDate.getFullYear();
      let M =
        gDate.getMonth() >= 9
          ? gDate.getMonth() + 1
          : '0' + (gDate.getMonth() + 1);
      console.log('M',M)
      let d = gDate.getDate() > 9 ? gDate.getDate() : '0' + gDate.getDate();
      return y + '-' + M + '-' + d;
    },
    //日期选择的值
    changPicker1(date) {
      this.startDate = this.formatDate(date.getTime());
      console.log('date---', date);
    },
    changPicker2(date) {
      this.stopDate = this.formatDate(date.getTime());
      console.log('date---', date);
    },
    //
    payeeStatus(status) {
      status != '' ? (this.state = status) : (this.state = '');
      console.log('statu---', this.state);
    },
    payeeNo(index) {
      this.creditAcct = this.options[index].acctNo;
      console.log('account---', this.creditAcct);
    },
    sizeChange(size) {
      this.size = size.page_limit;
      this.pageInit();
      console.log('size---', this.size);
    },
    pageChange(page) {
      this.current = page.page_index;
      this.pageInit();
      console.log('current---', this.current);
    },
    resetForm() {
      this.creditAcct = '';
      this.state = '';
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
      this.startDate = this.dateFromat(start);
      this.stopDate = this.dateFromat(end);
      this.formData.resource = '30';
      this.pageInit();
      this.$refs['formData'].resetFields();
    },
    submitForm() {
      this.pageInit();
    },
    replaceToDetails(value) {
      this.$router.push({
        path: '/paymentSettlement/batchTransfer/details',
        query: {
          item: value
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-payDay {
  .m-fromData {
    display: flex;
    ::v-deep .el-input__inner {
      width: 230px;
    }
    .picker {
      width: 140px;

      margin-bottom: 16px;
      ::v-deep .el-input__inner {
        width: 140px;
      }
    
    }
      ::v-deep .el-form-item__content {
        display: flex;
      }
      .line{
        padding: 10px;
      }
  }
  .m-status {
    margin-left: 20px;
  }
  .u-marginL {
    margin-left: 45px;
    margin-top: 12px;
  }
  .tac {
    margin-left: 90px;
    display: flex;
    span {
      cursor: pointer;
    }
  }
  .searchBtn {
    margin-left: 90px;
    display: flex;
    span {
      cursor: pointer;
    }
  }
}
.m-table {
  margin-top: 6px;
}
.u-show-search-btn {
  // display: flex;
  margin-top: 10px;
  margin-left: 24px;
  color: #4181fa;
  font-size: 14px;
  .el-icon-expand {
    width: 14px;
    height: 14px;
    background-image: url('~@/images/common/jiantou_chaxunzhankai.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 2px;
  }
  .el-icon-put-away {
    width: 14px;
    height: 14px;
    background-image: url('~@/images/common/jiantou_chaxunshouqi.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 2px;
  }
}
::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
::v-deep .el-table .el-table__row {
  height: 46px;
}
::v-deep .el-table td.el-table__cell div {
  padding: 0 24px !important;
}
.pageNation {
  margin-right: 20px;
}
.run {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .btn {
    margin-right: 10px;
  }
}
</style>
