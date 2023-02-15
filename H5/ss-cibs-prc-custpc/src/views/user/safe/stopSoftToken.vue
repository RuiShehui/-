<!--
 * @Author: your name
 * @Date: 2022-06-21 11:38:19
 * @LastEditTime: 2022-08-24 11:39:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\user\safe\stopSoftToken.vue
-->
<template>
  <div class="m-stopSoftToken">
    <p class="u-title">{{$t(`MOBILE_TOKEN.TERMINATION_SERVICES`)}}</p>
    <ul class="u-tips">
      <li>{{$t(`MOBILE_TOKEN.REGISTERED_SERVICES`)}}</li>
      <li>{{$t(`MOBILE_TOKEN.HIGH_RISK_TRANSACTION`)}}</li>
      <li>{{$t(`MOBILE_TOKEN.FINGERPRINT_AND_PIN`)}}</li>
    </ul>
    <div class="u-btns">
      <V-Button @click="cancel">{{$t(`COMMON.CANCEL`)}}</V-Button>
      <V-Button type="primary" style="margin-left:24px;" @click="submit">{{$t(`COMMON.DETERMINE`)}}</V-Button>
    </div>
  </div>
</template>

<script>
import { logff } from '@/api/public.js';
export default {
  data() {
    return {};
  },
  methods: {
    submit() {
      logff().then(res => {
        console.log(res, 'res');   
        let result = JSON.stringify(res);
        if (res == 'SUCCESS') {
          this.$router.push({
            path: '/user/safe/softTokenResult',
            query: {
              params:result
            }
          });
        }else{
           this.$router.push({
            path: '/user/safe/softTokenResult',
            query:  {
              params:result
            }
          });
        }
      });
    },
    cancel(){
      this.$router.replace('/home')
    }
  }
};
</script>

<style lang="scss" scoped>
.u-title {
  margin-left: 20px;
  font-size: 14px;
  color: #000;
  font-weight: 400;
}
.u-tips {
  margin: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 20px;
  font-weight: 400;
}
.u-btns {
  margin: 24px 0px;
  display: flex;
  align-self: center;
  justify-content: center;
}
</style>