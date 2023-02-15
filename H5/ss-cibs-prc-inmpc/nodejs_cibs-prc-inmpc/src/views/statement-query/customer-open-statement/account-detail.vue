<template>
  <div class="waitAuth">
    <!-- 列表数据区 -->
    <el-table
      :data="accountDetails"
      border
      style="width: 100%"
      class="m-t-40"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column label="序號" type="index" width="90"></el-table-column>
      <el-table-column prop="accountName" label="賬戶名稱" min-width="120"></el-table-column>
      <el-table-column prop="accountNo" label="賬戶號碼" min-width="120"></el-table-column>
      <el-table-column prop="accountType" label="賬戶類別" min-width="120"></el-table-column>
      <el-table-column prop="currencyType" label="幣種" min-width="120"></el-table-column>
      <!-- <el-table-column prop="thirdAccStatus" label="本人賬戶/第三者賬戶" min-width="150"></el-table-column> -->
      <!-- <el-table-column prop="xxx" label="第三方轉賬限額" min-width="150"></el-table-column> -->
    </el-table>
    <div style="display: table; margin: 40px auto 0">
      <el-button class="m-t-back" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
// import FormButton from '@/components/common/FormButton.vue';
// import { queryAuthsInManagment } from '@/api/authorizeCenter';
export default {
  components: {
    // FormButton
  },
  props:{
    isDetail:{ type: Boolean,default: false},
    accountDetails:{
      type:Array,
      default:()=>{
        return []
      }
    },
    ebankCstmNo:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      mySubmitForm: {
        custNo: '',
        authStatus: '02',
        submitDate: ''
      },
      min: '',
      pickerOptions: {
         onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        disabledDate: time => {
          if (this.min) {
            const m = 90 * 24 * 60 * 60 * 1000;
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now() - 24 * 3600 * 1000
            );
          }

          return time.getTime() > new Date().getTime() - 24 * 3600 * 1000;
        }
      },
      authStatusList: [
        {
          authStatus: '全部',
          value: ''
        },
        {
          authStatus: '个人类型1',
          value: '01'
        },
        {
          authStatus: '个人类型2',
          value: '02'
        },
        {
          authStatus: '个人类型3',
          value: '03'
        },
        {
          authStatus: '个人类型4',
          value: '04'
        },
        {
          authStatus: '个人类型5',
          value: '05'
        }
      ],
      mySubData: [
        {
          coustNo: '00',
          applyDate: 'JBC TRAVEL COMPANY',
          tradeType: '259-20-093287-3',
          authStatus: '1',
          customerName: '港币',
          enterpriseType: '本人账户',
          adress: '300，000.00'
        }
      ]
    };
  },
  created() {
    //默认选近一个月的日期
    let end = new Date();
    let start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.mySubmitForm.submitDate = [start, end];
    // console.log(this.accountDetails,'accountDetails')
    // this.queryAuthsInManagmentInit();
  },
  methods: {

    resetClick(mySubmitFormRef) {
      //默认选近一个月的日期
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.mySubmitForm.submitDate = [start, end];
      this.$refs[mySubmitFormRef].resetFields();
      this.$refs[mySubmitFormRef].resetFields();
    },
    queryClick() {},
    back() {
      this.$emit('back')
    },
    query(){

    },
    handleReset(){}
  }
};
</script>
<style lang="scss" scoped>
.waitAuth {
  background: #fff;
  min-width: 600px;
  padding: 32px 24px;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  .f-w-270 {
    width: 270px;
  }
  .transverse-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      display: flex;
      margin-right: 40px;
      ::v-deep .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  .m-t-40 {
    margin-top: 30px;
  }
  .m-t-20 {
    margin-top: 20px;
  }
  .m-t-back {
    background: #f06b00 !important;
    color: #fff;
    border: none;
  }
  .el-table {
    margin-top: 24px;
  }
  .flexc {
    // float: right;
    // justify-content: normal;
    margin-top: 2px;
  }
}
/deep/ .el-pagination {
  text-align: right !important;
}
</style>