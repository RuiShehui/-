<!--
 * @Autor: 赵霖
 * @Date: 2021-10-18 14:07:41
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-30 09:00:18
 * @Description: 收费项目设置--收费项目详情
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\businessMangament\businessMagament-ditail.vue
-->

<template>
  <div class="g-detail">
    <section>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="project1" width="180" align="center"></el-table-column>
        <el-table-column prop="project" align="center"></el-table-column>
        <el-table-column prop="channle" width="180" align="center"></el-table-column>
        <el-table-column prop="channles" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="userName" width="180" align="center"></el-table-column>
        <el-table-column prop="userNames" align="center"></el-table-column>
        <el-table-column prop="upTime" width="180" align="center"></el-table-column>
        <el-table-column prop="upTimes" align="center"></el-table-column>
      </el-table>
      <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
        <el-table-column prop="status" width="180" align="center"></el-table-column>
        <el-table-column prop="stautss" align="center"></el-table-column>
        <el-table-column prop="effectTime" width="180" align="center"></el-table-column>
        <el-table-column prop="effectTimes" align="center"></el-table-column>
      </el-table>
    </section>
    <div class="g-tabs">
      <el-tabs>
        <el-tab-pane label="金额区间收费标准信息">
          <el-table :data="tableDatas">
            <el-table-column prop="interval" label="金额区间(元)" align="center"></el-table-column>
            <el-table-column prop="chargle" label="收费方式" align="center"></el-table-column>
            <el-table-column prop="standard" label="收费标准" align="center"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="g-bottom">
      <el-button class="f-backTo" @click="backTo">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      tableData: [
        {
          project: '汇款', // 表头
          project1: '收费项目', //收费项目
          channle: '收费渠道', // 表头
          channles: '个人网银', // 收费渠道
          userName: '提交人', // 表头
          userNames: '张三', // 用户名
          upTime: '提交时间', // 表头
          upTimes: '2020-12-30', //更新时间
          status: '状态', // 表头
          stautss: '启用', //状态
          effectTime: '生效日期', // 表头
          effectTimes: '2020-12-30' //生效日期
        }
      ],
      tableDatas: [
        {
          interval: '0<金额<50,000.00',
          chargle: '按金额收费',
          standard: '5元'
        },
        {
          interval: '0<金额<50,000.00',
          chargle: '按金额收费',
          standard: '5元'
        },
        {
          interval: '0<金额<50,000.00',
          chargle: '按金额收费',
          standard: '5元'
        },
        {
          interval: '0<金额<50,000.00',
          chargle: '按金额收费',
          standard: '5元'
        },
        {
          interval: '0<金额<50,000.00',
          chargle: '按金额收费',
          standard: '5元'
        }
      ]
    };
  },
  computed: {},
  created() {},

  mounted() {},

  methods: {
    // 合并单元格
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    // 返回
    backTo() {
      this.$router.push('/businessMangament');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/businessMangament/detail' )
    }
  }
};
</script>

<style lang='scss' scoped>
.g-detail {
  background: #fff;
  min-height: 100%;
}
.g-tabs {
  margin-top: 3.5%;
  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
.g-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
.f-backTo {
  font-size: 18px;
  margin-top: 20px;
  width: 210px;
  height: 40px;
  background: #f06b00;
  color: #fff;
  text-align: center;
}
</style>