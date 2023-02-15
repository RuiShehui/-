<!--
 * @Author: your name
 * @Date: 2022-03-01 09:09:11
 * @LastEditTime: 2022-09-17 11:43:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\serviceSetting\bindingAccount\contact\index.vue
-->
<template>
  <div class="contact">
    <steps :stepsList="stepsList" class="formW_540" :activeIndex="activeIndex" />
    <div v-if="activeIndex === 0">
      <entry-info :formData="formData" @next="next" />
    </div>
    <div v-if="activeIndex === 1">
      <confirm-info :confirmInfo="confirmInfo" @confirm="confirm" @back="back" />
    </div>
    <div v-if="activeIndex === 2">
      <result :confirmInfo="confirmInfo" :result="result" />
    </div>
  </div>
</template>
<script>
import { fpsAccountBindingSubmit } from '@/api/FPSAccountBinding.js';
import EntryInfo from './components/entryInfo';
import ConfirmInfo from './components/confirmInfo';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import Result from './components/result';
export default {
  components: {
    EntryInfo,
    ConfirmInfo,
    Result
  },
  data() {
    return {
      // 步骤条
      stepsList: [
        {
          title: this.$t('USER_MANAGERMENT.BIND_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('COMMON.STEPS_COMFIRM_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.BIND_RESULTS'),
          description: ''
        }
      ],
      activeIndex: 0,
      formData: {},
      confirmInfo: {}
    };
  },
  created() {
    this.formData = this.$route.query.row;
    console.log(this.formData, 'formData');
  },
  methods: {
    next(data) {
      this.confirmInfo = data;

      this.activeIndex++;
    },

    //确认提交
    confirm(confirmInfo) {
      let hkdArr = confirmInfo.bindAccount.split('HKD');
      let rmbArr = [];
      let rmbString = '';
      let rmbAccType = '';
      let obj = {};
      if (confirmInfo.raccountNo) {
        rmbArr = confirmInfo.raccountNo.split('CNY');
        rmbString = rmbArr[0].trim();
        rmbAccType = rmbArr[1].trim();
      }
      console.log(confirmInfo, '222', hkdArr);
      if (confirmInfo.contactInfomation == '1') {
        console.log(1);
        confirmInfo.contactInfomation = '1';
        obj = {
          bindAcctHKD: hkdArr[0].trim(),
          bindAcctHKDAccType: hkdArr[1].trim(),
          bindAcctHKDCurrency: 'HKD',
          bindAcctRMB: rmbString,
          bindAcctRMBAccType: rmbAccType,
          bindAcctRMBCurrency: 'CNY',
          cutEnName: confirmInfo.customerName,
          emailAdd: '',
          phone: confirmInfo.number,
          otpCode: confirmInfo.code,
          presetAcct: confirmInfo.presetAcct,
          otherEmail:
            confirmInfo.otherChannels == '--' ? '' : confirmInfo.otherChannels,
          otherPhone: '',
          act: 'register',
          authReqInfo: {
            opType: '1'
          }
        };
      } else {
        console.log(2);
        confirmInfo.contactInfomation = '2';
        let phoneNumber = '';
        if (confirmInfo.otherChannels !== '--') {
          phoneNumber = confirmInfo.otherChannels;
        }
        obj = {
          bindAcctHKD: hkdArr[0].trim(),
          bindAcctHKDAccType: hkdArr[1].trim(),
          bindAcctHKDCurrency: 'HKD',
          bindAcctRMB: rmbString,
          bindAcctRMBAccType: rmbAccType,
          bindAcctRMBCurrency: 'CNY',
          cutEnName: confirmInfo.customerName,
          phone: '',
          emailAdd: confirmInfo.emailAddressDesen,
          otpCode: confirmInfo.code,
          presetAcct: confirmInfo.presetAcct,
          otherEmail: '',
          otherPhone: phoneNumber,
          act: 'register',
          authReqInfo: {
            opType: '1'
          }
        };
      }
      const tradeInfo = JSON.stringify(confirmInfo);
      let menuId = localStorage.getItem('sliderMenusAct');
      const { adminEmpower } = JSON.parse(sessionStorage.getItem('userInfo'));
      const entType = localStorage.getItem('entType');
      fpsAccountBindingSubmit(obj).then(resp => {
        console.log('resp', resp);
        if (resp && resp.body.authResultInfo) {
          this.result = resp.body.authResultInfo;
          this.activeIndex++;
        }
      });
    },
    back() {
      this.activeIndex--;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>