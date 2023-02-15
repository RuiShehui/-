<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 17:27:34
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-11-26 17:37:43
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\src\components\authorization-details\information-overview-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->

<template>
  <div class="contain">
    <main class="u-tabs">
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane
          :label="$t('CUSTOMER_MANAGEMENT.ENT_BASE_INFO')"
          name="enterpriseInfo"
        >-->
        <enterprise-info v-if="activeName === 'enterpriseInfo'" :ebankCstmNo="ebankCstmNo"></enterprise-info>
        <!-- </el-tab-pane> -->
        <!-- <el-tab-pane
          :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_INFO')"
          name="accountInfo"
        >
          <account-info
            v-if="activeName === 'accountInfo'"
            :ebankCstmNo="ebankCstmNo"
          ></account-info>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CUSTOMER_MANAGEMENT.USER_INFO')"
          name="userInfo"
        >
          <user-info
            v-if="activeName === 'userInfo'"
            :ebankCstmNo="ebankCstmNo"
          ></user-info>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CUSTOMER_MANAGEMENT.THIED_REMITTEE')"
          name="thiedRemittee"
        >
          <third-remittee
            v-if="activeName === 'thiedRemittee'"
            :ebankCstmNo="ebankCstmNo"
          ></third-remittee>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CUSTOMER_MANAGEMENT.AUTH_INFO')"
          name="authInfo"
        >
          <auth-info
            v-if="activeName === 'authInfo'"
            :ebankCstmNo="ebankCstmNo"
          ></auth-info>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CUSTOMER_MANAGEMENT.BILL_INFO')"
          name="billInfo"
        >
          <bill-info
            v-if="activeName === 'billInfo'"
            :ebankCstmNo="ebankCstmNo"
          ></bill-info>
        </el-tab-pane>-->
      </el-tabs>
    </main>
  </div>
</template>

<script>
import EnterpriseInfo from '@/views/customerManagement/components/customerInfoView/enterpriseInfo';
import AccountInfo from '@/views/customerManagement/components/customerInfoView/accountInfo';
import UserInfo from '@/views/customerManagement/components/customerInfoView/userInfo';
import ThirdRemittee from '@/views/customerManagement/components/customerInfoView/thirdRemittee';
import AuthInfo from '@/views/customerManagement/components/customerInfoView/authInfo';
import BillInfo from '@/views/customerManagement/components/customerInfoView/billInfo';
import { queryListPageBill } from '@/api/customer-management/bill';
export default {
  name: 'CustomerInfoView',
  components: {
    EnterpriseInfo,
    AccountInfo,
    UserInfo,
    ThirdRemittee,
    AuthInfo,
    BillInfo
  },
  data() {
    return {
      activeName: 'enterpriseInfo',
      ebankCstmNo: ''
    };
  },
  methods: {
    // 已登记账单信息
    async queryListPageBill() {
      let result = await queryListPageBill({
        ebankCstmNo: this.ebankCstmNo
      });
      console.log(result);
    },
    // 交易授权信息
    async queryListSetting() {
      let result = await queryListSetting({
        ebankCstmNo: this.ebankCstmNo
      });
      console.log(result);
    }
  },
  created() {
    // this.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
    console.log(this.ebankCstmNo);
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  //   padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
.u-tabs {
  padding-bottom: 20px;
  /deep/ .el-tabs__item {
    text-align: center;
    padding-left: 20px;
  }
  /deep/ .el-tabs__item.is-active,
  /deep/ .el-tabs__item:hover {
    color: #f06b00 !important;
  }
}
</style>
