<!--
 * @Author: ZhangZhen
 * @Date: 2022-03-26 10:48:09
 * @LastEditTime: 2022-05-11 15:50:51
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\_businessManagement\authorizeCenter\mySubmit\result.vue
-->
<template>
  <div class="result">
    <OperateResult :title="resultTitle" :desc="resultSubTitle" :status="resultIco">
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
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      resultIco: 'success', //success: 成功，fail：失败
      resultTitle: '', //返回结果标题
      resultSubTitle: ''
    };
  },
  mounted() {
    console.log(this.$route.query, 'message0000');
    this.handleDate();
  },
  methods: {
    handleDate() {
      if (
        this.$route.query &&
        ['04', '30', '66', '61', '91'].includes(
          this.$route.query.authResultState
        )
      ) {
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle =
          this.$t('REMITTANCECONFIRM.REASON_FOR_FAILURE') +
          ':' +
          this.$route.query.authResultMessage;
      } else {
        this.resultIco = 'success';
        this.resultTitle = this.$t('COMMON.SUBMIT_SUCCESS');
        this.resultSubTitle =
          this.$t('COMMON.FLOW_NO') + '：' + this.$route.query.flowNo;
      }
    },
    back() {
      this.$router.push({
        path: '/_businessManagement/authorizeCenter/mySubmit'
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