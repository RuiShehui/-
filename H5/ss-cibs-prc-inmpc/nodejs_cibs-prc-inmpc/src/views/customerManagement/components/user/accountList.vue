<!--
 * @Author: your name
 * @Date: 2022-10-10 11:26:10
 * @LastEditTime: 2022-11-15 12:00:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nodejs_cibs-prc-inmpc\src\views\customerManagement\components\user\accountList.vue
-->
<template>
  <div>
    <div class="divider">
      <div class="bill"></div>
      <div class="title">賬戶選擇設置</div>
      <slot />
    </div>
    <div class="accountSelectAll" style="background: #f3f3f3;height:46px;,margin-top:20px">
      <el-checkbox style="margin-top: 20px; margin-left: 13px;" v-model="allChecked" @change="selectAll">全選</el-checkbox>
    </div>
    <div  style="overflow: auto">
      <div class="p-checkBox" v-for="(item, index) in PopAccount" :key="index" style="margin:12px">
        <el-checkbox
          class="accountCheck"
          v-model="item.checked"
          :disabled="item.disabled"
          @change="selectChecked"
        >{{item.accName}}</el-checkbox>
      </div>
    </div>
      <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
      <!-- <el-button
        class="f-reset"
        @click="handleReset('userInfo')"
      >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button> -->
      <el-button type="primary" @click="submit">{{$t('CUSTOMER_MANAGEMENT.SUBMIT')}}</el-button>
    </div>
  </div>
</template>

<script>
import {
  getPaymentCommAccountList,
  getCustAcctList
} from '@/api/customer-management/customer';
import { deepClone } from '@/utils/tree-table.js';
import filter from '@/filters/public.js';
export default {
  props: {
    showLoginName: {
      type: Boolean,
      default: false
    }, // 是否修改
    userCode: {
      type: String,
      default: ''
    }, // 查询条件

    //客户号
    ebankCstmNo: {
      type: String,
      default: ''
    },
    //判断客户号类型——sa/mam
    entType: {
      type: String,
      default: ''
    },
    detailData: {
      type: Object,
      default() {
        return {};
      }
    } //传入数据
  },
  filter: {
    ccyFilter: filter.ccyFilter,
    accountType: filter.accountType,
    formatBankNo: filter.formatBankNo
  },
  data() {
    return {
      PopAccount: [],
      allChecked: false
    };
  },
  created() {
   
     this.getAccountList();
  
    
  },
  mounted(){
     console.log(JSON.parse(JSON.stringify(this.PopAccount)),'PopAccount')
  },
  methods: {
    selectAll() {
      let flag =false
      this.PopAccount.forEach(item => {
        if(!item.disabled){
           item.checked = this.allChecked;
        }
       
      });
    },
    async getAccountList() {
      const res = await getCustAcctList({
        ebankCustNo: this.detailData.ebankCstmNo
      });
      let arr =[]
      res.body.accList.forEach(item => {
        if (item.currency) {
          item.accName =
            this.accountFormat(item.accNo) +
            '-' +
            this.curFilter(item.currency) +
            '-' +
            this.accountTypeFilter(item.accType);
        } else {
          item.accName =
            this.accountFormat(item.accNo) +
            '-' +
            this.accountTypeFilter(item.accType);
        }
        this.PopAccount.push(item);
      });
      // this.PopAccount = arr
      if(this.detailData.userAccountLimits.length!==0){
        let newUserLimits = this.detailData.userAccountLimits

        newUserLimits.forEach(item=>{
          this.PopAccount.forEach(type=>{
            if(item.accountNo===type.accNo){
               this.$set(type,'checked',true)
              // type.disabled = true
              this.$set(type,"disabled",true)
            }
          }) 
        })
      }
      if(this.detailData.operatorAccounts.length!==0){
        let operatorAccounts = this.detailData.operatorAccounts
        this.PopAccount.forEach(item=>{
          operatorAccounts.forEach(old=>{
            if(item.accNo ==old.accountNo){
              // item.checked = true
              this.$set(item,'checked',true)
            }
          })
        })
      }
      // this.selectChecked()
    },
    selectChecked(checked) {
      let flag =false
      // console.log(checked,'checked')
      this.PopAccount.forEach(item=>{
        if(item.checked){
          flag =true
        }
      })
      if (flag) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    curFilter(val) {
      return filter.ccyFilter(val);
    },
    accountTypeFilter(val) {
      return filter.accountType(val);
    },
    accountFormat(val) {
      return filter.formatBankNo(val);
    },
    back(){
      this.$emit('backIndex', this.detailData);
    },
    submit(){

      let newAccount=[]
      let newobj={}
      this.PopAccount.forEach(item=>{
        console.log(item,'item')
        if(item.checked){
          newobj={
            accountNo:item.accNo,
            accountType:item.accType,
            currencyType:item.currency
          }
        newAccount.push(newobj)
        }
        
      })
      this.detailData.operatorAccounts = newAccount
    

      this.$emit('handleShowDetail',this.detailData)
    }
  }
};
</script>

<style lang="scss" scoped>
.divider {
  // float:left;
  // margin: 10px 0;
  display: flex;
  // align-items: s;
  // background: #f3f3f3;
  height: 46px;
  width: 100%;
  margin-top: 36px;
  .bill {
    width: 4px;
    height: 46px;
    background: #f06b00;
    // border-radius: 8px;
  }

  .title {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
    padding-left: 10px;
    font-weight: 500;
    line-height: 46px;
    text-align: left;
  }
}
.p-checkBox{
  width: 100%;
  float: left;
  width: 30%;
  // padding: 20px;
  padding: 12px 0;
  // padding-left: 3%;
  font-size: 14px;
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
  .f-reset {
    color: rgba(0, 0, 0, 0.45);
    border-color: rgba(0, 0, 0, 0.45);
  }
}
</style>