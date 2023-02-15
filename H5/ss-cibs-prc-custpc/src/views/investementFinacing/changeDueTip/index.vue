<template>
  <div class="g-changeDueTip" v-loading="loading">
    <div class="u-form">
      <el-form ref="formData" :model="formData" class="m-form" label-width="320px;">
        <el-form-item :label="$t(`FIXED_DEPOSIT_OVERVIEW.ACCOUNT_NUMBER`)">
          <el-select v-model="formData.account">
            <el-option
              v-for="item in accountInfoList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="g-btn">
        <VButton size="w70" style="margin-right:22px;" @click="reset">{{$t(`COMMON.RESET`)}}</VButton>
        <VButton
          :style="{ overflow: 'hidden' }"
          size="wMin70"
          @click="search"
          type="primary"
        >{{$t(`COMMON.SEARCH`)}}</VButton>
      </div>
    </div>

    <div class="m-table">
      <el-table :data="tableData" height="390px">
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_NUMBER`)"
          prop="altId"
          width="150"
        ></el-table-column>
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.VALUE_DATE`)"
          prop="effdate"
          width="130px"
        >
          <template slot-scope="scope">{{datefilter(scope.row.effdate)}}</template>
        </el-table-column>
        <el-table-column :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURIT`)" prop="matdate" width="130px">
          <template slot-scope="scope">{{datefilter(scope.row.matdate)}}</template>
        </el-table-column>
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)"
          prop="depositAmount"
          width="145px"
        >
          <template slot-scope="scope">{{ccyfilter(scope.row.cur) + scope.row.depositAmount}}</template>
        </el-table-column>
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
          prop="deposiTimes"
          :width="lang==='en'?'150':width='150'"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.depositTermType=='0'">{{fixedType(scope.row.deposiTime)}}</span>
          <span v-if="scope.row.depositTermType=='1'">{{scope.row.deposiTimes}}</span>
        </template>
        </el-table-column>
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.INTEREST_RATES`)"
          prop="rateOfYear"
          width="115px"
        ></el-table-column>
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
          prop="maturityInstructs"
          width="170"
        >
          <template v-slot="{row}">{{ maturityInstructsFilter(row.maturityInstruct)}}</template>)
        </el-table-column>
        <el-table-column :label="$t(`COMMON.OPERATION`)" :width="lang==='en'?'360px':width='150'">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.depositTermType=='1'||scope.row.maturityInstruct=='6'||scope.row.reservationNumber?true:false"
              @click="changeTips(scope.row)"
            >{{$t(`FIXED_DEPOSIT_OVERVIEW.AMEND_MATURITY_INSTRUCTION`)}}</el-button>
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
  </div>
</template>

