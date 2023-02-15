<!--
 * @Author: 赵霖
 * @Date: 2021-12-15 09:47:05
 * @LastEditTime: 2022-11-07 11:19:16
 * @LastEditors: Please set LastEditors
 * @Description:开立定期
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\openFixed\index.vue
-->
// 
<template>
  <div class="g-openFixed" v-loading="acctLoading">
    <el-tabs v-model="activeName" >
      <el-tab-pane :label="$t(`OPEN_FIXED.FIXED_DEPOSIT_PLACEMENT`)" name="first">
        <openFixed></openFixed>
      </el-tab-pane>
      <el-tab-pane :label="$t(`OPEN_FIXED.BOOK_RATE`)" name="second">
        <interestRate></interestRate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import openFixed from './components/openFix/index';
import interestRate from './components/interestRate/index';
import { judgeDepositAccount, queryTime } from '@/api/openFixed.js';
export default {
  components: {
    openFixed,
    interestRate
  },
  data() {
    return {
      activeName: 'first',
      acctLoading:false
    };
  },
  created(){
    this.depositAccount()
  },
  methods:{
    // TODO 是否跳转首页？
     depositAccount() {
      this.acctLoading = true;
      queryTime().then(res => {
        console.log(res, 'res');
        switch (res.flag) {
          case '1':
            judgeDepositAccount().then(result => {
              console.log(result,'result')
              if (!result) {
                this.$confirm({
                  isIcon: true,
                  type: 'warn',
                  message: this.$t('OPEN_FIXED.NO_ACCOUNT'),
                  btnText: {
                    cancleText: this.$t('COMMON.CANCEL'),
                    confirmText: this.$t('COMMON.DETERMINE')
                  }
                }).then(res => {
                  this.acctLoading = false;
                    this.$router.go(-1);
                });
              } else {
                this.acctLoading = false;
              }
            });
            break;
          case '2':
            this.$confirm({
              isIcon: true,
              type: 'warn',
              message: this.$t('OPEN_FIXED.NO_TIME'),
              btnText: {
                cancleText: this.$t('COMMON.CANCEL'),
                confirmText: this.$t('COMMON.DETERMINE')
              }
            }).then(res => {
              this.acctLoading = false;
                this.$router.go(-1);
            });
            break;
          case '3':
            this.$confirm({
              isIcon: true,
              type: 'warn',
              message: this.$t('OPEN_FIXED.WEATHER_DEPOSIT'),
              btnText: {
                cancleText: this.$t('COMMON.CANCEL'),
                confirmText: this.$t('COMMON.DETERMINE')
              }
            }).then(res => {
              this.acctLoading = false;
              this.$router.go(-1);
            });
            break;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-openFixed {
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
</style>