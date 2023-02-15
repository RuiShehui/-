<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 11:46:58
 * @LastEditTime: 2022-01-21 14:43:55
 * @LastEditors: zhangcheng
 * @Description: 客户维护详情
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\user\userMaintain-detail.vue
-->
<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.USER_TYPE')}}</div>
        <div>{{userTypeFilter(tableData.userType)}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.LOGIN_NAME')}}</div>
        <div>{{tableData.loginName}}</div>
      </div>
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.USER_CHS_NAME')}}</div>
        <div>{{tableData.userChsName}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.USER_EGLS_NAME')}}</div>
        <div>{{tableData.userEglsName}}</div>
      </div>
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.CARD_TYPE')}}</div>
        <div>{{tableData.cardType}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.CARD_NO')}}</div>
        <div>{{tableData.cardNo}}</div>
      </div>
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.CARD_AREA')}}</div>
        <div>{{tableData.cardArea}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.EMPOWER_LEVEL')}}</div>
        <div>{{empowerGroupFilter(tableData.empowerGroup)}}</div>
      </div>
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.USER_STATUS')}}</div>
        <div>{{userStatusFilter(tableData.status)}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.TFA_STATUS')}}</div>
        <div>{{tfaStatusFilter(tableData.tfaStatus)}}</div>
      </div>
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE')}}</div>
        <div>{{tableData.userPhone}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS')}}</div>
        <div>{{tableData.email}}</div>
      </div>
      <div class="row">
        <div>{{$t('CUSTOMER_MANAGEMENT.MOBILE_PHONE')}}</div>
        <div>{{tableData.mobilePhone}}</div>
        <div>{{$t('CUSTOMER_MANAGEMENT.MAIL_ADDRESS')}}</div>
        <div>{{tableData.mailAddress}}</div>
      </div>
    </div>
    <div class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import { queryOperatorDetail } from '@/api/customer-management/user';
export default {
  name: 'UserMaintainDetail',
  data() {
    return {
      tableData: {
        channel: '',
        loginName: '',
        userChsName: '',
        userEglsName: '',
        cardType: '',
        cardNo: '',
        userStatus: '',
        authLevel: '',
        tfaStatus: '',
        cardArea: '',
        birthday: '',
        phone: '',
        emilAddress: '',
        mobilePhone: ''
      },
      ebankCstmNo: ''
    };
  },
  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    back() {
      this.$router.replace({
        name: this.$route.params.routerName
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/userMaintain/detail' 
      );
    },
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ADMAIN');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.AUTH_USER');
        case '3':
          return this.$t('CUSTOMER_MANAGEMENT.INPUT_USER');
        default:
          return '';
      }
    },
    tfaStatusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.YES');
        default:
          return '';
      }
    },
    userStatusFilter(val) {
      switch (val) {
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
        default:
          return '';
      }
    },
    empowerGroupFilter(val) {
      switch (val) {
        case 'A':
          return 'A';
        case 'B':
          return 'B';
        case 'C':
          return 'C';
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NONE');
        default:
          return '';
      }
    }
  },
  async created() {
    this.userCode = this.$route.params.userCode;
    const result = await queryOperatorDetail({
      userCode: this.userCode
    });
    this.tableData = result.body;
    console.log(this.tableData);
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
    border-color: #f06b00;
  }
}
</style>