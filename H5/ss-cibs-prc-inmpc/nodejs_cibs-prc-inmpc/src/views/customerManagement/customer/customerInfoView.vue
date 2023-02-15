<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 16:08:33
 * @LastEditTime: 2022-07-07 10:21:51
 * @LastEditors: zhangcheng
 * @Description: 客户信息概览页面
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\customer\customerInfoView.vue
-->
<template>
  <div class="contain">
    <customer-query v-show="showQuery" @showIndex="showIndex" route-name="CustomerInfoView" />
    <user-detail-info v-if="showUserDetail" :user-code="userCode" :entType="entType" @backIndex="backIndex" />
    <div v-if="showIndexInfo">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ENT_BASE_INFO')" name="enterpriseInfo">
          <enterprise-info v-if="activeName === 'enterpriseInfo'" :ebankCstmNo="ebankCstmNo"></enterprise-info>
        </el-tab-pane>
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_INFO')" name="accountInfo">
          <account-info v-if="activeName === 'accountInfo'" :ebankCstmNo="ebankCstmNo"></account-info>
        </el-tab-pane>
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.USER_INFO')" name="userInfo">
          <user-info
            v-if="activeName === 'userInfo'"
            :ebankCstmNo="ebankCstmNo"
            @toUserInfoDetail="toUserInfoDetail"
          ></user-info>
        </el-tab-pane>
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.THIED_REMITTEE')" name="thiedRemittee">
          <third-remittee v-if="activeName === 'thiedRemittee'" :ebankCstmNo="ebankCstmNo"></third-remittee>
        </el-tab-pane>
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ENT_TRS_LIMIT')" name="entTrsLimit">
          <ent-trans-limit v-if="activeName === 'entTrsLimit'" :ebankCstmNo="ebankCstmNo"></ent-trans-limit>
        </el-tab-pane>
        <el-tab-pane
          v-if="entType!=='1'"
          :label="$t('CUSTOMER_MANAGEMENT.AUTH_INFO')"
          name="authInfo"
        >
          <auth-info v-if="activeName === 'authInfo'" :ebankCstmNo="ebankCstmNo"></auth-info>
        </el-tab-pane>
        <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.BILL_INFO')" name="billInfo">
          <bill-info v-if="activeName === 'billInfo'" :ebankCstmNo="ebankCstmNo"></bill-info>
        </el-tab-pane>
      </el-tabs>
      <div class="g-bottom">
        <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      </div>
      <article class="article">
        <p>
          <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
          {{$t('CUSTOMER_MANAGEMENT.PREVIEW_CUSTOMER_TIP')}}
        </p>
      </article>
    </div>
  </div>
</template>

<script>
import UserDetailInfo from '../components/customer-info-view/UserDetailInfo';
import EnterpriseInfo from '../components/customer-info-view/EnterpriseInfo';
import AccountInfo from '../components/customer-info-view/AccountInfo';
import UserInfo from '../components/customer-info-view/UserInfo';
import ThirdRemittee from '../components/customer-info-view/ThirdRemittee';
import AuthInfo from '../components/customer-info-view/AuthInfo';
import BillInfo from '../components/customer-info-view/BillInfo';
import EntTransLimit from '../components/customer-info-view/EntTransLimit';
import { queryListPageBill } from '@/api/customer-management/bill';
export default {
  name: 'CustomerInfoView',
  components: {
    EnterpriseInfo,
    AccountInfo,
    UserInfo,
    ThirdRemittee,
    AuthInfo,
    BillInfo,
    EntTransLimit,
    UserDetailInfo
  },
  data() {
    return {
      activeName: 'enterpriseInfo',
      ebankCstmNo: '',
      showUserDetail: false,
      userCode: '',
      showIndexInfo: false,
      showQuery: true,
      entType: ''
    };
  },
  methods: {
    showIndex(data) {
      this.ebankCstmNo = data.ebankCstmNo;
      this.entType = data.entType;
      this.showQuery = false;
      this.showIndexInfo = true;
    },
    toUserInfoDetail(data) {
      console.log('(this.entType',this.entType)
      this.userCode = data;
      this.showUserDetail = true;
      this.showIndexInfo = false;
    },
    backIndex() {
      this.showUserDetail = false;
      this.showIndexInfo = true;
    },
    back() {
      this.showIndexInfo = false;
      this.showQuery = true;
    },
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
  created() {}
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}
.g-bottom {
  margin: 40px 0 50px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
}
::v-deep .el-tabs__item {
  font-size: 16px;
}
::v-deep .el-tabs__header {
  margin-bottom: 40px;
}
.article {
  position: absolute;
  bottom: 32px;
  left: 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>