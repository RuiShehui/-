<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-05-12 17:37:59
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\paymentSettlement\intraBankTransfer\components\resultInfo.vue
-->
<!-- 行内转账-结果页 -->
<template>
  <div class="g-resultInfo" v-show="timeOut">
    <div class="m-result-content">
      <operate-result :status="resultType" :title="resultTitle" :desc="resultDescribe">
        <template v-if="isSuccess">
          <div class="m-auth-tips mt24" v-if="authorized">
            <!-- 90--交易成功 -->
            <span v-if="authResultState === '03'">{{ $t('PAYMENT.TO_AUTH_TIP') }}</span>
          </div>
          <div class="btn-box-wrapper" :class="authorized ? 'mt34' : 'mt56'">
            <template v-if="resultType == 'success'">
              <v-button
                size="w210"
                class="mr16"
                @click="downloadPDF"
              >{{ $t('PAYMENT.GENERATE_PDF') }}</v-button>
              <v-button
                size="w160"
                type="primary"
                class="mr16"
                @click="handleFinish"
              >{{ $t('COMMON.BACK') }}</v-button>
            </template>
            <div class="btn-box-wrapper" v-else>
              <v-button size="w210" @click="handleBack">{{ $t('COMMON.BACK') }}</v-button>
            </div>
          </div>
        </template>
        <template v-else>
          <p
            class="fail-reason-tip"
          >{{$t('PAYMENT.FAIL_REASON')}} : {{authResultState | tradeStateFilter}}</p>
          <p class="to-assist-tip">{{ $t('PAYMENT.RESULT_ASSIST') }}</p>
          <div class="btn-box-wrapper">
            <v-button size="w210" @click="handleBack">{{ $t('COMMON.BACK') }}</v-button>
          </div>
        </template>
      </operate-result>
    </div>
  </div>
</template>
<script>
import { result } from '@bank-transfer/mixins';
import filters from '@/filters/public';

export default {
  mixins: [result],
  data() {
    return {
      timeOut: false
    };
  },
  filters: {
    ...filters
  },
  created() {
    this.timeOut = false;
    setTimeout(() => {
      this.timeOut = true;
    }, 300);
  },
  mounted() {},
  methods: {
    downloadPDF() {
      this.$emit('downloadPDF', this.$t('PAYMENT.INNER_TRANSFER'));
    }
  }
};
</script>
<style lang="scss" scoped>
.g-resultInfo {
  .m-auth-tips {
    span {
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.6);
      letter-spacing: 0;
      line-height: 1;
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

  .btn-box-wrapper {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  // .fail-reason-tip {
  //   margin-bottom: 20px;
  // }
}
</style>
