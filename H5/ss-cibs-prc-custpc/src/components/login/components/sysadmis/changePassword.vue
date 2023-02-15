<template>
  <div class="g-passWord">
    <el-form ref="formData" :model="formData" :rules="rules"  label-width="245px" class="m-formData">
      <!-- 新密码 -->
      <el-form-item :label="$t('FIRST_LOGIN.NEW_PASSWORD')" class="u-password" prop="userPassword">
        <el-input v-model="formData.userPassword" maxlength="12" type="password"></el-input>
      </el-form-item>
      <!-- 确认新密码 -->
      <el-form-item :label="$t('FIRST_LOGIN.CONFIRM_THE_NEW_PASSWOCHANGE_USENAMERD')" prop="userPasswordConfirm">
        <el-input v-model="formData.userPasswordConfirm" maxlength="12" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</VButton>
      <VButton size="w160" type="primary" style="margin-left:20px;" @click="e2eeFun">{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <ul class="u-content">
        <li>{{$t('FIRST_LOGIN.LOGON_PASSWORD_CONTAINS')}}</li>
        <li>{{$t('FIRST_LOGIN.LOGON_PASSWORD_WILL_SYNCHRONISED')}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  checkNewLogonInfo,
  setNewLogonInfo,
  getHsmPublicKey,
  setNewLogonPWD
} from '@/api/login.js';
import { passwordValidator, userNameValidator } from '@/utils/validator';
import tools from '@/dataTools/tools';
const { getCurrentTimesData } = tools;
export default {
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var checkPassword = (rules, value, callback) => {
      console.log(value, 'value');
      if (this.formData.userPassword !== this.formData.userPasswordConfirm) {
        callback(new Error(this.$t('FIRST_LOGIN.PASSWORD_DIFFREENT')));
      }
      callback();
    };
    return {
      rules: {
        // newUserNames: [
        //   { validator: userNameValidator, trigger: 'blur' }
        // ],
        userPassword: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
              input:this.$t('FIRST_LOGIN.PLEASE_ENTER_THE_NEW_PASSWORD')
            }),
            trigger: 'blur'
          },
          { validator: passwordValidator, trigger: 'blur' }
        ],
        userPasswordConfirm: [
          {
            required: true,
             message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{
              input:this.$t('FIRST_LOGIN.PLEASE_ENTER_THE_NEW_PASSWORD')
            }),
            trigger: 'blur'
          },
          { validator: passwordValidator, trigger: 'blur' },
          {
            validator: checkPassword,
            trigger: 'blur',
            message: this.$t('FIRST_LOGIN.PLEASE_TRY_AGAIN')
          }
        ]
      },
      loginState: '',
      message: {
        status: 'success',
        title: this.$t('COMMON.SUBMIT_SUCCESS'),
        desc: this.$t('FIRST_LOGIN.PLEASE_LOGON_AGAIN')
      },
      newUserName: '',
      enc: '',
      pinModulus: ''
    };
  },
  created() {
    this.loginState = sessionStorage.getItem('firstLogin');
    this.$set(this.formData, 'newUserName', '');
  },
  methods: {
    e2eeFun() {
      this.enc = '';
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.pinModulus = '';
          // 加密组件
          getHsmPublicKey({}).then(async body => {
            if (body) {
              this.pinModulus = body;
              let pinExponent = '010001';
              let triDesKeyLen = 2;
              let iv = null;
              let pin = this.formData.password;
              let newPin = this.formData.userPasswordConfirm;
              let timestamp =await getCurrentTimesData(); // Time Element in YYYYMMDDHH24MISS format, this should
              this.enc = E2EE.encryptChangeAlphaPINAndGenerateMAC(
                this.pinModulus,
                pinExponent,
                triDesKeyLen,
                iv,
                pin,
                newPin,
                timestamp
              );
              console.log(this.enc, 'enc');
              console.log(this.formData, 'formData');
              this.next();
            }
          });
        }
      });
    },
    // 进入下一步
    next() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.changeUserName();
        }
      });
    },
    // 修改登录密码
    changeUserName(value) {
      // let params = {};
      console.log(this.formData, 'formData');
      let params = {
        firstVerifyToken: this.formData.firstVerifyToken,
        userName: this.formData.userName,
        webPin: this.enc
      };
      setNewLogonPWD(params).then(({ head = {} }) => {
        const { returnCode } = head;
        if (returnCode === '000000') {
          this.$emit('next', this.message);
        } else {
          this.message = {
            status: 'fail',
            title: this.$t('COMMON.SUBMIT_FAIL'),
            desc: this.$t('FIRST_LOGIN.TO_FINISH')
          };
          this.$emit('next', this.message);
        }
      });
    },
    // 返回上一步
    back() {
      this.$emit('back');
      // this.
    }
  }
};
</script>

<style lang="scss" scoped>
.m-formData {
  margin-left: 23%;
  ::v-deep .el-input__inner {
    width: 320px;
  }
}
.u-password {
  ::v-deep .el-form-item__content {
    display: flex;
  }
}
.u-btn {
  margin-left: 38%;
  display: flex;
  margin-top: 36px;
}
.u-tips {
  margin-top: 40px;
  margin-left: 24px;
  // position: absolute;
  // bottom: 0px;
  .u-title {
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 400;
  }
  .u-content {
    margin-top: 16px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.45);
    font-weight: 400;
  }
}
</style>