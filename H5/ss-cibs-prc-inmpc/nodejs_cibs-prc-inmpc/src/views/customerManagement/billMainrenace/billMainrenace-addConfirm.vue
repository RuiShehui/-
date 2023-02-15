<!--
 * @Author: zhangcheng
 * @Date: 2021-11-10 10:37:30
 * @LastEditTime: 2021-12-23 11:41:55
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\billMainrenace\billMainrenace-addConfirm.vue
-->
<template>
  <div class="contain">
    <bill-confirm :tableData="billData" @lastStep="lastStep" @confirm="confirm"></bill-confirm>
  </div>
</template>

<script>
import { saveBill } from '@/api/customer-management/bill';
import BillConfirm from '../components/bill-mainrenace/BillConfirm';
export default {
  name: 'BillMainrenaceAddConfirm',
  components: {
    BillConfirm
  },
  data() {
    return {
      billData: {}
    };
  },
  methods: {
    lastStep() {
      this.$router.replace({
        name: 'BillMainrenaceAdd',
        params: {
          ...this.billData[0]
        }
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/billMainrenace/addConfirm'
      );
    },
    async confirm() {
      let ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
      const result = await saveBill({
        ebankCstmNo,
        ...this.billData[0]
      });
      if (result.head.returnCode === '000000') {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.BILL_ADD_SUCCESS'),
          type: 'success'
        });
        this.$router.replace({
          name: 'BillMainrenace'
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/billMainrenace/addConfirm' 
        );
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/billMainrenace/add' 
        );
      } else {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      }
    }
  },
  created() {
    this.billData = [{ ...this.$route.params }];
  }
};
</script>

<style lang='scss' scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}
</style>