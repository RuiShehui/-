<template>
  <div class="g-changePassword">
    <el-form label-width="340px" class="m-form" ref="formData" :model="formData" :rules="formRule">
      <el-form-item :label="$t('USER_COMMON.LONGIN_NEW_PASSWORD')" prop="loginNewPassword">
        <!-- 请输入现时密码 -->
        <el-input v-model="formData.loginNewPassword" type="password" :placeholder="$t('USER_COMMON.PLACEHOLDER_LOGIN')" ></el-input>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item :label="$t('USER_COMMON.NEW_PASSWORD')" prop="newPassword">
        <!-- 请输入新密码 -->
        <el-input v-model="formData.newPassword" type="password" :placeholder="$t('USER_COMMON.PLACEHOLDER_NEW')" ></el-input>
      </el-form-item>
      <!-- 再输入新密码 -->
      <el-form-item :label="$t('USER_COMMON.CONFIRM_NEW_PASSWORD')" prop="confirmNewPassword">
        <!-- 请再次输入新密码 -->
        <el-input v-model="formData.confirmNewPassword" type="password" :placeholder="$t('USER_COMMON.PLACEHOLDER_CONFIRM')" ></el-input>
      </el-form-item>
    </el-form>
    <div class="f-btn">
      <!-- 重置 -->
      <VButton size="w160" @click="reset">{{$t('USER_COMMON.RESET')}}</VButton>
      <!-- 提交 -->
      <VButton size="w160" type="primary" style="margin-left:16px;" @click="e2eeFun">{{$t('USER_COMMON.NEXT')}}</VButton>
    </div>
    <!-- <div class="u-tips">
      <p class="u-title">温馨提示</p>
      <ul class="u-content">
        <li>1.网银用户名为8-12位的字符（必须同时包含字母、数字）</li>
        <li>2.网银用户名修改后，个人手机银行用户名同步修改</li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { passwordValidator } from '@/utils/validator';
import { getHsmPublicKey } from '@/api/login.js';
import { updatePwd } from '@/api/home.js';
import tools from '@/dataTools/tools';
const { getCurrentTimesData } = tools;
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          loginNewPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          webPin: ''
        };
      }
    }
    // message: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   }
    // }
  },
  data() {
    const comfrimPw = (rule, value, callback) => {
      if (this.formData.newPassword !== value) {
        // 两次输入密码不一致
        callback(new Error(this.$t('USER_COMMON.DIFF_PASSWORD')));
      } else {
        callback();
      }
    };
    const passwordValidator1 = (rule, value, callback) => {
    if (value.length == 0) {
      // '请输入密码'
    callback(new Error(this.$t('USER_COMMON.INPUT_PASSWORD')))
  } else if (value.length < 8) {
    // '密码长度不能小于8位'
    callback(new Error(this.$t('USER_COMMON.LESS_PASSWORD')))
  }else if (value.length > 12) {
    // '密码长度不能大于12位'
    callback(new Error(this.$t('USER_COMMON.MORE_PASSWORD')))
  } else {
 if (/((?=.*[a-z])(?=.*\d))[a-z\d!@#$%^&*()-+]{8,12}$/i.test(value)) {
     if (this.formData.loginNewPassword == value) {
      //  '新密码不能与原密码相同'
        callback(new Error(this.$t('USER_COMMON.SAME_PASSWORD')));
      } else {
        if (/((?=.*[a-z])(?=.*\d))[a-z\d!@#$%^&*()-+]{8,12}$/i.test(value)) {
          if (this.formData.loginNewPassword == value) {
            callback(new Error(this.$t('USER_COMMON.SAME_PASSWORD')));
          } else {
            callback();
          }
        } else {
          callback(new Error(this.$t('USER_COMMON.ERROR_PASSWORD')));
        }
      }
    }
    else {
      // '请输入8-12位数字、字母中的至少两种组合'
      callback(new Error(this.$t('USER_COMMON.ERROR_PASSWORD')))
    }
  }
      
    };
    return {
      enc: '',
      pinModulus: '',
      formRule: {
        loginNewPassword: [
          // '密码不能为空'
          { required: true, message: this.$t('USER_COMMON.NULL_PASSWORD')},
         
        ],
        newPassword: [
          // '新密码不能为空'
          { required: true, message: this.$t('USER_COMMON.NULL_NEWPASSWORD') },
          { min:8,max:12,validator: passwordValidator1, trigger: 'blur' }
        ],
        confirmNewPassword: [
          // '确认密码不能为空'
          { required: true, message: this.$t('USER_COMMON.CONFIRM_PASSWORD') },
          {min:8,max:12, validator: comfrimPw, trigger: 'blur' }
        ]
      }
      // message:{}
    };
  },
  methods: {
    e2eeFun() {
      this.enc = '';
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.pinModulus = '';
          getHsmPublicKey({}).then(async body => {
            if (body) {
              this.pinModulus = body;
              let pinExponent = '010001';
              let triDesKeyLen = 2;
              let iv = null;
              let pin = this.formData.loginNewPassword;
              let newPin = this.formData.confirmNewPassword;
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
              console.log(this.enc)
              this.next();
            }
          });
        }
      });
    },
    next() {
      this.$refs['formData'].validate(valid => {
      let params={
        webPin: this.enc,
        confirmNewPassword:this.formData.confirmNewPassword,
        // loginNewPassword:this.formData.loginNewPassword,
        // newPassword:this.formData.newPassword
      }
      if(valid){
        updatePwd(params).then(res => {
          if (res) {
            // '修改成功' 
            this.$emit('message', { status: 'success', title:this.$t('USER_COMMON.UDATE_SUCCESS') });
            this.$emit('next');
          }
        });
      }
     
      });
    },
    reset() {
      this.$refs['formData'].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-form {
  // margin-left: 24%;
  width: 970px;
  margin: 0 auto;
  .el-form-item {
    ::v-deep .el-input__inner {
      width: 320px;
    }
  }
}
.f-btn {
  display: flex;
  // width: 100%;
  margin-top: 36px;
  margin-left: 35%;
}
.u-tips {
  margin-top: 185px;
  margin-left: 24px;
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

.el-form-item__error {
}
</style>