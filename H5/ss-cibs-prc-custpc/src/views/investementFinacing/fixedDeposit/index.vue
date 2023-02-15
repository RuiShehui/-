<template>
  <div class="g-deposit-set-time f-mt-24">
    <!-- <title-bar :title="$t('ACCOUNT_MANAGEMENT.SET_A_TIME_ACCOUNT')"></title-bar> -->
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      row-key="id"
      :tree-props="{ children: 'currencyList' }"
      default-expand-all
    >
      <!-- 账户号码 -->
      <el-table-column prop="accountNo" :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')">
        <template slot-scope="scope">
          <div class="f-accountno">{{formatAccountNo(scope.row.accountNo) }}</div>
        </template>
      </el-table-column>
      <!-- 账户名称 -->
      <el-table-column prop="accountName" width="180">
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
        width="220"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.row.currencyList"
          >{{ scope.row.currency | ccyFilter }}{{ scope.row.accountType | accountType }}</div>
          <div
            v-else
            class="f-blue"
            @click="toAccountDetial(scope.row)"
          >-{{ scope.row.currency | ccyFilter }}</div>
        </template>
      </el-table-column>
      <!-- 账户结余 -->
      <el-table-column
        prop="accountBalance"
        :label="$t('ACCOUNT_MANAGEMENT.USER_BALANCE')"
        width="300"
      >
        <template slot-scope="scope">
          <span>{{ formatMoney(scope.row.currency,scope.row.accountBalance) }}</span>
        </template>
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="status" :label="$t('ACCOUNT_MANAGEMENT.STATUS')" width="130">
        <template slot-scope="scope">{{ scope.row.status | accountStateFilter }}</template>
      </el-table-column>
    </el-table>
    <!-- 定期存款总值(港币等值): -->
    <div class="u-money-text">
      {{$t('ACCOUNT_MANAGEMENT.LAST_UPDATE_TIME')}}:
      <span>{{ endUpdateDate }}</span>
    </div>
    <div class="m-table-footer f-d-f f-jc-sb f-mt-16">
      <!-- 分页 -->
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
import { depositFixeAccount } from '@/api/accountManagement.js';
import filters from '@/filters/accountManagement';
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
      endUpdateDate: 0,
      loading: false
    };
  },
  filters,
  mounted() {
    this.depositFixeAccount();
  },
  methods: {
    // 金额格式转换
    formatMoney,
    // 查询
    async depositFixeAccount() {
      this.loading = true;
      let params = {
        otherCurrent: 1,
        otherSize: 10,
        fixedCurrent: this.currentPage,
        fixedSize: this.pageSize
      };
      const result = await depositFixeAccount(params);
      this.loading = false;
      if (result && result.fixeAccountList) {
        result.fixeAccountList.forEach((item, index) => {
          // item.id = index;
          this.$set(item, 'id', index + 1);
          // console.log(item)
          if (item.currencyList) {
            item.currencyList.forEach((itm, idx) => {
              this.$set(itm, 'id', Number('' + (index + 1) + (idx + 1)));
              itm.acctNo = item.accountNo;
              itm.cur = itm.currency;
            });
          }
          // }
        });
        this.tableData = result.fixeAccountList;
        this.total = result.fixedTotal;
        this.endUpdateDate = result.endUpdateDate;
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
      this.depositFixeAccount();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.depositFixeAccount();
    },
    // 点击tab标签
    tabClick() {
      // console.log("tab", tab);
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    //金额格式化
    formatter(row) {
      return mathTools.addDecollator(row.balance);
    },
    // 显示/隐藏账户名称
    eyeClick() {
      this.isEye = !this.isEye;
    },
    //路由跳转
    toAccountDetial(row) {
      // 改query 传参
      // TODO
    let obj = JSON.stringify(row);
       this.$router.push({
        name: 'depositDetails',
        query: {params:obj}
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
.f-mt-16 {
  margin-top: 16px;
}
.g-deposit-set-time {
  .nav-bar {
    margin-bottom: 24px;
  }
  .f-accountno {
    display: inline-block;
  }
  .f-blue {
    color: #4181fa;
    cursor: pointer;
  }
}
.f-mt-24 {
  margin-top: 24px;
}
.u-money-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin: 16px 0px;
}
</style>