<!--
 * @Author: your name
 * @Date: 2021-12-06 11:12:50
 * @LastEditTime: 2022-04-01 10:00:07
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\mySubmit.vue
-->
<template>
  <div class="g-mySubmit-wrapper" v-loading="requestLoading">
    <el-tabs v-model="activeName" @tab-click="tabClick" class="m-topTabs">
      <!-- 待授权 -->
      <el-tab-pane :label="$t('AUTHORIZE.WAIT_AUTHOR')" name="wait">
        <wait v-if="activeName === 'wait'" @detail="goDetail"></wait>
      </el-tab-pane>
      <!-- 已结束 -->
      <el-tab-pane :label="$t('AUTHORIZE.END')" name="end">
        <end v-if="activeName === 'end'" @detail="goDetail"></end>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!-- <cardDetail :type="type" v-if="showDetail" @golist="goList" @submit="submit"></cardDetail> -->
</template>

<script>
// import cardDetail from './components/cardDetail';
import wait from './components/wait';
import end from './components/end';
import { mapState } from 'vuex';
export default {
  components: {
    wait,
    end
    // cardDetail
  },
  data() {
    return {
      scene:'',
      activeName: 'wait',
      // showDetail: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      type: 0 //传入cardDetail组件的类型
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  created(){
    this.scene = localStorage.getItem('scene') 
   if (this.scene === '1') {
     this.activeName = 'end'
     localStorage.setItem('scene','')
   }else {
     this.activeName = 'wait'
     localStorage.setItem('scene','')

   }
  },
  methods: {
    tabClick(tab, event) {
      switch (tab.name) {
        case 'wait':
          // this.tableHeade = '外币现钞兑港元牌价'
          break;
        case 'end':
          // this.tableHeade = '外币电汇兑港元牌价'
          break;
      }
    },
    goDetail(item) {
      // this.showDetail = true;
      // this.type = item.type *1
      this.$router.push({
        path: '/authorizeCenter/detail',
        query: {
          ...item,
          hasAuthorization: '1'
        }
      });
    },
    goList() {
      // this.showDetail = false;
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    submit() {}
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
/deep/.el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0 0 24px;
}
</style>
