<!--
管理员
-->
<template>
  <div class="u-changeUserName">
    <el-form ref="formData" :model="formData" class="u-form" :rules="rules" label-width="245px">
      <!-- 登录名 -->
      <el-form-item :label="$t('FIRST_LOGIN.USERNAME')" prop="userName">
        <el-input v-model="formData.userName"  disabled :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{input:this.$t('FIRST_LOGIN.USERNAME')})"></el-input>
      </el-form-item>
      <!-- 初始密码 -->
      <el-form-item  :label="$t('FIRST_LOGIN.START_CODE')" prop="password" class="u-passWord">
        <el-input v-model="formData.password" maxlength="12" :placeholder="$t('FIRST_LOGIN.PLEASE_ENTER_ORIGINAL_PASSWORD')"></el-input>
      </el-form-item>
    </el-form>
    <div class="u-btn">
      <VButton size="w160" @click="reset">{{$t('COMMON.RESET')}}</VButton>
      <VButton size="w160" type="primary" style="margin-left:16px;" @click="e2eeFun">{{$t('COMMON.NEXT_STEP')}}</VButton>
    </div>
    <div class="u-tips">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <p class="u-content">{{$t('FIRST_LOGIN.TIPS_CONTENT')}}</p>
    </div>
  </div>
</template>

<script>
import { checkFirstPwdForAdmin, getHsmPublicKey,
checkResetPwd } from '@/api/login.js';
import tools from '@/dataTools/tools';
const { getCurrentTimesData } = tools;
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          custNo: '',
          userName: '',
          passWord: ''
        };
      }
    }
  },
  data() {
    return {
      enc:'',
      pinModulus: '',
      rules: {
        userName: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_INPUT_SOMETHING',{input:this.$t('FIRST_LOGIN.USERNAME')}),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message:this.$t('FIRST_LOGIN.PLEASE_ENTER_ORIGINAL_PASSWORD'),
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    this.formData.userName = sessionStorage.getItem('userName');
  },
  methods: {
    // 加密组件
    e2eeFun(){
      this.enc = '';
      this.$refs['formData'].validate(valid =>{
        if(valid){
          this.pinModulus = '';
          // 加密组件
          getHsmPublicKey({}).then(async body => {
            if (body) {
              this.pinModulus = body;
              let pinExponent = '010001';
              let triDesKeyLen = 2;
              let iv = null;
              let pin = this.formData.password;
              let timestamp =await getCurrentTimesData(); // Time Element in YYYYMMDDHH24MISS format, this should
              this.enc = E2EE.encryptAlphaPINAndGenerateMAC(this.pinModulus, pinExponent, triDesKeyLen, iv, pin, timestamp);
              this.next();
            }
          });
        }
      })

    },
    // 下一步
    next() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          let params ={
            custNo: this.formData.custNo,
            userName: this.formData.userName,
            // passWord: ''
          };
          params.webPin = this.enc
          checkResetPwd(params).then(res => {
            console.log(res,'res')
            if (res.body.result) {
              this.$emit('next', this.formData);
            }
          });
        }
      });
    },
    // 重置表单
    reset() {
      this.$refs['formData'].resetFields();
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
  .u-passWord {
    ::v-deep .el-form-item__content {
      display: flex;
    }
  }
  .u-btn {
    margin-left: 38%;
    display: flex;
    margin-top: 36px;
  }
  // .u-tips{
  //   position: relative;
  //   bottom: 0;
  //   top:0 ;
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
</style>