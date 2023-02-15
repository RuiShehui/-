<!--
 * @Author: zhangcheng
 * @Date: 2021-11-04 20:45:08
 * @LastEditTime: 2021-11-11 20:59:54
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\ss-cibs-prc-inmpc\src\views\customerManagement\billMainrenace\billMainrenace-modify.vue
-->
<template>
  <div class="contain">
    <bill-change :billData="billData" @confirm="toConfirm" @backTo="backTo"></bill-change>
  </div>
</template>

<script>
import BillChange from '../components/bill-mainrenace/BillChange';
export default {
  name: 'BillMainrenaceModify',
  components: {
    BillChange
  },
  data() {
    return {
      billData: {}
    };
  },
  methods: {
    backTo() {
      this.$router.replace({
        name: 'BillMainrenace'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/billMainrenace/modify'
      );
    },
    toConfirm(billData) {
      this.$router.push({
        name: 'BillMainrenaceModifyConfirm',
        params: {
          ...billData
        }
      });
    }
  },
  created() {
    this.billData = { ...this.$route.params };
    console.log(this.billData);
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
}
</style>