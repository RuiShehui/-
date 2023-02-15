<!--
 * @Author: your name
 * @Date: 2021-12-06 11:12:50
 * @LastEditTime: 2022-09-26 11:44:04
 * @Description: In User Settings Edit
 * @FilePath: \webbank-pc\src\views\authorizeCenter\waitAuth.vue
-->
<template>
  <div class="g-waitAuth-wrapper" v-loading="requestLoading">
    <el-tabs v-model="activeName" @tab-click="tabClick" class="m-topTabs">
      <!-- 待我授权 -->
      <el-tab-pane :label="$t('AUTHORIZE.WAITME')" name="wait">
        <wait-me
          v-if="activeName === 'wait'"
          @detail="goDetail"
          @checkbox="checkbox"
          ref="waitme"
        ></wait-me>
      </el-tab-pane>
      <!-- 已授权 -->
      <el-tab-pane :label="$t('AUTHORIZE.HAS_AUTHOR')" name="end">
        <already v-if="activeName === 'end'" @detail="goDetail"></already>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      v-if="total * 1 > 10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, sizes, jumper"
      :total="Number(total)"
      :current-page="Number(currentPage)"
      :page-size="Number(pageSize)"
      :page-sizes="[10, 20, 30, 50]"
      class="pagination"
    ></el-pagination>
  </div>
</template>

<script>
import already from './components/already';
import waitMe from './components/waitMe';
import { authFnMap } from '@auth/service/constant';
import { mapState } from 'vuex';

export default {
  components: {
    waitMe,
    already
  },
  data() {
    return {
      scene: '',
      activeName: 'wait',
      showMany: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      type: 0, //传入cardDetail组件的类型
      checkList: [], //选中的列表
      refuseDialog: false,
      opinion: '',
      flowNoList: [],
      flowNo: '', //流水号
      // authActionMessage: '', // 授权意见
      authActionType: '1' // 1-拒绝 / 2-同意
    };
  },
  created() {
    // this.checkList=this.$refs.waitme.checkList
    console.log('this.checkList', this.checkList);
    this.scene = localStorage.getItem('scene');
    if (this.scene === '3') {
      this.activeName = 'end';
      localStorage.setItem('scene', '');
    } else {
      this.activeName = 'wait';
      localStorage.setItem('scene', '');
    }
  },
  computed: {
    ...mapState('app', ['requestLoading']),
  },
  watch: {
    refuseDialog() {
      this.scene = '';
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
      // this.type = item.type * 1;
      this.$router.push({
        path: '/authorizeCenter/detail',
        query: {
          ...item,
          hasAuthorization: '0'
        }
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    totalData(value) {
      this.total = value;
    },
    checkbox(data) {
      console.log('1111111111', data);
      this.checkList = data;
      let list = ['03010401', '03010501', '03020101'];
      if (this.checkList.length == 2) {
        console.log(
          'this.checkList[1].businessCode',
          this.checkList[1].businessCode
        );
        if (list.includes(this.checkList[1].businessCode)) {
          this.checkList.pop();
          return this.$message({
            type: 'fail',
            // '批量转账及自动转账收款功能，不支持批量的授权操作'
            message: this.$t('AUTHORIZE.DAONT_RECEIVE') ,
            delay: 3000
          });
        }
      }
      //批量同意仅可支持同类（一级交易类型和二级交易类型都相同）
      if (this.checkList.length > 0) {
        for (let i = 0; i < this.checkList.length - 1; i++) {
          let j = i + 1;
          let a = this.checkList[i].businessCode;
          if (a !== this.checkList[j].businessCode) {
            this.checkList.pop();
            return this.$message({
              type: 'fail',
              // '只能选择相同的类型进行批量操作'
              message: this.$t('AUTHORIZE.SAME_RECEIVE'),
              delay: 3000
            });
          }
        }
      }
      if (this.checkList.length > 10) {
        this.checkList.pop();
        return this.$message({
          type: 'fail',
          // '最多可勾选十条进行批量操作'
          message: this.$t('AUTHORIZE.MORE_CHECK'),
          delay: 3000
        });
      }
    },
    // async onConfirm() {
    //   this.onRefuseAuth(this.checkList[0].businessCode);
    //   this.refuseDialog = false;
    // }
  }
};
</script>

<style lang="scss" scoped>
.m-title {
  text-align: center;
  font-weight: 700;
  font-size: 16px;
}
::v-deep .el-dialog__body {
  padding: 0px 25px 0px;
}
.g-btns {
  margin-top: 36px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}
.f-agree {
  margin-left: 24px;
}
::v-deep .oButton {
  margin-left: 24px;
}
::v-deep .el-dialog {
  border-radius: 4px;
}
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
/deep/.el-icon-arrow-down {
  width: 18px;
  height: 18px;
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 12px;
}
/deep/.el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0 0 24px;
}
/deep/ .el-pagination .el-pagination__jump {
  margin-left: 10px;
  height: 32px;
  position: relative;
  line-height: 32px;
  font-size: 16px !important;
  color: #595959;
  margin-right: 40px;
}
</style>
