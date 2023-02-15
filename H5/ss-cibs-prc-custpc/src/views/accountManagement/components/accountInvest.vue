<template>
  <div class="g-account-invest f-mt-24">
    <!-- 投资账户 -->
    <title-bar :title="$t('ACCOUNT_MANAGEMENT.INVESTMENT_ACCOUNT')"></title-bar>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'accInvestmentValueList' }"
    >
      <!-- 账户号码 -->
      <el-table-column
        prop="accountNo"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
        width="200"
      >
        <template slot-scope="scope">
          <div
            class="u-accountno"
            @click="toAccountDetial(scope.row)"
          >{{ formatAccountNo(scope.row.accountNo) }}</div>
        </template>
      </el-table-column>
      <!-- 账户名称 -->
      <el-table-column prop="accountName" width="220">
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
      <!-- 账户类别 -->
      <el-table-column
        prop="accountType"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"
        width="150"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.accountType | accountType }}</div>
        </template>
      </el-table-column>
      <!-- 市值 -->
      <el-table-column
        prop="investmentValue"
        :label="$t('ACCOUNT_MANAGEMENT.MARKET_VALUE')"
        width="180"
        align="right"
      >
        <template slot-scope="scope">{{ formatMoney(scope.row.currency,scope.row.investmentValue) }}</template>
      </el-table-column>
      <!--最后更新日期-->
      <el-table-column
        prop="lastUpdateDate"
        :label="$t('ACCOUNT_MANAGEMENT.LAST_UPDATE_TIME')"
        width="200"
      ></el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" :label="$t('ACCOUNT_MANAGEMENT.STATUS')" width="90">
        <template slot-scope="scope">{{ scope.row.status | sharesFilter }}</template>
      </el-table-column>
    </el-table>
    <!-- 债券/基金总值 -->
    <div class="m-money-text">
      {{$t('ACCOUNT_MANAGEMENT.TOTAL_BOND_FUND_VALUE')}}:
      <span
        v-for="(item,index) in investmentValueList"
        :key="index"
      >{{ `${formatMoney(item.currency,item.investmentValue)}` }}</span>
    </div>
    <div class="warm-tip">
      <span class="red">*</span>
      <span>{{$t('ACCOUNT_MANAGEMENT.TIPONE')}}</span>
    </div>
    <div class="f-d-f f-jc-sb">
      <el-pagination
        layout="prev, pager, next,sizes, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      ></el-pagination>
    </div>
    <!-- 温馨提示 -->
    <div class="m-tips">
      <p class="u-title">{{$t('ACCOUNT_MANAGEMENT.TIPS_TITLE')}}</p>
      <p class="u-details">{{$t('ACCOUNT_MANAGEMENT.INVEST_TIPS_CONTENT')}}</p>
    </div>
  </div>
</template>

<script>
import { formatMoney } from '@/utils/tools.js';
import mathTools from '@/utils/mathTools.js';
import filters from '@/filters/accountManagement';
import { investmentInvAccount } from '@/api/accountManagement.js';
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
      investmentValueList: '',
      loading: false
    };
  },
  mounted() {
    this.investmentInvAccount();
  },
  computed: {
    // investmentValueCom() {
    //   const result = JSON.parse(this.investmentValue);
    //   let str = '';
    //   if (Object.keys(result).length) {
    //     Object.keys(result).forEach(
    //       key => (str = str + `${key}: ${String(result[key]).toMoney()} `)
    //     );
    //   }
    //   return str;
    // }
  },
  filters,
  methods: {
    formatMoney,
    async investmentInvAccount() {
      let params = {
        investmentCurrent: this.currentPage,
        investmentSize: this.pageSize,
        stockCurrent: 1,
        stockSize: 10
      };
      this.loading = true;
      const result = await investmentInvAccount(params);
      this.loading = false;
      console.log(result,'result');
      if (result && result.investmentAccountList) {
        result.investmentAccountList.forEach((item, index) => {
          // item.id = index;
          this.$set(item, 'id', index + 1);
          // 卡bug
          if (item.accInvestmentValueList.length !== 0) {
            this.$set(item, 'id', 0);
          }
          // console.log(item)
          if (item.accInvestmentValueList) {
            item.accInvestmentValueList.forEach((itm, idx) => {
              this.$set(itm, 'id', Number('' + (index + 1) + (idx + 1)));
            });
          }
        });
        this.tableData = result.investmentAccountList;
        this.total = result.investmentTotal;
        this.investmentValueList = result.investmentValueList;
      } else {
        this.tableData = [];
        this.total = 0;
        this.currentPage = 1;
      }
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.investmentInvAccount();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.investmentInvAccount();
    },
    // 点击tab标签。
    tabClick() {
      // console.log("tab", tab);
    },
    //金额格式化
    formatter(row) {
      return mathTools.addDecollator(row.balance);
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    // 显示/隐藏账户名称
    eyeClick() {
      this.isEye = !this.isEye;
    },
    //路由跳转
    toAccountDetial(data) {
      data.type = 3;
      // data.investmentValue = this.investmentValue;
      let params = JSON.stringify(data);
      this.$emit('showDetailHandle', params);
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
.f-mt-40 {
  margin-top: 40px;
}
.g-account-invest {
  .nav-bar {
    margin-bottom: 24px;
  }
  .u-accountno {
    cursor: pointer;
    display: inline-block;
    color: #4181fa;
  }
  .m-money-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin-top: 16px;
    font-weight: 500;
    > span {
      display: inline-block;
      margin-left: 4px;
      margin-right: 8px;
    }
  }
  .warm-tip {
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 22px;
    .red {
      color: red;
    }
  }
  .m-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin: 50px 0 0 0;
    .u-details {
      color: rgba(0, 0, 0, 0.45);
      margin-top: 16px;
    }
  }
}
.f-mt-24 {
  margin-top: 24px;
}
::v-deep .el-table [class*='el-table__row--level'] .el-table__expand-icon {
  display: none;
}
::v-deep .is-right {
  padding-right: 5px;
}
::v-deep .is-right.is-leaf.el-table__cell {
  padding-right: 17px;
}
</style>