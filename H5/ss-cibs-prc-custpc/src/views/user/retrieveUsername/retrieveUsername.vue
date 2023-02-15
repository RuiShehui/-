<template>
  <div class="g-changeUserName">
    <div class="u-bg">
      <img src="@/images/user/headPortarit.png" class="u-img" />
      <div class="u-userName">
        <!-- 用户名 -->
        <p class="userName">{{$t('USER_COMMON.USER_NAME')+'：'}}
        
          {{ userInfo.loginName ||userInfo.userCode }}
        
        </p>
        <!-- 客户编号 -->
        <p style="font-size:14px;">{{$t('USER_COMMON.USER_CODE')}}：{{userInfo.custNo}}</p>
      </div>
    </div>
    <!-- 修改用户名 -->
    <VButton size="w210" class="f-btn" @click="changeUserName" v-if="change">{{$t('USER_COMMON.UPDATE_USERNAME')}}</VButton>
    <div v-if="showInput">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="220px"
        style="margin-left:26%"
      >
      <!-- 修改用户名 -->
        <el-form-item :label="$t('USER_COMMON.UPDATE_USERNAME')" prop="userName" class="u-changeUser">
          <!-- 请输入用户名 -->
          <el-input v-model="formData.userName" :placeholder="$t('USER_COMMON.INPUT_USERNAME')" ></el-input>
        </el-form-item>
      </el-form>
      <div class="f-btn">
        <!-- 重置 -->
        <VButton size="w160" style="margin-right:16px;" @click="reset">{{$t('USER_COMMON.RESET')}}</VButton>
        <!-- 提交 -->
        <VButton size="w160" type="primary" @click="comfirm">{{$t('USER_COMMON.NEXT')}}</VButton>
      </div>
    </div>
   <div class="u-tips">
     <!-- 温馨提示 -->
      <p class="u-title">{{$t('USER_COMMON.TIPS')}}</p>
      <ul class="u-content">
        <!-- 1.网银用户名为8-12位的字符（必须同时包含字母、数字） -->
        <li>{{$t('USER_COMMON.TIPS_ONE')}}</li>
        <!-- 2.网银用户名修改后，个人手机银行用户名同步修改 -->
        <li>{{$t('USER_COMMON.TIPS_TWO')}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { updateUserName,queryUserInfo } from '@/api/home.js';
// import { userNameValidator } from '@/utils/validator.js';
export default {

  data() {
   const  userNameValidator=(rule, value, callback)=> {
  if (value.length < 8) {
    // '用户名长度不能小于8位'
    callback(new Error(this.$t('USER_COMMON.LESS_USERNAME')))
  }else if(value.length >12){
    // '用户名长度不能大于12位'
    callback(new Error(this.$t('USER_COMMON.MORE_USERNAME')))
  } else {
    if (/((?=.*[a-z])(?=.*\d))[a-z\d!@#$%^&]{8,12}$/i.test(value)) {
      callback()
    } else {
      // '网银用户名为8-12为字符（必须包含字母、数字）'
      callback(new Error(this.$t('USER_COMMON.ERROR_USERNAME')))
    }
  }
}
    return {
      formData: {
        userName: ''
      },
      showInput: false,
      change: true,
      dialogVisible: false,
      rules: {
        userName: [
          // '用户名不能为空'
          { required: true, message: this.$t('USER_COMMON.NULL_USERNAME') },
          { validator: userNameValidator, trigger: 'blur' },
          // {min:6,max:12, trigger: 'blur' }
        ]
      },
      userInfo:{},
      userCode:"",
      userLoginName:""
    };
  },
  created(){
    this.userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
    console.log(this.userInfo,'this.userInfo')
    // this.userLoginName = this.userInfo

    // this.userCode =sessionStorage.getItem('custNo')
  },
  methods: {
    changeUserName() {
      this.showInput = true;
      this.change = false;
    },
    reset() {
      this.formData.userName='';
      //  this.$refs['formData'].resetFields();
    },
    comfirm() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$confirm({
            // '确定修改为以下用户名?'
            title:  this.$t('USER_COMMON.CONFIRM_USERNAME'),
            // '用户名:'
            message:  this.$t('USER_COMMON.USER_NAME') +':'+ this.formData.userName,
            btnText: {
              // '取消'
              cancleText:  this.$t('USER_COMMON.CANCLE'),
              //  '确定'
              confirmText: this.$t('USER_COMMON.CONFIRM')
            },
            isCancle: true
          }).then(() => {
            this.changed();
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });

      // this.dialogVisible = true;
    },
    async changed() {
      let params = {
        loginName: this.formData.userName
        //  language:localStorage.getItem('lang')
      };
      const res = await updateUserName(params);
      console.log(res, 'res1111');
      if (res) {
        queryUserInfo().then(res=>{
          if(res){
            console.log(res,'res')
            // sessionStorage.setItem('userInfo',res)
            this.userInfo=res
            sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          }
          console.log(res,'xinde')
        })
        console.log('修改用户名返回的数据',res)
        this.$message({
          // '用户名修改成功'
          message: this.$t('USER_COMMON.UPDATE_USERNAME_SUCCESS') ,
          type: 'success',
          delay: 3000
        });
        this.userName=this.formData.userName
        localStorage.setItem('user',this.formData.userName)
        this.formData.userName = '';
        this.dialogVisible = false;
        this.change = true;
        this.showInput = false;
      } else {
        this.$message({
          // '用户名修改失败'
          message:  this.$t('USER_COMMON.UPDATE_NSERNAME_FAIL'),
          type: 'error',
          delay: 3000
        });
        this.dialogVisible = false;
        this.change = true;
        this.showInput = false;
      }
      // this.$message.success('用户名修改成功');
      // this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.u-bg {
  width: 600px;
  height: 160px;
  background-image: url('~@/images/user-bg.png');
  // border: 1px solid #000;
  display: flex;
  margin-left: 27%;
  border-bottom: 2px solid #cccc;
  border-style: outset;
}
.u-img {
  width: 74px;
  height: 74px;
  margin: 43px 43px;
}
.u-userName {
  margin-top: 60px;
  .userName {
    margin-bottom: 8px;
    font-size: 20px;
    font-weight: 400;
    color: rgba($color: #000000, $alpha: 0.85);
  }
}
.u-changeUser {
  margin-top: 36px;
  // margin-left: 39%;
  ::v-deep .el-input__inner {
    width: 320px;
  }
}
.f-btn {
  display: flex;
  margin-left: 40%;
  margin-top: 36px;
}
.dialog-footer {
  display: flex;
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
</style>