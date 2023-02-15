<!--
 * @Author: your name
 * @Date: 2022-10-24 14:34:06
 * @LastEditTime: 2022-11-04 11:24:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\specialInstruction\appliocationSpecial\add.vue
-->
<template>
  <div class="add">
    <el-form
      ref="formData"
      label-position="right"
      label-width="calc(50% - 170px)"
      label-suffix=":"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="網銀客戶號" prop="ebankCstmNo" >
        <el-input
          v-model="formData.ebankCstmNo"
          @blur="getUserName"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="客戶名稱">
        <el-input
          v-model="formData.entEglsName"
          :disabled="true"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="客戶經理登錄名稱"  prop="rmUserno">
        <el-input
          v-model="formData.rmUserno"
          @blur="getCustName"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="客戶經理姓名" prpp="rmRealName">
        <el-input
          v-model="formData.rmRealName"
          :disabled="true"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="客戶經理郵箱"  prpp="rmEmail">
        <el-input
          v-model="formData.rmEmail"
          :disabled="true"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="客戶經理所屬機構"  prpp="belongDepName">
        <el-input
          v-model="formData.belongDepName"
          :disabled="true"
          :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          class="f-w-340"
          maxlength="200"
        />
      </el-form-item>
    </el-form>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back()">返回</el-button>
      <el-button
        type="primary"
        @click="handleSubmit('ruleForm')"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  querySave,
  getFindUserInfoListPage,
  update
} from '@/api/specialInstruction/index';
import {

  queryMerchantList,

} from '@/api/customer-management/customer';
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          ebankCstmNo: '',
          entEglsName: '',
          rmUserno: '',
          rmEmail: '',
          depName: '',
          userRealName: ''
        };
      }
    },
    adds:{
      type:Boolean,
      default:()=>{
        return true
      }
    }
  },
  data() {
    return {
      // formData: {
      //   ebankCstmNo: '',
      //   entEglsName: '',
      //   rmUserno: '',
      //   rmEmail: '',
      //   depName: '',
      //   userRealName: ''
      // },
      rules: {
        ebankCstmNo:[
          {
            required: true,
            message:"請輸入網銀客戶號",
            trigger: 'blur'
          }
        ],
        rmUserno:[
          {
            required: true,
            message:"請輸入客戶經理登錄名稱",
            trigger: 'blur'
          }
        ],
        entEglsName:[
          {
            required: true,
            message:"請輸入客戶經理姓名",
            trigger: 'blur'
          }
        ],
        rmEmail:[
          {
            required: true,
            message:"請獲取聯絡郵箱",
            trigger: 'blur'
          }
        ],
        belongDepName:[
          {
            required: true,
            message:"請獲取所屬機構名稱",
            trigger: 'blur'
          }
        ],
      }
    };
  },
  methods: {
    back() {
      this.$emit('back');
    },
   handleSubmit() {

     this.$refs['formData'].validate(valid => {
       if(valid){
         if(this.adds){
          querySave(
          {
          ...this.formData
          }
        ).then(res=>{
          if(res.body){
            this.$showMsg({
              type: 'success',
              message: '新增成功'
            });
            this.$emit('back')
          }else{
             this.$showMsg({
              type: 'error',
              message: '提交失敗，請重新提交'
            });
          }
        })
         }else{
           update({
          ...this.formData
          }
        ).then(res=>{
          if(res.body){
             this.$showMsg({
              type: 'success',
              message: '修改成功'
            });
            this.$emit('back')
          }else{
             this.$showMsg({
              type: 'error',
              message: '修改失敗'
            });
          }
        })
         }
        
       }
     })
    },
    async getUserName() {
      const result = await queryMerchantList({
        serchType: '1',
        ebankCstmNo: this.formData.ebankCstmNo,
        accountNo: '',
        cardArea: '',
        cardNo: '',
        cardType: '',
        cstmNo: '',
        email: ''
      });
 
      if (result && result.body.length!==0) {
        this.$set(this.formData,'entEglsName',result.body[0].entEglsName)
        // this.formData.entEglsName = 
      }else{
        this.$showMsg({
          type: 'error',
          message: '請輸入正確的網銀客戶號'
        });
      }
    },
    async getCustName() {
      if (this.formData.rmUserno) {
        const res = await getFindUserInfoListPage({
          current: 1,
          size: 10,
          userName: this.formData.rmUserno
        });
 
        if (res && res.body) {
           this.$set(this.formData,'rmRealName',res.body.userRealName)
           this.$set(this.formData,'rmEmail',res.body.email)
           this.$set(this.formData,'belongDepName',res.body.depName)
          // this.formData.userRealName = ;
          // this.formData.rmEmail = res.body.email;
          // this.formData.belongDepName = res.body.depName;
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.f-w-340 {
  width: 340px;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
</style>