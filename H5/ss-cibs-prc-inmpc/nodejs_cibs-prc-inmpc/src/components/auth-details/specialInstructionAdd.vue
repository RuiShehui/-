<!--
 * @Author: zhutao
 * @Date: 2021-11-18 17:44:07
 * @LastEditTime: 2022-11-04 11:20:38
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
      <div>{{ tableData.entEglsName }}</div>
    </div>
    <div class="row">
     <div>客戶經理登入名稱</div>
      <div>{{ tableData.rmUserno }}</div>
      <div>客戶經理郵箱</div>
      <div>{{ tableData.rmEmail }}</div>
    </div>
    <div class="row">
      
       <div>客戶經理姓名</div>
      <div>{{ tableData.rmRealName}}</div>
       <div>客戶經理所屬機構</div>
      <div>{{ tableData.belongDepName}}</div>
    </div>

    
  </div>
</template>

<script>
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
      ebankCsInfo: [{ entName: '', authStatus: '' }],
      detailData:{}
    };
  },
  async mounted() {
     
    this.tableData = JSON.parse(this.options.temp.afterMdJson).body
    console.log(this.tableData,'this.tableData')
   
  },
  methods: {
   
  
  }
};
</script>

<style lang="scss" scoped></style>
