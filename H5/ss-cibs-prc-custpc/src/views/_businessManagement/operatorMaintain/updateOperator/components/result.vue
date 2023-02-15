<!--
 * @Author: your name
 * @Date: 2022-08-19 09:01:43
 * @LastEditTime: 2022-08-25 11:38:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\operatorMaintain\updateOperator\components\result.vue
-->
<template>
  <div class="result">
    <OperateResult
      :title="resultTitle"
      :desc="resultSubTitle"
      :status="resultIco"
      :comfirm="comfirmTitle"
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
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      resultIco: 'success', //success: 成功，fail：失败
      resultTitle: this.$t('COMMON.SUBMIT_SUCCESS'), //返回结果标题
      resultSubTitle: '',
      comfirmTitle: ''
    };
  },
  mounted() {
    console.log(this.message, 'this.message');
    this.handleDate();
  },
  methods: {
    handleDate() {
      let flag = true; //true：操作成功， false：操作失败
      if (
        this.message.authResultState === '03' ||
        this.message.authResultState === '90'
      ) {
        if ( this.message.authResultState === '03' ) {
          this.comfirmTitle = this.$t('REMITTANCECONFIRM.PROGRESS');
        }
        this.resultIco = 'success';
        this.resultTitle = this.$t('COMMON.SUBMIT_SUCCESS');
        this.resultSubTitle = this.$t('OPERATORLOG.REFERENCE_NUMBER') + this.message.flowNo;
      } else {
        this.resultIco = 'fail';
        this.resultTitle = this.$t('COMMON.SUBMIT_FAIL');
        this.resultSubTitle = this.$t('RIGHTS_TEMPLATE.NEED_HELP');
      }
    },
    back() {
      this.$router.push({
        path: '/_businessManagement/operatorMaintain'
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