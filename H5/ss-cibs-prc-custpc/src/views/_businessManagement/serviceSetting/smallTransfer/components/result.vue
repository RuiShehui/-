<template>
  <div class="result">
    <OperateResult
      :title="resultTitle"
      :desc="resultSubTitle"
      :comfirm="comfirmTitle"
      :status="resultIco"
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
    backResult: {
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
    console.log(this.backResult, 'ss');
    this.handleDate();
  },
  methods: {
    //返回
    returnClick() {
      this.$emit('over');
    },
    //处理数据
    handleDate() {
      if (
        this.backResult.authResultState === '03' ||
        this.backResult.authResultState === '90'
      ) {
        if (this.backResult.authResultState === '03') {
          this.comfirmTitle = this.$t('REMITTANCECONFIRM.PROGRESS');
        }
        this.resultIco = 'success';
        this.resultTitle = this.$t('COMMON.SUBMIT_SUCCESS');
        this.resultSubTitle = this.$t('COMMON.FLOW_NO')+':' + this.backResult.flowNo;
      } else {
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle = this.$t('USER_MANAGERMENT.FAIL_SEASON');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.result {
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