<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 11:46:58
 * @LastEditTime: 2022-01-10 14:13:07
 * @LastEditors: zhangcheng
 * @Description: 客户维护新增确认
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\user\userMaintain-addConfirm.vue
-->
<template>
  <div class="contain">
    <confirm :tableData="tableData"></confirm>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.LASTSTEP')}}</el-button>
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.CONFIRM')}}</el-button>
    </div>
  </div>
</template>

<script>
import { operatorSave } from '@/api/customer-management/user';
import Confirm from '../components/user/confirm';
export default {
  name: 'UserMaintainAddConfirm',
  components: {
    Confirm
  },
  data() {
    return {
      tableData: [],
      ebankCstmNo: ''
    };
  },
  methods: {
    back() {
      this.$router.replace({
        name: 'UserMaintainAdd',
        params: this.tableData
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/userMaintain/addConfirm'
      );
    },
    async submit() {
      const result = await operatorSave({
        ...this.tableData,
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.USER_ADD_SUCCESS'),
          type: 'success'
        });
        this.$router.replace({
          name: 'UserMaintain'
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/userMaintain/addConfirm' 
        );
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/userMaintain/add'
        );
      }
    }
  },
  created() {
    this.tableData = this.$route.params;
    this.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
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