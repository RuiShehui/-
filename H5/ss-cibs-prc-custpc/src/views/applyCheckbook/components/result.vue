<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:45
 * @LastEditTime: 2022-04-18 16:07:10
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\applyCheckbook\components\result.vue
-->
<template>
  <div class="resultWapperBox">
    <div v-if="message.succ">
    <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
    <p class="desc" v-if="message.flag">{{$t('HEAD.AUTHORISATION_PROGRESS')}}</p>
    </div>
    <div v-else> 
    <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
    <p class="descs" >{{$t('HEAD.ASSISTANCE')}}</p>
    </div>
    <el-row class="flexc mt56"> 
      <v-button class="w210" @click="onReset">{{$t('HEAD.Back')}}</v-button>
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
    // console.log('上个页面的数据',this.message)
  },
  methods: {
    onReset() {
      this.$emit('reset');
    }
  }
};
</script>
<style lang="scss" scoped>
.desc{
  text-align: center;
   
  font-size: 14px;
  color: rgba(0,0,0,0.65);
  line-height: 22px;
}
.descs{
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
        line-height: 22px;
        word-break: break-all;
        text-align: center;
}
.resultWapperBox {
  display: flex;
  flex-direction: column;
  // .btn {
  //     margin-top: 20px;
  // }
}
</style>