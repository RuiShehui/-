<template>
  <div class="g-accountManagent">
    <el-tabs v-show="!showDetail" class="m-topTabs" v-model="activeTabName" @tab-click="tabsClick">
      <el-tab-pane :label="$t('ACCOUNT_MANAGEMENT.DEPOSIT_ACCOUNT')" name="first">
        <div v-if="activeTabName==='first'" class="m-scroll-box" ref="scrollRfsFirst">
          <!-- 活期账户 -->
          <account-current></account-current>
          <!-- 定期账户 -->
          <account-set-a-time></account-set-a-time>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('ACCOUNT_MANAGEMENT.INVEST_ACCOUNT')" name="second">
        <div v-if="activeTabName==='second'" class="m-scroll-box" ref="scrollRfsSecond">
          <!-- 股票账户 -->
          <account-shares @showDetailHandle="showDetailHandle"></account-shares>
          <!-- 投资账户 -->
          <account-invest @showDetailHandle="showDetailHandle"></account-invest>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT')" name="third">
        <div v-if="activeTabName==='third'" class="m-scroll-box" ref="scrollRfsThird">
          <!-- 贷款类账户 -->
          <account-loan @showDetailHandle="showDetailHandle"></account-loan>
        </div>
      </el-tab-pane>
    </el-tabs>
    <account-detail v-if="showDetail" @showIndex="showIndex" :detailData="detailData" />
  </div>
</template>

<script>
import accountCurrent from './components/accountCurrent';
import accountSetATime from './components/accountSetATime';
import accountShares from './components/accountShares';
import accountInvest from './components/accountInvest';
import accountLoan from './components/accountLoan';
import accountDetail from './accountDetails';
import { mapState } from 'vuex';
export default {
  name: 'AssetOverview',
  components: {
    accountCurrent,
    accountSetATime,
    accountShares,
    accountInvest,
    accountLoan,
    accountDetail
  },
  data() {
    return {
      activeTabName: 'first',
      showDetail: false,
      detailData: {}
    };
  },
  methods: {
    tabsClick(tab) {
      this.$nextTick(() => {
        if (tab.index === '0') {
          this.$refs.scrollRfsFirst.scrollTop = 0;
        } else if (tab.index === '1') {
          this.$refs.scrollRfsSecond.scrollTop = 0;
        } else if (tab.index === '2') {
          this.$refs.scrollRfsThird.scrollTop = 0;
        }
      });
    },
    showDetailHandle(data) {
      this.detailData = data;
      this.showDetail = true;
    },
    showIndex() {
      this.showDetail = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-accountManagent {
  position: relative;

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
      }
      &.is-top:last-child {
        padding-right: 32px;
      }

      &.is-active {
        background-color: #fff;
        border-bottom: none;
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
          width: 101%;
          height: 4px;
          top: -1px;
          left: -1px;
          background-color: #f06b00;
        }
      }
    }
    /deep/ .el-tabs__active-bar {
      display: none;
    }
  }

  //  ::v-deep .el-tabs__header{
  //       margin-top: 20px;
  //   }
  .el-tabs__item {
    font-size: 18px;
  }
  .el-table {
    .cell {
      display: flex;
    }
  }
  .el-table__header .has-gutter tr th {
    background-color: #f3f3f3;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table .cell,
  .el-table th > .cell {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    font-weight: 400;
  }
  .m-eye-img {
    img {
      width: 16px;
      display: block;
    }
  }
  .el-pagination {
    width: auto;
    .btn-prev {
      margin-right: 4px;
    }
  }
}
::v-deep .el-table__header-wrapper {
  background: #f3f3f3;
}
@media (max-width: 1440px) {
  .asset-view {
    .el-pagination {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>