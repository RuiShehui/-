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
      <el-form-item label="開戶日期" prop="submitDate">
        <el-date-picker
          class="f-w-270"
          v-model="mySubmitForm.submitDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          :picker-options="pickOptions"
          range-separator="~"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="客戶經理團隊" prop="accountManagerTeam">
        <el-select
          class="f-w-270"
          v-model="mySubmitForm.accountManagerTeam"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
          @change="teamChange"
        >
          <el-option
            v-for="(item,index) in accountManagerTeamList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客戶經理名稱" prop="accountManagerName">
        <el-select class="f-w-270" v-model="mySubmitForm.accountManagerName" placeholder="請選擇">
          <el-option
            v-for="(item,index) in accountManagerNameList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申請表遞交日期" prop="applicationDate">
        <el-date-picker
          class="f-w-270"
          v-model="mySubmitForm.applicationDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="請選擇"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="狀態" prop="state">
        <el-select
          class="f-w-270"
          v-model="mySubmitForm.state"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
        >
          <el-option
            v-for="(item,index) in statusList"
            :key="index"
            :label="item.state"
            :value="item.value"
          ></el-option>
        </el-select>
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
    <el-button @click="downLoad">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <!-- 列表数据区 -->
    <el-table
      :data="mySubData"
      style="width: 100%"
      class="m-t-20"
      height="550px"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="accountOpenDate" label="開戶日期" min-width="120"></el-table-column>
      <el-table-column prop="applicationDate" label="申請表遞交日期" min-width="150"></el-table-column>
      <el-table-column prop="accountManagerTeam" label="客戶經理團隊" min-width="150"></el-table-column>
      <el-table-column prop="accountManagerName" label="客戶經理名稱（如有）" min-width="150"></el-table-column>
      <el-table-column prop="entEglsName" label="客戶名稱" min-width="120"></el-table-column>
      <el-table-column label="個人類型" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.entType === '1' ? 'SA個人' : 'MAM個人'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="entType" label="个人类型" min-width="120"></el-table-column> -->
      <el-table-column prop="ebankCstmNo" label="個人網銀客戶號" min-width="150"></el-table-column>
      <el-table-column prop="state" label="狀態（30天/90天）" min-width="150"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>

    <!-- 分页区 -->

    <div class="g-bolck">
      <div class="total">
        <span>SA個人：{{countSA}}</span>
        <span style="margin-left: 10px">MAM個人：{{countMAM}}</span>
        <span style="margin-left: 10px">總計：{{total}}</span>
      </div>
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import FormButton from '@/components/common/FormButton.vue';
import {
  noStartQueryList,
  noStartDownload,
  selectManagerName,
  selectManagerTeam
} from '@/api/statiscal-query';
import { downUrl } from '@/utils/downLoadTools';
import CONSTANTS from '@/utils/constant.js';
import dateTools from '@/utils/dateTools';
const { getPreMonthDay, getDateStr, formatDate } = dateTools;
function getMonth(date) {
  const dateArr = date.split('-');
  let yearNum = parseInt(dateArr[0]);
  let monthNum = parseInt(dateArr[1]);
  if (monthNum - 1 < 1) {
    monthNum = monthNum + 11;
    --yearNum;
  } else {
    monthNum = monthNum - 1;
  }
  return new Date(`${yearNum}-${monthNum}`);
}
function getLastMonth() {
  let date = formatDate(new Date());
  const dateArr = date.split('-');
  return [
    getMonth(`${dateArr[0]}-${dateArr[1]}`),
    new Date(
      new Date(`${dateArr[0]}-${dateArr[1]}-01`).getTime() - 1000 * 24 * 3600
    )
  ];
}
const initDate = getLastMonth();
const endDate = formatDate(initDate[1]);
const startDate = formatDate(initDate[0]);

export default {
  components: {
    FormButton
  },
  watch: {
    'mySubmitForm.submitDate': {
      handler(val) {
        this.mySubmitForm.startTime = val[0];
        this.mySubmitForm.endTime = val[1];
      }
    }
  },
  data() {
    return {
      mySubmitForm: {
        accountManagerTeam: '', //客户经理团队
        state: '', //状态
        accountManagerName: '', //客户经理名称
        submitDate: [startDate, endDate], //开户日期
        applicationDate: '', //申请表递交日期
        startTime: startDate,
        endTime: endDate
      },
      min: '',
      pickOptions: {
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
              time.getTime() > Date.now() - 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      },

      //客户经理团队数组
      accountManagerTeamList: [],
      //状态数组
      statusList: [
        {
          state: '全部',
          value: ''
        },
        {
          state: '30天',
          value: '30'
        },
        {
          state: '90天',
          value: '90'
        }
      ],
      //客户经理名称数组
      accountManagerNameList: [],
      mySubData: [],
      countSA: 0,
      countMAM: 0,
      total: 0,
      current: 1,
      size: 10
    };
  },
  async created() {
    //客户经理团队
    // this.accountManagerTeamList = CONSTANTS.ACCOUNT_MANAGER_TEAM_LIST;
    let params = { menuCode: 'TJCX005' };
    const res = await selectManagerTeam(params);
    // console.log('res:',res);
    this.accountManagerTeamList = res.body.teamList;
    this.queryAuthsInManagmentInit();
    this.querytManagerTeam();
  },
  methods: {
    //查询
    async queryAuthsInManagmentInit() {
      let params = {
        ...this.mySubmitForm,
        current: this.current,
        size: this.size
      };
      const result = await noStartQueryList(params);
      console.log('result:', result);
      if (result && result.body) {
        this.mySubData = result.body.notStratUsingCyberBankCustomers.list;
        this.total = result.body.num;
        this.countSA = result.body.saNum;
        this.countMAM = result.body.mamNum;
      } else {
        this.total = 0;
        this.mySubData = [];
      }
    },
    //查询客户经理姓名
    querytManagerTeam() {
      this.accountManagerNameList = [];
      selectManagerName({
        accountManagerTeam: this.mySubmitForm.accountManagerTeam
      }).then(resp => {
        this.accountManagerNameList = resp.body.teamList;
      });
    },
    //选择切换项目经理团队
    teamChange() {
      this.querytManagerTeam();
    },
    //查询
    query() {
      this.current = 1;
      this.queryAuthsInManagmentInit();
    },
    //重置
    handleReset() {
      this.$refs['mySubmitFormRef'].resetFields();
      console.log(this.mySubmitForm);
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.queryAuthsInManagmentInit();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryAuthsInManagmentInit();
    },
    async downLoad() {
      let params = {
        ...this.mySubmitForm,
        current: this.current,
        size: this.size
      };
      const result = await noStartDownload(params);
      if (result && result.body) {
        downUrl(result.body.url);
      }
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
.g-bolck {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 20px;
  .total {
    span:not(:nth-of-type(1)) {
      margin-left: 20px;
    }
  }
}
::v-deep .el-pagination {
  text-align: right;
}
</style>