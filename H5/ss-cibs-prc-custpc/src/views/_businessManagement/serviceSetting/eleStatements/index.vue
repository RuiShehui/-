<!--
 * @Author: your name
 * @Date: 2022-05-18 16:46:03
 * @LastEditTime: 2022-09-17 11:48:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\eleStatements\index.vue
-->
<template>
  <div class="eleStatements">
    <steps :stepsList="stepsList" class="formW_540" :activeIndex="activeIndex" />
    <div v-if="activeIndex === 0">
      <input-info @next="next" />
    </div>
    <div v-if="activeIndex === 1">
      <confirm-info :tableData="tableData" @back="back" @confirm="confirm" />
    </div>
    <div v-if="activeIndex === 2">
      <result @over="over" :confirmInfo="confirmInfo" />
    </div>
    <div class="u-tips">
      <p class="u-title">{{ $t('PAYMENT.WARM_TIPS') }}</p>
      <ul class="u-content">
        <li>{{ $t('USER_MANAGERMENT.TIPIS_ONE') }}</li>
        <li>{{ $t('USER_MANAGERMENT.TIPIS_TWO') }}</li>
        <li>{{ $t('USER_MANAGERMENT.TIPIS_THREE') }}</li>
        <li>{{ $t('USER_MANAGERMENT.TIPIS_THREE') }}</li>
      </ul>
    </div>
    <!-- <prompt class="u-mt142" :desc="['如阁下于三分钟后未能收到一次性短讯密码，请在按「收取一次性短讯密码」一次。']" /> -->
  </div>
</template>
<script>
import InputInfo from './components/inputInfo';
import ConfirmInfo from './components/confirmInfo';
import Result from './components/result';
import { updateElecStateSubmit } from '@/api/setServiceQuota.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';

const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
export default {
  components: {
    InputInfo,
    ConfirmInfo,
    Result
  },
  data() {
    return {
      confirmInfo: {},
      stepsList: [
        {
          title: this.$t('COMMON.STEPS_FILL_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.YAN_MESSAGE'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.TIJIAO'),
          description: ''
        }
      ],
      activeIndex: 0,
      tableData: [] // 接受上个页面的详情的数据
    };
  },
  methods: {
    next(data) {
      this.tableData = data;
      this.activeIndex++;
    },
    back() {
      this.activeIndex--;
    },
    confirm(tableData) {
      console.log('tableData',tableData)
      const tradeInfo = JSON.stringify(tableData);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      const entType = localStorage.getItem('entType');
      updateElecStateSubmit({ eletStateList: tableData }).then(resp => {
        const { returnCode } = resp.head;
          if (returnCode == 'OTP000107' && adminEmpower=='0') {
            choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo
          }).then(() => {
             this.confirm(tableData);
          });
        } else  if (returnCode == 'OTP000107') {
          softToken({
            softTokenCode: '',
            otpType: menuId,
            tradeInfo: tradeInfo
          }).then(() => {
            this.confirm(tableData);
          });
        } else {
          if (resp.body.authResultInfo.authResultState === '03') {
            resp.body.authResultInfo.authorMessage = this.$t('REMITTANCECONFIRM.PROGRESS');
            this.confirmInfo = resp.body.authResultInfo;
            this.activeIndex++;
          } else {
            this.confirmInfo = resp.body.authResultInfo;
            this.activeIndex++;
          }
        }
      });
    },
    over() {
      this.activeIndex = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>