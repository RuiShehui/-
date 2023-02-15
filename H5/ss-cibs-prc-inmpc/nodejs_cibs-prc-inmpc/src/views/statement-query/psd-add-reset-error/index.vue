<!--
 * @Author: ZhangZhen
 * @Date: 2022-06-08 11:32:42
 * @LastEditTime: 2022-08-11 14:11:50
 * @LastEditors: zhangcheng
 * @Description: 密码生成/重置异常报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\psd-add-reset-error\index.vue
-->
<template>
  <div class="contain">
    <!-- 查询区 -->
    <el-form class="transverse-form" ref="formRef" :model="mySubmitForm" label-width="auto">
      <el-form-item label="個人類型:" prop="entType">
        <el-select class="g-w-270" v-model="mySubmitForm.entType" placeholder="全部">
          <el-option
            v-for="(item,index) in entTypeList"
            :key="index"
            :label="item.value"
            :value="item.entType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道:" prop="chnnel">
        <el-select class="g-w-270" v-model="mySubmitForm.chnnel" placeholder="全部">
          <el-option
            v-for="(item,index) in channelList"
            :key="index"
            :label="item.value"
            :value="item.chnnel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="個人網銀客戶號:" prop="ebankCstmNo">
        <el-input class="g-w-270" v-model="mySubmitForm.ebankCstmNo" placeholder="請輸入"></el-input>
      </el-form-item>
      <el-form-item label="生成/重置異常日期:" prop="transDate">
        <el-date-picker
          class="g-w-270"
          v-model="mySubmitForm.transDate"
          type="daterange"
          range-separator
          :picker-options="pickOptions"
          value-format="yyyy-MM-dd"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button
            style="float:right;width:196px"
            @submit="search"
            @handleReset="handleReset"
            :showAdd="false"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-button size="w70" @click="downLoad">下載</el-button>
    <!-- 列表数据区 -->
    <el-table
      :data="tableData"
      class="mt-20"
      height="550px"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column width="120px" prop="entType" label="個人類型">
        <template v-slot="{row}">{{ entTypeFilter(row.entType) }}</template>
      </el-table-column>
      <el-table-column width="130px" prop="ebankCstmNo" label="個人網銀客戶號"></el-table-column>
      <el-table-column width="130px" prop="type" label="操作類別">
        <template v-slot="{row}">{{ typeFilter(row.type) }}</template>
      </el-table-column>
      <el-table-column width="150px" prop="errorReason" label="錯誤/拒絕原因"></el-table-column>
      <el-table-column width="150px" prop="entEglsName" label="客戶名稱"></el-table-column>
      <el-table-column width="110px" prop="userType" label="用戶類型">
        <template v-slot="{row}">{{ userTypeFilter(row.userType) }}</template>
      </el-table-column>
      <el-table-column width="150px" prop="loginName" label="用戶名"></el-table-column>
      <el-table-column width="100px" prop="chnnel" label="渠道">
        <template v-slot="{row}">{{ chnnelFilter(row.chnnel) }}</template>
      </el-table-column>
      <el-table-column width="150px" prop="operator" label="操作員"></el-table-column>
      <el-table-column width="160px" prop="resetDate" label="生成/重置異常日期"></el-table-column>
      <el-table-column width="160px" prop="resetTime" label="生成/重置異常時間"></el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>
    <!-- 分页区 -->
    <div class="g-bolck">
      <div>SA個人：{{saNum}} MAM個人：{{mamNum}} 總計：{{total}}</div>
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,prev,pager,next,jumper"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      />
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
const { getDateStr } = dateTools;
const initDate = getDateStr(new Date(), -1);
import FormButton from '@/components/common/FormButton.vue';
import { downUrl } from '@/utils/downLoadTools';
import {
  resetPwdErrorReport,
  downloadResetPwdErrorReport
} from '@/api/apply-checkbook';
export default {
  name: 'ResetPassword',
  components: {
    FormButton
  },
  watch: {
    'mySubmitForm.transDate': {
      handler(val) {
        this.mySubmitForm.startDate = val[0];
        this.mySubmitForm.endDate = val[1];
      }
    }
  },
  data() {
    return {
      mySubmitForm: {
        entType: '',
        ebankCstmNo: '',
        chnnel: '',
        transDate: [initDate, initDate],
        startDate: initDate,
        endDate: initDate
      },
      entTypeList: [
        {
          entType: '1',
          value: 'SA個人'
        },
        {
          entType: '2',
          value: 'MAM個人'
        }
      ],
      channelList: [
        {
          chnnel: '1',
          value: '內管'
        },
        {
          chnnel: '2',
          value: '網銀端'
        }
      ],
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
          // console.log('time----', time);
        }
      },
      current: 1,
      size: 10,
      total: 0,
      saNum: 0,
      mamNum: 0,
      endTime: '',
      startTime: ''
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    // 查询
    search() {
      // this.current = 1;
      this.queryList();
    },
    queryList() {
      let params = {
        ...this.mySubmitForm,
        current: this.current,
        pagesize: this.size
      };
      resetPwdErrorReport(params).then(res => {
        this.tableData = res.body.resetPwdDtosList.list;
        this.total = res.body.total || 0;
        this.saNum = res.body.satotal || 0;
        this.mamNum = res.body.mamtotal || 0;
      });
    },
    // 重置
    handleReset() {
      this.$refs['formRef'].resetFields();
    },
    entTypeFilter(val) {
      switch (val) {
        case '1':
          return 'SA個人';
        case '2':
          return 'MAM個人';
        default:
          return val;
      }
    },
    userTypeFilter(val) {
      switch (val) {
        case '1':
          return '管理員';
        case '2':
          return '授權員';
        case '3':
          return '錄入員';
        default:
          return val;
      }
    },
    typeFilter(val) {
      switch (val) {
        case '0':
          return '打印密碼信封';
        case '1':
          return '發送啟動碼郵件';
        default:
          return val;
      }
    },
    chnnelFilter(val) {
      switch (val) {
        case '1':
          return '內管';
        case '2':
          return '網銀';
        default:
          return val;
      }
    },
    // 改变页面条数
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.search();
    },
    // 改变页码
    handleCurrentChange(val) {
      this.current = val;
      this.search();
    },
    // 下载
    async downLoad() {
      const result = await downloadResetPwdErrorReport({
        ...this.mySubmitForm,
        current: this.current,
        pagesize: this.size
      });
      if (result && result.body) {
        downUrl(result.body);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  min-width: 600px;
  background: #fff;
  min-height: 100%;
  padding: 32px 24px;
  box-sizing: border-box;
  .transverse-form {
    display: flex;
    flex-wrap: wrap;
    .g-w-270 {
      width: 270px;
    }
    .el-form-item {
      display: flex;
      margin-right: 40px;
      ::v-deep .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
  .mt-20 {
    margin-top: 20px;
  }
  .g-bolck {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px 10px;
  }
}
</style>