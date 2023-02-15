<!--
 * @Author: zhangcheng
 * @Date: 2021-11-17 17:32:49
 * @LastEditTime: 2022-09-26 10:09:49
 * @LastEditors: zhangcheng
 * @Description: 客户信息维护确认
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-maintain\CustomerInfoMaintainConfirm.vue
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
import dateTools from '@/utils/dateTools';
import { moneyFormat } from '@/utils/tools';
const { formatDate } = dateTools;

export default {
  name: 'CustomerInfoMaintainConfirm',
  filters,
  data() {
    return {};
  },
  props: {
    /**
     * @param {object}
     * @description 确认页展示数据
     */
    tableData: {
      type: Object,
      default() {
        return {};
      }
    },
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  methods: {
    formatDate,
    moneyFormat,
    lastStep() {
      // 返回修改页
      this.$emit('backIndex');
    },
    async confirm() {
      // 测试修改需求（数据未改动不能提交）
      // const data = this.$route.params;
      // console.log(data);
      // const unChangeData = await this.queryMerchantDetail();
      // if (
      //   data.ebankStatus === unChangeData.ebankStatus &&
      //   data.remark === unChangeData.remark &&
      //   data.entType === unChangeData.entType &&
      //   data.adminEmpower === unChangeData.adminEmpower
      // ) {
      //   this.$showMsg({
      //     message: this.$t('CUSTOMER_MANAGEMENT.DATA_UNCHANGE'),
      //     type: 'error'
      //   });
      //   return;
      // }
      // this.tableData.mobilePhone = this.tableData.contactsPhone;
      // console.log('this.tableData', this.tableData);
      const limitAmount = this.tableData.limitAmount?this.tableData.limitAmount.split(',').join(''):'0'
      const result = await merchantUpdate({...this.tableData,limitAmount});
      if (result.body) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.CUSTOMER_CHANGE_SUCCESS'),
          type: 'success'
        });
        this.$emit('finish');
      }
    },
    async queryMerchantDetail() {
      const result = await queryMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      if (result.body) {
        return result.body;
      }
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