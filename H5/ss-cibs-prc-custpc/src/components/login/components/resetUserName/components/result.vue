<!--
 * @Author: your name
 * @Date: 2021-12-31 15:28:40
 * @LastEditTime: 2022-07-06 18:02:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\login\components\enterprise\result.vue
-->
<template>
  <div class="resultWapperBox">
    <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
    <el-row class="flexc mt56">
      <v-button type="primary" size="w210" @click="toLogin">{{$t('FIRST_LOGIN.RE_LOGON')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import OperateResult from '@/components/common/operateResult';
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    OperateResult
  },
  data() {
    return {};
  },
  created(){
    console.log(this.message,'mesage')
  },
  methods: {
    toLogin() {
      this.$router.push('/login');
    }
  }
};
</script>
<style lang="scss" scoped>
.resultWapperBox {
  display: flex;
  flex-direction: column;
  // .btn {
  //     margin-top: 20px;
  // }
}
</style>