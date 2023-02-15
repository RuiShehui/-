 <!-- 登记第三者账户 -->
<template>
  <div class="g-registerAccount-container">
    <el-tabs v-model="tabIndex" class="m-topTabs" v-if="isShowTab">
      <el-tab-pane :label="$t('PAYMENT.INTRA_BANK_ACCOUNT')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('PAYMENT.LOCAL_BANK_ACCOUNT')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('PAYMENT.REMITTANCE_ACCOUNT')" name="2"></el-tab-pane>
    </el-tabs>
    <component
      :is="renderComponent"
      @clickChange="handlePageChange"
      @clickBack="isShowTab = true"
    />
  </div>
</template>

<script>
import IntraBankAccount from './intraBankAccount';//行内
import LocalBankAccount from './localBankAccount';//本地跨行
import TelegraphBankAccount from './telegraphBankAccount';//电汇
import { formatAcctNo } from '@bank-transfer/utils/function';

export default {
  name: 'RegisteredThirdAccount',
  components: {
    IntraBankAccount,
    LocalBankAccount,
    TelegraphBankAccount
  },
  data() {
    return {
      tabIndex: 0,
      isShowTab: true
    };
  },
  computed: {
    formatAcctNo() {
      return formatAcctNo;
    },
    renderComponent() {
      console.log('this.tabIndex',this.tabIndex)
      switch (this.tabIndex) {
        case '1':
          return 'local-bank-account';//本地跨行
        case '2':
          return 'telegraph-bank-account';//电汇
        default:
          return 'intra-bank-account';//行内
      }
    }
  },
  provide() {
    return {
      formatAcctNo: this.formatAcctNo
    };
  },
  methods: {
    handlePageChange() {
      this.isShowTab = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-topTabs {
  /deep/ .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #d9d9d9;
  }
  /deep/.el-tabs__item {
    position: relative;
    line-height: 26px;
    border: solid 1px #d9d9d9;
    margin-right: 8px;
    padding: 7px 32px;
    border-radius: 2px;
    background-color: #f4f4f4;
    &.is-top:nth-child(2) {
      padding-left: 32px;
      margin-left: 8px;
    }
    &.is-top:last-child {
      padding-right: 32px;
    }

    &.is-active {
      background-color: #fff;
      border-bottom: none;
      color: #f06b00;
      &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 8px;
        bottom: -3px;
        left: 0;
        background-color: #fff;
        z-index: 1;
      }
      &:before {
        position: absolute;
        content: '';
        width: calc(100% + 2px);
        height: 4px;
        top: -1px;
        left: -1px;
        background-color: #f06b00;
        border-radius: 2px 2px 0 0;
      }
    }
  }
  /deep/ .el-tabs__active-bar {
    display: none;
  }
  /deep/.el-tabs__header.is-top {
    margin: 0 0 24px;
  }
}

.el-form-item {
  width: 650px;
  margin-left: auto;
  margin-right: auto;
}
</style>