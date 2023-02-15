<!--
 * @Author: your name
 * @Date: 2022-09-17 10:19:16
 * @LastEditTime: 2022-09-20 14:33:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\authManagement\resultTemplate\index.vue
-->
<template>
  <div class="result">
    <OperateResult
      :title="resultTitle"
      :desc="resultSubTitle"
      :comfirm="comfirmTitle"
      :status="resultIco"
    >
      <v-button size="w210" style="margin-top: 56px" @click="back">{{$t('COMMON.BACK')}}</v-button>
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
      backResult: {},
      resultIco: 'success', //success: 成功，fail：失败
      resultTitle: '', //返回结果标题
      resultSubTitle: '',
      comfirmTitle: ''
    };
  },
  mounted() {
    console.log(this.$route, 'message');
    this.backResult = this.$route.query;
    this.handleDate();
  },
  methods: {
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
        this.resultSubTitle =
          this.$t('COMMON.FLOW_NO') + ':' + this.backResult.flowNo;
      } else {
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle = this.$t('RIGHTS_TEMPLATE.NEED_HELP');
      }
    },
    back() {
      this.$router.push({
        path: '/_businessManagement/authManagement/rightsTemplate'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.result {
  margin-top: 36px;
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
  }
}
</style>