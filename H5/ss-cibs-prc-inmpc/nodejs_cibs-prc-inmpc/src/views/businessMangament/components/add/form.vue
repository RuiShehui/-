<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 15:43:28
 * @LastEditors: 赵霖
 * @LastEditTime: 2021-10-27 14:09:32
 * @Description: 收费项目设置添加子组件----表单
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\components\add\form.vue
-->
<template>
  <div class="g-businessMangamentAdd">
    <el-form class="g-form">
      <el-form-item label="收费渠道" label-width="100px">
        <el-radio v-model="radio" label="1">个人网银</el-radio>
        <el-radio v-model="radio" label="2">企银直联</el-radio>
      </el-form-item>
      <el-form-item label="折扣项目" label-width="100px">
        <el-select v-model="payItemName" style="width:340px">
          <el-option label="本地汇款" value="1"></el-option>
          <el-option label="汇款(TT)" value="2"></el-option>
          <el-option label="汇款(CHATS)" value="3"></el-option>
          <el-option label="批量转账" value="4"></el-option>
          <el-option label="自动收款" value="5"></el-option>
        </el-select>
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
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="收费类型" label-width="100px" v-show="true?this.payItemName==4:flase">
        <el-select v-model="valueds" style="width:340px">
          <el-option label="本地汇款" value="1"></el-option>
          <el-option label="汇款(TT)" value="2"></el-option>
          <el-option label="汇款(CHATS)" value="3"></el-option>
          <el-option label="批量转账" value="4"></el-option>
          <el-option label="自动收款" value="5"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:"businessMangamentAddForm",
  components: {},

  data() {
    return {
      radio: "2", // 收费渠道
      date: "", // 生效时间
      valueds: "", //  收费类型
      payItemName: "", //收费项目
      show: false
    };
  },

  created() {},

  mounted() {},

  methods: {
    showInp() {
      if (this.payItemName == 4) {
        this.show = true;
      } else {
        this.show = false;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.g-form {
  padding: 20px;
  margin: 0 36%;
}
</style>