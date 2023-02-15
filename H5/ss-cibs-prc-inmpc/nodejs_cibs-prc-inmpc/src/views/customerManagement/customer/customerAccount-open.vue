<template>
  <div class="contain" v-show="showPage">
    <customer-query
      v-if="showAccountQuery"
      route-name="CustomerAccountOpen"
      @showIndex="showIndex"
      @showConfirm="showConfirm"
    />
    <div v-if="showAccountOpen">
      <el-steps :active="step" align-center class="g-margin">
        <el-step :title="$t('CUSTOMER_MANAGEMENT.BASE_INFO')"></el-step>
        <el-step :title="$t('CUSTOMER_MANAGEMENT.USER_SETTING')"></el-step>
        <el-step :title="$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_SETTING')"></el-step>
        <el-step :title="$t('CUSTOMER_MANAGEMENT.TRANS_AUTH_SETTING')"></el-step>
      </el-steps>
      <div v-if="step === 1">
        <open-step-one
          :userMerchantSave="submitData.userMerchantSave"
          :stepOneData="stepOneData"
          @backQuery="backQuery"
          @nextStepOne="nextStepOne"
        ></open-step-one>
      </div>
      <div v-if="step === 2">
        <open-step-two
          :finishUser="submitData.operatorList"
          :ebankCstmNo="ebankCstmNo"
          :entType="entType"
          :cstmNo="cstmNo"
          @nextStepTwo="nextStepTwo"
          @lastStep="lastStep"
          :adminEmpower="submitData.userMerchantSave.adminEmpower"
        ></open-step-two>
      </div>
      <div v-if="step === 3">
        <open-step-three
          :authTemplateList="submitData.authTemplateList"
          :ebankCstmNo="ebankCstmNo"
          :cstmNo="cstmNo"
          @nextStepThree="nextStepThree"
          @lastStep="lastStep"
        ></open-step-three>
      </div>
      <div v-if="step === 4">
        <open-step-four
          :cstmNo="cstmNo"
          :ebankCstmNo="ebankCstmNo"
          :authSettingList="submitData.authSettingList"
          @toConfirm="toConfirm"
          @lastStep="lastStep"
        ></open-step-four>
      </div>
    </div>
    <div v-if="showAccountOpenConfirm">
      <customer-account-confirm
        :cstmNo="cstmNo"
        :params="confirmPageData"
        @showIndex="showIndex"
        @showQuery="showQuery"
      />
    </div>
  </div>
</template>

