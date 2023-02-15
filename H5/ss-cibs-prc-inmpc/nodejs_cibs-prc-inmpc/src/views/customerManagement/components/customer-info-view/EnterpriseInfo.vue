<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 16:38:09
 * @LastEditTime: 2022-09-29 19:12:42
 * @LastEditors: zhangcheng
 * @Description: 个人基本信息
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\EnterpriseInfo.vue
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_STATUS') }}</div>
      <div>{{ enterpriseInfo.ebankStatus | ebankStatus }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_CHS_NAME') }}</div>
      <div>{{ enterpriseInfo.entChsName || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_EGLS_NAME') }}</div>
      <div>{{ enterpriseInfo.entEglsName }}</div>
    </div>
    <div v-for="(item,index) in enterpriseInfo?enterpriseInfo.cardList:[]" :key="index">
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
      <div>{{ enterpriseInfo.contactsName }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') }}</div>
      <div>{{ enterpriseInfo.contactsPhone || '- -' }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.CONTACTS_PHONE') + '2' }}</div>
      <div>{{ enterpriseInfo.contactsPhone2 || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.EMAIL_ADDRESS') }}</div>
      <div>{{ enterpriseInfo.emailAddress }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_ADDRESS') }}</div>
      <div>{{ enterpriseInfo.entAddress }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_TYPE') }}</div>
      <div>{{ enterpriseInfo.entType | entType }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.ADMAIN_AUTH_MODEL') }}</div>
      <div>{{ enterpriseInfo.adminEmpower | adminEmpower }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_TEAM') }}</div>
      <div>{{ enterpriseInfo.accountManagerTeam }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.MANAGE_NAME') }}</div>
      <div>{{ enterpriseInfo.accountManagerName || '- -' }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.APPLICATION_DATA') }}</div>
      <div>{{ enterpriseInfo.applicationDate }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.REMARK') }}</div>
      <div>{{ enterpriseInfo.remark || '- -' }}</div>
    </div>
    <div class="row">
      <div>小額轉賬狀態</div>
      <div>{{ enterpriseInfo.setStatus | setStatusFilter }}</div>
      <div v-if="enterpriseInfo.setStatus==='1'">金額</div>
      <div v-if="enterpriseInfo.setStatus==='1'">HKD{{ moneyFormat(String(enterpriseInfo.limitAmount)) }}</div>
    </div>
    <div class="row">
      <div>限額級別</div>
      <div>{{customerClazzFilter(enterpriseInfo.customerClazz) }}</div>
    </div>
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import { moneyFormat } from '@/utils/tools';
import { queryMerchantDetail } from '@/api/customer-management/customer';
export default {
  name: 'EnterpriseInfo',
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  filters,
  data() {
    return {
      enterpriseInfo: {}
    };
  },
  methods: {
    moneyFormat,
    // 个人基本信息
    async queryMerchantDetail() {
      const result = await queryMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        this.enterpriseInfo = result.body;
      }
      console.log(result.body);
    },
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
  },
  async created() {
    this.queryMerchantDetail();
  }
};
</script>

<style lang="scss" scoped></style>
