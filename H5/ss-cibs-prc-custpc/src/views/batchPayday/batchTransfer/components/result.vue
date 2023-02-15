<!--
 * @Author: your name
 * @Date: 2022-09-22 16:22:31
 * @LastEditTime: 2022-09-26 14:16:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\batchPayday\batchTransfer\components\result.vue
-->
<template>
  <div class="resultWapperBox">
    <div v-if="message.succ">
    <operate-result :status="message.status" :title="message.title" :desc="message.desc" ></operate-result>
    <p class="desc" v-if="message.flag">{{$t('TRANSFR_INFO.GOTO_AUTHOR')}}</p>
    </div>
    <div v-else> 
    <operate-result :status="message.status" :title="message.title" :desc="message.desc"></operate-result>
    <p class="descs" >{{$t('TRANSFR_INFO.erate-result>')}}</p>
    </div>
    <el-row class="flexc mt56"> 
      <v-button class="w210" @click="next">{{$t('COMMON.BACK')}}</v-button>
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
    next() {
       this.$emit('back');
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