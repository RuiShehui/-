<!--
 * @Author: zhangcheng
 * @Date: 2021-11-12 14:45:04
 * @LastEditTime: 2022-10-13 19:14:19
 * @LastEditors: zhangcheng
 * @Description: 确认页
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\customer-account-management.vue
-->
<template>
  <div class="contain">
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_STATUS') + '99999' }}</div>
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
        <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') + '2' }}</div>
        <div>{{ tableData.contactsPhone2 }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.MOBILE_PHONE') }}</div>
        <div>{{ tableData.mobilePhone }}</div>
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
      <div class="row">
        <div>小額轉賬狀態</div>
        <div>{{ tableData.setStatus | setStatusFilter }}</div>
        <div v-if="tableData.setStatus==='1'">金額</div>
        <div v-if="tableData.setStatus==='1'">HKD {{ moneyFormat(String(tableData.limitAmount)) }}</div>
      </div>
      <div class="row">
        <div>限額級別</div>
        <div>{{ customerClazzFilter(tableData.customerClazz) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { getHead } from '@/utils/user';
import { moneyFormat } from '@/utils/tools';
import filters from '@/filters/clientManage';
export default {
  name: 'CustomerAccountOpenConfirm',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: {},
      show: true,
      arrList: []
    };
  },
  filters,
  mounted() {
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
  },
  methods: {
    moneyFormat,
    customerClazzFilter(val) {
      const number = Number(val);
      if (number === 0 || (number && number < 26)) {
        return (
          String.fromCharCode(65 + Number(val)) +
          this.$t('BUSINESS_MANAGEMENT.CLAZZ')
        ) + '級';
      } else {
        return val;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 0;
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
</style>
