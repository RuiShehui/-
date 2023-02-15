<!--
 * @Author: zhangcheng
 * @Date: 2021-11-10 10:40:08
 * @LastEditTime: 2022-01-24 17:25:41
 * @LastEditors: zhangcheng
 * @Description: billConfirm file create
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\billMainrenace\billConfirm.vue
-->
<template>
  <div>
    <div class="transverse-table">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.MERCHANT_TYPE') }}</div>
        <div>{{ tableData.merchantTypeInfo }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.MERCHANT_NAME') }}</div>
        <div>{{ tableData.merchantName }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.BILL_TYPE') }}</div>
        <div>{{ tableData.billTypeInfo }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.BILL_NO') }}</div>
        <div>{{ tableData.billNo }}</div>
      </div>
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.MERCHANT_ALIAS') }}</div>
        <div>{{ tableData.merchantAlias }}</div>
      </div>
    </div>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="lastStep">{{$t('CUSTOMER_MANAGEMENT.LASTSTEP')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('CUSTOMER_MANAGEMENT.CONFIRM')}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BillConfirm',
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    lastStep() {
      this.$emit('lastStep');
    },
    confirm() {
      this.$emit('confirm');
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.g-bottom {
  margin-top: 40px;
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