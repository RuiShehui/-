<!--
 * @Author: zhangcheng
 * @Date: 2021-11-17 17:32:49
 * @LastEditTime: 2022-01-19 11:37:18
 * @LastEditors: zhangcheng
 * @Description: 客户信息维护确认
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\customer\customerInfoMaintain-confirm.vue
-->
<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_STATUS') }}</div>
        <div>{{ tableData.ebankStatus | ebankStatus }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_CHS_NAME') }}</div>
        <div>{{ tableData.entChsName }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_EGLS_NAME') }}</div>
        <div>{{ tableData.entEglsName }}</div>
      </div>
      <div v-for="(item,index) in tableData.cardList" :key="index+'1'">
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') + (index+1) }}</div>
          <div>{{ item.cardType }}</div>
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') + (index+1) }}</div>
          <div>{{ item.cardNo }}</div>
        </div>
        <div class="row">
          <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_AREA') + (index+1) }}</div>
          <div>{{ item.cardArea }}</div>
        </div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_NAME') }}</div>
        <div>{{ tableData.contactsName }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
        <div>{{ tableData.contactsPhone }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
        <div>{{ tableData.emailAddress }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_ADDRESS') }}</div>
        <div>{{ tableData.entAddress }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_TYPE') }}</div>
        <div>{{ tableData.entType | entType }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL') }}</div>
        <div>{{ tableData.adminEmpower | adminEmpower }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_TEAM') }}</div>
        <div>{{ tableData.accountManagerTeam }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_NAME') }}</div>
        <div>{{ tableData.accountManagerName }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.APPLICATION_DATA') }}</div>
        <div>{{ tableData.applicationDate }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.REMARK') }}</div>
        <div>{{ tableData.remark }}</div>
      </div>
    </div>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="lastStep">{{ $t('CUSTOMER_MANAGEMENT.LASTSTEP') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('CUSTOMER_MANAGEMENT.CONFIRM') }}</el-button>
    </div>
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import {
  merchantUpdate,
  queryMerchantDetail
} from '@/api/customer-management/customer';
export default {
  name: 'CustomerInfoMaintainConfirm',
  filters,
  data() {
    return {
      tableData: [],
      ebankCstmNo: ''
    };
  },
  methods: {
    lastStep() {
      this.$router.replace({
        name: 'CustomerInfoMaintain',
        params: { userInfo: this.tableData }
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/customerInfoMaintain/confirm' 
      );
    },
    async confirm() {
      // 测试修改需求（数据未改动不能提交）
      const data = this.$route.params;
      console.log(data);
      const unChangeData = await this.queryMerchantDetail();
      if (
        data.ebankStatus === unChangeData.ebankStatus &&
        data.remark === unChangeData.remark &&
        data.entType === unChangeData.entType &&
        data.adminEmpower === unChangeData.adminEmpower
      ) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.DATA_UNCHANGE'),
          type: 'error'
        });
        return;
      }
      this.tableData.mobilePhone = this.tableData.contactsPhone;
      // console.log('this.tableData', this.tableData);
      const result = await merchantUpdate(this.tableData);
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.CUSTOMER_CHANGE_SUCCESS'),
          type: 'success'
        });
        this.$router.replace({
          name: 'CustomerQueryCusMain'
        });
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/customerManagement/customerInfoMaintain/confirm' 
        );
      }
    },
    async queryMerchantDetail() {
      const result = await queryMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        return result.body;
      }
    }
  },
  created() {
    this.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
    this.tableData = this.$route.params;
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
.f-margint-20 {
  margin-top: 20px;
}
.f-w-340 {
  width: 340px;
}
.g-bottom {
  margin: 40px;
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

.el-form-item {
  margin-bottom: 10px;
}
</style>