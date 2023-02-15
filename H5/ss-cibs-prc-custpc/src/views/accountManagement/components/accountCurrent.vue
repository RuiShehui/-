<template>
  <div class="g-account-current">
    <el-table
      :data="tableData"
      :stripe="true"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'currencyList' }"
      v-loading="loading"
    >
      <!-- 账户号码 -->
      <el-table-column
        prop="accountNo"
        width="170"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
      >
        <template slot-scope="scope">
          <div class="f-d-i">{{formatAccountNo(scope.row.accountNo)}}</div>
        </template>
      </el-table-column>
      <!-- 账户名称 -->
      <el-table-column prop="accountName">
        <template #header>
          <div class="f-d-f f-ai-c">
            <div>{{$t('ACCOUNT_MANAGEMENT.ACCOUNT_NAME')}}</div>
            <div class="f-ml-6 f-c-p m-eye-img" @click="eyeClick">
              <img :src="isEye ? eyeOn : eyeOff" />
            </div>
          </div>
        </template>
        <template
          slot-scope="scope"
        >{{isEye ? scope.row.accountName : scope.row.accountName ? '*******' : ''}}</template>
      </el-table-column>
      <!--账户类别-->
      <el-table-column
        prop="accountType"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"
        width="190"
      >
        <template slot-scope="scope">
          <div
            v-show="scope.row.accountNo"
          ><span v-if="lang === 'en'">{{ scope.row.currency }}</span><span v-else>{{ scope.row.currency | ccyFilter }}</span> {{ scope.row.accountType | accountType }}</div>
          <div v-show="!scope.row.accountNo">-<span v-if="lang === 'en'">{{ scope.row.currency }}</span><span v-else>{{ scope.row.currency | ccyFilter }}</span></div>
        </template>
      </el-table-column>
      <!-- 账户结余 -->
      <el-table-column
        class="money-right"
        prop="accountBalance"
        :label="$t('ACCOUNT_MANAGEMENT.USER_BALANCE')"
        width="160"
        align="right"
      >
        <template
          slot-scope="scope"
        >{{ formatMoney(scope.row.currency,scope.row.accountBalance,false) }}</template>
      </el-table-column>
      <!-- 可用结余 -->
      <el-table-column
        prop="availableBalance"
        :label="$t('ACCOUNT_MANAGEMENT.AVAILABLE_BALANCE')"
        width="160"
        align="right"
      >
        <template
          slot-scope="scope"
        >{{ formatMoney(scope.row.currency,scope.row.availableBalance,false) }}</template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" :label="$t('ACCOUNT_MANAGEMENT.STATUS')" width="100">
        <template slot-scope="scope">{{ scope.row.status | accountStateFilter }}</template>
      </el-table-column>
      <!-- 操作： 明细-->
      <el-table-column :label="$t('ACCOUNT_MANAGEMENT.OPERATION')" width="110">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.currencyList"
            class="u-btn-color"
            type="text"
            @click="toTransactionDetailEnquiry(scope.row)"
          >{{$t('ACCOUNT_MANAGEMENT.DETAIL_BUTTON')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 最后更新时间 -->
    <div class="u-money-text">
      {{$t('FIXED_DEPOSIT_OVERVIEW.LAST_UPDATE_TIME')}}
      <span>{{ lastUpdateTime }}</span>
    </div>
    <div class="m-table-footer f-d-f f-jc-sb f-mt-16">
      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import mathTools from '@/utils/mathTools.js';
import { depositCasaAccount } from '@/api/accountManagement.js';
import filters from '@/filters/accountManagement';
import { formatMoney } from '@/utils/tools.js';
import _ from 'lodash';
// import {transactionAccount} from '@/api/home.js';
import { createNamespacedHelpers } from 'vuex';
const { mapState } = createNamespacedHelpers('app');
export default {
  data() {
    return {
      eyeOff: require('@/images/accountManage/closeEye.png'),
      eyeOn: require('@/images/accountManage/openEye.png'),
      isEye: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      lastUpdateTime: '--',
      currentDeposit: '',
      loading: true
    };
  },
  computed: {
    ...mapState(['lang'])
  },
  watch: {
    lang(newValue, oldValue) {
      console.log(newValue, 'new');
    }
  },
  filters,
  created() {},
  mounted() {
    this.getCasaAccountData();
    // console.log(this.formatMoney('HKD', -100000), 'formatMoney');
  },
  methods: {
    // 金额格式转换
    formatMoney,
    async getCasaAccountData() {
      let params = {
        // roleCode: this.roleCode,
        // roleName: this.roleName,
        fixedCurrent: 1,
        fixedSize: 10,
        otherCurrent: this.currentPage,
        otherSize: this.pageSize
      };
      const result = await depositCasaAccount(params);
      if (result && result.casaAccountList) {
        this.tableData = result.casaAccountList.map((item, index) => {
          // item.id = index;
          this.$set(item, 'id', index + 1);
          if (item.accountType !== 'MULTICURRENCY') {
            item = { ...item, ...item.currencyList[0] };
            delete item.currencyList;
          }
          if (item.currencyList) {
            item.currencyList.forEach((itm, idx) => {
              this.$set(itm, 'id', Number('' + (index + 1) + (idx + 1)));
              this.$set(itm, 'account', item.accountNo);
              this.$set(itm, 'accountType', item.accountType);
              this.$set(itm, 'accountTypeCode', item.accountTypeCode);
            });
          }
          return item;
        });
        console.log(result.casaAccountList, 'result.casaAccountList');
        //  = _.cloneDeep(result.casaAccountList);
        this.total = result.casaTotal;
        this.lastUpdateTime = result.endUpdateDate;
        // this.currentDeposit = result.currentDeposit;
      } else {
        this.tableData = [];
        this.total = 0;
        this.currentPage = 1;
      }
      this.loading = false;
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getCasaAccountData();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCasaAccountData();
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    // 显示/隐藏账户名称
    eyeClick() {
      this.isEye = !this.isEye;
    },
    //跳转账户详情
    toAccountDetial(data) {
      console.log(data);
      data.type = 0;
      let params = JSON.stringify(data);
      this.$router.push({
        path: '/accountManagement/accountDetails',
        query: { params: params }
      });
    },
    //跳转交易明细
    toTransactionDetailEnquiry(row) {
      this.$router.push({
        name: 'transactionDetailEnquiry',
        params: {
          accountNo: row.account ? row.account : row.accountNo,
          currency: row.currency,
          accountType: row.accountType,
          accountTypeCode: row.accountTypeCode
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .cell {
  margin-left: 12px;
}
.m-eye-img {
  height: 16px;
  width: 16px;
}
::v-deep .el-button {
  height: 22px;
}
.f-mt-16 {
  margin-top: 16px;
}
.g-account-current {
  margin-top: 24px;
  .f-accountno {
    margin-left: 20px;
  }
  .f-d-i {
    display: inline-block;
  }
  .f-account-type {
    cursor: pointer;
  }
  .f-btn-color1 {
    color: rgba(0, 0, 0, 0.65);
  }
  .m-table-footer {
    font-size: 14px;
  }
}
.u-money-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin: 16px 0px;
}
::v-deep .is-right {
  padding-right: 5px;
}
::v-deep .is-right.is-leaf.el-table__cell {
  padding-right: 17px;
}
</style>