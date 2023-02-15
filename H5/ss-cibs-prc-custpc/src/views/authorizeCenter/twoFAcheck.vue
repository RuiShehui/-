<!--
 * @Author: your name
 * @Date: 2022-06-13 17:37:16
 * @LastEditTime: 2022-06-13 17:42:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\twoFAcheck.vue
-->
<template>
  <div class="m-checkFA">
    <!-- 此交易必须使用双重认证，请选择双重认证的方式 -->
    <p>{{$t('AUTHORIZE.DOUBLE_WAY')}}</p>
    <el-form>
      <!-- 双重认证方式 -->
      <el-form-item :label="$t('AUTHORIZE.DOUBLE_WAYS')">
         <el-radio-group v-model="checkWay" style="padding-top:10px">
           <!-- otp验证 -->
          <el-radio label="1">{{$t('AUTHORIZE.OPT_RE')}}</el-radio>
          <!-- softToken认证 -->
          <el-radio label="2">{{$t('AUTHORIZE.SOFT_TOKEN')}}</el-radio>
           <!-- <el-radio v-for="item in checkWay" :key="item.value" :value="item.value" :label="item.label"></el-radio> -->
         </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return{
      checkWay:''
    }
  }
}
</script>

<style lang="scss" scoped>
.m-checkFA{

}
</style>