<script>
import { isType } from '@/utils/tools.js';
import OpenStepOne from '../components/customer-account-open/OpenStepOne';
import OpenStepTwo from '../components/customer-account-open/OpenStepTwo.vue';
import OpenStepThree from '../components/customer-account-open/OpenStepThree.vue';
import OpenStepFour from '../components/customer-account-open/OpenStepFour.vue';
import CustomerAccountConfirm from '../components/customer-account-open/CustomerAccountConfirm.vue';
import {
  queryMerchant,
  openAccountStempOne,
  openAccountStempTwo,
  openAccountStempThree,
  openAccountStempFour,
  queryOpenStemp,
  clearAway,
  queryMerchantData,
  queryOpenMerchantDetail
} from '@/api/customer-management/customer';
import { queryMenuBy } from '@/api/customer-management/authorization';
export default {
  name: 'CustomerAccountOpen',
  components: {
    OpenStepOne,
    OpenStepTwo,
    OpenStepThree,
    OpenStepFour,
    CustomerAccountConfirm
  },
  inject: ['onBackTop'],
  data() {
    return {
      cstmNo: '', //储存用来请求T24查询账户接口入参
      showAccountQuery: true, // 显示查询
      showAccountOpen: false, // 显示主页
      showAccountOpenConfirm: false, // 显示结果页
      confirmPageData: {},
      option: 'option', // tabs颜色显示
      step: 1, // 步骤
      ebankCstmNo: '',
      entType: '',
      stepOneData: {},
      submitData: {
        userMerchantSave: {}, // 第一步数据
        operatorList: [], // 第二步数据
        authTemplateList: [], // 第三步数据
        authSettingList: [] // 第四步数据
      },
      showPage: true
    };
  },
  watch: {
    step: {
      async handler(newVal) {
        this.onBackTop();
      }
    }
  },
  computed: {},
  async created() {
    // 授權結果頁重新編輯
    const { params = {} } = this.$route;
    if (params.ebankCstmNo) {
      this.showPage = false;
      this.ebankCstmNo = params.ebankCstmNo;
      this.step = 2;
      const result = await queryOpenMerchantDetail({
        ebankCstmNo: this.ebankCstmNo
      });
      this.submitData = result.body;
      console.log(this.submitData, 'this.submitData');
      if (
        this.submitData.operatorList &&
        this.submitData.operatorList.length > 0
      ) {
        this.submitData.operatorList.forEach(item => {
          if (item.userAccountLimits && item.userAccountLimits.length > 0) {
            item.privilegedAccount = item.userAccountLimits.length;
          } else {
            item.privilegedAccount = '無';
          }
        });
      }
      await this.lastStep();
      this.showAccountOpen = true;
      this.showAccountQuery = false;
      this.showPage = true;
    }
  },
  methods: {
    showIndex(data) {
      console.log('首页接收到返回首页的参数', this.confirmPageData);
      this.showAccountOpen = true;
      this.showAccountOpenConfirm = false;
      this.showAccountQuery = false;
      this.init(data);
    },
    init(data) {
      this.cstmNo = data.cstmNo;
      this.ebankCstmNo = data.ebankCstmNo;
      this.entType = data.entType;
      if (data.submitData) {
        if (data.step === 2) {
          this.step = 2;
          console.log(data, 'dsadasdas');
          this.submitData.operatorList = data.submitData;
        } else {
          this.step = 4;
          console.log(data.submitData, 'data.submitData');
          this.submitData.authSettingList = data.submitData;
        }
        return;
      }
      if (!data.stemp) {
        this.dealCustomerData(data);
      } else {
        this.step = Number(data.stemp) + 1;
      }
    },
    dealCustomerData(data) {
      const params = data;
      Object.getOwnPropertyNames(params).forEach(k => {
        if (params[k]) {
          this.$set(this.submitData.userMerchantSave, k, params[k]);
        }
      });
      console.log(this.submitData.userMerchantSave);
    },
    async nextStepOne(data) {
      this.entType = data.entType;
      const result = await openAccountStempOne({ ...data });
      if (result.body) {
        this.ebankCstmNo = result.body;
        this.step++;
      }
    },
    async nextStepTwo(data) {
      this.submitData.operatorList = data;
      console.log('datas', data);
      // return;
      const result = await openAccountStempTwo({
        operatorList: data
      });
      if (result.body) {
        if (this.entType === '1') {
          this.confirmPageData = {
            step: 2,
            ebankCstmNo: this.ebankCstmNo,
            oprarete: data
          };
          this.showAccountOpenConfirm = true;
          this.showAccountOpen = false;
          this.showAccountQuery = false;
        } else {
          this.step++;
        }
      }
    },
    async nextStepThree(data) {
      console.log('data', data);
      if (data.isChangeDate) {
        // this.submitData.authSettingList = [];
        // this.submitData.authTemplateList = data;
        let amuntUserList = data.authTemplateListShow;
        this.submitData.authTemplateList.concat(amuntUserList);
        const result = await openAccountStempThree({
          authTemplateList: this.submitData.authTemplateList
        });
        if (result.body) {
          console.log(this.submitData.authSettingList, 'this.authSettingList');
          this.step++;
        }
      } else {
        this.step++;
      }
    },
    async lastStep() {
      const result = await queryOpenStemp({
        ebankCstmNo: this.ebankCstmNo,
        stemp: String(this.step - 1)
      });
      console.log(this.step, 'setetete');
      if (result.body) {
        this.stepOneData = result.body;
        const cstmNo = this.stepOneData.cstmNo;
        this.cstmNo = cstmNo;
        let phoneArray = '',
          phoneArray2 = '',
          mobilePhoneArray = '';
        // T24有的数据无法修改，没有的可以修改，需重新查询T24数据
        switch (this.step) {
          case 2:
            phoneArray = this.stepOneData.contactsPhone
              ? this.stepOneData.contactsPhone.split('-')
              : '';
            console.log(phoneArray);
            if (phoneArray.length === 3) {
              this.stepOneData.countryNo = phoneArray[0];
              this.stepOneData.areaNo = phoneArray[1];
              this.stepOneData.phoneNo = phoneArray[2];
            } else {
              this.stepOneData.countryNo = phoneArray[0];
              this.stepOneData.phoneNo = phoneArray[1];
              this.stepOneData.areaNo = '';
            }
            phoneArray2 = this.stepOneData.contactsPhone2
              ? this.stepOneData.contactsPhone2.split('-')
              : '';
            console.log(phoneArray2);
            if (phoneArray2.length === 3) {
              this.stepOneData.countryNo2 = phoneArray2[0];
              this.stepOneData.areaNo2 = phoneArray2[1];
              this.stepOneData.phoneNo2 = phoneArray2[2];
            } else {
              this.stepOneData.countryNo2 = phoneArray2[0];
              this.stepOneData.phoneNo2 = phoneArray2[1];
              this.stepOneData.areaNo2 = '';
            }
            mobilePhoneArray = this.stepOneData.mobilePhone.split('-');
            this.stepOneData.mobilePhoneArea = mobilePhoneArray[0];
            this.stepOneData.mobilePhoneNo = mobilePhoneArray[1];
            this.stepTwo(cstmNo);
            return;
          case 3:
            this.submitData.operatorList = result.body;
            this.step--;
            return;
          case 4:
            this.submitData.authTemplateList = result.body;
            this.step--;
            return;
          default:
            return '';
        }
      }
    },
    async stepTwo(cstmNo) {
      const res = await queryMerchantData({ cstmNo });
      if (res.body) {
        this.submitData.userMerchantSave = res.body;
        console.log(res);
        this.step--;
      }
    },
    async toConfirm(data) {
      this.submitData.authSettingList = data;
      let isEmpty = this.submitData.authSettingList.some(
        item => item.modelName === ''
      );
      if (isEmpty) {
        this.$showMsg({
          message: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_RULES'),
          type: 'error'
        });
      } else {
        console.log('data', data);
        const result = await openAccountStempFour({ authSettingList: data });
        if (result.body) {
          this.confirmPageData = {
            step: 4,
            ebankCstmNo: this.ebankCstmNo
          };
          this.showAccountOpenConfirm = true;
          this.showAccountOpen = false;
          this.showAccountQuery = false;
        }
      }
    },
    backQuery() {
      this.showAccountQuery = true;
      this.showAccountOpenConfirm = false;
      this.showAccountOpen = false;
    },
    showQuery() {
      this.showAccountQuery = true;
      this.showAccountOpenConfirm = false;
      this.showAccountOpen = false;
      this.submitData = {
        userMerchantSave: {}, // 第一步数据
        operatorList: [], // 第二步数据
        authTemplateList: [], // 第三步数据
        authSettingList: [] // 第四步数据
      };
      this.step = 1;
    },
    showConfirm(data) {
      this.showAccountQuery = false;
      this.showAccountOpenConfirm = true;
      this.showAccountOpen = false;
      this.confirmPageData = data;
      this.cstmNo = data.cstmNo;
      console.log('showConfirmDATA', data);
      console.log('this.cstmNo', this.cstmNo);
    }
  }
};
</script>

<style lang='scss' scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
::v-deep .el-tabs__item.is-active {
  color: #f06b00;
}
::v-deep .el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
}
::v-deep .el-tabs__content {
  box-sizing: border-box;
}
.g-table-form {
  margin-bottom: 0px;
}
.g-margin {
  margin: 12px 0px 18px;
}
::v-deep .is-process {
  color: #c0c4cc;
  border-color: #c0c4cc;
}
</style>
