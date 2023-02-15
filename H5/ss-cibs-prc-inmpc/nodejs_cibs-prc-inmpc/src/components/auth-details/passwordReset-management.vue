<!--
 * @Author: zhutao
 * @Date: 2021-11-18 17:44:07
 * @LastEditTime: 2022-10-13 19:22:41
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\auth-details\user-maintenance-management.vue
-->
<template>
  <div class="transverse-table">
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.EBANK_CSTM_NO') }}</div>
      <div>{{ tableData.ebankCstmNo }}</div>
       <div>{{ $t('CUSTOMER_MANAGEMENT.ENT_NAME') }}</div>
      <div>{{ ebankCsInfo[0].entName }}</div>
    </div>
    <div class="row">
      <div>{{ $t('CUSTOMER_MANAGEMENT.STATUS') }}</div>
      <div>{{ ebankCsInfo[0].authStatus }}</div>
      <div>{{ $t('CUSTOMER_MANAGEMENT.USER_TYPE') }}</div>
      <div>{{ tableData.userType }}</div>
    </div>
    <div class="row">
      
      <div v-if="tableData.loginName">{{ $t('CUSTOMER_MANAGEMENT.LOGIN_NAME') }}</div>
      <div v-if="tableData.loginName">{{ tableData.loginName }}</div>
    </div>
    <div class="row">
      <div>用戶編號</div>
      <div>{{ tableData.userCode }}</div>
       <div>用戶英文名稱</div>
      <div>{{ tableData.userEglsName }}</div>
      <!-- <div v-if="tableData.loginName">{{ $t('CUSTOMER_MANAGEMENT.LOGIN_NAME') }}</div>
      <div v-if="tableData.loginName">{{ tableData.loginName }}</div> -->
    </div>
    <div class="row">
      <div>交易類別</div>
      <div>重設密碼重試次數</div>
    </div>
    
  </div>
</template>

<script>
import { queryMerchantList } from '@/api/customer-management/customer';
import { getPaymentCommAccountList } from '@/api/customer-management/customer';
import tool from '@/utils/moneyTools.js';
import {
  getListCardType,
  getListCardArea
} from '@/api/customer-management/dictionary';
import CONSTANTS from '@/utils/constant.js';
export default {
  name: 'UserMaintainConfirm',
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
        authStatus: '', //状态
        userType: '', //用户类型
        loginName: '', //用户名
        userChsName: '', //用户中文名称
        userEglsName: '', //用户英文名称
        cardType: '', //证件类型
        cardNo: '', //证件号码
        userTypeOne: '', //用户状态
        empowerGroup: '', //授权级别
        cardArea: '', //是否开通双重认证
        cardAreaOne: '', //证件签发地
        birthday: '', //出生日期
        userPhone: '', //联络电话
        email: '', //电邮地址
        mobilePhone: '', //流动电话号码
        mailAddress: '' //邮寄地址
      },
      CONSTANTS,
      cardTypeList: [],
      cardAreaList: [],
      ebankCsInfo: [{ entName: '', authStatus: '' }]
    };
  },
  async mounted() {
    this.getCardTypeList();
    this.getCardAreaList();
    let userTypeObj = { 1: '管理員', 2: '授權員', 3: '錄入員' };
    let cardAreaObj = { 0: '否', 1: '是' };
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body;
    console.log(this.tableData,'tableData')
    if (this.tableData.cuSoleAuthorizerInd === '1') {
      getPaymentCommAccountList({
        ebankCustNo: this.tableData.ebankCstmNo
      }).then(resp => {
        if (resp.body) {
          if (resp.body.accList.length > 0) {
            this.tableData.userAccountLimits.forEach(accItem => {
              accItem.limitDaily = tool.currencyFormat(
                accItem.limitDaily,
                '',
                2
              );
              resp.body.accList.forEach(item => {
                let accTypeName = '';
                let currencyName = '';
                if (item.accType) {
                  accTypeName = CONSTANTS.accountTypes[item.accType];
                }
                if (item.currency) {
                  currencyName = item.currency;
                }
                if (accItem.accountNo === item.accNo) {
                  accItem.accountNo =
                    item.accNo + ' ' + currencyName + ' ' + accTypeName;
                }
              });
            });
          }
        }
      });
    }
    this.tableData.userType = userTypeObj[this.tableData.userType];
    this.tableData.tfaStatus = cardAreaObj[this.tableData.tfaStatus];
    if (this.tableData.empowerGroup === '0') {
      this.tableData.empowerGroup = '无';
    }
    // console.log("打印tableData", this.tableData)
    const result = await queryMerchantList({
      ebankCstmNo: this.tableData.ebankCstmNo,
      serchType: '1'
    });
    console.log('result.body[0]', result.body[0]);
    let lang = JSON.parse(sessionStorage.getItem('head')).lang;
    if (lang !== 'en' && result.body[0].entChsName !== '') {
      this.ebankCsInfo[0].entName = result.body[0].entChsName;
    } else {
      this.ebankCsInfo[0].entName = result.body[0].entEglsName;
    }
    this.ebankCsInfo[0].authStatus = CONSTANTS.ENABLE[result.body[0].status];
    console.log(this.ebankCsInfo);
    // this.ebankCsInfo[0].cardArea = cardAreaObj[result.body[0].cardArea];
  },
  methods: {
    async getCardTypeList() {
      if (sessionStorage.getItem('cardTypeList')) {
        this.cardTypeList = JSON.parse(sessionStorage.getItem('cardTypeList'));
      } else {
        const result = await getListCardType({
          bigGroupCode: 'language',
          fieldName: 'cardTypeInd'
        });
        if (result.body) {
          this.cardTypeList = result.body.cardTypeList;
          sessionStorage.setItem(
            'cardTypeList',
            JSON.stringify(this.cardTypeList)
          );
        }
      }
    },
    async getCardAreaList() {
      if (sessionStorage.getItem('cardAreaList')) {
        this.cardAreaList = JSON.parse(sessionStorage.getItem('cardAreaList'));
      } else {
        const result = await getListCardArea({
          bigGroupCode: 'language',
          fieldName: 'cardArea'
        });
        if (result.body) {
          this.cardAreaList = result.body.cardAreaList;
          sessionStorage.setItem(
            'cardAreaList',
            JSON.stringify(this.cardAreaList)
          );
        }
      }
    },
    cardTypeFilter(val) {
      console.log(this.cardTypeList, val);
      const value = this.cardTypeList.find(item => item.fieldValue === val);
      console.log(value);
      return value ? value.fiedlDescrible : '';
    },
    cardAreaFilter(val) {
      const value = this.cardAreaList.find(item => item.fieldValue === val);
      console.log(value);
      return value ? value.fiedlDescrible : '';
    }
  }
};
</script>

<style lang="scss" scoped></style>
