<template>
  <div class="u-binding-modify">
    <steps :stepsList="stepsList" class="u-w360" :activeIndex="activeIndex" />
    <div v-if="activeIndex===0">
      <modify-info :formData="rowData" @back="back" @next="next" />
    </div>
    <div v-if="activeIndex===1">
      <result :confirmInfo="base_info" />
    </div>
  </div>
</template>
<script>
import { fpsAccountUnbindingSubmit } from '@/api/FPSAccountBinding.js';
import ModifyInfo from './components/modifyInfo';
import Result from './components/result';
export default {
  components: {
    ModifyInfo,
    Result
  },
  data() {
    return {
      stepsList: [
        {
          title: this.$t('USER_MANAGERMENT.UNBIND_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.UNBIND_RESULTS'),
          description: ''
        }
      ],
      activeIndex: 0,
      // 上个页面传参
      rowData: {},
      base_info: {}
    };
  },
  created() {
    this.rowData = this.$route.query.row;
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    next(formData) {
      console.log('formData', formData);
      let bindAccountArr = formData.bindAccount.split('HKD');
      let raccountNoCNY = '';
      let rmbAccType = '';
      if (formData.raccountNo) {
        let raccountNoArr = formData.raccountNo.split('CNY');
        // let raccountNoArr = formData.raccountNo.split('HKD'); //测试用的数据
        raccountNoCNY = raccountNoArr[0].trim();
        rmbAccType = raccountNoArr[1].trim();
      }
      let obj = {};
      if (formData.bindingType === '1') {
        obj = {
          bindAcctHKD: bindAccountArr[0].trim(),
          bindAcctHKDAccType: bindAccountArr[1].trim(),
          bindAcctHKDCurrency: 'HKD',
          bindAcctRMB: raccountNoCNY,
          bindAcctRMBAccType: rmbAccType,
          bindAcctRMBCurrency: 'CNY',
          cutEnName: formData.customerName,
          emailAdd: formData.emailAddress || '',
          otpCode: formData.code,
          presetAcct: formData.presetAcct,
          otherPhone: formData.phone || ''
        };
      } else {
        obj = {
          bindAcctHKD: bindAccountArr[0].trim(),
          bindAcctHKDAccType: bindAccountArr[1].trim(),
          bindAcctHKDCurrency: 'HKD',
          bindAcctRMB: raccountNoCNY,
          bindAcctRMBAccType: rmbAccType,
          bindAcctRMBCurrency: 'CNY',
          cutEnName: formData.customerName,
          phone: formData.phone || '',
          otpCode: formData.code,
          presetAcct: formData.presetAcct,
          otherEmail: formData.emailAddress || ''
        };
      }

      fpsAccountUnbindingSubmit(obj).then(resp => {
        console.log('resp111', resp);
        this.base_info = resp.authResultInfo;
        this.activeIndex++;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>