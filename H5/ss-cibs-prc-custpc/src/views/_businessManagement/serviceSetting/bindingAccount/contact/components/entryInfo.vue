<template>
  <div class="entryInfo">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      class="u-ml56 mb36"
      label-width="210px"
    >
      <el-form-item :label="$t('AUTHORIZE.AUTH_CUSTOMER')+':'">
        <el-input v-model="formData.customerNameDesen" disabled></el-input>
      </el-form-item>
      <el-form-item v-show="!phoneFlag" :label="$t('USER_MANAGEMENT.USER_EMAIL')+':'">
        <el-input v-model="formData.numberDesen" disabled></el-input>
      </el-form-item>
      <el-form-item v-show="phoneFlag" :label="$t('AUTHORIZE.AUTH_MOBILE')">
        <el-input v-model="formData.numberDesen" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.AUTH_BINDHKD')+':'" prop="bindAccount">
        <el-select v-model="formData.bindAccount">
          <el-option
            v-for="(item,index) in option"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.AUTH_BINDCNY')+':'">
        <el-select v-model="formData.raccountNo">
          <el-option
            v-for="(item,index) in options"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('PAYMENT.PRESET_PAYEE_ACCOUNT')+':'" required>
        <el-radio class="radioPreset" label="0" v-model="formData.presetAcct">{{$t('AUTHORIZE.YES')}}</el-radio>
        <el-radio label="1" v-model="formData.presetAcct">{{$t('AUTHORIZE.NO')}}</el-radio>
      </el-form-item>
      <el-form-item v-show="!phoneFlag" :label="$t('AUTHORIZE.AUTH_CHANNELMOILBLE')+':'">
        <el-input v-model="formData.otherChannelsDesen" disabled></el-input>
      </el-form-item>
      <el-form-item v-show="phoneFlag" :label="$t('AUTHORIZE.AUTH_CHANNELEMAIL')+':'">
        <el-input v-model="formData.otherChannelsDesen" disabled></el-input>
      </el-form-item>
    </el-form>
    <el-row class="flexc mt36">
      <v-button class="mr16" @click="back">{{$t('COMMON.BACK')}}</v-button>
      <v-button type="primary" @click="next">{{$t('COMMON.NEXT_STEP')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import { queryInvestmentAccount } from '@/api/investmentServices.js';
import { getAcctInfo } from '@/api/FPSAccountBinding.js';
import filter from "@/filters/public.js"
export default {
  data() {
    return {
      phoneFlag: false,
      formData: {
        customerName: '', //客户名称
        emailAddress: '', //电邮地址
        bindAccount: '', //绑定账户（港币）
        raccountNo: '', //绑定账户（人民币）
        presetAcct: '0', //预设收款账户
        otherChannelsDesen: '' //其他沟通渠道（流动电话）
      },
      rules: {
        bindAccount: [
          { required: true, message: this.$t('USER_MANAGERMENT.BIND_HKDACCOUNT'), trigger: 'blur' }
        ]
      },
      option: [],
      options: [],
      accountTypeList: [
        {
          value: '',
          label: this.$t('RIGHTS_TEMPLATE.ALL')
        },
        {
          value: 'SAVING',
          label: this.$t('USER_MANAGEMENT.SAVINGS_ACCOUNT')
        },
        {
          value: 'MULTICURRENCY',
          label: this.$t('USER_MANAGEMENT.CURRENCY_SAVINGS_ACCOUNTS')
        },
        {
          value: 'CURRENT',
          label: this.$t('USER_MANAGEMENT.CURRENT_ACCOUNT')
        },
        {
          value: 'FIXED',
          label: this.$t('USER_MANAGEMENT.FIXED')
        },
        {
          value: 'LOAN',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'SECURITIES',
          label: this.$t('USER_MANAGEMENT.LOAN_ACCOUNT')
        },
        {
          value: 'INVESTMENT',
          label: this.$t('USER_MANAGEMENT.INVESTMENT_ACCOUNT')
        }
      ]
    };
  },
  filters:{
    ccyFilter:filter.ccyFilter
  },
  mounted() {
    this.formData = this.$route.query.row;
    console.log('this.$route.query.row', this.$route.query.row);
    this.getInvestmentAccount();
    if (this.$route.query.row.contactInfomation == this.$t('AUTHORIZE.AUTH_MOBILE') || this.$route.query.row.contactInfomation === '1') {
      this.phoneFlag = true;
      this.formData.contactInfomation = '1'; 
      this.formData.number = this.$route.query.row.number;
    } else {
      this.phoneFlag = false;
      this.formData.contactInfomation = '2';
      this.formData.emailAddressDesen = this.$route.query.row.number;
    }
    if (this.$route.query.row.otherChannelsDesen) {
      this.formData.otherChannelsDesen = this.$route.query.row.otherChannelsDesen;
    } else {
      this.formData.otherChannelsDesen = '--';
    }
  },

  methods: {
    //下一步
    next() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          console.log('this.formData', this.formData);
          this.$emit('next', this.formData);
        }
      });
    },
    curfilter(val){
      return filter.ccyFilter(val)
    },
    //返回
    back() {
      this.$router.go(-1);
    },

    //用户账号
    getInvestmentAccount() {
      getAcctInfo().then(resp => {
        console.log(resp, 'resp');
        let payeeList = [];
        let cnyList = [];
        resp.debitAcctList.forEach(item => {
          let hkd = {};
          let cny = {};
          if (item.cur == 'HKD') {
            this.accountTypeList.forEach(type => {
              if (type.value == item.typeLabel) {
                item.typeLabel = type.label;
                hkd = {
                  label: item.acctNo + ' ' + this.curfilter(item.cur) + ' ' + item.typeLabel,
                  value: item.acctNo + ' ' + item.cur + ' ' + item.typeLabel
                };
              }
            });
            return payeeList.push(hkd);
          }
          if (item.cur == 'CNY') {
            this.accountTypeList.forEach(type => {
              if (type.value == item.typeLabel) {
                item.typeLabel = type.label;
                cny = {
                  label: item.acctNo + ' ' + this.curfilter(item.cur) + ' ' + item.typeLabel,
                  value: item.acctNo + ' ' + item.cur + ' ' + item.typeLabel
                };
              }
            });
            return cnyList.push(cny);
          }
        });
        this.option = payeeList;
        this.options = cnyList;
        //unshift ===》 数组头部添加元素
        this.options.unshift({
          label: '',
          value: ''
        });
        if (payeeList.length > 0) {
          this.formData.bindAccount = payeeList[0].value;
        }
        console.log(this.options, 'option');
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-input {
  width: 320px !important;
}
.u-ml56 {
  margin-left: 174px;
}
.radioPreset {
  margin-top: 11px;
  margin-left: 13px;
}
</style>