<!--
 * @Autor: 朱涛
 * @Date: 2021-11-27 16:58:28
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-07-18 16:37:43
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\register-third\index.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="g-userManagementDetail">
    <component
      :is="CommonInfoComponent"
      :commonData="commonData"
      :registerThirdData="registerThirdData"
      :cardList="cardList"
      :payeeIdenMethodFlag="payeeIdenMethodFlag"
      :wireInfo="wireInfo"
      :bankFlag="bankFlag"
    />
  </div>
</template>

<script>
import InsideBankCommon from './inside-bank/common-info.vue';
import TransFastCommon from './trans-fast/common-info.vue';
import LocalFastCommon from './local-fast/common-info.vue';
import WireTransCommon from './wire-trans/common-info.vue';

import { queryMerchantDetail } from '@/api/customer-management/customer';
import { judgeSwiftCode } from '@/api/customer-management/third-register';
import CONSTANTS from '@/utils/constant';
import countryInfos from '@/mixins/country-list';

const { PAYEE_IDENTIFY_METHOD_LIST } = CONSTANTS;

export default {
  components: {
    InsideBankCommon,
    TransFastCommon,
    LocalFastCommon,
    WireTransCommon
  },
  mixins: [countryInfos],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    options: function(val) {
      // console.log('打印val', val.temp.afterMdJson);
      if (val.temp.afterMdJson) {
        this.registerThirdData = {
          ...JSON.parse(this.options.temp.afterMdJson).body
        };
        this.processData();
      }
    }
  },
  data() {
    return {
      bankFlag: true, //true: 展示银行名称，地址。false：不显示
      transType: '0', //0: 行内转账,1：转数快,2:外币转账,3:电汇账户
      payeeIdenMethodFlag: '1', //1:收款账户, 2:流动电话， 3：电邮地址， 4：FPS ID
      commonData: {
        ebankCstmNo: '', //网银客户号
        contactsName: '', //客户名称
        status: '' //状态
      },
      cardList: [
        // {
        //   cardType: '', //证件类型
        //   cardNo: '' //证件号码
        // }
      ],
      registerThirdData: {
        transferType: '', //第三者账号类别
        payeeIdenMethod: '', //收款人识别方式
        receivingBank: '', //收款银行/机构
        payeeBank: '', // 指定收款方银行
        emailAddress: '', //电邮地址
        fpsId: '', //FPS ID
        payeeName: '', //收款人名称
        payeeCountryCode: '', //收款人国家
        payeeAddress: '', //收款人地址
        accountNo: '', //账户号码/IBAN
        swiftCode: '', //swiftCode
        countryCode: '', //银行国家/地区
        bankName: '', //银行名称
        bankAddress: '', //银行地址
        ebankCstmNo: '', //网银客户号
        bankCode: '' //银行编号
      },
      /** 电汇特有的数据 */
      wireInfo: {
        swiftCode: '', //swiftCode
        countryCode: '', //银行国家/地区
        bankName: '', //银行名称
        bankAddress: '' //银行地址
      },
      countryCode: '', //银行国家/地区
      bankName: '', //银行名称
      bankAddress: '' //银行地址
    };
  },
  computed: {
    /** 渲染出来的component */
    CommonInfoComponent() {
      switch (this.transType) {
        case '0':
          return 'InsideBankCommon';
        case '1':
          return 'TransFastCommon';
        case '2':
          return 'LocalFastCommon';
        case '3':
          return 'WireTransCommon';
        default:
          return '';
      }
    }
  },
  mounted() {
    if (this.options.temp.afterMdJson) {
      this.registerThirdData = {
        ...JSON.parse(this.options.temp.afterMdJson).body
      };
    }
    this.processData();
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },

    //处理数据
    processData() {
      queryMerchantDetail({
        ebankCstmNo: this.registerThirdData.ebankCstmNo
      }).then(resp => {
        if (resp.body) {
          this.commonData.ebankCstmNo = resp.body.ebankCstmNo;
          this.commonData.contactsName = resp.body.contactsName;
          this.commonData.status = CONSTANTS.ENABLE[resp.body.status];
          this.cardList = resp.body.cardList;
        }
      });
      let traObj = {
        0: this.$t('CUSTOMER_MANAGEMENT.INNER_BANK'),
        1: this.$t('CUSTOMER_MANAGEMENT.TRANS_FAST'),
        2: this.$t('CUSTOMER_MANAGEMENT.LOCAL_FAST'),
        3: this.$t('CUSTOMER_MANAGEMENT.WIRE_TRANSFER')
      };
      this.wireInfo.swiftCode = JSON.parse(
        this.options.temp.afterMdJson
      ).body.swiftCode;

      if (this.registerThirdData.countryCode === 'HK') {
        this.bankFlag = false;
        this.registerThirdData.bankCode = this.registerThirdData.bankName;
      } else {
        this.bankFlag = true;
      }
      if (
        this.registerThirdData.transType === '1' ||
        this.registerThirdData.transType === '2'
      ) {
        if (JSON.parse(sessionStorage.getItem('BANK_INFO_LIST'))) {
          JSON.parse(sessionStorage.getItem('BANK_INFO_LIST')).forEach(item => {
            if (item.value === this.registerThirdData.payeeBank) {
              this.registerThirdData.receivingBank = item.label;
            }
          });
        }
      }
      this.transType = this.registerThirdData.transType;
      this.registerThirdData.transferType =
        traObj[this.registerThirdData.transType];
      this.handleSetTransFastNums(this.transType);
      this.countryList.forEach(item => {
        if (item.countryId === this.registerThirdData.payeeCountryCode) {
          this.registerThirdData.payeeCountryCode = item.countryShortName;
        }
      });
      if (!this.registerThirdData.swiftCode) {
        this.countryList.forEach(item => {
          if (item.countryId === this.registerThirdData.countryCode) {
            this.wireInfo.countryCode = item.countryFullName;
          }
        });
        this.wireInfo.bankAddress = this.registerThirdData.bankAddress;
        this.wireInfo.bankName = this.registerThirdData.bankName;
        if (this.registerThirdData.transType === '3') {
          this.registerThirdData.bankCode =
            this.registerThirdData.bankName +
            '-' +
            this.registerThirdData.bankAddress;
        }
      } else {
        judgeSwiftCode({
          ebankCstmNo: this.registerThirdData.ebankCstmNo,
          swiftCode: this.registerThirdData.swiftCode
        }).then(resp => {
          // console.log('答应resp：', resp, this.countryList);
          this.countryList.forEach(item => {
            if (item.countryId === resp.body.countryCode) {
              this.wireInfo.countryCode = item.countryFullName;
            }
          });
          this.wireInfo.bankAddress = resp.body.address;
          this.wireInfo.bankName = resp.body.institution;
          if (this.registerThirdData.transType === '3') {
            this.registerThirdData.bankCode =
              resp.body.institution + '-' + resp.body.address;
          }
          // console.log('打印this.registerThirdData', this.wireInfo);
        });
      }
    },
    handleSetTransFastNums(transType) {
      if (transType === '1') {
        const { temp } = this.options,
          { afterMdJson } = temp;
        if (afterMdJson) {
          const { body } = JSON.parse(afterMdJson);
          const item = this.registerThirdData;
          console.log(body.payeeIdentifyMethod, 'body.payeeIdentifyMethod');
          item.payeeIdenMethod = PAYEE_IDENTIFY_METHOD_LIST.find(
            item => item.value === body.payeeIdentifyMethod
          ).label;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-userManagementDetail {
  margin-top: 25px;
  background: #ffffff;
  height: 100%;
}
.tabs {
  margin-top: 3.5%;

  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
.g-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
/deep/ .el-table td.el-table__cell div {
  width: 100%;
}
</style>
