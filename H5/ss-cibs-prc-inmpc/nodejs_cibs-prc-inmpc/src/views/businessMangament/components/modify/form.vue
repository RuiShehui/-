<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 15:47:27
 * @LastEditors: 赵霖
 * @LastEditTime: 2021-10-27 14:10:48
 * @Description: 收费项目设置修改子组件--表单
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\components\modify\form.vue
-->
<template>
  <el-form class="g-form">
    <el-form-item label="收费渠道" label-width="100px">
      <el-input placeholder="个人网银" v-model="form.channel" disabled></el-input>
    </el-form-item>
    <el-form-item label="收费项目" label-width="100px">
      <el-input placeholder="汇款" v-model="form.payItemName" disabled></el-input>
    </el-form-item>
    <el-form-item label="状态" label-width="100px">
      <el-radio v-model="radio" label="1">启用</el-radio>
      <el-radio v-model="radio" label="2">停用</el-radio>
    </el-form-item>
    <el-form-item label="生效日期" label-width="100px">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="~"
        start-placeholde="开始日期"
        end-placeholde="结束日期"
        style="width:340px"
        disabled
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "businessMangamentModifyForm",
  components: {},

  data() {
    return {
      form: {
        channel: "个人网银", // 收费渠道
        payItemName: "汇款(TT)" // 收费项目
      },
      radio: "2", // 状态
      date: "" // 生效日期
    };
  },

  created() {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.g-form {
  padding: 20px;
  margin: 0 36%;
}
</style>