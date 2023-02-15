<!--
 * @Autor: 朱涛
 * @Date: 2021-11-26 15:17:08
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-17 11:41:43
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\authorization-details\discount-management.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->

<template>
  <div>
    <div class="transverse-table">
      <div class="row">
        <div>{{this.$t("BUSINESS_MANAGEMENT.CHANNEL")}}</div>
        <div>{{tableData[0].discountWay}}</div>
        <div>{{this.$t("BUSINESS_MANAGEMENT.DISCOUNT_WAY")}}</div>
        <div>{{tableData[0].channel}}</div>
      </div>
      <div class="row">
        <div>{{this.$t("BUSINESS_MANAGEMENT.DISCOUNT_STANDARD")}}</div>
        <div v-if="MethodType === '0'">{{tableData[0].discountStandard}}</div>
        <div v-else> / </div>
        <div>{{this.$t("BUSINESS_MANAGEMENT.DISCOUNT_METHOD")}}</div>
        <div>{{tableData[0].discountMethod}}</div>
      </div>
      <div class="row">
        <div>{{this.$t("BUSINESS_MANAGEMENT.FIXED_AMOUNT")}}</div>
        <div
          v-if="tableData[0].discountMoneyList && tableData[0].discountMoneyList.length > 0 && MethodType === '1'"
        >
          <span
            v-for="(item,key) in tableData[0].discountMoneyList"
            :key="key"
          >{{' '+item.discountCcy + ':' + item.discountMoney + '; '}}</span>
        </div>
        <div v-else> / </div>
        <div>{{this.$t("BUSINESS_MANAGEMENT.EFFECTIVE_DATE")}}</div>
        <div>{{tableData[0].effectiveTime}}</div>
      </div>
      <div class="row">
        <div>{{this.$t("BUSINESS_MANAGEMENT.CHANNEL")}}</div>
        <div>{{tableData[0].discountWay}}</div>
        <div v-if="!discountFlag">{{this.$t("BUSINESS_MANAGEMENT.DISCOUNT_OBJECTS")}}</div>
        <div v-if="discountFlag">{{this.$t("BUSINESS_MANAGEMENT.CUSTOM_INFO")}}</div>
        <div>{{tableData[0].objectName}}</div>
      </div>
      <div class="row">
        <div>{{this.$t("BUSINESS_MANAGEMENT.DISCOUNT_DESC")}}</div>
        <div>{{tableData[0].discountDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      MethodType:'',
      tableData: [
        {
          discountWay: '汇款', // 表头
          discountWayTitle: '折扣项目', // 收费项目
          channleTitle: '折扣渠道', // 表头
          channel: '个人网银', // 收费渠道
          // creatorTitle: '提交人', // 表头
          discountMoney: '', //固定金额
          // createTimeTitle: '提交时间', // 表头
          effectiveTime: '', // 生效日期
          discountObjectTypeTitle: '适用对象', // 表头
          discountObjectType: '机构', // 折扣对象
          // objectNameTitle: '机构', // 表头
          objectName: '', // 折扣机构
          discountDescTitle: '优惠描述', // 表头
          discountDesc: '111', //优惠描述
          discountStandardTitle: '折扣标准', //折扣标准
          discountStandard: '折扣标准', //折扣标准
          discountMethodTitle: '折扣方式', //折扣方式
          discountMethod: '' ,//折扣方式
        }
      ],
      discountFlag: false //false: 0(机构), true: 1(白名单)
    };
  },
  computed: {},
  created() {},

  mounted() {
    console.log('打印options', JSON.parse(this.options.temp.afterMdJson));
    this.MethodType = JSON.parse(this.options.temp.afterMdJson).body.discountMethod
    console.log('JSON.parse(this.options.temp.afterMdJson).body',JSON.parse(this.options.temp.afterMdJson).body)
    this.renderData(JSON.parse(this.options.temp.afterMdJson).body);
    // this.tableData[0].discountWay = JSON.parse(this.options.temp.afterMdJson).discountWay;
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    //处理渲染数据
    renderData(discountObject) {
      let dischaObj = {
        0: this.$t('COMMON.ENT_BANK'),
        1: this.$t('COMMON.ENTERPRISES_BANK')
      };
      let dismethObj = {
        0: this.$t('BUSINESS_MANAGEMENT.PERCENT'),
        1: this.$t('BUSINESS_MANAGEMENT.FIXED_AMOUNT')
      };
      let distypObj = {
        0: this.$t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECTS'),
        1: this.$t('BUSINESS_MANAGEMENT.WHITE_LIST')
      };
      let diswayObj = {
        0: this.$t('BUSINESS_MANAGEMENT.FUND'),
        1: this.$t('BUSINESS_MANAGEMENT.TT_PAY'),
        2: this.$t('BUSINESS_MANAGEMENT.CHATS_PAY'),
        3: this.$t('BUSINESS_MANAGEMENT.MULTI_TRANSFER'),
        4: this.$t('BUSINESS_MANAGEMENT.MULTI_SALARY'),
        5: this.$t('BUSINESS_MANAGEMENT.MULTI_RECEIVE'),
        6: this.$t('BUSINESS_MANAGEMENT.AUTO_RECEIVE')
      };
      this.tableData[0].discountWay = diswayObj[discountObject.discountWay];
      this.tableData[0].channel = dischaObj[discountObject.channel];
      this.tableData[0].discountMoneyList = JSON.parse(discountObject.discountMoney);
      if (discountObject.effectiveTime) {
        this.tableData[0].effectiveTime = discountObject.effectiveTime;
      } else {
        this.tableData[0].effectiveTime = this.$t(
          'BUSINESS_MANAGEMENT.EFFECTIVED'
        );
      }
      this.tableData[0].discountObjectType =
        distypObj[discountObject.discountObjectType];
      this.tableData[0].discountDesc = discountObject.discountDesc;
      this.tableData[0].discountStandard = discountObject.discountStandard;
      // this.tableData[0].objectName = discountObject.objectName
      this.tableData[0].discountMethod =
        dismethObj[discountObject.discountMethod];
      if (discountObject.discountObjects) {
        if (discountObject.discountObjectType === '1') {
          this.discountFlag = true;
          discountObject.discountObjects.forEach(item => {
            if (this.tableData[0].objectName) {
              this.tableData[0].objectName =
                this.tableData[0].objectName + ';' + item.discountObjectCode;
            } else {
              this.tableData[0].objectName = item.discountObjectCode;
            }
          });
        } else {
          this.discountFlag = false;
          discountObject.discountObjects.forEach(item => {
            if (this.tableData[0].objectName) {
              this.tableData[0].objectName =
                this.tableData[0].objectName + ';' + item.objectName;
            } else {
              this.tableData[0].objectName = item.objectName;
            }
          });
        }
      }
      console.log('this.tableData',this.tableData)
    }
  }
};
</script>

<style lang="scss" scoped>
.g-discountDetail {
  //   padding: 24px;
}
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
</style>
