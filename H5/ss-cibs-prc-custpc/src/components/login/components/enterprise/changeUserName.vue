<template>
  <div class="u-changeUserName">
    <el-form ref="formData" :model="formData" :rules="rules" class="u-form" label-width="245px">
      <!-- 客户号 -->
      <el-form-item :label="$t('FIRST_LOGIN.LOGIN_CUSTNO')" prop="userName">
        <el-input
          v-model="formData.userName"
          maxlength="20"
          :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
            input:$t('FIRST_LOGIN.LOGIN_CUSTNO')
          })"
        ></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item class="verify" :label="$t('FIRST_LOGIN.VERIFICATION_CODE')" prop="verifyCode">
        <el-input
          class="verify-code"
          v-model="formData.verifyCode"
          :placeholder="$t('FIRST_LOGIN.PLEASE_INPUT_VERIFICATION_CODE')"
        ></el-input>
        <img class="verify-code-img" :src="imgSrc" alt="verify code" @click="getVerifyImg" />
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="u-btn">
      <VButton size="w160" @click="reset">{{$t('COMMON.RESET')}}</VButton>
      <VButton
        size="w160"
        type="primary"
        style="margin-left:16px;"
        @click="next"
      >{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <p class="u-content">{{$t('FIRST_LOGIN.TIPS_CONTENT')}}</p>
    </div>
  </div>
</template>

<script>
import { checkUserFirstLogin, verifyImg } from '@/api/login.js';
import { setUser, setToken } from '@/utils/user';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('app');
// import { userNameValidator } from '@/utils/validator.js';
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      rules: {
        userName: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING', {
              input: this.$t('FIRST_LOGIN.LOGIN_CUSTNO')
            }),
            trigger: 'blur'
          }
          // { validator: userNameValidator, trigger: 'blur' }
        ],
        verifyCode: [
          {
            required: true,
            message: this.$t('FIRST_LOGIN.PLEASE_INPUT_VERIFICATION_CODE'),
            trigger: 'blur'
          }
        ]
      },
      imgSrc: ''
    };
  },
  watch: {},
  created() {
    this.getVerifyImg();
    this.$set(this.formData, 'verifyCode', '');
  },
  methods: {
    ...mapActions(['SET_TOKEN']),
    next() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let params = this.formData;
          // 检查是否是首次登录， 区分该用户是重置密码首次登录还是普通首次登录
          checkUserFirstLogin(params).then(res => {
            console.log(res, 'res');
            if (!res) {
              this.getVerifyImg();
              return;
            } else if (res.logonState == 'RESET_PWD') {
              sessionStorage.setItem('userName', this.formData.userName);
              this.$confirm({
                title: this.$t('COMMON.TIPS'),
                message: this.$t('FIRST_LOGIN.NOT_NEWUER'),
                btnText: {
                  confirmText: this.$t('COMMON.DETERMINE')
                },
                isCancle: false
              });
            } else {
              this.$emit('next', this.formData);
            }
          });
        }
      });
    },
    reset() {
      this.formData.userName = '';
      this.formData.verifyCode = '';
    },
    // 点击切换验证码
    getVerifyImg() {
      let self = this;
      verifyImg().then(res => {
        this.imgSrc = res.imageStr;
        this.SET_TOKEN(res.imageToken);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.u-changeUserName {
  .u-form {
    margin-left: 23%;
    ::v-deep .el-input__inner {
      width: 320px;
    }
  }
  .u-btn {
    margin-left: 38%;
    display: flex;
    margin-top: 36px;
  }
  .el-form .el-input {
    width: 180px;
  }
  .verify {
    ::v-deep .el-form-item__content {
      display: flex;
      align-items: center;
    }

    // ::v-deep .verify-code {
    ::v-deep .el-input__inner {
      width: 180px;
    }
    .verify-code-img {
      width: 128px;
      height: 36px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      margin-left: 10px;
    }
    // margin-right: 20px;
    // }
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
}
</style>