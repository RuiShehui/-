<template>
  <div class="result">
    <OperateResult
      :title="resultTitle"
      :desc="resultSubTitle"
      :comfirm="comfirmTitle"
      :status="resultIco"
    >
      <v-button style="margin-top:44px" size="w210" @click="returnClick">{{$t('COMMON.BACK')}}</v-button>
    </OperateResult>
  </div>
</template>
<script>
import OperateResult from '@/components/common/operateResult';
export default {
  components: {
    OperateResult
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
    console.log(this.$route.query, 'ss11');
    this.handleDate();
  },
  methods: {
    //返回
    returnClick() {
      this.$router.go(-1);
    },
    //处理数据
    handleDate() {
      let flag = true; //true：操作成功， false：操作失败
      if (
        this.$route.query.authResultState === '03' ||
        this.$route.query.authResultState === '90'
      ) {
        if (this.$route.query.authResultState === '03') {
          this.comfirmTitle = this.$t('REMITTANCECONFIRM.PROGRESS');
        }
        this.resultIco = 'success';
        this.resultTitle = this.$t('COMMON.SUBMIT_SUCCESS');
        this.resultSubTitle = this.$t('COMMON.FLOW_NO')+':' + this.$route.query.flowNo;
      } else {
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle = this.$t('USER_MANAGERMENT.FAIL_SEASON');
        this.comfirmTitle = this.$t('RIGHTS_TEMPLATE.NEED_HELP');
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