<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 15:38:36
 * @LastEditors: 赵霖
 * @LastEditTime: 2021-10-27 14:10:16
 * @Description: 收费项目添加子组件--表格
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\components\add\tabs.vue
-->
<template>
  <div class="g-businessManagamentTabs">
    <el-button class="f-add" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-tabs v-model="option">
      <el-tab-pane label="金额收费区间设置" name="option">
        <el-table :data="tableData" class="g-table">
          <el-table-column label="金额区间(元)" prop="charge" align="center">
            <template>
              <div class="u-inp">
                <el-input :style="{width:'100px'}" placeholder="0" disabled></el-input>
                <span>＜ 金额 ≤</span>
                <el-input :style="{width:'150px'}" placeholder="请输入"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="收费方式" prop="payItemType" align="center">
            <template>
              <div class="u-sel">
                <el-select v-model="values">
                  <el-option label="本地汇款" value="1"></el-option>
                  <el-option label="汇款(TT)" value="2"></el-option>
                  <el-option label="汇款(CHATS)" value="3"></el-option>
                  <el-option label="批量转账" value="4"></el-option>
                  <el-option label="自动收款" value="5"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="收费标准" prop="criterion" align="center">
            <template>
              <div class="sel">
                <el-select v-model="values">
                  <el-option label="本地汇款" value="1"></el-option>
                  <el-option label="汇款(TT)" value="2"></el-option>
                  <el-option label="汇款(CHATS)" value="3"></el-option>
                  <el-option label="批量转账" value="4"></el-option>
                  <el-option label="自动收款" value="5"></el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="收费标准" prop="standard"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "businessMangamentAddTabs",
  components: {},

  data() {
    return {
      option: "option",
      tableData: [
        {
          charge: "",
          payItemType: "",
          criterion: "",
          standard: ""
        }
      ],
      values: ""
    };
  },

  created() {},

  mounted() {},

  methods: {
    handleAdd() {}
  }
};
</script>

<style lang='scss' scoped>
.g-businessManagamentTabs {
   margin: 0 20px;
  /deep/ .el-tabs__item.is-active {
    color: #f06b00;
  }
  /deep/.el-tabs__active-bar {
    background: #f06b00;
    height: 4px;
  }
  .f-add {
    width: 90px;
    height: 40px;
    font-size: 16px;
    font-weight: 400;
     
    border: 1px solid;
    border-radius: 4px;
    border-color: #f06b00;
    color: #f06b00;
    margin-right: 20%;
    position: absolute;
    right: -280px;
    z-index: 100;
  }
}
.u-inp {
  display: flex;
  /deep/ .el-input__inner {
    height: 28px;
  }
  span {
    padding: 2px 7px;
  }
}
.u-sel {
  /deep/ .el-input__inner {
    height: 28px;
  }
  /deep/.el-input__icon {
    height: 120%;
  }
}
/deep/ .el-table {
  width: auto;
}
.g-table {
  // padding: 0 20px;
  margin: 0 20px;
  // width: 1--
}
</style>
