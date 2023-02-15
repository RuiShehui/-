<template>
  <div class="waitAuth">
    <!-- 查询区 -->
    <el-form
      ref="mySubmitFormRef"
      :model="mySubmitForm"
      label-width="auto"
      class="transverse-form"
      label-suffix=":"
      label-position="right"
    >
      <el-form-item label="个人网银客户号" prop="tradeType">
        <el-input class="f-w-270" v-model="mySubmitForm.custNo" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="个人类型" prop="authStatus">
        <el-select class="f-w-270" v-model="mySubmitForm.authStatus" placeholder="请选择授权状态">
          <el-option
            v-for="(item,index) in authStatusList"
            :key="index"
            :label="item.authStatus"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开户日期" prop="subDate">
        <el-date-picker
          class="f-w-270"
          v-model="mySubmitForm.submitDate"
          type="daterange"
         range-separator="~"
          value-format="yyyy/MM/dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            :show-add="false"
            @submit="query"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 下载 -->
    <el-button class="m-t-20">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <!-- 列表数据区 -->
    <el-table
      :data="mySubData"
      border
      style="width: 100%"
      class="m-t-40"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="coustNo" label="序号" min-width="120"></el-table-column>
      <el-table-column prop="applyDate" label="账户名称" min-width="120"></el-table-column>
      <el-table-column prop="tradeType" label="账户号码" min-width="120"></el-table-column>
      <el-table-column prop="authStatus" label="账户类别" min-width="120"></el-table-column>
      <el-table-column prop="customerName" label="本人账户/第三者账户" min-width="150"></el-table-column>
      <el-table-column prop="enterpriseType" label="第三方转账限额" min-width="150"></el-table-column>
    </el-table>
    <div style="display: table; margin: 40px auto 0">
      <el-button class="m-t-back" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
import FormButton from '@/components/common/FormButton.vue';
// import { queryAuthsInManagment } from '@/api/authorizeCenter';
export default {
  components: {
    FormButton
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
    // this.queryAuthsInManagmentInit();
  },
  methods: {
    queryAuthsInManagmentInit() {
      let params = {
        businessCode: [],
        current: 1,
        flowNo: '',
        gcAuthQueue: {
          authState: '',
          authStatePk: 0,
          authType: '',
          businessCode: '',
          createTime: '',
          cstmNo: '',
          current: 1,
          flowNo: '',
          size: 10,
          state: '',
          tmpelateCode: '',
          updateTime: '',
          userCode: '',
          userLevel: 0,
          userLevelNum: 0
        },
        size: 10,
        userCode: ''
      };

      queryAuthsInManagment(params).then(res => {
        res.map((item, index) => {
          this.mySubData.push({
            serialNo: item.flowNo,
            busType: item.transactionType,
            operType:
              item.operationType == 1
                ? '新增'
                : item.operationType == 2
                ? '修改'
                : '删除'
          });
        });

        console.log('管理员未授权数据', res, this.mySubData);
      });
    },
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
      this.$router.go(-1);
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