<!--
 * @Author: zhangcheng
 * @Date: 2021-10-29 09:41:51
 * @LastEditTime: 2021-12-23 11:41:48
 * @LastEditors: zhangcheng
 * @Description: 授权模板维护修改确认
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\authorization\authTemplateMaintain-editConfirm.vue
-->
<template>
  <div class="contain">
    <table-confirm :modelFrom="modelFrom"></table-confirm>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.CONFIRM')}}</el-button>
    </div>
  </div>
</template>

<script>
import TableConfirm from '../components/auth-template-maintain/TableConfirm';
import { updateTemplate } from '@/api/customer-management/authorization';
export default {
  name: 'AuthTemplateMaintainEditConfirm',
  components: {
    TableConfirm
  },
  data() {
    return {
      modelFrom: [],
      ebankCstmNo: ''
    };
  },
  methods: {
    back() {
      this.$router.replace({
        name: 'AuthTemplateMaintainEdit',
        params: this.modelFrom
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/authTemplateMaintain/editConfirm' 
      );
    },
    async submit() {
      // 获取数据，发起请求
      const result = await updateTemplate({
        ...this.modelFrom,
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_EDIT_SUCCESS'),
          type: 'success'
        });
        this.$router.replace({
          name: 'AuthTemplateMaintain'
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/authTemplateMaintain/editConfirm' 
        );
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/authTemplateMaintain/edit' 
        );
      }
    }
  },
  created() {
    this.modelFrom = this.$route.params;
    this.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
  }
};
</script>

<style lang="scss" scoped>
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
</style>