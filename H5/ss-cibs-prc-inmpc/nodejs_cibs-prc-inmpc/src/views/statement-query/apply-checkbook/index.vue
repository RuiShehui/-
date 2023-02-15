
<template>
  <div class="contain">
    <el-form
      :model="queryData"
      class="transverse-form"
      label-width="auto"
      ref="formRef"
      label-suffix=":"
      label-position="right"
    >
      <!-- 机构名称 -->
      <el-form-item :label="$t('STATEMENT_QUERY.COMPANY_TYPE')" prop="companyType">
        <el-select v-model="queryData.companyType" placeholder="請選擇" class="f-w-270">
          <el-option label="演示銀行" value="0"></el-option>
          <el-option label="香港銀行" value="1"></el-option>
        </el-select>
      </el-form-item>
      <!-- 交易日期 -->
      <el-form-item label="交易日期" class="g-project" prop="startStopTime">
        <el-date-picker
          class="f-w-270"
          v-model="queryData.startStopTime"
          type="daterange"
          :clearable="false"
          :picker-options="pickOptions"
          range-separator="-"
          :start-placeholder="$t('AUTHORIZATION_CENTER.START_DATE')"
          :end-placeholder="$t('AUTHORIZATION_CENTER.END_DATE')"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="客戶經理團隊" prop="accountManagerTeam">
        <el-select
          class="f-w-270"
          v-model="queryData.accountManagerTeam"
          :placeholder="$t('COMMON.PLEASE_SELECT')"
         
        >
          <el-option
            v-for="(item,index) in accountManagerTeamList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            :show-add="false"
            @submit="search"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 下载 -->
    <el-button @click="downLoad">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <el-table
      height="550px"
      class="m-t-20"
      :data="tableData"
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <!-- 交易日期 -->
      <el-table-column :label="$t('STATEMENT_QUERY.SEND_TIME')" prop="sendTime"></el-table-column>
      <!-- 交易账户 -->
      <el-table-column :label="$t('STATEMENT_QUERY.ACCOUNTNO')" prop="accountNo"></el-table-column>
      <!-- 币种-->
      <el-table-column :label="$t('STATEMENT_QUERY.CCY')" prop="ccy"></el-table-column>
      <!-- 提交日期 -->
      <el-table-column :label="$t('STATEMENT_QUERY.SUBMIT_TIME')" prop="submitDate"></el-table-column>
      <!-- 提交时间-->
      <el-table-column :label="$t('STATEMENT_QUERY.SUBMINT_DATE')" prop="submitTime"></el-table-column>
      <!-- 领取方式 -->
      <el-table-column :label="$t('STATEMENT_QUERY.RECEIVE_METHOD')" prop="receiveMethod"></el-table-column>
      <!-- 领取数量 -->
      <el-table-column :label="$t('STATEMENT_QUERY.RECEIVE_NUMBER')" prop="receiveNumber"></el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <!-- 合计 -->
    <div class="g-bolck">
      <div class="total">
        <span>{{$t('STATEMENT_QUERY.TOTAL')}}：{{total}}</span>
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
import filters from '@/filters/clientManage';
import FormButton from '@/components/common/FormButton.vue';
import { checkApplyQuery, checkApplyDownload } from '@/api/apply-checkbook';
import {selectManagerTeam  } from '@/api/statiscal-query';

import { downUrl } from '@/utils/downLoadTools';
import dateTools from '@/utils/dateTools';
const { getPreMonthDay, getDateStr } = dateTools;
const endDate = getDateStr(new Date(), -1);
const startDate = getPreMonthDay(endDate, 1);
export default {
  name: 'ApplyCheckBook',
  filters,
  components: {
    FormButton
  },
  data() {
    return {
      current: 1,
      size: 10,
      total: 0,
      queryData: {
        companyType: '',
        startStopTime: [startDate, endDate],
        startTime: startDate,
        endTime: endDate,
        accountManagerTeam: '', //客户经理团队

      },
      //客户经理团队数组
      accountManagerTeamList: [],
      tableData: [],
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
      }
    };
  },
  async created() {
    this.queryList();
    let params ={menuCode:'TJCX003'}
    const res=await selectManagerTeam(params)
    this.accountManagerTeamList =res.body.teamList

  },
  watch: {
    'queryData.startStopTime': {
      handler(val) {
        this.queryData.startTime = val[0];
        this.queryData.endTime = val[1];
      }
    }
  },
  methods: {
    //初始化时间　默认查询近一个月的记录
    async queryList() {
      let params = {
        ...this.queryData,
        current: this.current,
        size: this.size,
        organName: this.queryData.accountManagerTeam
      };
      const result = await checkApplyQuery(params);
      if (result && result.body) {
        this.tableData = result.body.checkStatisticsList.list;
        this.total = result.body.num;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.queryList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.queryList();
    },
    search() {
      // 发起查询请求
      this.current = 1;
      this.queryList();
    },
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    async queryOperatorPage() {},
    //下载
    async downLoad() {
      let params = {
        ...this.queryData,
        current: this.current,
        size: this.size
      };
      console.log('params', params);
      const result = await checkApplyDownload(params);
      if (result && result.body) {
        downUrl(result.body.url);
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
.m-t-20 {
  margin-top: 20px;
}
</style>