<!--
 * @Author: your name
 * @Date: 2022-03-04 15:14:16
 * @LastEditTime: 2022-05-20 16:27:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\smallTransfer\index.vue
-->
<template>
  <div class="smallTransfer">
    <div v-if="checkedOtp">
      <steps :stepsList="stepsList" class="u-w540" :activeIndex="activeIndex" />
      <div v-if="activeIndex === 0">
        <input-info @submit="submit" :options="base_info" />
      </div>
      <div v-if="activeIndex === 1">
        <confirm-info :confirmInfo="confirmInfo" @back="back" @confirm="confirm" />
      </div>
      <div v-if="activeIndex === 2">
        <result :backResult="backResult" @over="fOver" />
      </div>
      <div class="u-tips" v-if="activeIndex !== 2">
        <p class="u-title">{{$t('COMMON.TIPS')}}</p>
        <ul class="u-content">
          <li>{{$t('USER_MANAGERMENT.SMALL_TIP_ONE')}}</li>
          <li>{{$t('USER_MANAGERMENT.SMALL_TIP_TWO')}}</li>
          <li>{{$t('USER_MANAGERMENT.SMALL_TIP_THREE')}}</li>
          <li>{{$t('USER_MANAGERMENT.SMALL_TIP_FOUR')}}</li>
          <li>{{$t('USER_MANAGERMENT.SMALL_TIP_FIVE')}}</li>
          <li>{{$t('USER_MANAGERMENT.SMALL_TIP_SIX')}}</li>
        </ul>
      </div>
    </div>
  
  </div>
</template>
<script>
import InputInfo from './components/inputInfo';
import ConfirmInfo from './components/confirmInfo';
import result from './components/result';
export default {
  components: {
    InputInfo,
    ConfirmInfo,
    result,
  },
  prop:{},
  data() {
    return {
      base_info: {},
      stepsList: [
        {
          title: this.$t('USER_MANAGERMENT.SET_INFOR'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.CONFIRM_INFO'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.SET_RESULT'),
          description: ''
        }
      ],
      activeIndex: 0,
      confirmInfo: {},
      backResult: {},
      checkOtp:true,
      checkedOtp:true
    };
  },
  computed: {},
  methods: {
    submit(data) {
      this.activeIndex++;
      this.confirmInfo = data;
    },
    back(confirmInfo) {
      console.log('confirmInfo', confirmInfo);
      this.base_info = confirmInfo;
      this.activeIndex--;
    },
    checksOtp(value){
      console.log(value,'value')
      this.checkOtp = false
      this.checkedOtp = true  
    },
    //限额提交
    confirm(resultObj) {
      console.log(resultObj, 'obj');
      this.activeIndex++;
      this.backResult = resultObj;
    },
    fOver() {
      this.activeIndex = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>