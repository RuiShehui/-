<!--
 * @Author: 朱涛
 * @Date: 2022-01-27 16:11:32
 * @LastEditTime: 2022-09-17 11:45:14
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\edda\elePayment\modify\index.vue
-->
<template>
  <div class="modify">
    <steps :stepsList="stepsList" class="formW_540" :activeIndex="activeIndex" />
    <div v-if="activeIndex === 0">
      <modify-info :modifyInfo="detailObj" @next="next" />
    </div>
    <div v-if="activeIndex === 1">
      <confirm-info :confirmInfo="detailObj" @back="back" @confirm="confirm" />
    </div>
    <div v-if="activeIndex === 2">
      <result :confirmInfo="authInfo" />
    </div>
  </div>
</template>
<script>
import ModifyInfo from './components/modifyInfo';
import ConfirmInfo from './components/confirmInfo';
import Result from './components/result';
import { haveApprovalUpdateSumbit } from '@/api/setUpEDDA.js';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';

export default {
  components: {
    ModifyInfo,
    ConfirmInfo,
    Result
  },
  data() {
    return {
      stepsList: [
        {
          title: this.$t('USER_MANAGERMENT.UPDATE_MESSAGE'),
          description: ''
        },
        {
          title: this.$t('COMMON.STEPS_COMFIRM_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.END_UPDATE'),
          description: ''
        }
      ],
      activeIndex: 0,
      detailObj: {}, // 接受上个页面的详情的数据
      authInfo: {}
    };
  },
  created() {
    this.detailObj = this.$route.query.row;
  },
  methods: {
    next(data) {
      this.detailObj = data;
      this.activeIndex++;
    },
    back() {
      this.$router.replace('/_businessManagement/serviceSetting/edda');
    },
    async confirm() {
      const result = await haveApprovalUpdateSumbit(this.detailObj);
      console.log('result:', result);
      const { returnCode } = result.head;
      const tradeInfo = JSON.stringify(this.detailObj);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      const entType = localStorage.getItem('entType');
      if (returnCode == 'OTP000107' && adminEmpower == '0') {
        choosesWay({
          checkWay: '',
          tradeInfo: tradeInfo,
          flag: '2'
          // status: status
        }).then(() => {
          this.confirm();
        });
      } else if (returnCode == 'OTP000107') {
        softToken({
          softTokenCode: '',
          otpType: menuId,
          tradeInfo: tradeInfo
        }).then(() => {
          this.confirm();
        });
      } else {
        if (result.body.authResultInfo) {
          if (result.body.authResultInfo.authResultState === '03') {
            result.body.authResultInfo.authorMessage = this.$t(
              'REMITTANCECONFIRM.PROGRESS'
            );
            this.authInfo = result;
            this.activeIndex++;
          } else {
            this.authInfo = result;
            this.activeIndex++;
          }
        } else {
          this.authInfo = result;
          this.activeIndex++;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>