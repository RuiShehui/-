<!--
 * @Autor: 赵霖
 * @Date: 2021-10-18 17:00:52
 * @LastEditors: 赵霖
 * @LastEditTime: 2021-10-28 15:05:19
 * @Description: 收费项目设置--收费项目修改
 * @FilePath: \ss-cibs-prc-inmpc\src\views\businessMangament\businessMagament-modify.vue
-->
<template>
  <div class="g-modify">
    <!-- 表单区 -->
    <ModifyForm></ModifyForm>

    <!-- tabs区 -->
    <ModifyTabs></ModifyTabs>

    <!-- 按钮区 -->
    <div class="g-btn">
      <el-button class="f-step" @click="step">上一步</el-button>
      <el-button class="f-confirm">确认</el-button>
    </div>
  </div>
</template>

<script>
import ModifyTabs from "./components/modify/tabs.vue";
import ModifyForm from "./components/modify/form.vue";
export default {
  components: {
    ModifyTabs,
    ModifyForm
  },

  data() {
    return {};
  },

  created() {},

  mounted() {},

  methods: {
    //返回
    step() {
      this.$router.push("/businessMangament");
      this.$store.commit(
        "tabs/DELETE_TABS",
        "/businessMangament/modify"
      );
    },
    // 删除一行
    del(row, index) {
      console.log("删除一行");
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
  .f-step {
    color: #f06b00;
  }
  .f-confirm {
    background: #f06b00;
  }
}
</style>