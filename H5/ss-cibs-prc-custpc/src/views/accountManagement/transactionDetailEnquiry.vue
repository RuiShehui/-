<template>
  <div class="g-transation-detail-enquiry" v-loading="requestLoading">
    <!-- 查询区 -->
    <el-form ref="transationForm" :model="transationForm" label-width="80px" :rules="formRules">
      <el-row>
        <!-- 账户 -->
        <el-col :span="6">
          <el-form-item
            :label="$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TO_SEARCH')"
            prop="accountNoList"
          >
            <el-select
              v-model="transationForm.accountNoList"
              :placeholder="$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: $t('ACCOUNT_MANAGEMENT.QUERY_ACCOUNT')
                  })"
              :no-data-text="$t('ACCOUNT_MANAGEMENT.DONOT_HAS_QUERY_ACCOUNT')"
            >
              <el-option
                v-for="(item,index) in accountList"
                :key="index"
                :label="showAccountInfo(item)"
                :value="`${item.accountNo},${item.currency},${item.accountType},${item.accountTypeCode}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 交易类型 -->
        <el-col :span="6" :push="4">
          <div style="height: 40px"></div>
        </el-col>
        <!-- 交易金额 -->
        <!-- <el-col :span="6" :push="4" v-if="isClose==false"></el-col> -->
        <el-col :span="8" :push="4" v-if="isClose==true">
          <div class="m-btn-box f-ml82">
            <!-- 重置 查询按钮 -->
            <v-button
              size="w70"
              @click="resetClick()"
              class="u-btn-reset"
            >{{$t('ACCOUNT_MANAGEMENT.RESET')}}</v-button>
            <v-button
              size="w70"
              type="primary"
              @click="queryClick()"
              class="u-btn-search"
            >{{$t('ACCOUNT_MANAGEMENT.SEARCH')}}</v-button>
            <span class="u-show-search-btn" @click="showTime">
              {{$t('ACCOUNT_MANAGEMENT.OPEN')}}
              <i class="el-icon-expand"></i>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <!-- 交易时间 -->
        <el-col :span="7" v-if="isClose==false">
          <el-form-item
            :label="$t('ACCOUNT_MANAGEMENT.TRADE_TIME')+ '：'"
            prop="transTime"
            class="timePick"
          >
            <!-- :picker-options="pickerOptions" 服务器时间更改，暂时不控制时间，后面在限制 20220415 -->
            <el-date-picker
              v-model="transationForm.transTime.startDate"
              style="width:140px;"
              :clearable="false"
              range-separator
            ></el-date-picker>
            <span class="line">-</span>
            <el-date-picker
              v-model="transationForm.transTime.endingDate"
              style="width:140px;"
              :clearable="false"
              range-separator
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isClose==false" class="m-quickTimePicker">
          <el-form-item prop="timeArea">
            <el-radio-group v-model="transationForm.timeArea" @change="changeDate">
              <el-radio label="0">{{$t('ACCOUNT_MANAGEMENT.ON_THE_DAY')}}</el-radio>
              <el-radio label="1">{{$t('ACCOUNT_MANAGEMENT.LATELY_SEVEN_DAYS')}}</el-radio>
              <el-radio label="2">{{$t('ACCOUNT_MANAGEMENT.LATELY_THIRTY_DAYS')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7" :push="1" v-if="isClose==false">
          <div class="m-btn-box" v-if="isClose==false">
            <v-button
              size="w70"
              @click="resetClick()"
              class="u-btn-reset"
            >{{$t('ACCOUNT_MANAGEMENT.RESET')}}</v-button>
            <v-button
              size="w70"
              type="primary"
              @click="queryClick()"
              class="u-btn-search"
            >{{$t('ACCOUNT_MANAGEMENT.SEARCH')}}</v-button>
            <span @click="showTime" class="u-show-search-btn">
              {{$t('ACCOUNT_MANAGEMENT.CLOSE')}}
              <i class="el-icon-put-away"></i>
            </span>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="m-totalize" v-if="transationData.length!==0">
      <p class="f-totalNum">
        {{$t('ACCOUNT_MANAGEMENT.TOTAL_NUMBER')+ '：'}}
        <span>{{total}}</span>
        {{$t('ACCOUNT_MANAGEMENT.STROKES')}}
      </p>
    </div>
    <!-- 数据列表区 -->
    <el-table :data="transationData" stripe style="width：100%" :header-cell-style="headerStyle">
      <!-- 交易日期 -->
      <el-table-column prop="transactionTime" :label="$t('FUND.TRS_DATE')" width="120"></el-table-column>
      <!-- 交易类别 -->
      <el-table-column prop="transactionType" :label="$t('Tasks.TRANSACTION_TYPE')" width="180"></el-table-column>
      <!-- 存入 -->
      <el-table-column
        v-if="showFlag!=='dbamt'"
        prop="cramt"
        :label="$t('ACCOUNT_MANAGEMENT.INCOME')"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ formatMoney(scope.row.currency,scope.row.cramt) }}</span>
        </template>
      </el-table-column>
      <!-- 支出 -->
      <el-table-column
        v-if="showFlag!=='cramt'"
        prop="dbamt"
        :label="$t('ACCOUNT_MANAGEMENT.WITHDRAWAL')"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ formatMoney(scope.row.currency,scope.row.dbamt) }}</span>
        </template>
      </el-table-column>
      <!-- 对方账户 -->

      <!-- 收款/付款人账户名称 -->
      <el-table-column
        prop="reciprocalName"
        :label="$t('ACCOUNT_MANAGEMENT.COUNTERPART_ACCOUNT_NAME')"
        width="180"
      ></el-table-column>
      <!-- 收款/付款人银行 -->
      <el-table-column
        prop="reciprocalBank"
        :label="$t('ACCOUNT_MANAGEMENT.RECIPROCAL_BANK')"
        width="160"
      ></el-table-column>
      <!-- 账户结余 -->
      <el-table-column
        prop="availableBalance"
        :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_BALANCE')"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ formatMoney(scope.row.currency,scope.row.availableBalance) }}</span>
        </template>
      </el-table-column>
      <!-- 摘要 -->
      <el-table-column prop="abstractStr" :label="$t('ACCOUNT_MANAGEMENT.ABSTRACT')" width="180"></el-table-column>
      <!-- 详情按钮 -->
      <el-table-column fixed="right" :label="$t('ACCOUNT_MANAGEMENT.OPERATION')" width="76">
        <template slot-scope="scope">
          <div
            @click="detailBtn(scope.row)"
            type="text"
            class="operate-btn"
          >{{$t('ACCOUNT_MANAGEMENT.TO_DETAILS')}}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <div class="m-footerBox" v-if="transationData.length!==0">
      <div class="f-excel-type">
        {{$t('ACCOUNT_MANAGEMENT.DOWNLOAD_FORMAT')}}
        <el-radio v-model="excelType" label="0">EXCEL</el-radio>
      </div>
      <el-pagination
        style="margin-top:20px"
        layout="prev, pager, next,sizes, jumper"
        :total="total"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      ></el-pagination>
    </div>
    <!-- 下载按钮 -->
    <div class="f-btn" v-if="transationData.length!==0">
      <v-button
        size="w210"
        type="primary"
        @click="checkExcelTotal()"
      >{{$t('ACCOUNT_MANAGEMENT.DOWNLOAD')}}</v-button>
    </div>
    <!-- 温馨提示 -->
    <div class="m-tips">
      <p class="u-title">{{$t('ACCOUNT_MANAGEMENT.TIPS_TITLE')}}</p>
      <p
        class="u-content"
        v-for="(item,index) in $t('ACCOUNT_MANAGEMENT.TRANSATION_TIPS')"
        :key="index"
      >{{item}}</p>
    </div>
    <el-dialog :show-close="false" :visible.sync="dialogVisible" width="420px" top="0vh">
      <div class="m-content-wrapper" v-if="downTotal">
        <p
          style="text-align:center;margin-top:20px"
        >{{ $t("ACCOUNT_MANAGEMENT.FINISH_BRANCH",{total:downTotal},{totals:downTotal+1}) }}</p>
        <p style="text-align:center;margin-top:36px">{{ `${downTotal}/${Math.ceil(total/500)}` }}</p>
      </div>
      <div class="m-content-wrapper" v-else>
        <div style="text-align: center;">
          <img width="100px" height="100px" src="@/images/common/success.png" alt />
          <p
            style="text-align:center;margin-top:20px"
          >{{ $t("ACCOUNT_MANAGEMENT.ALL_FISISH_DOWNLOAD") }}</p>
        </div>
      </div>
      <div slot="footer" class="g-btns">
        <v-button
          style="margin-right:20px"
          v-if="downTotal"
          @click="cancel"
          size="w120"
        >{{ $t('COMMON.CANCEL') }}</v-button>
        <v-button
          v-if="downTotal"
          @click="downloadExcel()"
          size="w120"
          type="primary"
        >{{ $t('COMMON.DETERMINE') }}</v-button>
        <v-button
          v-if="!downTotal"
          @click="confirmDown"
          size="w120"
          type="primary"
        >{{ $t('COMMON.DETERMINE') }}</v-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" :visible.sync="dialogVisible2" top="0vh" width="420px">
      <div class="m-content-wrapper">
        <div style="text-align: center;">
          <img width="100px" height="100px" src="@/images/common/warning.png" alt />
        </div>
        <p style="text-align:center">{{ $t('ACCOUNT_MANAGEMENT.TOTLA_MORE') }}</p>
      </div>
      <div slot="footer" class="g-btns">
        <v-button
          @click="dialogVisible2 = false"
          size="w120"
          type="primary"
        >{{ $t('COMMON.DETERMINE') }}</v-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" :visible.sync="dialogVisible3" top="0vh" width="420px">
      <div class="m-content-wrapper">
        <div style="text-align: center;">
          <img width="100px" height="100px" src="@/images/common/warning.png" alt />
        </div>
        <p
          style="text-align:center"
        >{{ $t("ACCOUNT_MANAGEMENT.TOO_MANANY_TOTAL",{num:Math.ceil(total/500)}) }}</p>
      </div>
      <div slot="footer" class="g-btns">
        <v-button
          style="margin-right:20px"
          @click="dialogVisible3 = false"
          size="w120"
        >{{$t('COMMON.CANCEL')}}</v-button>
        <v-button @click="downloadExcel()" size="w120" type="primary">{{ $t('COMMON.DETERMINE') }}</v-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTransDetailList,
  getTransAccountList,
  downloadTransDetail,
  downloadLoop
} from '@/api/accountManagement.js';
import { getNow } from '@/api/login.js';
import tools from '@/dataTools/tools';
import { downloadFile } from '@/utils/tools';
import filters from '@/filters/accountManagement';
import { formatMoney } from '@/utils/tools.js';
import { mapState } from 'vuex';
const { getYMD } = tools;
const startDate = getYMD(new Date().getTime() - 2505600000);
const endingDate = getYMD(new Date().getTime());
export default {
  name: 'TransactionDetailEnquiry',
  data() {
    return {
      // currentPage: 0,
      transationForm: {
        accountNoList: '', //账号
        transactionType: '', // 存入支出
        timeArea: '2', //时间快捷选择
        transTime: { startDate, endingDate }, //交易时间
        startDate,
        endingDate
      },
      showFlag: '',
      //账号
      accountList: [],
      inOutList: [
        {
          label: this.$t('COMMON.INCOME'),
          value: 'cramt'
        },
        {
          label: this.$t('COMMON.WITHDRAWAL'),
          value: 'dbamt'
        }
      ],
      ccy: '', //币种
      withCombined: '', //收入合计
      totalSpending: '', //支出合计
      //列表数据
      transationData: [],
      excelType: '0',
      isClose: true,
      choiceDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime();
          if (maxDate) {
            this.choiceDate = '';
            this.transationForm.timeArea = '';
          }
          console.log(this.choiceDate);
        },
        disabledDate: time => {
          if (this.choiceDate) {
            let choiceDateTime = new Date(this.choiceDate).getTime();
            let minTime = new Date(choiceDateTime).setMonth(
              new Date(choiceDateTime).getMonth() - 3
            );
            let maxTime = new Date(choiceDateTime).setMonth(
              new Date(choiceDateTime).getMonth() + 3
            );
            const min =
              minTime < this.sysTime - 31536000000
                ? this.sysTime - 31536000000
                : minTime;
            const max = maxTime > this.sysTime ? this.sysTime : maxTime;
            return time.getTime() < min || time.getTime() > max;
          }
          return (
            time.getTime() < this.sysTime - 365 * 24 * 3600 * 1000 ||
            time.getTime() > this.sysTime
          );
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      sysTime: '',
      downTotal: '', //已选择条数
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      downFlowNo: '',
      downLogo: '',
      bytes: ''
    };
  },
  filters,
  computed: {
    ...mapState('app', ['requestLoading', 'lang']),
    formRules() {
      return {
        accountNoList: {
          required: true,
          trigger: 'change',
          validator: (r, val, cb) => {
            if (!val) {
              cb(
                new Error(
                  this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: this.$t('ACCOUNT_MANAGEMENT.QUERY_ACCOUNT')
                  })
                )
              );
              return;
            }
            cb();
          }
        }
      };
    }
  },
  watch: {
    // 切换语言
    lang(n, o) {
      this.resetClick();
    },
    'transationForm.accountNoList': {
      handler(newVal) {
        const [
          accountNo,
          currency,
          accountType,
          accountTypeCode
        ] = newVal.split(',');
        this.ccy = currency;
        if (accountType === 'MULTICURRENCY') {
          this.transationForm.accountNo = accountNo + currency;
        } else {
          this.transationForm.accountNo = accountNo;
        }
        this.transationForm.currency = currency;
        this.transationForm.accountType = accountType;
        this.transationForm.accountTypeCode = accountTypeCode;
      }
    },
    'transationForm.transTime': {
      handler(newVal) {
        const startDate = this.transationForm.transTime.startDate;
        const endingDate = this.transationForm.transTime.endingDate;
        this.transationForm.startDate = getYMD(new Date(startDate).getTime());
        this.transationForm.endingDate = getYMD(new Date(endingDate).getTime());
      }
    }
  },
  async mounted() {
    console.log(this.$route.params, 'this.$route.params');
    await this.getNow();
    await this.getTransAccountList();
    const {
      accountNo = '',
      currency = '',
      accountType = '',
      accountTypeCode = ''
    } = this.$route.params;
    if (accountNo) {
      if (accountType === 'MULTICURRENCY') {
        this.transationForm.accountNo = accountNo + currency;
      } else {
        this.transationForm.accountNo = accountNo;
      }
      this.transationForm.accountNo = accountNo;
      this.transationForm.currency = currency;
      this.transationForm.accountType = accountType;
      this.transationForm.accountTypeCode = accountTypeCode;
      this.transationForm.accountNoList = `${accountNo},${currency},${accountType},${accountTypeCode}`;
      this.getTransDetailList();
    }
  },
  methods: {
    change() {
      console.log(this.transationForm.transactionType);
    },
    formatMoney,
    async getNow() {
      const result = await getNow();
      if (result) {
        this.sysTime = new Date(result.sysTime.split(' ')[0]).getTime();
        console.log(
          new Date(this.sysTime).getMonth() + 1,
          new Date(this.sysTime).getDate(),
          'this.sysTime'
        );
      }
    },
    showAccountInfo(item) {
      const accountTypeFilter = this.$options.filters['accountType'];
      const ccyFilter = this.$options.filters['ccyFilter'];
      return `${item.accountNo} ${ccyFilter(item.currency)} ${accountTypeFilter(
        item.accountType
      )}`;
    },
    async getTransAccountList() {
      const result = await getTransAccountList();
      if (result) {
        this.accountList = result.accountList;
      }
    },
    async getTransDetailList() {
      let params = {
        current: this.currentPage,
        size: this.pageSize,
        ...this.transationForm,
        startDate: this.transationForm.startDate.split('-').join(''),
        endingDate: this.transationForm.endingDate.split('-').join('')
      };
      console.log('params', params);
      const result = await getTransDetailList(params);
      if (result && result.transactionDetailsList) {
        this.showFlag = this.transationForm.transactionType;
        console.log(result, 'rererer');
        this.transationData = result.transactionDetailsList;
        this.withCombined = result.withCombined;
        this.totalSpending = result.totalSpending;
        this.total = result.total;
        this.downFlowNo = result.downFlowNo;
        this.downLogo = result.downLogo;
      }
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTransDetailList();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTransDetailList();
    },
    headerStyle() {
      return {
        'font-size': '14px',
        'background-color': '#f3f3f3',
        'text-align': 'left'
      };
    },
    resetClick() {
      this.isClose = true;
      this.$refs['transationForm'].resetFields();
      this.transationData = [];
    },
    queryClick() {
      this.$refs['transationForm'].validate(valid => {
        if (valid) {
          this.currentPage = 1;
          this.getTransDetailList();
        }
      });
    },
    detailBtn(row) {
      this.$router.push({
        path: '/accountManagement/toTransactionDetail',
        query: { ...row }
      });
    },
    showTime() {
      this.isClose = !this.isClose;
    },
    changeDate(e) {
      this.setDefaultDate(+e);
    },
    setDefaultDate(day) {
      console.log('day====>', day);
      if (day === 0) {
        this.transationForm.transTime.startDate = getYMD(
          Date.now() - 0 * 24 * 3600 * 1000
        );
        this.transationForm.transTime.endingDate = getYMD();
      } else if (day === 1) {
        this.transationForm.transTime.startDate = getYMD(
          Date.now() - 6 * 24 * 3600 * 1000
        );
        this.transationForm.transTime.endingDate = getYMD();
      } else if (day === 2) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
        this.transationForm.transTime.startDate = start;
        this.transationForm.transTime.endingDate = end;
      }
    },
    async cancel() {
      this.dialogVisible = false;
      this.downLogo = '1';
      const result = await downloadLoop({
        downFlowNo: this.downFlowNo,
        downLogo: this.downLogo
      });
      if (result && result.bytes) {
        downloadFile(
          result.bytes,
          this.$t('ACCOUNT_MANAGEMENT.TRANSITION_DETAILS'),
          'xlsx'
        );
      }
    },
    async checkExcelTotal() {
      if (this.total > 10000) {
        this.$confirm({
          title: this.$t('COMMON.TIPS'),
          isIcon: true,
          message: this.$t('ACCOUNT_MANAGEMENT.TOTLA_MORE'),
          btnText: {
            cancleText: this.$t('COMMON.CANCEL'),
            confirmText: this.$t('COMMON.DETERMINE')
          },
          isCancle: false
        });
        return;
      }
      if (this.total > 500) {
        this.$confirm({
          title: this.$t('COMMON.TIPS'),
          isIcon: true,
          message: `num:${Math.ceil(this.total / 500)}})`,
          btnText: {
            cancleText: this.$t('COMMON.CANCEL'),
            confirmText: this.$t('COMMON.DETERMINE')
          },
          isCancle: false
        });
        return;
      }
      const result = await downloadLoop({
        downFlowNo: this.downFlowNo,
        downLogo: this.downLogo
      });
      if (result && result.bytes) {
        this.bytes = result.bytes;
        downloadFile(
          this.bytes,
          this.$t('ACCOUNT_MANAGEMENT.TRANSITION_DETAILS'),
          'xlsx'
        );
      }
    },
    async downloadExcel() {
      this.dialogVisible = false;
      const result = await downloadLoop({
        downFlowNo: this.downFlowNo,
        downLogo: this.downLogo
      });
      if (result) {
        if (result.bytes) {
          this.bytes = result.bytes;
        }
        console.log(result);
        this.downFlowNo = result.downFlowNo;
        this.downLogo = result.downLogo;
        this.downTotal = result.downTotal;
        this.dialogVisible = true;
      }
    },
    confirmDown() {
      this.dialogVisible = false;
      if (this.bytes) {
        downloadFile(
          this.bytes,
          this.$t('ACCOUNT_MANAGEMENT.TRANSITION_DETAILS'),
          'xlsx'
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .cell {
  margin-left: 12px;
}
.timePick {
  ::v-deep .el-form-item__content {
    display: flex;
  }
  /deep/.el-input__inner {
    width: 140px !important;
  }
}
/deep/.el-radio {
  /deep/.el-radio__label {
    color: rgba(0, 0, 0, 0.85);
  }
}
.g-transation-detail-enquiry {
  .m-quickTimePicker {
    height: 22px;
    margin: 14px 20px 10px 40px;
  }
  .m-btn-box {
    display: flex;
    margin-left: 37px;
    .u-btn-search {
      margin-left: 16px;
    }
    .u-show-search-btn {
      cursor: pointer;
      margin-top: 10px;
      margin-left: 24px;
      color: #4181fa;
      font-size: 14px;
      .el-icon-expand {
        width: 14px;
        height: 14px;
        background-image: url('~@/images/common/jiantou_chaxunzhankai.svg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 0 2px;
      }
      .el-icon-put-away {
        width: 14px;
        height: 14px;
        background-image: url('~@/images/common/jiantou_chaxunshouqi.svg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 0 2px;
      }
    }
  }
  .f-ml82 {
    margin-left: 82px;
  }
  .m-totalize {
    width: 100%;
    display: flex;
    margin-bottom: 13px;
    justify-content: flex-end;
    .f-totalNum,
    .f-totalIncome,
    .f-totalExpend {
      text-align: right;
      height: 22px;
      font-size: 14px;
      color: rgba(34, 32, 32, 0.85);

      font-weight: 500;
    }
    .f-totalIncome,
    .f-totalExpend {
      margin-left: 36px;
    }
  }
  .m-footerBox {
    display: flex;
    overflow: hidden;
    .f-excel-type {
      width: 40%;
      font-size: 14px;
      line-height: 22px;
      margin-top: 23px;
    }
  }
  .f-btn {
    margin-top: 40px;
    display: flex;
    justify-content: center;
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
.operate-btn {
  height: 22px;
  color: #f57e00;
  cursor: pointer;
}
.g-btns {
  display: flex;
  justify-content: center;
}
.u-hasMargin {
  margin: 0 24px;
}
.line {
  margin: 10px 10px;
}
</style>
