<!--
 * @Author: your name
 * @Date: 2021-10-26 10:50:54
 * @LastEditTime: 2021-10-26 16:48:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\ss-cibs-prc-inmpc\src\views\roleManagement\roleManagement-add.vue
-->
<template>
  <div class="g-holiday">
    <div class="g-holiday_cion">
      <i class="el-icon-refresh" @click="refresh"></i>
    </div>
    <div class="g-holiday_calendar">
      <div>
        <el-select class="holiday_calendar-select" v-model="yearValue" placeholder="请选择">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="monthValue" placeholder="请选择">
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-calendar v-model="dateTime"></el-calendar>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      //   dateTime: new Date()
      dateTime: "2012-12-21 12:21:21", //日历时间
      yearValue: "2021年", //年份
      monthValue: "10月", //月份
      yearList: [], //年份数组
      monthList: [] //月份数组
    };
  },

  created() {},

  mounted() {
    let self = this;
    console.log("new date:", this.dateTime);
    let numYear = 2010;
    for (let i = 1; i <= 20; i++) {
      numYear = numYear + 1;
      let obj = {
        value: i,
        label: numYear + "年"
      };
      self.yearList.push(obj);
    }

    for (let i = 1; i <= 12; i++) {
      let obj = {
        value: i,
        label: i + "月"
      };
      self.monthList.push(obj);
    }
  },

  methods: {
    refresh() {
      console.log("refresh");
    }
  }
};
</script>

<style lang="scss" scoped>
.g-holiday {
  height: 100%;
  background: #fff;
  display: flex;
  .g-holiday_cion {
    font-size: 30px;
    padding: 20px 100px 20px 40px;
  }
  .g-holiday_calendar {
    margin: 20px 191px 20px 20px;
    padding: 20px;
    border: 1px solid;
    .holiday_calendar-select {
      padding: 0 20px 0 30%;
    }
    /deep/ .el-calendar__title {
      display: none;
    }
    /deep/ .el-calendar__button-group {
      display: none;
    }
  }
}
</style>