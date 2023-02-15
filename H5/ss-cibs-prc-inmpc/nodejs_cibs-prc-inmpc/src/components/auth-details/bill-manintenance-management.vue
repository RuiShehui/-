<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 17:45:34
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 15:57:16
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\bill-manintenance-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->

<template>
  <div class="transverse-table" v-if="isShow">
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO') }}</div>
      <div>{{ ebankCstmNo }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_NAME') }}</div>
      <div>{{ ebankCsInfo[0].entEglsName }}</div>
    </div>
    <div v-for="(item,key) in ebankCsInfo[0].cardList" :key="key">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') + (key + 1) }}</div>
        <div>{{ item.cardType }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO') + (key + 1) }}</div>
        <div>{{ item.cardNo }}</div>
      </div>
    </div>
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
</template>

<script>
import { queryMerchantBillDetail } from '@/api/business-management/exception.js';
import { queryMerchantList } from '@/api/customer-management/customer';
import CONSTANTS from '@/utils/constant.js';
export default {
  name: 'BillConfirm',
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: {
        ebankCstmNo: '', //网银客户号
        entChsName: '', //客户名称
        status: '', //状态
        cardType: '', //证件类型
        cardNo: '', //证件号码
        merchantType: '', //商户类别
        merchantName: '', //商户名称
        billType: '', //账单类别
        billNo: '', //账户号码
        merchantAlias: '' //商户别名
      },
      ebankCsInfo: [],
      isShow: false,
      ebankCstmNo: ''
    };
  },
  created() {
    this.ebankCstmNo = JSON.parse(
      this.options.temp.afterMdJson
    ).body.ebankCstmNo;
    if (this.options.operType !== this.$t('COMMON.DELETE')) {
      this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
    } else {
      queryMerchantBillDetail(
        JSON.parse(this.options.temp.afterMdJson).body
      ).then(resp => {
        if (resp.body) {
          this.tableData.entChsName = resp.body.ENT_CHS_NAME;
          this.tableData.status = CONSTANTS.ENABLE[resp.body.STATUS];
          this.tableData.cardType = resp.body.CARD_TYPE;
          this.tableData.cardNo = resp.body.CARD_NO;
          this.tableData.merchantType = resp.body.MERCHANT_TYPE;
          this.tableData.merchantName = resp.body.MERCHANT_NAME;
          this.tableData.billType = resp.body.BILL_TYPE;
          this.tableData.billNo = resp.body.BILL_NO;
          this.tableData.merchantAlias = resp.body.MERCHANT_ALIAS;
        }
      });
    }
    this.queryMerchantList();
  },
  methods: {
    queryMerchantList() {
      queryMerchantList({
        serchType: '1',
        ebankCstmNo: this.ebankCstmNo
      }).then(res => {
        this.isShow = true;
        this.ebankCsInfo = res.body;
      });
    },
    statusFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.DELETE_ACCOUNT');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.ENABLE');
        case '2':
          return this.$t('CUSTOMER_MANAGEMENT.DISABLE');
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
 