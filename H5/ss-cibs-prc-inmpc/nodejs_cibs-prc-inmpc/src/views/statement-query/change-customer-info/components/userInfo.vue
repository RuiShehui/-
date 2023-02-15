<!--
 * @Author: your name
 * @Date: 2022-10-13 14:26:13
 * @LastEditTime: 2022-10-14 11:22:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\statement-query\change-customer-info\components\userInfo.vue
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
      <el-table-column type="index" label="序號" width="80"></el-table-column>
      <el-table-column prop="ebankCstmNO" label="個人網銀客戶號" min-width="150"></el-table-column>
      <el-table-column prop="userEglsName" label="用戶名" min-width="120"></el-table-column>
      <el-table-column prop="mailAddress" label="郵寄地址" min-width="120"></el-table-column>
      <!-- <el-table-column prop="customerName" label="地址類型" min-width="120"></el-table-column> -->
      <el-table-column prop="cardType" label="證件類型" min-width="120"></el-table-column>
      <el-table-column prop="cardNo" label="證件號碼" min-width="120"></el-table-column>
      <el-table-column prop="cardArea" label="證件簽發地/國家" min-width="150"></el-table-column>
      <el-table-column prop="mobilePhone" label="流動電話" min-width="120"></el-table-column>
      <el-table-column prop="email" label="電郵地址" min-width="120"></el-table-column>
      <el-table-column prop="modifyTime" label="修改日期" min-width="120"></el-table-column>
      <!-- <el-table-column prop="createTime" label="創建日期" min-width="120"></el-table-column> -->
      <el-table-column prop="status" label="用戶狀態" min-width="120">
        <template v-slot="{row}">{{ statusFilter(row.status) }}</template>
      </el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>
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
  methods:{
 statusFilter(status) {
      switch (status) {
        case '0':
          return '停用';
        case '1':
          return '啟用';
        default:
          return status;
      }
    },
  }
}
</script>

<style>

</style>