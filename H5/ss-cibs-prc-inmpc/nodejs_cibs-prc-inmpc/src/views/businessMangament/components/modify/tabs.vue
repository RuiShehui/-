<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 15:34:01
 * @LastEditors: 赵霖
 * @LastEditTime: 2021-10-27 14:11:14
 * @Description: 收费项目设置修改子组件--表格
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\components\modify\tabs.vue
-->
<template>
  <div class="g-min">
    <el-button class="f-add" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-tabs v-model="option">
      <el-tab-pane label="金额收费区间设置" name="option">
        <el-table
          :data="tableData"
          :header-cell-style="{
            color: '#000',
            background: '#f3f3f3',
            fontweight: '500'
          }"
        >
          <el-table-column label="金额区间" align="center">
            <template slot-scope="scope">
              <el-form :model="scope.row" class="u-inp">
                <el-form-item>
                  <el-input :style="{ width: '100px' }" placeholder="0" disabled></el-input>
                  <span>＜ 金额 ≤</span>
                  <el-input :style="{ width: '150px' }" v-model="scope.row.cash" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="收费方式" prop="charge" align="center">
            <template slot-scope="scope">
              <el-form :model="scope.row" class="u-sel">
                <el-select v-model="scope.row.charge" @change="charge">
                  <el-option label="按固定金额收费" value="1"></el-option>
                  <el-option label="按比例收费" value="2"></el-option>
                </el-select>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="收费标准" prop="standard" align="center">
            <template slot-scope="scope">
              <el-form :model="scope.norm" class="u-inp">
                <el-form-item v-if="charges">
                  <el-input :style="{ width: '150px' }" v-model="scope.row.norm"></el-input>元
                </el-form-item>
                <el-form-item v-if="chargesd">
                  <el-input :style="{ width: '150px' }" v-model="scope.row.norm"></el-input>%
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="f-delete" type="text" @click="del(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'businessMangamentModifyTabs',
  components: {},

  data() {
    return {
      option: 'option',
      values: '',
      tableData: [
        {
          interval: '0<金额≤5000',
          charge: '固定金额收费',
          standard: '5元'
        }
      ],
      cash: '',
      norm: '',
      charges: true,
      chargesd: false
    };
  },

  created() {},

  mounted() {},

  methods: {
    handleAdd() {
      let lists = {
        cash: '',
        charge: '',
        norm: ''
      };
      this.tableData.push(lists);
    },
    del(row, index) {
      if (this.tableData.length <= 1) {
        this.$showMsg.warning('1111');
      } else {
        this.tableData.splice(index, 1);
      }
    },
    charge(val) {
      console.log(val);
      if (val == 1) {
        this.charges = true;
        this.chargesd = false;
      } else if (val == 2) {
        this.chargesd = true;
        this.charges = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.f-delete {
  color: #e34141;
  font-size: 14px;
   
  text-align: center;
}
.el-form-item {
  margin-bottom: 0 !important;
}
.g-min {
  margin: 0 20px;
  /deep/ .el-tabs__item.is-active {
    color: #f06b00;
  }
  /deep/.el-tabs__active-bar {
    background: #f06b00;
    height: 4px;
  }
  .u-inp,
  .u-sel {
    /deep/.el-input__inner {
      height: 28px;
    }
    // padding-top: 20p
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
    // top: 50%;
    right: -270px;
    z-index: 100;
  }
}
</style>
