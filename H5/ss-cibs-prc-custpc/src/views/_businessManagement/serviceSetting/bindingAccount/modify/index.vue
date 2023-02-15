<template>
  <div class="u-binding-modify">
    <steps :stepsList="stepsList" class="u-w360" :activeIndex="activeIndex" />
    <div v-if="activeIndex===0">
      <modify-info
        v-loading="loading"
        :formData="rowData"
        :loading="loading"
        @back="back"
        @next="next"
      />
    </div>
    <div v-if="activeIndex===1">
      <result :confirmInfo="base_info" />
    </div>
  </div>
</template>
<script>
import { fpsAccountUpdateSubmit } from '@/api/FPSAccountBinding.js';
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
          title: this.$t('USER_MANAGERMENT.UPDATE_BIND_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.UPDATE_RESULTS'),
          description: ''
        }
      ],
      activeIndex: 0,
      // 上个页面传参
      rowData: {},
      base_info: {},
      loading: false
    };
  },
  created() {
    this.rowData = this.$route.query.row;
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //修改
    next(formData) {
      console.log('formData', formData);
      let hkdArr = formData.bindAccount.split('HKD');
      let rmbArr = [];
      let rmbString = '';
      let rmbAccType = '';
      if (formData.raccountNo) {
        rmbArr = formData.raccountNo.split('CNY');
        rmbString = rmbArr[0].trim();
        rmbAccType = rmbArr[1].trim();
      }
      let obj = {};
      if (formData.bindingType === '1') {
        obj = {
          bindAcctHKD: hkdArr[0].trim(),
          bindAcctHKDAccType: hkdArr[1].trim(),
          bindAcctHKDCurrency: 'HKD',
          bindAcctRMB: rmbString,
          bindAcctRMBAccType: rmbAccType,
          bindAcctRMBCurrency: 'CNY',
          cutEnName: formData.customerName,
          emailAdd: formData.emailAddress || '',
          otpCode: formData.code,
          presetAcct: formData.presetAcct,
          otherPhone: formData.phone || '',
          act: 'edit',
          authReqInfo: {
            opType: '2'
          }
        };
      } else {
        obj = {
          bindAcctHKD: hkdArr[0].trim(),
          bindAcctHKDAccType: hkdArr[1].trim(),
          bindAcctHKDCurrency: 'HKD',
          bindAcctRMB: rmbString,
          bindAcctRMBAccType: rmbAccType,
          bindAcctRMBCurrency: 'CNY',
          cutEnName: formData.customerName,
          phone: formData.phone || '',
          otpCode: formData.code,
          presetAcct: formData.presetAcct,
          otherEmail: formData.emailAddress || '',
          act: 'edit',
          authReqInfo: {
            opType: '2'
          }
        };
      }
      this.loading = true;
      fpsAccountUpdateSubmit(obj)
        .then(resp => {
          this.loading = false;
          console.log(resp,'fpsd')
          if(resp.body.authResultInfo){
            this.base_info = resp.body.authResultInfo;
            this.activeIndex++;
          }
         
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>