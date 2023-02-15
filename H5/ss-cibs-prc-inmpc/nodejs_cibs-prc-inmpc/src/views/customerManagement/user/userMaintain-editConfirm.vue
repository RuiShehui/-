<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 11:46:58
 * @LastEditTime: 2022-01-10 14:13:46
 * @LastEditors: zhangcheng
 * @Description: 客户维护新增确认
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\user\userMaintain-editConfirm.vue
-->
<template>
  <div class="contain">
    <confirm :tableData="tableData" :show-login-name="true"></confirm>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.LASTSTEP')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.CONFIRM')}}</el-button>
    </div>
  </div>
</template>

<script>
import Confirm from '../components/user/confirm';
import { operatorUpdate } from '@/api/customer-management/user';
export default {
  name: 'UserMaintainEditConfirm',
  components: {
    Confirm
  },
  data() {
    return {
      tableData: {}
    };
  },
  methods: {
    back() {
      this.$router.replace({
        name: 'UserMaintainEdit',
        params: { userSetting: this.tableData, backEdit: true }
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/userMaintain/editConfirm'
      );
    },
    async submit() {
      const result = await operatorUpdate(this.tableData);
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.USER_EDIT_SUCCESS'),
          type: 'success'
        });
        this.$router.replace({
          name: 'UserMaintain'
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/userMaintain/editConfirm' 
        );
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/userMaintain/edit' 
        );
      }
    }
  },
  created() {
    this.tableData = this.$route.params;
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
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
</style>