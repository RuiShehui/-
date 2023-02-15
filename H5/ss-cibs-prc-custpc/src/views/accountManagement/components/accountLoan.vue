<template>
  <div class="g-account-loan">
    <!-- 贷款账户 -->
    <title-bar :title="$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TITLE')"></title-bar>
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <!-- 账户号码 -->
      <el-table-column prop="accountNo" :label="$t('ACCOUNT_MANAGEMENT.RECEIVE_ACCOUNTNO')">
        <template slot-scope="scope">
          <div class="u-accountno" @click="toAccountDetial(scope.row)">{{ scope.row.altAccId }}</div>
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
      <!-- 贷款类别 -->
      <el-table-column prop="loanType" :label="$t('ACCOUNT_MANAGEMENT.LOAN_TYPE')">
        <template slot-scope="scope">
          <div>{{ scope.row.loanType }}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 结欠总额(港币等值):  -->
    <div class="m-money-text">
      {{$t('ACCOUNT_MANAGEMENT.LAST_UPDATE_TIME')}}:
      <span>{{ endUpdateTime }}</span>
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
import {
  getLoansAccountList,
  getLoansAccountDetail,
  getLoansAccountNo
} from '@/api/accountManagement.js';
import { truncate } from 'fs';
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
      endUpdateTime: '',
      loading: false
    };
  },
  mounted() {
    this.getLoansAccountList();
  },
  methods: {
    async getLoansAccountList() {
      let params = {
        current: this.currentPage,
        size: this.pageSize
      };
      this.loading = true;
      const result = await getLoansAccountList(params);
      console.log(result);
      this.loading = false;
      if (result && result.loanAccountList) {
        this.tableData = result.loanAccountList;
        this.total = result.total;
        this.endUpdateTime = result.endUpdateTime;
      } else {
        this.tableData = [];
        this.total = 0;
        this.currentPage = 1;
      }
    },
    acctFormat(val) {
      let str = val;
      if (val) {
        str = `${val.slice(0, 3)}-${val.slice(3, 5)}-${val.slice(5)}`;
      }
      return str;
    },
    formatMoney(ccy, money) {
      if (money === 0 || money) {
        let moneyStr = String(money);
        let minus = moneyStr.split('-');
        moneyStr = moneyStr.split('-').join('');
        if (ccy === 'JPY') {
          if (minus.length > 1) {
            return '- ' + moneyStr.toJPY();
          }
          return moneyStr.toJPY();
        } else {
          if (minus.length > 1) {
            return '- ' + moneyStr.toMoney();
          }
          return moneyStr.toMoney();
        }
      }
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getLoansAccountList();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLoansAccountList();
    },
    // 点击tab标签
    tabClick() {
      // console.log("tab", tab);
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
      row.type = 4;
      row.endUpdateTime = this.endUpdateTime;
      let params = JSON.stringify(row);
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
.g-account-loan {
  .nav-bar {
    margin-bottom: 20px;
  }
  .u-accountno {
    cursor: pointer;
    color: #4181fa;
  }
  .m-money-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 500;
    margin: 16px 0;
    > span {
      display: inline-block;
      margin-left: 4px;
    }
    > span:nth-of-type(2n) {
      margin-right: 8px;
    }
  }
  .m-pagination {
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