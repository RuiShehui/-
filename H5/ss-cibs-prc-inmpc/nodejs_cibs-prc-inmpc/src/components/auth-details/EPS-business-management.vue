<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 15:28:47
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-27 15:20:48
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\EPS-business-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div>
      <el-descriptions :column="2" border>
        <template v-if="!mcrchantTypeFlag">
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE')">{{ tableData.merchantTypeName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.OUTWARD_MERCHART_CODE')">{{ tableData.merchartCode }}</el-descriptions-item>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')+'(簡)'">{{ tableData.merchartName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')+'(繁)'">{{ tableData.merchartNameZht }}</el-descriptions-item>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_NAME')+'(英)'">{{ tableData.merchartNameEn }}</el-descriptions-item>
        </template>
        <template v-else>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME')+'(簡)'">{{ tableData.merchartTypeName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME')+'(繁)'">{{ tableData.merchartTypeNameZht }}</el-descriptions-item>
        <el-descriptions-item :label="$t('BUSINESS_MANAGEMENT.MERCHANT_TYPE_NAME')+'(英)'">{{ tableData.merchartTypeNameEn }}</el-descriptions-item>
        </template>
      </el-descriptions>

    <el-table :data="arrList" border style="width:100%"  header-cell-class-name="title" v-if="!mcrchantTypeFlag">
        <el-table-column width="150" prop="billNumberInfo" :label="$t('CUSTOMER_MANAGEMENT.BILL_NO_DETIAL')+'(簡)'"></el-table-column>
        <el-table-column width="150" prop="billNumberInfoZht" :label="$t('CUSTOMER_MANAGEMENT.BILL_NO_DETIAL')+'(繁)'"></el-table-column>
        <el-table-column width="150" prop="billNumberInfoEn" :label="$t('CUSTOMER_MANAGEMENT.BILL_NO_DETIAL')+'(英)'"></el-table-column>
        <el-table-column width="150" prop="billType" :label="$t('CUSTOMER_MANAGEMENT.BILL_TYPE')"></el-table-column>
        <el-table-column width="150" prop="billTypeInfo" :label="$t('CUSTOMER_MANAGEMENT.BILL_TYPE_DETAIL')+'(簡)'"></el-table-column>
        <el-table-column width="150" prop="billTypeInfoZht" :label="$t('CUSTOMER_MANAGEMENT.BILL_TYPE_DETAIL')+'(繁)'"></el-table-column>
        <el-table-column width="150" prop="billTypeInfoEn" :label="$t('CUSTOMER_MANAGEMENT.BILL_TYPE_DETAIL')+'(英)'"></el-table-column>
        <el-table-column width="150" prop="billEffectiveTime" :label="$t('BUSINESS_MANAGEMENT.BILL_EFFECTIVE_TIME')"></el-table-column>
        <el-table-column width="150" prop="billFailureTime" :label="$t('BUSINESS_MANAGEMENT.BILL_FAILURE_TIME')"></el-table-column>
    </el-table> 
  </div>
</template>

