<!--
 * @Author: zhangcheng
 * @Date: 2022-06-17 17:00:11
 * @LastEditTime: 2022-09-22 20:55:33
 * @LastEditors: zhangcheng
 * @Description: 公司客户销售报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\compony-customer-salesman\index.vue
-->

<template>
  <div class="contain">
    <el-form
      :model="queryData"
      class="transverse-form"
      label-width="110px"
      ref="formRef"
      label-suffix=":"
      label-position="right"
    >
      <!-- 交易日期 -->
      <el-form-item label="開戶日期" prop="submitDate">
        <el-date-picker
          class="f-w-270"
          v-model="queryData.startStopTime"
          type="daterange"
          range-separator="~"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <!-- 客户经理团队 -->
      <el-form-item label="客戶經理團隊" prop="accountManagerTeam">
        <el-select
          　v-model="queryData.accountManagerTeam"
          @change="querytManagerTeam"
          class="f-w-270"
        >
        <!-- todo -->
          <!-- <el-option
            v-for="(item,index) in accountManagerTeamList"
            :key="index"
            :label="item.accountManagerTeam"
            :value="item.value"
          ></el-option> -->
          <el-option
            v-for="(item,index) in accountManagerTeamList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 客户经理名称 -->
      <el-form-item label="客戶經理名稱" prop="accountManagerName">
        <el-select 　v-model="queryData.accountManagerName" class="f-w-270">
          <el-option
            v-for="(item,index) in accountManagerNameList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 申请表递交日期 -->
      <el-form-item label="申請表遞交日期" prop="applyDate">
        <el-date-picker
          class="f-w-270"
          v-model="queryData.applyDate"
          type="date"
          value-format="yyyy/MM/dd"
          placeholder="請選擇"
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
    <el-button  @click="customerSelectDownload">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <el-table
      height="550px"
      class="m-t-20"
      :data="tableData"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <!-- 开户日期 -->
      <el-table-column label="開戶日期" prop="openDate"></el-table-column>
      <!-- 申请表递交日期 -->
      <el-table-column label="申請表遞交日期" prop="applyDate"></el-table-column>
      <!--客户经理团队-->
      <el-table-column label="客戶經理團隊" prop="accountManagerTeam"></el-table-column>
      <!--客户经理名称（如有）-->
      <el-table-column label="客戶經理名稱（如有）" width="160" prop="accountManagerName"></el-table-column>
      <!-- 客户名称 -->
      <el-table-column label="客戶名稱" prop="entEglsName"></el-table-column>
      <!-- 个人类型 -->
      <el-table-column label="個人類型" prop="entType">
        <template slot-scope="scope">
          <span>{{scope.row.entType === '1' ? 'SA個人' : 'MAM個人'}}</span>
        </template>
      </el-table-column>
      <!-- 个人网银客户号 -->
      <el-table-column label="個人網銀客戶號" prop="ebankCstmNo"></el-table-column>
      <!-- 用户编号 -->
      <el-table-column label="用戶編號" prop="userCode"></el-table-column>
      <!-- 打印密码日期 -->
      <el-table-column label="打印密碼日期" prop="printPwdDate"></el-table-column>
      <!-- 最后登录时间 -->
      <el-table-column label="最後登錄時間" prop="endLoginDate"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import filters from '@/filters/clientManage';
import FormButton from '@/components/common/FormButton.vue';
import { downUrl } from '@/utils/downLoadTools';
import {
  customerSelect,
  customerSelectDownload,
  selectManagerName,
  selectManagerTeam
} from '@/api/statiscal-query';
import dateTools from '@/utils/dateTools';
const { getPreMonthDay, getDateStr,formatDate } = dateTools;
function getMonth(date){
  const dateArr = date.split('-')
  let yearNum = parseInt(dateArr[0])
  let monthNum = parseInt(dateArr[1])
  if(monthNum-1<1){
    monthNum = monthNum + 11
    --yearNum
  }else{
     monthNum = monthNum-1
  }
  return new Date(`${yearNum}-${monthNum}`)
}
function getLastMonth(){
  let date = formatDate(new Date())
  const dateArr = date.split('-')
  return [getMonth(`${dateArr[0]}-${dateArr[1]}`), new Date(new Date(`${dateArr[0]}-${dateArr[1]}-01`).getTime()-1000*24*3600)]
}
const initDate = getLastMonth()
const endDate = formatDate(initDate[1])
const startDate = formatDate(initDate[0])
import CONSTANTS from '@/utils/constant.js';
export default {
  name: 'UserMaintain',
  filters,
  components: {
    FormButton
  },
  watch: {
    'queryData.startStopTime': {
      handler(val) {
        this.queryData.openStartDate = val[0];
        this.queryData.openEndDate = val[1];
      }
    }
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 0,
      queryData: {
        submitDate: '', //开户日期,
        accountManagerTeam: '', //客户经理团队
        accountManagerName: '', //客户经理名称
        applyDate: '', //申请表递交日期
        startStopTime: [startDate, endDate],
        openStartDate: startDate,
        openEndDate: endDate
      },
      pickerOptions: {
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
      tableData: [],
      accountManagerNameList: [], //客户经理名称
      accountManagerTeamList: [] //客户经理团队
    };
  },
 async created() {
    console.log(initDate)
    //客户经理团队
    // this.accountManagerTeamList = CONSTANTS.ACCOUNT_MANAGER_TEAM_LIST;
    let params={menuCode:'55555004'}
    const res=await selectManagerTeam(params)
    console.log('res:',res);
    this.accountManagerTeamList =res.body.teamList
    this.queryList();
    this.querytManagerTeam();
  },
  methods: {
    //查询
    queryList() {
      let params = {
        ...this.queryData,
        pageNum: this.current,
        pageSize: this.size
      };
      console.log('params', params);
      customerSelect(params).then(resp => {
        console.log('resp', resp);
        this.tableData = resp.body.list;
        this.total = resp.body.total;
      });
    },

    //查询客户经理姓名
    querytManagerTeam() {
      this.accountManagerNameList = [];
      this.queryData.accountManagerName = '';
      selectManagerName({
        accountManagerTeam: this.queryData.accountManagerTeam
      }).then(resp => {
        this.accountManagerNameList = resp.body.teamList;
      });
    },

    handleSizeChange(val) {
      this.current = 1;
      this.size = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryList();
    },
    query() {
      this.current = 1;
      this.queryList();
    },
    handleReset() {
      this.queryData.startStopTime=[startDate, endDate]
      this.$refs['formRef'].resetFields();
    },
    async customerSelectDownload() {
      let params = {
        ...this.queryData,
        pageNum: this.current,
        pageSize: this.size
      };
      const result = await customerSelectDownload(params);
      if (result && result.body) {
        downUrl(result.body);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
}
.g-bolck {
  text-align: right;
  margin-top: 10px;
  padding: 0 10px;
}
.f-w-270 {
  width: 270px;
}
.f-w-110 {
  width: 127px;
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
.m-t-20 {
  margin-top: 20px;
}
</style>