<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 15:56:20
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-07-06 17:46:33
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\authorization-temolate-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t(`CUSTOMER_MANAGEMENT.EBANK_CSTM_NO_LABEL`) }}</div>
      <div>{{ tableData.ebankCstmNo }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`CUSTOMER_MANAGEMENT.ENT_NAME`) }}</div>
      <div>{{ ebankCsInfo.entName }}</div>
      <div>{{ $t(`CUSTOMER_MANAGEMENT.STATUS`) }}</div>
      <div>{{ ebankCsInfo.status | status }}</div>
    </div>
    <div v-for="(item,index) in ebankCsInfo.cardList" :key="index + '1'">
      <div class="row">
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_TYPE') + (index+1) }}</div>
        <div>{{ item.cardType }}</div>
        <div>{{ $t('CUSTOMER_MANAGEMENT.CARD_NO')+ (index+1) }}</div>
        <div>{{ item.cardNo }}</div>
      </div>
    </div>
    <div class="row">
      <div>{{ $t(`CUSTOMER_MANAGEMENT.MODEL_NAME`) }}</div>
      <div>{{ tableData.modelName }}</div>
      <div>{{ $t(`CUSTOMER_MANAGEMENT.TEMPLATE_TYPE`) }}</div>
      <div>{{ tableData.modelType | modelType }}</div>
    </div>
    <div class="row">
      <div>{{ $t(`CUSTOMER_MANAGEMENT.AUTH_PEOPLE_INFO`) }}</div>
      <div>
        <p v-for="(item,index) in ebankCsInfo.amuntUserList" :key="index + '2'">{{ item }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { queryMerchantList } from '@/api/customer-management/customer';
import { moneyFormat } from '@/utils/tools';
import filters from '@/filters/clientManage';
import CONSTANTS from '@/utils/constant.js';
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  filters,
  data() {
    return {
      tableData:
        //列表数组
        {
          ebankCstmNo: '网银客户号1', //网银客户号
          cstmName: '客户名称1', //客户名称
          authStatus: '状态1', //状态
          cardType: '证件类型1', //证件类型
          cardNo: '证件号码1', //证件号码
          modelName: '模板名称1', //模板名称
          modelType: '模板类型1', //模板类型
          authPeopleInfo: '授权人数信息1' // 授权人数信息
        },
      ebankCsInfo: {
        entName: '',
        status: '',
        cardList: [],
        amuntUserList: []
      }
    };
  },
  computed: {},
  created() {},

  async mounted() {
    this.init();
  },

  methods: {
    init() {
      const { afterMdJson = '{}' } = this.options.temp;
      this.tableData = JSON.parse(afterMdJson).body;
      this.queryMerchantList();
      const modelType = this.tableData.modelType;
      this.tableData.amuntUserList.forEach(item => {
        if (modelType === '1') {
          this.ebankCsInfo.amuntUserList.push(
            `${moneyFormat(item.amountStart)} < ${this.$t(
              'CUSTOMER_MANAGEMENT.MONEY'
            )} ≤ ${moneyFormat(item.amountEnd)}, ${item.levelANumber}A ${
              item.levelBNumber
            }B ${item.levelCNumber}C`
          );
        } else {
          this.ebankCsInfo.amuntUserList.push(
            `${item.levelANumber}A ${item.levelBNumber}B ${item.levelCNumber}C`
          );
        }
      });
    },
    async queryMerchantList() {
      const result = await queryMerchantList({
        ebankCstmNo: this.tableData.ebankCstmNo,
        serchType: '1'
      });
      if (result.body) {
        this.ebankCsInfo.status = result.body[0].status;
        this.ebankCsInfo.cardList = result.body[0].cardList;
        let lang = JSON.parse(sessionStorage.getItem('head')).lang;
        if (lang !== 'en' && result.body[0].entChsName !== '') {
          this.ebankCsInfo.entName = result.body[0].entChsName;
        } else {
          this.ebankCsInfo.entName = result.body[0].entEglsName;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