<script>
import { getEpsTypeInf } from '@/api/business-management/business-start.js';
import { getMMDetail } from '@/api/business-management/merchants-maintain.js';
import CONSTANTS from '@/utils/constant';
export default {
  components: {},
  props: {
    options: {
      Type: Object,
      default: () => {}
    },
    bizTypeCode: [String, Number]
  },
  data() {
    return {
      arrList: [],
      tableData:
        //列表数组
        {
          // merchantTypeName: '', //商户类别
          // riskClazz: '', //风险等级
          // merchartName: '', //商品名称
          // billNumberInfo: '', //账单详情
          // billType: '', //账单类别
          // billTypeInfo: '', // 账单类别详情
          // billEffectiveTime: '', //账单生效日期
          // billFailureTime: '', //账单失效日期
          // chargingType: '', //计费类型
          // cardStanded: '' //信用卡指标
        }
    };
  },
  computed: {
    // 根据商户类型展示不同数据； false：商家维护；true：商户类别维护
    mcrchantTypeFlag() {
      const { bizTypeCode = '' } = this.options;
      if (bizTypeCode === '91442342') {
        return true;
      }
      return false;
    }
  },
  created() {
    console.log('this.options:',this.options);
  },

  mounted() {
    if (
      this.options.operType !== '删除' &&
      this.options.operType !== 'Delete' &&
      this.options.operType !== '刪除'
    ) {
      if (this.mcrchantTypeFlag) {
        
        this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
        console.log('this.tableData',this.tableData);
        CONSTANTS.RISK_LEVEL_LIST.forEach(item => {
          if (item.value === this.tableData.riskClazz) {
            this.tableData.riskClazz = item.label;
          }
        });
      } else {
        this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
        console.log('this.tableData',this.tableData);
        this.arrList = JSON.parse(
          this.options.temp.afterMdJson
        ).body.commEpsMerchantBills;
        // let cardStandedObj = { 0: 'C', 1: 'D' }; //信用卡指标
        // let chargingTypeObj = { 0: 'C', 1: 'D', 2: 'R' }; //计费类型
        // this.arrList.forEach(item => {
        //   item.chargingType = chargingTypeObj[item.chargingType];
        //   item.cardStanded = cardStandedObj[item.cardStanded];
        // });
        console.log('this.arrList', this.arrList);
      }
    } else {
      if (this.mcrchantTypeFlag) {
        getEpsTypeInf({
          merchartTypeCode: JSON.parse(this.options.temp.afterMdJson).body
            .merchartTypeCode
        }).then(resp => {
          console.log('打印删除。。。', resp);
          if (resp.body) {
            this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
            console.log('this.tableData1111111',this.tableData);
            // this.tableData.merchantTypeName = resp.body.merchartTypeName;
            // this.tableData.riskClazz = resp.body.riskClazz;
            CONSTANTS.RISK_LEVEL_LIST.forEach(item => {
              if (item.value === resp.body.riskClazz) {
                this.tableData.riskClazz = item.label;
              }
            });
          }
        });
      } else {
        getEpsTypeInf({
          merchartTypeCode: JSON.parse(this.options.temp.afterMdJson).body
            .merchartTypeCode
        }).then(resp => {
          console.log('打印删除。。。', resp);
          this.tableData.merchantTypeName = resp.body.merchartTypeName;
          CONSTANTS.RISK_LEVEL_LIST.forEach(item => {
            if (item.value === resp.body.riskClazz) {
              this.tableData.riskClazz = item.label;
            }
          });
          this.tableData.merchartName = resp.body.merchartName;
          this.tableData.billNumberInfo = resp.body.billNumberInfo;
          this.tableData.billType = resp.body.billType;
          this.tableData.billTypeInfo = resp.body.billTypeInfo;
          // this.arrList = resp.body.commEpsMerchantBills;
          this.tableData.merchartName = JSON.parse(this.options.temp.afterMdJson).body.merchartName;
          this.arrList = JSON.parse(
            this.options.temp.afterMdJson
          ).body.commEpsMerchantBills;
          // let cardStandedObj = { 0: 'C', 1: 'D' }; //信用卡指标
          // let chargingTypeObj = { 0: 'C', 1: 'D', 2: 'R' }; //计费类型
          // this.arrList.forEach(item => {
          //   item.chargingType = chargingTypeObj[item.chargingType];
          //   item.cardStanded = cardStandedObj[item.cardStanded];
          // });
        });
      }
    }
  },

  methods: {

  }
};
</script>

<style lang="scss" scoped>
::v-deep .title{
  background:#f3f6fc !important
}
::v-deep .el-descriptions-item__label.is-bordered-label{
  width: 180px;
  background:#f3f6fc;
}
::v-deep .el-descriptions-item__content{
  width: 282px;
}
</style>
