<!--
 * @Author: your name
 * @Date: 2022-10-13 14:26:01
 * @LastEditTime: 2022-10-14 11:22:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\statement-query\change-customer-info\components\accountInfo.vue
-->
<template>
  <div>
   <el-table
      :data="showData"
      stripe
      
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column width="80" type="index" label="序號"></el-table-column>
      <el-table-column prop="accountName" label="賬戶名稱"></el-table-column>
      <el-table-column prop="accountNo" label="賬戶號碼"></el-table-column>
      <el-table-column prop="accountType" label="賬戶類別"></el-table-column>
      <el-table-column prop="currencyType" label="幣種"></el-table-column>
      <!-- <el-table-column prop="thirdAccStatus" label="本人賬戶/第三者賬戶"></el-table-column>
      <el-table-column prop="xxx" label="第三方轉賬限額"></el-table-column>-->
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>
    <!-- <div class="g-bottom">
      <el-button @click="back">返回</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    showAcctInfo: {
      type: Boolean,
      default: false
    },
    showUserInfo: {
      type: Boolean,
      default: false
    },
    showData: {
      type: Array,
      require: true
    },
    accountCustNo: {
      type: String,
      default: ''
    }
  },
  data(){
    return{

    }
  },
  methods:{
   back() {
      this.$emit('backIndex');
    },
  }
}
</script>

<style scoped lang='scss'>
.g-bottom {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>