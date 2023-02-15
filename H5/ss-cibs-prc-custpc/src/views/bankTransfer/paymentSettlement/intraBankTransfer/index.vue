<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-08-16 14:27:21
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\paymentSettlement\intraBankTransfer\index.vue
-->
<!--行内转账-->
<template>
  <div class="g-intraBankTransfer-container">
    <steps class="formW_550" :stepsList="stepsList" :activeIndex="activeIndex" />
    <!--
      1 v-if : 不缓存填写页面
      2 v-show : 缓存pdf内容页面
      3. v-if : 确保每次获取的都是最新的确认信息 (其他的转账同理)
    -->
    <transfer-info
      v-show="activeIndex === 0"
      @next="toConfirmPage"
      :confirmData="transferInfo"
      :isResultTo="isResultTo"
      @onChangeisResultTo="onChangeisResultTo"
    />
    <confirm-info
      ref="confirmInfo"
      v-show="activeIndex === 1"
      :confirmData="transferInfo"
      @confirmBack="backToInputPage"
      @confirmSubmit="toResultPage"
    />
    <result-info
      v-if="activeIndex === 2"
      :resultInfo="resultData"
      @clickBack="backToFirstStep"
      @downloadPDF="downloadPDF"
      class="mt25"
    />
    <div class="wPro" v-show="activeIndex === 0">
      <p class="p1">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p v-for="(item, n) in $t('PAYMENT.INLINE_TIPS_1')" :key="n">{{ item }}</p>
    </div>
    <div class="wPro" v-show="activeIndex === 1">
      <p class="p1">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <p v-for="(item, n) in $t('PAYMENT.INLINE_DETAIL_TIPS_1')" :key="n">{{ item }}</p>
    </div>
  </div>
</template>

<script>
import { newTradeToken } from '@/api/paymentRemittance';
import TransferInfo from './components/transfer-info';
import ConfirmInfo from './components/confirm-info';
import ResultInfo from './components/result-info';

/** 转账外层页面的公共混入 */
import { trans } from '@bank-transfer/mixins';

export default {
  name: 'IntraBankTransfer',
  components: {
    TransferInfo,
    ConfirmInfo,
    ResultInfo
  },
  mixins: [trans],
  data() {
    return {
      resultData: {}
    };
  },
  methods: {
    /**
     * 填写完成信息跳转到确认页面
     * @param {{}} val 当前转账填写子页面的数据
     */
    async toConfirmPage(val) {
      /**
       * 1. 设置转账内容
       * 2. 跳转到确认页面
       */
      const tokResult = await newTradeToken();
      if (tokResult) {
        console.log(tokResult);
        sessionStorage.setItem('tranToken', tokResult.body);
      }
      this.transferInfo = val;
      this.activeIndex = 1;
      // console.log('转账信息', val);
    },
    // 信息确认提交
    toResultPage(result = {}) {
      // console.log('结果', val);
      if (result) {
        this.activeIndex = 2;
        this.resultData = { ...result, ...this.transferInfo };
      }
    },
    // 回到第一步
    backToInputPage() {
      this.activeIndex = 0;
    },
    //UK输入提交
    ukSubmit(ukey) {},
    onChangeisResultTo(val) {
      this.isResultTo = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.formW_550 {
  margin: 0 auto 24px;
}
</style>
