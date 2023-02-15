<template>
  <div class="g-beforeMaturity"  v-loading="accountLoading">
    <div class="m-form">
      <el-form ref="formData"  :model="formData" label-width="450px;">
      <el-form-item
        :label="$t('FIXED_DEPOSIT_OVERVIEW.ACCOUNT_NUMBER')"
        prop="prmacc"
        class="u-sel"
      >
        <el-select v-model="formData.prmacc">
          <el-option
            v-for="(item,index) in option"
            :key="index"
            :label="formatAccountNo(item.label)"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <VButton size="w70" style="margin-right:16px;" @click="reset">{{$t('COMMON.RESET')}}</VButton>
      <VButton :style="{ overflow: 'hidden' }"
          size="wMin70" type="primary" @click="search()">{{$t('COMMON.SEARCH')}}</VButton>
    </div>

    <div class="m-table">
   <el-table :data="tableData" height="390px" stripe="">
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_NUMBER`)"
          prop="altId"
          width="190"
        ></el-table-column>
        <el-table-column :label="$t(`FIXED_DEPOSIT_OVERVIEW.VALUE_DATE`)" prop="effdate" width="130px">
          <template slot-scope="scope">
            {{datefilter(scope.row.effdate)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURIT`)" prop="matdate" width="130px">
          <template slot-scope="scope">
            {{datefilter(scope.row.matdate)}}
          </template>
        </el-table-column>
        <el-table-column :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_AMOUNT`)" prop="depositAmount"  width="145px">
          <template slot-scope="scope">
            {{ccyfilter(scope.row.cur)  + scope.row.depositAmount}}
          </template>
        </el-table-column>
        <el-table-column :label="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)" prop="deposiTimes" width="130px"></el-table-column>
        <el-table-column :label="$t(`FIXED_DEPOSIT_OVERVIEW.INTEREST_RATES`)" prop="rateOfYear" width="130px"></el-table-column>
        <el-table-column
          :label="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
          prop="maturityInstructs"
          width="170"
        >
          <template v-slot="{row}">{{ maturityInstructsFilter(row.maturityInstruct)}}</template>)
        </el-table-column>
        <el-table-column :label="$t(`COMMON.OPERATION`)" fixed="right"  :width="lang==='en'?'360px':width='150'">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.depositTermType=='1'||scope.row.maturityInstruct=='6'||scope.row.reservationNumber?true:false"
              @click="changeTips(scope.row)"
            >{{$t(`FIXED_DEPOSIT_OVERVIEW.AMEND_MATURITY_INSTRUCTION`)}}</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <VButton
        size="w210"
        type="primary"
        class="f-btn"
        @click="$router.go(-1)"
      >{{$t('COMMON.BACK')}}</VButton>
    </div>
  </div>
</template>

<script>
import {
  queryAcctList,
  queryDepositListPage,
  openQueryAccountList
} from '@/api/openFixed.js';
import mathTools from '@/utils/mathTools.js';
import tool from '@/dataTools/tools/moneyTools.js';
import CONSTANTS from '@/utils/contants.js';
import { getActiveClickArr } from '@/utils';
import filters from '@/filters/public';
import { createNamespacedHelpers } from 'vuex';
import _ from 'lodash';
import { safeGetLocalStorage } from '@/utils';
const { mapMutations, mapGetters, mapState } = createNamespacedHelpers('app');
export default {
  data() {
    return {
      formData: {
        account: ''
      },
      tableData: [],
      option: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      accountLoading: false
    };
  },
   computed: {
    ...mapState(['lang']),

  },
  created() {
    console.log(this.$route.query.params,'this.$route.query.params')
    this.formData.prmacc = this.formData.prmacc + '-' + this.formData.cur;
    this.changeAccount();
    // this.getList();
  },
  mounted() {

  },
  methods: {
    ...mapMutations(['setSliderMenus', 'setSliderMenusAct', 'setBreadcrumb']),
    changeAccount() {
      this.accountLoading = true;
      let accountList = [];
      queryAcctList().then(resp => {
        console.log('resp', resp);
        resp.accountInfoList.forEach(item => {
          let obj = {};
          CONSTANTS.ACCOUNT_TYPE_ARRAY.forEach(type => {
            obj = {
              label: item.accountNo + '-' + filters.ccyFilter(type) + '-' + this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT'),
              value: item.accountNo + '-' + type
            };
            return accountList.push(obj);
          });
        });
        this.option = accountList;
        console.log('accountList', accountList);
        this.$nextTick(() => {

          const params =JSON.parse(this.$route.query.params);
          console.log(params, 'params');
          this.formData.prmacc = params.acctNo + '-' + params.cur;
          this.getList();
        });
      });
    },
    toDetails(value) {
      console.log(value,'value')
      let obj = JSON.stringify(value);
      this.$router.push({
        // path: '/investmentFinancing/fixedDeposit/details/beforeDetails',
        name:'beforeDetails',
        // query:value
        query: {
          params: obj
        }
      });
    },
    getList() {
      this.accountLoading = true;
      console.log(this.formData, 'this.formData');
      this.accountCode = this.formData.prmacc.split('-');
      this.cur = this.accountCode[1];
      // console.log(accountCode, 'accountCode');
      let params = {
        accountCode: this.accountCode[0],
        cur: this.cur,
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      queryDepositListPage(params).then(res => {
        let queryPage = [];
        res.depositInfoList.forEach(item => {
          console.log(item,'item')
          let deposiTime = item.deposiTime.substr(
            item.deposiTime.length - 1,
            1
          );
          if (deposiTime == 'D') {
            item.deposiTimes = item.deposiTime.replace(/(.*)D/, `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DAY')}`);
          }
          if (deposiTime == 'M') {
            item.deposiTimes = item.deposiTime.replace(/(.*)M/, `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.MONTH')}`);
          }
          CONSTANTS.MATURITY_TRUCIONS.forEach(tpye => {
            if (item.maturityInstruct == tpye.value) {
              item.maturityInstructs = tpye.label;
            }
          });
          item.depositAmount = tool.currencyFormat(item.depositAmount, '', 2);
          item.rateOfYear = item.rateOfYear + '%p.a.';
          this.accountLoading = false;
        });
        this.tableData = res.depositInfoList;
        this.totalCount = res.total;
        this.accountLoading = false;
      });
    },
    getLists() {
      this.accountLoading = true;
      let params = {
        accountCode: this.accountCode[0],
        cur: this.cur,
        current: this.page.currentPage,
        size: this.page.pageSize
      };
      queryDepositListPage(params).then(res => {
        let queryPage = [];
        res.depositInfoList.forEach(item => {
          CONSTANTS.SELECT_DATE_LISTS.forEach(date => {
            if (item.deposiTime == date.value) {
              item.deposiTime = date.label;
            }
          });
          console.log(item, 'item');
          CONSTANTS.MATURITY_TRUCIONS.forEach(tpye => {
            if (item.maturityInstruct == tpye.value) {
              item.maturityInstructs = tpye.label;
            }
          });
          item.depositAmount = tool.currencyFormat(item.depositAmount, '', 2);
          item.rateOfYear = item.rateOfYear + '%p.a.';
          this.accountLoading = false;
        });
        this.tableData = res.depositInfoList;
        console.log(this.tableData, 'tableData');

        this.totalCount = res.total;
        this.accountLoading = false;
      });
    },
    changeTips(row) {
       let menu = JSON.parse(localStorage.getItem('userMenus'));
        let menuItem = menu.filter(item => {
          return item.id === '04';
        });
        this.$nextTick(() => {
          const breadcrumbList = getActiveClickArr('0403');
          this.setBreadcrumb(breadcrumbList);
          this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
        });
      this.$router.push({
        // TODO
        name:'changeDueTipInforMation',
        params: row
      });
    },
    reset() {
      // this.$refs['formData'].resetFields()
      this.formData.acctNo = '';
    },
    search() {
      this.getList();
    },
    fSizeChange(pageSize) {
      console.log('pageSize', pageSize);
      // this.page.currentPage = '1';
      this.page.pageSize = pageSize;
      this.getLists();
    },

    // 当前页数发生变化时
    fCurrentChange(currentPage) {
      console.log('currentPage', currentPage);
      this.page.currentPage = currentPage;
      this.getLists();
    },
      //过滤到期指示
    maturityInstructsFilter(value) {
      console.log(value, 'value', CONSTANTS.MATURITY_TRUCIONS);
      return value
        ? CONSTANTS.getMaturity().find(tpye => tpye.value == value).label
        : '';
    },
    datefilter(val){
      let y = val.substring(0,4),
          m = val.substring(4,6),
          d = val.substring(6,8)
      console.log(y,'yyyyyy')
      console.log(m,'mmmm')
      console.log(d,'ddddd')
      return y+'-'+m+'-'+ d
    },
      //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    ccyfilter(val) {
      return filters.ccyFilter(val);
    },
  }
};
</script>

<style lang="scss" scoped>
.g-beforeMaturity {
  .m-form {
    // position: relative;
    display: flex;
  }
  .u-sel {
    ::v-deep .el-form-item__content {
      width:375px !important;
    }
  }
  .u-btn {
    // position: absolute;
    // top: 0;
    // left: 325px;
    // // right: 0;
    display: flex;
  }
  .f-btn {
    margin-top: 36px;
    margin-left: 37%;
  }
}
::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
::v-deep .el-table td.el-table__cell div {
  padding: 0 24px !important;
}
</style>