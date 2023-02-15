<template>
  <div class="u-modify">
    <p class="fpsTipsStyle">{{$t('USER_MANAGEMENT.FPS_UNCONTENT_TIPS')}}</p>
    <el-form :model="formData" ref="formData" :rules="rules" class="u-ml56 mb36" label-width="auto">
      <el-form-item :label="$t('AUTHORIZE.AUTH_CUSTOMER')+':'">
        <el-input v-model="formData.customerNameDesen" disabled></el-input>
      </el-form-item>
      <!-- 需要区分修改的是邮件还是电话 -->
      <el-form-item v-if="formData.emailAddress" :label="$t('USER_MANAGEMENT.USER_EMAIL')+':'">
        <el-input v-model="formData.numberDesen" disabled></el-input>
      </el-form-item>
      <el-form-item v-if="formData.phone" :label="$t('AUTHORIZE.AUTH_MOBILE')+':'">
        <el-input v-model="formData.numberDesen" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZE.AUTH_BINDHKD')+':'" required>
        <el-select v-model="formData.bindAccount" disabled>
          <el-option
            v-for="(item,index) in options1"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="formData.raccountNo" :label="$t('AUTHORIZE.AUTH_BINDCNY')+':'">
        <el-select v-model="formData.raccountNo" disabled>
          <el-option
            v-for="(item,index) in options2"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('PAYMENT.PRESET_PAYEE_ACCOUNT')+':'" required>
        <el-radio
          :disabled="true"
          class="radioPreset"
          label="0"
          v-model="formData.presetAcct"
        >{{$t('AUTHORIZE.YES')}}</el-radio>
        <el-radio :disabled="true" label="1" v-model="formData.presetAcct">{{$t('AUTHORIZE.NO')}}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('SOFT_TOKEN.OTP')" class="u-OTP" prop="code">
        <el-input
          maxlength="6"
          minlength="6"
          onkeyup="this.value=this.value.replace(/\D/g,'')"
          onafterpaste="this.value=this.value.replace(/\D\g,'')"
          v-model="formData.code"
          :placeholder="$t('FUND.PLEASE_INPUT_MESSAGENO')"
          class="mr16"
        ></el-input>
        <VButton
          :style="{ overflow: 'hidden' }"
          size="wMin160"
          style="margin-left:20px;"
          :disabled="isdisabled"
          @click="getEmailCode"
        >{{btnValue}}</VButton>
      </el-form-item>
    </el-form>
    <el-row class="flexc mt20">
      <v-button class="mr16" @click="$emit('back')">{{$t('COMMON.BACK')}}</v-button>
      <v-button type="primary" @click="next">{{$t('COMMON.NEXT_STEP')}}</v-button>
    </el-row>
  </div>
