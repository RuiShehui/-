<!--
 * @Author: your name
 * @Date: 2021-12-14 16:47:02
 * @LastEditTime: 2022-09-19 09:59:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\fixedDeposit\components\details.vue
-->
<template>
  <div class="g-fixedDeposit">
    <before-Maturity></before-Maturity>
  </div>
</template>

<script>
import beforeMaturity from './before/beforeMaturity';
export default {
  components: {
    beforeMaturity
    // expired
  },
  data() {
    return {
      activeName: 'first'
    };
  }
};
</script>

<style lang="scss" scoped>
.g-fixedDeposit {
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