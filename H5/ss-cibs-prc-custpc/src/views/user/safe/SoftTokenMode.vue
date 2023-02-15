<!--
 * @Author: your name
 * @Date: 2022-06-22 09:37:02
 * @LastEditTime: 2022-06-22 10:39:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\user\safe\SoftTokenMode.vue
-->
<template>
  <div>
    <el-tabs v-model="activName">
      <el-tab-pane :label="$t('MOBILE_TOKEN.REGISTERED_MOBILE_DEVICE')" name="first">
        <phoneMode></phoneMode>
      </el-tab-pane>
      <el-tab-pane :label="$t('MOBILE_TOKEN.TERMINATION_OF_SERVICE')" name="second">
        <stopSoftToken></stopSoftToken>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import phoneMode from './phoneMode.vue'
import stopSoftToken from './stopSoftToken.vue'
export default {
   components:{
    phoneMode,
    stopSoftToken
  },
  data(){
    return{
      activName:'first'
    }
  }
};
</script>

<style>
</style>