</template>
<script>
import { queryInvestmentAccount } from '@/api/investmentServices.js';
import { getAcctInfo } from '@/api/FPSAccountBinding.js';
import { proSendOtpCode } from '@/api/public';
import { isAddZero } from '@/utils/tools';
import CONSTANTS from '@/utils/contants';
import { sendOtp, validOtp } from '@/api/sendOTP';
export default {
  data() {
    return {
      emailAddressDesen: '',
      phoneDesen: '',
      isdisabled: false,
      btnValue: this.$t('COMMON.GET_VR_CODE'),
      formData: {
        customerName: '', //客户名称
        emailAddress: '', //电邮地址
        bindAccount: '', //绑定账户（港币）
        raccountNo: '', //绑定账户（人民币）
        presetAcct: '0', //预设收款账户
        phone: '', //流动电话
        code: '' //验证码
      },
      rules: {
        code: [
          {
            required: true,
            message: this.$t('USER_MANAGERMENT.INPUT_MESSAGE'),
            trigger: 'blur'
          },
          {
            min: 6,
            max: 6,
            message: this.$t('USER_MANAGERMENT.LENGTH_LIMIT'),
            trigger: 'blur'
          }
        ]
      },
      options1: [],
      options2: [],
      smsCode: ''
    };
  },
  mounted() {
    console.log('this.route', this.$route.query.row);
    this.formData = this.$route.query.row;
    this.formData.customerName = this.$route.query.row.customerName;
    console.log('打印。。。。。111', this.formData);
    if (this.$route.query.row.bindingType === '1') {
      this.formData.emailAddress = this.$route.query.row.number;
    }
    if (this.$route.query.row.bindingType === '2') {
      this.formData.phone = this.$route.query.row.number;
    }
    // this.getRandomNum()
    // this.desensitization();
    this.getInvestmentAccount();
  },
  methods: {
    //下一步
    next() {
      let custNo = sessionStorage.getItem('custNo');
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let params = {
            otpType: '09040201',
            custNo: custNo,
            code: this.formData.code,
            otpMode: 'otp',
            refNum: this.smsCode
          };
          validOtp(params).then(res => {
            if (res.head.returnCode === '000000') {
              sessionStorage.setItem('otpToken', res.body);
              this.$emit('next', this.formData);
            }
          });
          // this.$emit('next', this.formData);
        } else {
          console.log('error submit');
          return false;
        }
      });
    },
    //用户账号
    getInvestmentAccount() {
      this.options1 = [];
      this.options2 = [];
      getAcctInfo().then(resp => {
        console.log(resp, 'resp');
        let payeeList = [];
        let cnyList = [];
        resp.debitAcctList.forEach(item => {
          let hkd = {};
          let cny = {};
          if (item.cur == 'HKD') {
            CONSTANTS.ACCOUNT_TYPE_LIST.forEach(type => {
              if (type.value == item.typeLabel) {
                item.typeLabel = type.label;
                hkd = {
                  label: item.acctNo + '' + item.cur + '' + item.typeLabel,
                  value: item.acctNo + '' + item.cur + '' + item.typeLabel
                };
              }
            });
            return payeeList.push(hkd);
          }
          if (item.cur == 'CNY') {
            CONSTANTS.ACCOUNT_TYPE_LIST.forEach(type => {
              if (type.value == item.typeLabel) {
                item.typeLabel = type.label;
                cny = {
                  label: item.acctNo + '' + item.cur + '' + item.typeLabel,
                  value: item.acctNo + '' + item.cur + '' + item.typeLabel
                };
              }
            });
            return cnyList.push(cny);
          }
        });
        this.options1 = payeeList;
        this.options2 = cnyList;
        console.log(this.options, 'option');
      });
    },

    //获取验证码
    getEmailCode() {
      let custNo = sessionStorage.getItem('custNo');
      let params = {
        otpType: '09040201',
        custNo: custNo,
        otpMode: 'otp',
        refNum: this.smsCode
      };
      sendOtp(params).then(res => {
        if (res.body) {
          this.smsCode = res.body.refNum;
          this.time();
          this.$message({
            type: 'success',
            message: this.$t('USER_MANAGERMENT.SEND_SCUSS'),
            delay: 3000
          });
        } else {
          this.$message({
            type: 'fail',
            message: this.$t('USER_MANAGERMENT.SEND_FAIL'),
            delay: 3000
          });
        }
      });
    },
    time(o) {
      let wait = 100;
      this.isdisabled = true;
      this.sendEmail = true;
      let interval = window.setInterval(() => {
        this.btnValue = this.$t('FIRST_LOGIN.GET_ANAIN', {
          time: wait
        });
        --wait;
        if (wait < 0) {
          this.btnValue = this.$t('USER_MANAGERMENT.SEND');
          wait = 100;
          this.isdisabled = false;
          this.sendEmail = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    // 短讯编号
    getRandomNum() {
      let randomStr = Math.random()
        .toFixed(3)
        .slice(-3);
      return (this.smsCode = randomStr);
    }
  }
};
</script>
<style lang="scss" scoped>
.u-ml56 {
  margin-left: 262px;
}
/deep/.el-input {
  width: 320px !important;
}
/deep/.u-OTP {
  .el-input {
    width: 180px !important;
    margin-right: 16px;
  }
  .el-form-item__content {
    display: flex;
  }
  /deep/ .el-button {
    width: 128px;
    border-radius: 4px;
    border: 1px solid #f06b00;
    color: #f06b00;
  }
}
.radioPreset {
  margin-top: 11px;
  margin-left: 13px;
}
.fpsTipsStyle {
  text-align: center;
  padding: 0 0 10px;
  line-height: 20px;
  color: #262626;
  font-size: 14px;
}
</style>