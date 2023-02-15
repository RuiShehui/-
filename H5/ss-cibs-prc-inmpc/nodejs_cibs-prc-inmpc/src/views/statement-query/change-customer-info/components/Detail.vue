<!--
 * @Author: zhangcheng
 * @Date: 2022-06-22 11:08:35
 * @LastEditTime: 2022-10-15 16:42:56
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\change-customer-info\components\Detail.vue
-->
<template>
  <div>
    <el-table
      v-if="showAcctInfo"
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
    <el-table
      v-if="showUserInfo"
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
    <div class="g-bottom" v-if="showUserInfo||showAcctInfo">
      <el-button @click="back">返回</el-button>
    </div>
  </div>
</template>

<script>
// import { queryList, infoQueryList } from '@/api/statiscal-query/index.js';a
export default {
  name: 'ChangeCustomerInfoDetail',
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
  data() {
    return {};
  },
  created() {
    // console.log(this.accountCustNo,'dede')
  },
  methods: {
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
    back() {
      this.$emit('backIndex');
    },
    async accountList() {}
  }
};
</script>

<style scoped lang='scss'>
.g-bottom {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
