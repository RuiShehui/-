<template>
  <div>
    <!-- 授权结果 -->
    <div class="m-head">{{$t('AUTHORIZE.AUTHOR_RESULT')}}</div>
    <!-- 网银流水号 图标 流水号 -->
    <el-result :icon="state" :subTitle="`${$t('AUTHORIZE.flowNo')}：${flowNo}`">
      <template slot="title">
        <!-- 交易成功/失败 -->
        <div class="title">{{ stateText }}</div>
        <!-- 成功失败原因 -->
        <div class="result" v-if="this.state === 'error'">{{$t('AUTHORIZE.FAIL_WHY') + ':'}}{{ resultText }}</div>
      </template>
      <template slot="extra">
        <div class="g-btn">
          <!-- 如需协助，请致电本行客服热线（852）3768688 -->
          <div v-if="auth!=='90'" class="help">{{$t('AUTHORIZE.TEL_PHONE')}}</div>
          <!-- 新增第三者用户将于六小时生效 -->
          <div v-if="auth==='90' && this.bsnCode==='030107' && this.operationType" class="help">{{$t('PAYMENT.AUTH_RESULT_STATE')}}</div>
          <v-button @click="$router.go(-1)">{{$t('COMMON.BACK')}}</v-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script>
import filter from '@/filters/public';
export default {
  name: 'AuthResult',
  data() {
    return {
      state: '',
      resultText: '',
      flowNo: '',
      stateText: '',
      auth: '',
      bsnCode: '',
      operationType:""
    };
  },
  filters:{
    tradeStateFilter:filter.tradeStateFilter
  },
  created() {
    this.init();
    console.log(this.$route.query,'this.$route.query')
  },
  methods: {
    init() {
      const { resultList = [] } = this.$route.query;
      if (resultList.length) {
        this.bsnCode = resultList[0].bsnCode;
        this.stateText = `${this.$options.filters['tradeStateFilter'](resultList[0].authResultState)}`
        this.state = this.stateFilter(resultList[0].authResultState);
        this.resultText =  resultList[0].hostMessage
        this.flowNo = resultList[0].flowNo;
        this.auth = resultList[0].authResultState;
      }
    },
    stateFilter(val) {
      switch (val) {
        case '04':
        case '30':
        case '66':
        case '61':
        case '91':
          return 'error';
        default:
          return 'success';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.m-head {
  border-left: 4px solid #f06b00;
  color: rgba(0, 0, 0, 0.85);
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
  padding-left: 12px;
  margin-bottom: 20px;
}
.title {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}
.result {
  margin-top: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
.g-btn {
  display: flex;
  align-items: center;
  flex-direction: column;
  .help {
    margin-bottom: 56px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
