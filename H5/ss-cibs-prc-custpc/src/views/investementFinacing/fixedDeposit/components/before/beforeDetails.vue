<!--
 * @Author: your name
 * @Date: 2021-12-14 19:21:47
 * @LastEditTime: 2022-11-16 16:32:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\investementFinacing\fixedDeposit\components\before\beforeDetails.vue
-->
<template>
  <div class="g-beforeDetails">
    <divider :title="$t(`COMMON.DETAIL`)"></divider>
    <div class="m-detailItem">
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.ACCOUNT_NUMBER`)"
        :content="formatAccountNo(content.acctNo)+'-'+content.cur+'-'+this.$t('FIXED_DEPOSIT_OVERVIEW.FIXED_DEPOSIT_ACCOUNT')"
      />
      <detail-item :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURIT`)" :content="content.matdate" />
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DEPOSIT_TENOR`)"
        :content="content.deposiTimes"
      />
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.INTEREST_RATES`)"
        :content="content.rateOfYear"
      />
      <detail-item
        v-if="content.preAvailableInterest==null||content.preAvailableInterest==''||content.reservationNumber?false:true"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_INTEREST`)"
        :content="content.cur+' '+content.preAvailableInterest"
      />
      <detail-item
        v-if="content.preAvailablePrincipalInterest==null||content.preAvailablePrincipalInterest==''||content.reservationNumber?false:true"
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.EXPECTED_PRINCIPAL`)"
        :content="content.cur+' '+content.preAvailablePrincipalInterest"
      />
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.MATURITY_INSTRUCTION`)"
        :content="maturityInstructsFilter(content.maturityInstruct)"
      />
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.NEXT_DEPOSIT_TENOR`)"
        v-if="content.maturityInstruct=='1'||content.maturityInstruct=='2'"
        :content="content.nextTransferDates"
      />
      <!--  :content="content.reNewAcc" -->
      <detail-item
        :title="$t(`FIXED_DEPOSIT_OVERVIEW.DESIGNATED_ACCOUNT`)"
        v-if="content.maturityInstruct=='2'||content.maturityInstruct=='3'"
        :content="formatAccountNo(appointAccount)+'-'+content.cur+'-'+filetrType(appointType)"
      />
      <detail-item :title="$t(`FIXED_DEPOSIT_OVERVIEW.REMARKS`)" :content="content.remark||'--'" />
    </div>
    <VButton size="w210" class="f-btn" @click="back">{{$t("COMMON.BACK")}}</VButton>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/contants.js';
import tool from '@/dataTools/tools/moneyTools.js';
import mathTools from '@/utils/mathTools.js';
export default {
  data() {
    return {
      content: [],
      appointAccount:'',
      appointType:''
    };
  },
  created() {
    console.log(this.$route.qur, '111');
    // TODO 修改qury
    this.content = JSON.parse(this.$route.query.params)
    console.log(this.content.reNewAcc.replace(/[^0-9]/g,''),'reNewAcc')
    console.log(this.content.reNewAcc.replace(/[^a-zA-Z]/g,''),'reNewAcc')
    console.log(this.content.reNewAcc.replace(/[^\u4E00-\u9FA5]/g,''),'reNewAcc')
    console.log(this.content.reNewAcc,'ssssdd')

    if (
      this.content.maturityInstruct == '2' ||
      this.content.maturityInstruct == '1'
    ) {
      let nextTransferDate = this.content.nextTransferDate.substr(
        this.content.deposiTime.length - 1,
        1
      );
      if (nextTransferDate == 'D') {
        // console.log(item.deposiTime,'item.deposiTime')
        this.content.nextTransferDates = this.content.nextTransferDate.replace(
          /(.*)D/,
          `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.DAY')}`
        );
        //  console.log(item.deposiTime,'item.deposiTim1e')
      }
      if (nextTransferDate == 'M') {
        this.content.nextTransferDates = this.content.nextTransferDate.replace(
          /(.*)M/,
          `$1${this.$t('FIXED_DEPOSIT_OVERVIEW.MONTH')}`
        );
      }
    }
    if(  this.content.maturityInstruct == '2' ||
      this.content.maturityInstruct == '3'){
        this.appointAccount = this.content.reNewAcc.replace(/[^0-9]/g,'')
        this.appointType = this.content.reNewAcc.replace(/[^a-zA-Z]/g,'')
         console.log(this.appointType,'appointType')
        this.appointType=this.appointType.slice(3)
        console.log(this.appointType,'appointTypes')
      }
    // this.content.acctNo = this.formatAcctNo(this.content.acctNo)
    // this.content.paymentAccount = this.formatAcctNo(this.content.paymentAccount)
    this.content.preAvailablePrincipalInterest = tool.currencyFormat(
      this.content.preAvailablePrincipalInterest,
      '',
      2
    );
  },
  methods: {
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    back() {
      // TODO  router.go(-1)
      this.$router.go(-1)
      // this.$router.push({
      //   name: 'depositDetails',
      //   params: this.$route.params
      // });
    },
    filetrType(value) {
      return value
        ? CONSTANTS.getAccountType().find(tpye => tpye.value == value).label
        : '';
    },
    maturityInstructsFilter(value) {
      console.log(value, 'value', CONSTANTS.MATURITY_TRUCIONS);
      return value
        ? CONSTANTS.getMaturity().find(tpye => tpye.value == value).label
        : '';
    },
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-left: 22%;
}
.m-form {
  margin-top: 20px;
}
.content {
  width: 250px;
}
.u-btn {
  display: flex;
  margin-left: 35%;
}
.f-btn {
  margin-top: 22px;
  margin-left: 40%;
}
.m-detailItem {
  width: 940px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 145px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
