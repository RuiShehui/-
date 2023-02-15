<template>
  <div class="m-operatorLog" v-loading="requestLoading">
    <el-form ref="statementForm" :model="statementForm" :rules="formRules">
      <!-- 账户 -->
      <el-form-item
        :label="$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TO_SEARCH')"
        prop="accountNoCCY"
        class="m-select-account"
      >
        <el-select
          v-model="statementForm.accountNoCCY"
          :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: $t('ACCOUNT_MANAGEMENT.QUERY_ACCOUNT')
                  })"
          :no-data-text="$t('ACCOUNT_MANAGEMENT.DONOT_HAS_QUERY_ACCOUNT')"
        >
          <el-option
            v-for="(item,index) in accountList"
            :key="index"
            :label="showAccountInfo(item)"
            :value="`${item.accountNo}${item.currency}`"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 交易时间 -->
      <el-form-item
        :label="$t('ACCOUNT_MANAGEMENT.TRADE_TIME')+':'"
        prop="transTime"
        class="m-timePick"
      >
        <el-date-picker
          v-model="statementForm.startDate"
          style="width:140px;"
          :clearable="false"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator
          :placeholder="$t('ACCOUNT_MANAGEMENT.STRAT_MONTH')"
          :picker-options="pickerOptionsStart"
        ></el-date-picker>
        <span class="line">-</span>
        <el-date-picker
          v-model="statementForm.endingDate"
          style="width:140px;"
          :clearable="false"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          range-separator
          :placeholder="$t('ACCOUNT_MANAGEMENT.END_MONTH')"
          :picker-options="pickerOptionsEnd"
        ></el-date-picker>
      </el-form-item>
      <!-- 重置 查询按钮 -->
      <div class="m-btn-box">
        <v-button size="w70" @click="reset()" class="u-btn-reset">{{$t('ACCOUNT_MANAGEMENT.RESET')}}</v-button>
        <v-button
          size="w70"
          type="primary"
          @click="query()"
          class="u-btn-search"
        >{{$t('ACCOUNT_MANAGEMENT.SEARCH')}}</v-button>
      </div>
    </el-form>

    <!-- 数据列表区 -->
    <el-table :data="statementData" stripe style="width：100%" :header-cell-style="headerStyle">
      <!-- 账户号码 -->
      <el-table-column
        prop="accNo"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
        width="300"
        align="left"
      >
        <!-- 2022-09-07查回数据已做格式化 -->
      </el-table-column>
      <!-- 账户名称 -->
      <el-table-column
        prop="accName"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NAME')"
        width="300"
        align="left"
      ></el-table-column>
      <!-- 月份 -->
      <el-table-column
        prop="esmMonth"
        :label="$t('ACCOUNT_MANAGEMENT.MONTH')"
        width="120"
        align="left"
      ></el-table-column>
      <!-- 账户类别 -->
      <el-table-column
        prop="accountType"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"
        width="200"
        align="left"
      >
        <template slot-scope="scope">{{ scope.row.currency }} {{ scope.row.accType | accountType }}</template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        :label="$t('ACCOUNT_MANAGEMENT.OPERATION')"
        width="120px"
        align="left"
      >
        <template slot-scope="scope">
          <!-- 预览 -->
          <div
            @click="previewPdf(scope.row)"
            class="operate-btn"
          >{{$t('ACCOUNT_MANAGEMENT.PERVIEW')}}</div>
          <!-- 下载 -->
          <span class="decollator">|</span>
          <div
            @click="download(scope.row)"
            class="operate-btn"
          >{{$t('ACCOUNT_MANAGEMENT.DOWNLOAD')}}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      class="mt15"
      layout="prev, pager, next, sizes, jumper"
      :total="total"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange($event)"
      @current-change="handleCurrentChange($event)"
    ></el-pagination>
    <!-- 温馨提示 -->
    <div class="m-tips">
      <p class="u-title">{{$t('ACCOUNT_MANAGEMENT.ELE_STATEMENT_TIPS_TITLE')}}</p>
      <p
        class="u-content"
        v-for="(item,index) in $t('ACCOUNT_MANAGEMENT.ELE_STATEMENT_TIPS_CONTENT')"
        :key="index"
      >{{item}}</p>
    </div>
    <PopUp
      ref="dialog"
      width="980px"
      :options="true"
      :cancelField="$t('ACCOUNT_MANAGEMENT.ACCOUNT_CLOSE')"
      :confirmField="$t('ACCOUNT_MANAGEMENT.DOWNLOAD')"
      @confirm="previewDownload"
    >
      <div class="dialog">
        <header>{{ $t('ACCOUNT_MANAGEMENT.ELECTRONIC_STATEMENT') }}</header>
        <div>
          <iframe
            :src="`data:application/pdf;base64,${pdfBase64}`"
            frameborder="0"
            width="100%"
            height="100%"
          ></iframe>
          <!-- <img src="@/images/login/banner1.png" /> -->
        </div>
      </div>
    </PopUp>
  </div>
