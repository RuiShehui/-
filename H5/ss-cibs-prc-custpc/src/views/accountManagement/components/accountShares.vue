<template>
  <div class="g-account-shares">
    <!-- 股票托管账户 -->
    <title-bar :title="$t('ACCOUNT_MANAGEMENT.STOCK_ESCROW_ACCOUNT')"></title-bar>
    <el-table v-loading="loading" :data="tableData" stripe default-expand-all>
      <!-- 账户号码 -->
      <el-table-column
        prop="accountNo"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
        width="200"
      >
        <template slot-scope="scope">
          <div class="u-accountno" @click="toAccountDetial(scope.row)">{{ scope.row.accountNo }}</div>
        </template>
      </el-table-column>
      <!-- 账户名称 -->
      <el-table-column prop="accountName" width="210">
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
      <!-- 可用按揭额度 -->
      <el-table-column
        prop="mortgageAmount"
        :label="$t('ACCOUNT_MANAGEMENT.AVAILABLE_MORTGAGE_LIMIT')"
        width="200"
        align="right"
      >
        <template slot-scope="scope">{{ formatMoney('HKD',scope.row.mortgageAmount) }}</template>
      </el-table-column>
      <!-- 市值 -->
      <el-table-column
        prop="marketValue"
        :label="$t('ACCOUNT_MANAGEMENT.MARKET_VALUE')"
        width="200"
        align="right"
      >
        <template slot-scope="scope">{{ formatMoney('HKD',scope.row.stockAccValue) }}</template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" :label="$t('ACCOUNT_MANAGEMENT.STATUS')" width="90">
        <template slot-scope="scope">{{ scope.row.status | sharesFilter }}</template>
      </el-table-column>
    </el-table>
    <!-- 股票总值 -->
    <div class="m-money-text">
      {{$t('ACCOUNT_MANAGEMENT.SHARES_TOTAL')}}:
      <span>{{stockValue?`${formatMoney('HKD',stockValue)}`:'- -'}}</span>
    </div>
    <div class="warm-tip">
      <span class="red">*</span>
      <span>{{$t('ACCOUNT_MANAGEMENT.TIP')}}</span>
    </div>
    <div class="m-pagination f-d-f f-jc-sb">
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
  </div>
</template>

<script>
import mathTools from '@/utils/mathTools.js';
import filters from '@/filters/accountManagement';
import { investmentSecAccount } from '@/api/accountManagement.js';
import { formatMoney } from '@/utils/tools.js';
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
      stockValue: '',
      runBatchSing: '',
      loading: false
    };
  },
  mounted() {
    this.investmentSecAccount();
  },
  filters,
  methods: {
    formatMoney,
    async investmentSecAccount() {
      let params = {
        investmentCurrent: 1,
        investmentSize: 10,
        stockCurrent: this.currentPage,
        stockSize: this.pageSize
      };
      this.loading = true;
      const result = await investmentSecAccount(params);
      this.loading = false;
      console.log(result);
      if (result && result.stockAccountList) {
        this.runBatchSing = result.runBatchSing || '0';
        result.stockAccountList.forEach((item, index) => {
          // item.id = index;
          this.$set(item, 'id', index + 1);
          // console.log(item)
          item.accountDetailsList.forEach((itm, idx) => {
            this.$set(itm, 'id', Number('' + (index + 1) + (idx + 1)));
          });
          // }
        });
        this.tableData = result.stockAccountList;
        this.total = result.stockTotal;
        this.stockValue = result.stockValue;
      } else {
        this.tableData = [];
        this.total = 0;
        this.currentPage = 1;
      }
    },
    // 点击tab标签
    tabClick() {
      // console.log("tab", tab);
    },
    //金额格式化
    formatter(row) {
      return mathTools.addDecollator(row.balance);
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.investmentSecAccount();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.investmentSecAccount();
    },
    // 显示/隐藏账户名称
    eyeClick() {
      this.isEye = !this.isEye;
    },
    //路由跳转
    toAccountDetial(data) {
      console.log(data);
      if (this.runBatchSing === '0') {
        data.type = 2;
        data.stockValue = this.stockValue;
        let params = JSON.stringify(data);
        this.$emit('showDetailHandle', params);
      } else {
        this.$confirm({
          type: 'warn',
          message: this.$t('ACCOUNT_MANAGEMENT.DONOT_SUPOT_SHARES'),
          isCancle: false
        });
      }
    }
    // async findList() {
    //   let params = {
    //     current: this.currentPage,
    //     size: this.pagesize,
    //     title: this.formData.title,
    //     startTime: this.formData.date[0],
    //     endTime: this.formData.date[1],
    //     language: lang
    //   };
    //   const notice = await findBankNoticeInfoList(params);
    //   this.tableData = notice.records;
    //   this.total = notice.total;
    // },
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
.g-account-shares {
  margin-top: 26px;
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
    }
    > span:nth-of-type(2n) {
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
  .m-pagination {
    padding-top: 4px;
    width: 100%;
  }
}
::v-deep .is-right {
  padding-right: 5px;
}
::v-deep .is-right.is-leaf.el-table__cell {
  padding-right: 17px;
}
</style>
