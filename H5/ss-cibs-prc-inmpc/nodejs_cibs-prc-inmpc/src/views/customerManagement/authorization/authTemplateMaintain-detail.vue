<!--
 * @Author: zhangcheng
 * @Date: 2021-10-29 09:41:51
 * @LastEditTime: 2021-12-10 09:41:00
 * @LastEditors: zhangcheng
 * @Description: 授权模板维护详情
 * @FilePath: \ss-cibs-prc-inmpc\src\views\customerManagement\authorization\authTemplateMaintain-detail.vue
-->
<template>
  <div class="contain">
    <table-confirm :modelFrom="modelFrom"></table-confirm>
    <div class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import TableConfirm from '../components/auth-template-maintain/TableConfirm';
export default {
  name: 'AuthTemplateMaintainDetail',
  components: {
    TableConfirm
  },
  data() {
    return {
      modelFrom: {}
    };
  },
  methods: {
    back() {
      this.$router.replace({
        name: 'AuthTemplateMaintain'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/authTemplateMaintain/detail'
      );
    }
  },
  created() {
    this.modelFrom = this.$route.params;
    console.log(this.modelFrom);
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    border-color: #f06b00;
  }
}
</style>