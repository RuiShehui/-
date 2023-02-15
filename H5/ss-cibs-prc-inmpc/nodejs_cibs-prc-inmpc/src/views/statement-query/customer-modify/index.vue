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
    <el-table :data="mySubData" border style="width: 100%"
      class="m-t-40"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}">
      <el-table-column prop="coustNo" label="个人网银客户号" min-width="150"></el-table-column>
      <el-table-column prop="applyDate" label="个人类型" min-width="120"></el-table-column>
      <el-table-column prop="tradeType" label="证件类型" min-width="120"></el-table-column>
      <el-table-column prop="authStatus" label="证件号码" min-width="120"></el-table-column>
      <el-table-column prop="customerName" label="证件签发地/国家" min-width="150"></el-table-column>
      <el-table-column prop="enterpriseType" label="客户名称" min-width="120"></el-table-column>
      <el-table-column prop="adress" label="地址" min-width="120"></el-table-column>
      <el-table-column prop="phone" label="联络电话" min-width="120"></el-table-column>
      <el-table-column prop="email" label="电邮地址" min-width="120"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
      <el-table-column prop="applyDate" label="申请日期" min-width="120"></el-table-column>
      <el-table-column prop="accountDate" label="开户日期" min-width="120"></el-table-column>
      <el-table-column prop="accountTime" label="开户时间" min-width="120"></el-table-column>
      <el-table-column label="账户信息" min-width="120">
        <template slot-scope="scope">
          <el-button @click="detailAccount(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" min-width="120">
        <template slot-scope="scope">
          <el-button @click="detailBtn(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="accountInfo" label="账户信息" min-width="10%"></el-table-column>
      <el-table-column prop="userInfo" label="用户信息" min-width="10%"></el-table-column>-->
    </el-table>
    <div style="margin-top: 10px">
      <span>总计：1</span>
    </div>
    <!-- 分页区 -->
    <el-pagination
       class="m-t-20"
     :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
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
          coustNo: '',
          applyDate: '',
          tradeType: '',
          authStatus: '',
          customerName: '',
          enterpriseType: '',
          adress: '',
          phone: '',
          email: '',
          remark: '',
          accountDate: '',
          accountTime: ''
        }
      ],
     
     // 分页
        current: 1,
        size: 10
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
    detailAccount(row){
      let jsonRow = JSON.stringify(row);
      this.$router.push({
        path: '/customer-open-statement/account-detail',
        query: {
          row,
          waitAuth: true
        }
      });
    },
    detailBtn(row) {
      let jsonRow = JSON.stringify(row);
      this.$router.push({
        path: '/customer-open-statement/user-detail',
        query: {
          row,
          waitAuth: true
        }
      });
    },
      handleSizeChange(val) {
      this.size = val;
      // this.queryList();
    },
    handleCurrentChange(val) {
      this.current = val;
      // this.queryList();
    },
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
  text-align:right !important;
}
</style>