<template>
  <div class="resultWapperBox">
    <div v-if="message.succ">
      <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
      <p style="text-align: center;margin-top:24px" class="desc" v-if="message.flag">{{$t('ACCOUNT_MAINTENACE.TO_AUTHORIZED')}}</p>
    </div>
    <div v-else>
      <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
      <p class="descs">{{$t('PAYMENT.RESULT_ASSIST')}}</p>
    </div>
    <el-row class="flexc mt56">
      <v-button class="w210" @click="next">{{$t('COMMON.BACK')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import operateResult from '../../../components/operateResult';
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    operateResult
  },
  data() {
    return {};
  },
  methods: {
    next() {
      this.$emit('next');
    }
  }
};
</script>
<style lang="scss" scoped>
.u-mt56 {
  margin-top: 56px;
}
.resultWapperBox {
  font-size: 16px;
}
</style>