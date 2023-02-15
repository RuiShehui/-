'<template>
  <div class="g-passWord">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="220px" class="m-formData">
      <!-- 登入用户名 -->
      <el-form-item :label="$t('FIRST_LOGIN.CHANGE_USENAME')" prop="newUserName">
        <el-input v-model="formData.newUserName" maxlength="12"></el-input>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item :label="$t('FIRST_LOGIN.NEW_PASSWORD')" class="u-password" prop="userPassword">
        <el-input v-model="formData.userPassword" maxlength="12" type="password"></el-input>
      </el-form-item>
      <!-- 确认新密码 -->
      <el-form-item
        :label="$t('FIRST_LOGIN.CONFIRM_THE_NEW_PASSWOCHANGE_USENAMERD')"
        prop="userPasswordConfirm"
      >
        <el-input v-model="formData.userPasswordConfirm" maxlength="12" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="back">{{$t('COMMON.PREVIOUS_STEP')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:20px;"
        @click="e2eeFun"
      >{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('FIRST_LOGIN.TIPS')}}</p>
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
    return {
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
  computed: {
    rules() {
      var checkPassword = (rules, value, callback) => {
        console.log(value, 'value');
        if (this.formData.userPassword !== this.formData.userPasswordConfirm) {
          callback(new Error(this.$t('FIRST_LOGIN.PLEASE_TRY_AGAIN')));
        }
        callback();
      };
      return {
        userPassword: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.PLEASE_ENTER_THE_NEW_PASSWORD'),
            trigger: 'blur'
          },
          { validator: passwordValidator, trigger: 'blur' }
        ],
        userPasswordConfirm: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.PLEASE_REENTER_THE_NEW_PASSWORD'),
            trigger: 'blur'
          },
          { validator: passwordValidator, trigger: 'blur' },
          {
            validator: checkPassword,
            trigger: 'blur',
            message: this.$t('FIRST_LOGIN.PLEASE_TRY_AGAIN')
          }
        ]
      };
    }
  },
  created() {
    this.loginState = sessionStorage.getItem('firstLogin');
    this.$set(this.formData, 'newUserName', '');
  },
  methods: {
    // 加密
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
              let pin = this.formData.webPin;
              let newPin = this.formData.userPasswordConfirm;
              let timestamp = await getCurrentTimesData(); // Time Element in YYYYMMDDHH24MISS format, this should
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
    // 下一步
    next() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let params = {};
          console.log(this.formData, 'formData');
          if (this.formData.userName == this.formData.newUserName) {
            params = {
              firstVerifyToken: this.formData.firstVerifyToken,
              userName: this.formData.userName,
              webPin: this.enc
            };
          } else {
            params = {
              firstVerifyToken: this.formData.firstVerifyToken,
              newUserName: this.formData.newUserName,
              userName: this.formData.userName,
              webPin: this.enc
            };
          }
          // 校验用户名
          checkNewLogonInfo(params).then(({ head = {} }) => {
            const { returnCode } = head;
            if (returnCode === '000000') {
              this.changeUserName();
            }
          });
        }
      });
    },
    // 设置用户名
    changeUserName(value) {
      let params = {};
      console.log(this.formData, 'formData');
      // 判断原用户名是否和新用户名相同
      if (this.formData.userName == this.formData.newUserName) {
        params = {
          firstVerifyToken: this.formData.firstVerifyToken,
          userName: this.formData.userName,
          userPassword: this.formData.userPassword,
          userPasswordConfirm: this.formData.userPasswordConfirm,
          webPin: this.enc
        };
      } else {
        params = {
          firstVerifyToken: this.formData.firstVerifyToken,
          newUserName: this.formData.newUserName,
          userName: this.formData.userName,
          userPassword: this.formData.userPassword,
          userPasswordConfirm: this.formData.userPasswordConfirm,
          webPin: this.enc
        };
      }
      // 设置新用户名
      setNewLogonInfo(params).then(({ head = {} }) => {
        const { returnCode } = head;
        if (returnCode === '000000') {
          this.$emit('next', this.message);
        } else {
          this.message = {
            status: 'fail',
            title: this.$t('COMMON.SUBMIT_FAIL'),
            desc: this.$t('FIRST_LOGIN.TO_FINISH_FAIL')
          };
          this.$emit('next', this.message);
        }
      });
    },
    back() {
      this.$emit('back');
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