</template>
<script>
import mathTools from '@/utils/mathTools.js';
import {
  getEleStatementList,
  getstatementsAccount,
  downloadStatement
} from '@/api/accountManagement.js';
import tools from '@/dataTools/tools';
import { downloadFile } from '@/utils/tools';
import filters from '@/filters/accountManagement';
import { mapState } from 'vuex';
const { getYMD,getYM } = tools;
const startDate = getYM(new Date().getTime() - 11*30*24*60*60*1000);
const endingDate = getYM(new Date().getTime());
export default {
  data() {
    return {
      statementForm: {
        accountNoCCY: '',
        accountNo: '',
        // transTime: {startDate,endingDate},
        startDate: startDate,
        endingDate: endingDate,
        currency: ''
      },
      pickerOptionsStart:{
        disabledDate:this.pickerOptionsMethodsStart
      },
      pickerOptionsEnd:{
        disabledDate:this.pickerOptionsMethodsEnd
      },
      // pickerOptionsStart: {
      //   disabledDate(time) {
      //     /**
      //      * 两种情况下·禁止选中
      //      * 1.大于当前日期
      //      * 2.七年之外
      //      */
      //     const currentMonth = new Date().getMonth();
      //     const currentYear = new Date().getFullYear();
      //     const selectMonth = new Date(time).getMonth();
      //     const selectYear = new Date(time).getFullYear();
      //     if (currentYear < selectYear || currentYear - selectYear > 7) {
      //       return true;
      //     }
      //     if (currentYear === selectYear) {
      //       return currentMonth < selectMonth;
      //     }
      //     if (currentYear - selectYear === 7) {
      //       return currentMonth >= selectMonth;
      //     }
      //     return false;
      //   }
      // },
      // pickerOptionsEnd: {
      //   disabledDate(time) {
      //     /**
      //      * 两种情况下·禁止选中
      //      * 1.大于当前日期
      //      * 2.七年之外
      //      */
      //     const currentMonth = new Date().getMonth();
      //     const currentYear = new Date().getFullYear();
      //     const selectMonth = new Date(time).getMonth();
      //     const selectYear = new Date(time).getFullYear();
      //     if (currentYear < selectYear || currentYear - selectYear > 7) {
      //       return true;
      //     }
      //     if (currentYear === selectYear) {
      //       return currentMonth < selectMonth;
      //     }
      //     if (currentYear - selectYear === 7) {
      //       return currentMonth >= selectMonth;
      //     }
      //     return false;
      //   }
      // },
      formRules: {
        accountNoCCY: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('ACCOUNT_MANAGEMENT.QUERY_ACCOUNT')
            }),
            trigger: 'change'
          }
        ]
      },
      accountList: [],
      statementData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pdfBase64: '',
      fileName: ''
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  filters,
  watch: {
  //  'statementForm.transTime': {
  //     handler(newVal) {
  //       const startDate = this.statementForm.transTime.startDate;
  //       const endingDate = this.statementForm.transTime.endingDate;
  //       this.statementForm.startDate = getYMD(new Date(startDate).getTime());
  //       this.statementForm.endingDate = getYMD(new Date(endingDate).getTime());
  //     },
  //     deep: true
  //   },
   
    'statementForm.accountNoCCY': {
      handler(newVal) {
        const accountInfo = this.accountList.find(
          item => `${item.accountNo}${item.currency}` === newVal
        );
        this.statementForm.accountNo = accountInfo.accountNo;
        this.statementForm.currency = accountInfo.currency;
        this.statementForm.accountType = accountInfo.accountTypeCode;
        this.statementForm.accountName = accountInfo.accountName;
        this.statementForm.stateType = accountInfo.stateType;
      }
    }
  },
  mounted() {
    this.getstatementsAccount();
  },
  methods: {
    pickerOptionsMethodsStart(time){
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const selectMonth = new Date(time).getMonth();
      const selectYear = new Date(time).getFullYear();
      if (currentYear < selectYear || currentYear - selectYear > 7 || new Date(time) > new Date(this.statementForm.endingDate)) {
        return true;
      }
      if (currentYear === selectYear) {
        return currentMonth < selectMonth;
      }
      if (currentYear - selectYear === 7) {
        return currentMonth >= selectMonth;
      }
      return false;
    },
    pickerOptionsMethodsEnd(time){
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const selectMonth = new Date(time).getMonth();
      const selectYear = new Date(time).getFullYear();
      if (currentYear < selectYear || currentYear - selectYear > 7 || new Date(time) < new Date(this.statementForm.startDate)) {
        return true;
      }
      if (currentYear === selectYear) {
        return currentMonth < selectMonth;
      }
      if (currentYear - selectYear === 7) {
        return currentMonth >= selectMonth;
      }
      return false;
    },
    // 返回展示的账户信息
    showAccountInfo(item) {
      const accountTypeFilter = this.$options.filters['accountType'];
      const ccyFilter = this.$options.filters['ccyFilter'];
      return `${item.accountNo} ${ccyFilter(item.currency)} ${accountTypeFilter(
        item.accountType
      )}`;
    },
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
    // 获取列表数据
    async getEleStatementList() {
      this.total = 0;
      this.statementData = [];
      if (!this.statementForm.startDate) {
        this.statementForm.endingDate = getYM(new Date().getTime());
        const date = new Date();
        this.statementForm.startDate = getYM(
          new Date(date.getFullYear(), date.getMonth() - 11, 1).getTime()
        );
      }
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        ...this.statementForm
      };
      const result = await getEleStatementList(params);
      if (result) {
        this.statementData = result.electronicStatementList;
        this.total = result.total ? result.total : 0;
      }
    },
    // 获取账户列表
    async getstatementsAccount() {
      const result = await getstatementsAccount();
      if (result) {
        this.accountList = result.accountList;
      }
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getEleStatementList();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEleStatementList();
    },
    // 表格样式
    headerStyle() {
      return {
        'font-size': '14px',
        'background-color': '#f3f3f3',
        'text-align': 'left'
      };
    },
    // 重置
    reset() {
      this.$refs['statementForm'].resetFields();
      this.statementForm.startDate = startDate
      this.statementForm.endingDate = endingDate
    },
    // 查询
    query() {
      this.$refs['statementForm'].validate(valid => {
        if (valid) {
          this.getEleStatementList();
        }
      });
    },
    // 预览pdf
    async previewPdf(row) {
      await this.pdfData(row);
      this.$refs['dialog'].showDialog();
    },
    // 请求pdfbase64数据
    async pdfData(row) {
      const result = await downloadStatement(row);
      if (result) {
        this.pdfBase64 = result.fileBase64;
        this.fileName = result.fileName.split('.')[0];
      }
    },
    // 下载
    async download(row) {
      await this.pdfData(row);
      downloadFile(this.pdfBase64, this.fileName, 'pdf');
      this.$refs['dialog'].closeHandle();
    },
    // 预览下载
    previewDownload() {
      downloadFile(this.pdfBase64, this.fileName, 'pdf');
    }
  }
};
</script>
<style lang="scss" scoped>
.m-operatorLog {
  width: 100%;
  .el-form {
    display: flex;
    margin-bottom: 8px;
    .m-select-account {
      display: flex;
    }
    .m-timePick {
      margin-left: 40px;
      ::v-deep .el-form-item__content {
        display: flex;
      }
      /deep/.el-input__inner {
        width: 140px !important;
        // margin-bottom: 16px;
      }
      .line {
        margin: 10px 10px;
      }
    }
    .m-btn-box {
      display: flex;
      margin-left: 32px;
      margin-top: 2px;
      .u-btn-search {
        margin-left: 16px;
      }
    }
  }
  .u-left-line {
    position: relative;
    &::before {
      position: absolute;
      content: '';
      left: -8px;
      top: 11px;
      width: 1px;
      height: 12px;
      background-color: #f0f0f0;
    }
  }
  .m-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin: 26px 0 0 0;
    .u-title {
      margin-bottom: 16px;
    }
    .u-content {
      color: rgba(0, 0, 0, 0.45);
    }
  }
}
/deep/.el-form {
  /deep/.el-select {
    /deep/.el-input {
      width: 230px !important;
    }
  }
}
.m-timePick {
  /deep/.el-input__inner {
    width: 240px !important;
  }
}
::v-deep .cell {
  margin-left: 14px;
}
.operate-btn {
  display: inline-block;
  height: 22px;
  color: #f57e00;
  cursor: pointer;
}
.decollator {
  display: inline-block;
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.1);
}
.dialog {
  header {
    width: 100%;
    height: 46px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    padding: 0 32px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: rgba(254, 175, 3, 0.1);
  }
  > div {
    width: 916px;
    height: 490px;
    margin: 20px 32px 0;
    box-sizing: border-box;
    overflow: hidden;
    img {
      width: 916px;
      background-size: cover;
    }
  }
}
</style>