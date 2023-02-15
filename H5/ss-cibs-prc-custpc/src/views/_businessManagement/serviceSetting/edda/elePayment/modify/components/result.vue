<template>
  <div class="result">
    <OperateResult
      :title="resultTitle"
      :desc="resultSubTitle"
      :status="resultIco"
      :comfirm="comfirmTitle"
    >
      <v-button style="margin-top: 56px" size="w210" @click="returnClick">{{$t('COMMON.BACK')}}</v-button>
    </OperateResult>
  </div>
</template>
<script>
import OperateResult from '@/components/common/operateResult';
export default {
  components: {
    OperateResult
  },
  props: {
    confirmInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      resultIco: 'success', //success: 成功，fail：失败
      resultTitle: '', //返回结果标题
      resultSubTitle: '',
      comfirmTitle: ''
    };
  },
  mounted() {
    console.log(this.confirmInfo, 'ss');
    this.handleDate();
  },
  methods: {
    //返回
    returnClick() {
      this.$router.replace(
        '/_businessManagement/serviceSetting/edda/elePayment'
      );
    },
    //处理数据
    handleDate() {
      if (this.confirmInfo.success) {
        if (
          this.confirmInfo.body.authResultInfo.authResultState === '03' ||
          this.confirmInfo.body.authResultInfo.authResultState === '90'
        ) {
        if (this.confirmInfo.body.authResultInfo.authResultState === '03') {
          this.comfirmTitle = this.$t('REMITTANCECONFIRM.PROGRESS');
        }
          this.resultIco = 'success';
          this.resultTitle = this.$t('COMMON.SUBMIT_SUCCESS');
          this.resultSubTitle =
            this.$t('BILLPAYMENT.ONLINE_BANKING_SERIAL_NUMBER') + ':' + this.confirmInfo.body.authResultInfo.flowNo;
        } else {
          this.resultIco = 'fail';
          this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
          this.resultSubTitle = this.$t('USER_MANAGERMENT.FAIL_SEASON');
        }
      } else {
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle =
          this.$t('REMITTANCECONFIRM.REASON_FOR_FAILURE') + ':' + this.confirmInfo.head.returnMessage;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.result {
  margin: 12px 0 56px;
  /deep/ .resultWapper .desc p {
    font-size: 20px;
     
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    text-align: center;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  /deep/ p {
    font-size: 14px;
     
    color: rgba(0, 0, 0, 0.45);
    letter-spacing: 0;
    text-align: center;
    line-height: 22px;
    font-weight: 400;
    // margin-bottom: 56px;
  }
}
</style>