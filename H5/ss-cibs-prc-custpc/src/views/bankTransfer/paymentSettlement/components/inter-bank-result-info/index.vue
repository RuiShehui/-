<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-09-21 20:43:40
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\paymentSettlement\components\resultInfo.vue
-->
<!-- 转数快/外币转账 -结果页 -->
<template>
  <div class="g-resultInfo">
    <div class="m-result-content">
    
      <operateResult :status="resultType" :title="resultTitle" :desc="resultDescribe">
        <template v-if="isSuccess">
          <div
            class="m-resultTips mt24"
            v-if="this.resultInfo.authResultInfo.authResultState === '03' "
          >
            <span>{{ $t('PAYMENT.TO_AUTH_TIP') }}</span>
          </div>
          <div class="m-btn-box" :class="authorized ? 'mt34' : 'mt56'">
            <div size="w210" v-if="resultType == 'success'">
              <v-button
                size="w210"
                @click="downloadPDF"
                class="mr16"
              >{{ $t('PAYMENT.GENERATE_PDF') }}</v-button>
              <v-button size="w160" type="primary" @click="handleFinish">{{ $t('COMMON.BACK') }}</v-button>
            </div>
            <div class="m-btn-box" v-else>
              <v-button size="w210" @click="handleBack">{{ $t('COMMON.BACK') }}</v-button>
            </div>
          </div>
        </template>
        <template v-else>
          <p
            class="fail-reason-tip"
          >{{$t('PAYMENT.FAIL_REASON')}} : {{authResultState | tradeStateFilter}}</p>
          <p class="to-assist-tip">{{ $t('PAYMENT.RESULT_ASSIST') }}</p>
          <div class="m-btn-box">
            <v-button size="w210" @click="handleBack">{{ $t('COMMON.BACK') }}</v-button>
          </div>
        </template>
      </operateResult>
    </div>
  </div>
</template>
<script>
import { result } from '@bank-transfer/mixins';
import filters from '@/filters/public';

export default {
  filters: {
    ...filters
  },
  mixins: [result],
  methods: {
    // 生成PDF
    downloadPDF() {
      this.$emit(
        'downloadPDF',
        this.payType === 'fast'
          ? this.$t('APPOINTTRACTION.FPS_TRANSFEP')
          : this.$t('APPOINTTRACTION.CHATS_TRANSFER')
      );
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.g-resultInfo {
  .m-resultTips {
    span {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      letter-spacing: 0;
      line-height: 22px;
    }
  }
  .mt34 {
    margin-top: 34px;
  }
  .fail-reason-tip,
  .to-assist-tip {
    padding: 5px 0 5px 0;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.3);
  }

  .m-btn-box {
    margin-top: 40px;
    .common-button {
      display: inline-block;
      margin: 0 8px;
    }
  }
}
</style>