<script>
import {
  // dueTipsList,
  queryAcctList,
  openQueryAccountList,
  // changeStatusList,
  queryDepositListPage
  // updateInstructionsSubmit
} from '@/api/openFixed.js';
import CONSTANTS from '@/utils/contants.js';
import tool from '@/dataTools/tools/moneyTools.js';
import filters from '@/filters/public';
import { createNamespacedHelpers } from 'vuex';
import _ from 'lodash';
import { safeGetLocalStorage } from '@/utils';
const { mapMutations, mapGetters, mapState } = createNamespacedHelpers('app');
export default {
  data() {
    return {
      formData: {
        account: '',
        status: '1'
      },
      accountInfoList: [],
      status: [],
      tableData: [],
      loading: false,
      // 分页控制
      page: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0 //列表总条数
    };
  },
  computed: {
    ...mapState(['lang'])
  },
  created() {
    console.log(this.$route, 'this.$route.params');
    this.accountLists();
  },
  mounted() {},
  filters: {
    fixedTermType:filters.fixedTermType
  },

  methods: {
    changeTips(value) {
      console.log(value, 'value');
      this.$router.push({
        name: 'changeDueTipInforMation',
        params: value
      });
    },

    //获取下拉框列表，并查询列表数据
    accountLists() {
      this.loading = true;
      openQueryAccountList()
        .then(resp => {
          console.log(resp, 'resp');
          if (resp) {
            console.log(11111);
            let accountInfoList = [];
            resp.list.forEach((item, index) => {
              let obj = {
                label:
                  item.prmacc +
                  '-' +
                  this.ccyFilter(item.cur) +
                  '-' +
                  this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT'),
                value: item.prmacc + '-' + item.cur
              };
              return accountInfoList.push(obj);
            });
            // if (accountInfoList == '') {
            //   return (this.accountInfoList = []);
            // }
            this.accountInfoList = accountInfoList;
            console.log(this.accountInfoList, ' this.accountInfoList');
            this.loading = false;
            this.formData.account = this.accountInfoList[0].value;
            this.getList();
            return;
          } else {
            console.log(321312);
            this.accountInfoList = [];
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //获取列表
    getList() {
      this.loading = true;
      // console.log(this.formData, 'formData');
      let params = {
        accountCode: this.formData.account.split('-')[0],
        cur: this.formData.account.split('-')[1],
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      queryDepositListPage(params)
        .then(res => {
          console.log(res.depositInfoList, 'res.depositInfoList');
          if (res && res.depositInfoList) {
            res.depositInfoList.forEach(item => {
              let deposiTime = item.deposiTime.substr(
                item.deposiTime.length - 1,
                1
              );
              let number = item.deposiTime.substr(
                0,
                item.deposiTime.length - 1
              );
              console.log(number, 'number');
              if (number == '1') {
                if (deposiTime == 'D') {
                  console.log(item.deposiTime, 'item.deposiTime');
                  item.deposiTimes = item.deposiTime.replace(
                    /(.*)D/,
                    `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.ONE_DAYS')}`
                  );
                  console.log(item.deposiTime, 'item.deposiTim1e');
                }
                if (deposiTime == 'M') {
                  item.deposiTimes = item.deposiTime.replace(
                    /(.*)M/,
                    `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.MONTH')}`
                  );
                }
                this.totalCount = res.total;
                this.tableData = res.depositInfoList;
                item.depositAmount = tool.currencyFormat(
                  item.depositAmount,
                  '',
                  2
                );
              } else {
                if (deposiTime == 'D') {
                  console.log(item.deposiTime, 'item.deposiTime');
                  item.deposiTimes = item.deposiTime.replace(
                    /(.*)D/,
                    `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DAY')}`
                  );
                  console.log(item.deposiTime, 'item.deposiTim1e');
                }
                if (deposiTime == 'M') {
                  item.deposiTimes = item.deposiTime.replace(
                    /(.*)M/,
                    `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DOUBLE_MOTH')}`
                  );
                }
                this.totalCount = res.total;
                this.tableData = res.depositInfoList;
                item.depositAmount = tool.currencyFormat(
                  item.depositAmount,
                  '',
                  2
                );
              }

              item.rateOfYear = item.rateOfYear + '%p.a.';
            });
          } else {
            this.tableData = [];
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //过滤到期指示
    maturityInstructsFilter(value) {
      console.log(value, 'value', CONSTANTS.MATURITY_TRUCIONS);
      return value
        ? CONSTANTS.getMaturity().find(tpye => tpye.value == value).label
        : '';
    },
    //查询
    search() {
      this.page.currentPage = 1;
      this.getList();
    },
    reset() {
      this.$router.go(0);
    },
    // 每页大小发生变化时
    fSizeChange(pageSize) {
      console.log('pageSize', pageSize);
      // this.page.currentPage = '1';
      this.page.pageSize = pageSize;
      this.getList();
    },

    // 当前页数发生变化时
    fCurrentChange(currentPage) {
      console.log('currentPage', currentPage);
      this.page.currentPage = currentPage;
      this.getList();
    },
    ccyFilter(val) {
      switch (val) {
        case 'HKD':
          return this.$t('ACCOUNT_MANAGEMENT.HKD');
        case 'AUD':
          return this.$t('ACCOUNT_MANAGEMENT.AUD');
        case 'CAD':
          return this.$t('ACCOUNT_MANAGEMENT.CAD');
        case 'CNY':
          return this.$t('ACCOUNT_MANAGEMENT.CNY');
        case 'EUR':
          return this.$t('ACCOUNT_MANAGEMENT.EUR');
        case 'GBP':
          return this.$t('ACCOUNT_MANAGEMENT.GBP');
        case 'JPY':
          return this.$t('ACCOUNT_MANAGEMENT.JPY');
        case 'NZD':
          return this.$t('ACCOUNT_MANAGEMENT.NZD');
        case 'SGD':
          return this.$t('ACCOUNT_MANAGEMENT.SGD');
        case 'TWD':
          return this.$t('ACCOUNT_MANAGEMENT.TWD');
        case 'USD':
          return this.$t('ACCOUNT_MANAGEMENT.USD');
        case 'CHF':
          return this.$t('ACCOUNT_MANAGEMENT.CHF');
        case 'CNH':
          return this.$t('ACCOUNT_MANAGEMENT.CNH');
        case 'DKK':
          return this.$t('ACCOUNT_MANAGEMENT.DKK');
        case 'SEK':
          return this.$t('ACCOUNT_MANAGEMENT.SEK');
        case 'THB':
          return this.$t('ACCOUNT_MANAGEMENT.THB');
        default:
          return val;
      }
    },
    datefilter(val) {
      let y = val.substring(0, 4),
        m = val.substring(4, 6),
        d = val.substring(6, 8);
      console.log(y, 'yyyyyy');
      console.log(m, 'mmmm');
      console.log(d, 'ddddd');
      return y + '-' + m + '-' + d;
    },
    ccyfilter(val) {
      return filters.ccyFilter(val);
    },
    fixedType(val){
      return filters.fixedTermType(val)
    }
  }
};
</script>

<style lang="scss" scoped>
.u-form {
  display: flex;
}
.m-form {
  // display: flex;
  ::v-deep .el-input__inner {
    width: 230px;
  }
  ::v-deep .el-input--suffix {
    width: 230px !important;
  }
}
.el-form-item {
  display: flex;
  margin-left: 22px;
  // margin-top: 22px;
}
.g-btn {
  display: flex;
  // margin-top: 22px;
  margin-left: 44px;
}
.m-table {
}
::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
  word-break: break-word !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
  word-break: break-word !important;
}
::v-deep .el-table td.el-table__cell div {
  padding: 0 24px !important;
  word-break: break-word !important;
}
</style>