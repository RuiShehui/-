<!--
 * @Author: your name
 * @Date: 2022-02-28 10:20:32
 * @LastEditTime: 2022-09-14 19:00:18
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\login\components\checkHKD\result.vue
-->
<template>
  <div class="resultWapperBox">
   <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
    <el-row class="flexc mt56">
      <v-button size="w210" @click="next">{{$t('COMMON.COMPLETE')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import OperateResult from '@/components/common/operateResult/index';
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
  methods: {
    next() {
        console.log(this.message)
        if(this.message.status=="success"){
            this.$store.dispatch('app/getUserMenus')
            // this.$router.push('/home')
        }else{
            this.$router.push('/login')
        }
     
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