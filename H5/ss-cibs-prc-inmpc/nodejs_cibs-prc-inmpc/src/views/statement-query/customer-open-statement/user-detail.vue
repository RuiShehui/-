<template>
  <div class="waitAuth">

    <!-- 列表数据区 -->
    <el-table
      :data="userDetailList"
      border
      style="width: 100%"
      class="m-t-40"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column type="index" label="序號" width="90"></el-table-column>
      <el-table-column prop="ebankCstmNO" label="個人網銀客戶號" min-width="150"></el-table-column>
      <el-table-column prop="loginName" label="用戶名" min-width="120"></el-table-column>
      <el-table-column prop="mailAddress" label="郵寄地址" min-width="120"></el-table-column>
      <!-- <el-table-column prop="customerName" label="地址类型" min-width="120"></el-table-column> -->
      <el-table-column prop="cardType" label="證件類型" min-width="120"></el-table-column>
      <el-table-column prop="cardNo" label="證件號碼" min-width="120"></el-table-column>
      <el-table-column prop="cardArea" label="證件簽發地/國家" min-width="150"></el-table-column>
      <el-table-column prop="mobilePhone" label="流動電話" min-width="120"></el-table-column>
      <el-table-column prop="email" label="電郵地址" min-width="120"></el-table-column>
      <!-- <el-table-column prop="aaa" label="申请日期" min-width="120"></el-table-column> -->
      <el-table-column prop="createTime" label="開戶日期" min-width="120"></el-table-column>
      <el-table-column prop="status" label="用戶狀態" min-width="120"></el-table-column>
    </el-table>
    <div style="display: table; margin: 40px auto 0">
          <el-button class="m-t-back"  @click="back" >返回</el-button>
      <!-- <v-button size="w120" type="primary" @click="resetClick('mySubmitFormRef')">返回</v-button> -->
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
    userDetailList:{
      type:Array,
      default:()=>{
        return []
      }
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
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ],
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过3个月的
        disabledDate: time => {
          let m = 3 * 30 * 24 * 60 * 60 * 1000;
          if (this.min) {
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
          // console.log('time----', time);
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
          coustNo: '',
          // applyDate: '10983923',
          tradeType: '',
          authStatus: '',
          customerName: '',
          enterpriseType: '',
          cardNo: '',
          address: '',
          phone: '',
          email: '',
          applyDate: '',
          accountDate: '',
          userStatus: ''
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
    // this.queryAuthsInManagmentInit();
  },
  methods: {
    // queryAuthsInManagmentInit() {
    //   let params = {
    //     businessCode: [],
    //     current: 1,
    //     flowNo: '',
    //     gcAuthQueue: {
    //       authState: '',
    //       authStatePk: 0,
    //       authType: '',
    //       businessCode: '',
    //       createTime: '',
    //       cstmNo: '',
    //       current: 1,
    //       flowNo: '',
    //       size: 10,
    //       state: '',
    //       tmpelateCode: '',
    //       updateTime: '',
    //       userCode: '',
    //       userLevel: 0,
    //       userLevelNum: 0
    //     },
    //     size: 10,
    //     userCode: ''
    //   };

    //   queryAuthsInManagment(params).then(res => {
    //     res.map((item, index) => {
    //       this.mySubData.push({
    //         serialNo: item.flowNo,
    //         busType: item.transactionType,
    //         operType:
    //           item.operationType == 1
    //             ? '新增'
    //             : item.operationType == 2
    //             ? '修改'
    //             : '删除'
    //       });
    //     });

    //     console.log('管理员未授权数据', res, this.mySubData);
    //   });
    // },
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
   back(){
    this.$emit('back')
   }
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
  .m-t-back{
    background: #f06b00 !important;
    color: #fff;
    border: none
    
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