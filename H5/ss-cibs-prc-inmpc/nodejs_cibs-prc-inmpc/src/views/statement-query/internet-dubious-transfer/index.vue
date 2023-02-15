<!--
 * @Author: zhutao
 * @Date: 2022-06-17 17:00:11
 * @LastEditTime: 2022-06-23 16:21:37
 * @LastEditors: Please set LastEditors
 * @Description: 网上银行每日可疑交易报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\customer-transaction-report\index.vue
-->
<template>
  <div class="waitAuth">
    <!-- 查询区 -->
    <el-form
      ref="mySubmitFormRef"
      :model="mySubmitForm"
      label-width="110px"
      class="transverse-form"
      label-suffix=":"
      label-position="right"
    >
      <el-form-item label="分行号" prop="tradeType">
        <el-input class="f-w-270" v-model="mySubmitForm.custNo" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="个人类型" prop="authStatus">
        <el-select class="f-w-270" v-model="mySubmitForm.authStatus" placeholder="全部">
          <el-option
            v-for="(item,index) in authStatusList"
            :key="index"
            :label="item.authStatus"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="个人网银客户号" prop="subDate">
         <el-input class="f-w-270" v-model="mySubmitForm.custNo" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="交易日期" prop="subDate">
        <el-date-picker
          class="f-w-270"
          v-model="mySubmitForm.channel"
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
      <el-table-column prop="coustNo" fixed label="分行号" min-width="150"></el-table-column>
      <el-table-column prop="applyDate" label="个人类型" min-width="120"></el-table-column>
      <el-table-column prop="tradeType" label="个人网银客户号" min-width="150"></el-table-column>
      <el-table-column prop="authStatus" label="交易日期" min-width="150"></el-table-column>
      <el-table-column prop="customerName" label="交易时间" min-width="150"></el-table-column>
      <el-table-column prop="enterpriseType" label="交易类型" min-width="120"></el-table-column>
      <el-table-column prop="adress" label="可疑场景ID" min-width="120"></el-table-column>
      <el-table-column prop="phone" label="账户号码" min-width="120"></el-table-column>
      <el-table-column prop="email" label="金额" min-width="120"></el-table-column>
      <el-table-column prop="remark" label="Follow Up" min-width="120"></el-table-column>
    </el-table>
    <div class="u-total" style="margin-top: 10px">
      <span>分行号：22 总计：1000</span>
      <span>分行号：22 总计：1000</span>
      <span>分行号：22 总计：1000</span>
      <span>总计：3</span>
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
  name: 'CustomerTransactionReport',
  components: {
    FormButton
  },
  data() {
    return {
      mySubmitForm: {
        custNo: '',
        authStatus: '02',
        submitDate: '',
        channel: ''
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
      channelList: [
        {
          channel: '全部',
          value: ''
        },
        {
          channel: '渠道1',
          value: '01'
        },
        {
          channel: '渠道2',
          value: '02'
        }
      ],
      mySubData: [
        {
          coustNo: '12/02/2021',
          applyDate: '12:03:32',
          tradeType: '1398737422',
          authStatus: '',
          customerName: '3723626318291317',
          enterpriseType: 'COMPANY',
          adress: '登录',
          phone: '/',
          email: '/',
          remark: '/',
          // applyDate: '/',
          accountDate: '/',
          accountTime: '/',
          accountInfo: '/',
          fa: '',
          bill: '',
          codeFlag: '',
          fiExeDate: '',
          fiNo: '',
          fiEmail: '',
          channel: 'MB'
        }
      ],
      numData: [
        {
          transactionNo: 'WBCSON01',
          traType: '登录',
          IBCount: '100',
          MBCount: '100',
          allCount: '200'
        }
      ],
      // 分页
      current: 1,
      size: 10,
      total:1
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
    detailBtn(row) {
      // let jsonRow = JSON.stringify(row);

      this.$router.push({
        path: '/_businessManagement/authorizeCenter/detail',
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
  .el-table {
    margin-top: 24px;
  }
  .flexc {
    // float: right;
    // justify-content: normal;
    margin-top: 2px;
  }
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
.g-w-270 {
  width: 270px;
}
.g-bolck {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  // margin-top: 32px;
  padding: 32px 20px 20px;
}
.mt-40 {
  margin-top: 40px;
}
.u-total{
  margin-top: 24px;
  display: flex;
  flex-direction: column;
}
</style>