<!--
 * @Autor: 赵霖
 * @Date: 2021-10-19 09:07:57
 * @LastEditors: 赵霖
 * @LastEditTime: 2021-10-28 15:05:11
 * @Description: 收费项目设置--收费项目添加
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\businessMangament-add.vue
-->

<template>
  <div class="g-modify">
    <!-- 表单区 -->
    <Add-Form></Add-Form>

    <!-- 金额区间收费设置 -->
    <Add-Tabs></Add-Tabs>

    <!-- 按钮区域 -->
    <div class="g-btn">
      <el-button class="f-cancel" @click="cancel">取消</el-button>
      <el-button class="f-confirm">提交</el-button>
    </div>
  </div>
</template>

<script>
import AddTabs from "./components/add/tabs.vue";
import AddForm from "./components/add/form.vue";
export default {
  components: {
    AddTabs,
    AddForm
  },
  data() {
    return {};
  },

  created() {},

  mounted() {},
  watch: {},
  methods: {
    //  取消
    cancel() {
      this.$router.push("/businessMangament");
      this.$store.commit(
        "tabs/DELETE_TABS",
        "/businessMangament/add" 
      );
    }
  }
};
</script>

<style lang='scss' scoped>
.g-modify {
  background: #fff;
  min-height: 100%;
}

.g-btn {
  margin-top: 35px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    width: 210px;
    height: 40px;
    border: 1px solid #f06b00;
    border-radius: 4px;
    color: #fff;
     
    font-size: 18px;
    text-align: center;
    font-weight: 400;
  }
  .f-cancel {
    color: #f06b00;
  }
  .f-confirm {
    background: #f06b00;
  }
}
</style>
