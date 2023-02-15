<!--
 * @Author: zhangcheng
 * @Date: 2021-11-04 20:45:08
 * @LastEditTime: 2022-01-07 18:29:44
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\billMainrenace\billMainrenace-add.vue
-->
<template>
  <div class="contain">
    <bill-change :billData="billData" @confirm="toConfirm" @backTo="backTo"></bill-change>
  </div>
</template>

<script>
import BillChange from '../components/bill-mainrenace/BillChange';
export default {
  name: 'BillMainrenaceAdd',
  components: {
    BillChange
  },
  data() {
    return {
      billData: {
        merchantType: '',
        merchantName: '',
        billType: '',
        billNo: '',
        merchantAlias: '',
        merchartTypeCode: '',
        merchartCode: ''
      }
    };
  },
  methods: {
    backTo() {
      this.$router.replace({
        name: 'BillMainrenace'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/billMainrenace/add' 
      );
    },
    toConfirm(billData) {
      console.log(billData);
      this.$router.push({
        name: 'BillMainrenaceAddConfirm',
        params: billData
      });
    }
  },
  created() {
    if (this.$route.params.billNo) {
      this.billData = this.$route.params;
    }
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