<template>
  <div class="operatorLog">
    <el-form ref="operatorLogRef" :model="eleReceiptForm" label-width="auto" :rules="formRules">
      <el-row>
        <!-- 账户 -->
        <el-col :span="6">
          <el-form-item :label="$t('ACCOUNT_MANAGEMENT.LOAN_ACCOUNT_TO_SEARCH')" prop="accountNo">
            <el-select
              v-model="eleReceiptForm.accountNo"
              :placeholder="$t('ACCOUNT_MANAGEMENT.PLEASE_SELECT')"
              :no-data-text="$t('ACCOUNT_MANAGEMENT.DONOT_HAS_QUERY_ACCOUNT')"
            >
              <el-option
                v-for="(item,index) in accountNoList"
                :key="index"
                :label="item.account"
                :value="item.account"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 通知书类型 -->
        <el-col :span="6" :push="2">
          <el-form-item
            :label="$t('ACCOUNT_MANAGEMENT.RECEIPTIONS_TYPE')+'：'"
            prop="receiptionsType"
          >
            <el-select
              v-model="eleReceiptForm.receiptionsType"
              :placeholder="$t('ACCOUNT_MANAGEMENT.PLEASE_SELECT')"
            >
              <el-option
                v-for="(item,index) in receiptionsTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 交易金额 -->
        <el-col :span="6" :push="4" v-show="isClose==false">
          <el-form-item
            :label="$t('ACCOUNT_MANAGEMENT.TRANSATION_AMOUNT')+'：'"
            prop="transationAmount"
          >
            <el-input
              v-model="eleReceiptForm.transationAmount"
              :placeholder="$t('ACCOUNT_MANAGEMENT.PLEASE_INPUT_AMOUNT')"
              style="width: 230px"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 重置查询按钮 查询条件折叠状态-->
        <el-col :span="7" :push="5" v-show="isClose==true">
          <div class="btn-box f-ml82">
            <v-button
              size="w70"
              @click="resetClick()"
              class="btn-reset"
            >{{$t('ACCOUNT_MANAGEMENT.RESET')}}</v-button>
            <v-button
              size="w70"
              type="primary"
              @click="queryClick()"
              class="btn-search"
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
        <el-col :span="7" v-show="isClose==false">
          <el-form-item
            :label="$t('ACCOUNT_MANAGEMENT.TRADE_TIME')+'：'"
            prop="transTime"
            class="m-timePick"
          >
            <el-date-picker
              v-model="eleReceiptForm.transTime.startDate"
              style="width:140px;"
              :clearable="false"
              range-separator
            ></el-date-picker>
            <span class="line">-</span>
            <el-date-picker
              v-model="eleReceiptForm.transTime.endingDate"
              style="width:140px;"
              :clearable="false"
              range-separator
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-show="isClose==false" class="quickTimePicker">
          <el-radio-group v-model="eleReceiptForm.timeArea" @change="changeDate">
            <el-radio label="0">{{$t('ACCOUNT_MANAGEMENT.ON_THE_DAY')}}</el-radio>
            <el-radio label="1">{{$t('ACCOUNT_MANAGEMENT.LATELY_SEVEN_DAYS')}}</el-radio>
            <el-radio label="2">{{$t('ACCOUNT_MANAGEMENT.LATELY_THIRTY_DAYS')}}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="7" :push="1" v-show="isClose==false">
          <!-- 重置查询按钮 查询条件展开状态-->
          <div class="btn-box">
            <v-button
              size="w70"
              @click="resetClick()"
              class="btn-reset"
            >{{$t('ACCOUNT_MANAGEMENT.RESET')}}</v-button>
            <v-button
              size="w70"
              type="primary"
              @click="queryClick()"
              class="btn-search"
            >{{$t('ACCOUNT_MANAGEMENT.SEARCH')}}</v-button>
            <span @click="showTime" class="u-show-search-btn">
              {{$t('ACCOUNT_MANAGEMENT.CLOSE')}}
              <i class="el-icon-put-away"></i>
            </span>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 数据列表区 -->
    <el-table
      :data="eleReceiptData"
      stripe
      style="width：100%"
      @selection-change="selectionChange"
      :header-cell-style="headerStyle"
    >
      <el-table-column type="selection" min-width="70"></el-table-column>
      <!-- 交易流水号 -->
      <el-table-column
        prop="serialNo"
        :label="$t('ACCOUNT_MANAGEMENT.SERIALNO')"
        min-width="160"
        class="color:#4181FA;"
      >
        <template slot-scope="scope">
          <div
            class="f-btn-color"
            @click="onClickSerialNo(scope.row.serialNo)"
          >{{ scope.row.serialNo }}</div>
        </template>
      </el-table-column>
      <!-- 通知书类型 -->
      <el-table-column
        prop="receiptType"
        :label="$t('ACCOUNT_MANAGEMENT.RECEIPTIONS_TYPE')"
        min-width="250"
      ></el-table-column>
      <!-- 交易金额 -->
      <el-table-column
        prop="transAmount"
        :label="$t('ACCOUNT_MANAGEMENT.TRANSATION_AMOUNT')"
        min-width="180"
      ></el-table-column>
      <!-- 对方户名 -->
      <el-table-column
        prop="counterpartAccountName"
        :label="$t('ACCOUNT_MANAGEMENT.COUNTERPART_ACCOUNT_NAME')"
        min-width="120"
      ></el-table-column>
      <!-- 交易渠道 -->
      <el-table-column
        prop="transChannel"
        :label="$t('ACCOUNT_MANAGEMENT.TRANS_CHANNEL')"
        min-width="100"
      ></el-table-column>
      <!-- 交易时间 -->
      <el-table-column prop="transTime" :label="$t('ACCOUNT_MANAGEMENT.TRADE_TIME')" width="180"></el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      class="mt16"
      layout="prev, pager, next, sizes, jumper"
      :total="total"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange($event)"
      @current-change="handleCurrentChange($event)"
    ></el-pagination>
    <!-- 下载按钮 -->
    <div class="btn" v-if="eleReceiptData.length!==0">
      <v-button
        size="w210"
        type="primary"
        @click="download('files')"
      >{{$t('ACCOUNT_MANAGEMENT.DOWNLOAD')}}</v-button>
    </div>
    <!-- 温馨提示 -->
    <div class="m-tips">
      <p class="u-tips-title">{{$t('ACCOUNT_MANAGEMENT.TIPS_TITLE')}}</p>
      <p
        class="u-content"
        v-for="(item,index) in $t('ACCOUNT_MANAGEMENT.ELE_RECEIPT_TIPS_CONTENT')"
        :key="index"
      >{{item}}</p>
    </div>
    <PopUp
      ref="dialog"
      width="980px"
      :options="true"
      @close="close"
      :cancelField="$t('ACCOUNT_MANAGEMENT.ACCOUNT_CLOSE')"
      :confirmField="$t('ACCOUNT_MANAGEMENT.DOWNLOAD')"
      @confirm="download('file')"
    >
      <div class="dialog">
        <header>{{ $t('ACCOUNT_MANAGEMENT.ELE_RECEIPT') }}</header>
        <div>
          <img src="@/images/login/banner1.png" />
        </div>
      </div>
    </PopUp>
  </div>
</template>
<script>
import {
  getEleReceiptList,
  previewEleReceiptPdf,
  downloadEleReceipt
} from '@/api/accountManagement.js';
import tools from '@/dataTools/tools';
const { getYMD } = tools;
const startDate = getYMD(new Date().getTime() - 2505600000);
const endingDate = getYMD(new Date().getTime());
export default {
  data() {
    return {
      eleReceiptForm: {
        accountNo: '',
        transationAmount: '',
        transTime: {startDate,endingDate},
        timeArea: '2',
        receiptionsType: ''
      },
      formRules: {
        accountNo: [
          {
            required: true,
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('ACCOUNT_MANAGEMENT.QUERY_ACCOUNT')
            }),
            trigger: 'change'
          }
        ]
      },
      eleReceiptData: [],
      // currentPage: 0,
      isClose: true,
      accountNoList: [
        {
          account: '6223 1277 7777 2222'
        },
        {
          account: '6223 1277 7777 2222'
        },
        {
          account: '6223 1277 7777 2222'
        }
      ],
      receiptionsTypeList: [
        {
          value: '0',
          label: this.$t('ACCOUNT_MANAGEMENT.DESPOT_RECEIPT')
        }
      ],
      downloadList: [],
      downloadFile: '',
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
   watch: {
    'eleReceiptForm.transTime': {
      handler(newVal) {
        const startDate = this.eleReceiptForm.transTime.startDate;
        const endingDate = this.eleReceiptForm.transTime.endingDate;
        this.eleReceiptForm.startDate = getYMD(new Date(startDate).getTime());
        this.eleReceiptForm.endingDate = getYMD(new Date(endingDate).getTime());
      },
      deep: true
    }
  },
  mounted() {
    // this.getEleReceiptList();
  },
  methods: {
    async getEleReceiptList() {
      let params = {
        // roleCode: this.roleCode,
        // roleName: this.roleName,
        current: this.currentPage,
        size: this.pageSize
      };
      const result = await getEleReceiptList(params);
      if (result) {
        this.eleReceiptData = result.eleReceiptList;
        this.total = result.total;
      }
    },
    // 日期返显
    changeDate(e) {
      this.setDefaultDate(+e);
    },
    // 设置日期搜索框
    setDefaultDate(day) {
      let dateArr = [];
      if (day == 0) {
        dateArr.push(this.formatDate(Date.now() - 0 * 24 * 3600 * 1000));
        dateArr.push(this.formatDate());
        this.eleReceiptForm.transTime = dateArr;
      } else if (day == 1) {
        dateArr.push(this.formatDate(Date.now() - 6 * 24 * 3600 * 1000));
        dateArr.push(this.formatDate());
        this.eleReceiptForm.transTime = dateArr;
      } else if (day == 2) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
        dateArr.push(start, end);
        this.eleReceiptForm.transTime = dateArr;
      }
    },
    formatDate(ops) {
      //格式化日期,ops时间戳
      let gDate = new Date(ops || Date.now());
      let y = gDate.getFullYear();
      let M =
        gDate.getMonth() >= 9
          ? gDate.getMonth() + 1
          : '0' + (gDate.getMonth() + 1);
      let d = gDate.getDate() > 9 ? gDate.getDate() : '0' + gDate.getDate();
      return y + '-' + M + '-' + d;
    },
    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getEleReceiptList();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEleReceiptList();
    },
    // 选择交易流水号
    selectionChange(rows) {
      this.downloadList = [...rows];
    },
    // 点击交易流水号
    onClickSerialNo(data) {
      this.downloadFile = data;
      previewEleReceiptPdf();
      this.$refs['dialog'].showDialog();
    },
    headerStyle() {
      return {
        'font-size': '14px',
        'background-color': '#f3f3f3',
        'text-align': 'left'
      };
    },
    // 重置
    resetClick() {
      this.$refs['operatorLogRef'].resetFields();
    },
    // 查询
    queryClick() {
      this.$refs['operatorLogRef'].validate(valid => {
        if (valid) {
          this.getEleReceiptList();
        }
      });
    },

    // 时间选择器
    showTime() {
      this.isClose = !this.isClose;
    },
    // 下载
    download(type) {
      downloadEleReceipt();
      if (type === 'files') {
        // 多条数据
        if (this.downloadList.length === 0) {
          this.$message({
            message: this.$t('COMMON.PLEASE_SELECT_SOMETHING', {
              select: this.$t('ACCOUNT_MANAGEMENT.ASLEASE_ONE_DATE')
            }),
            type: 'fail',
            delay: 3000
          });
          this.$refs['dialog'].closeHandle();
          downloadEleReceipt();
        }
      } else {
        // 单条数据
        downloadEleReceipt();
      }
    },
    close() {}
  }
};
</script>
<style lang="scss" scoped>
.operatorLog {
  // padding-top: 16px;
  .m-timePick {
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
  .quickTimePicker {
    height: 22px;
    margin: 14px 20px 10px 40px;
  }
  .f-ml82 {
    margin-left: 50px;
  }
  .btn-box {
    display: flex;
    margin-left: 40px;
    .btn-search {
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
  .btn {
    margin-top: 40px;
    display: flex;
    justify-content: center;
  }
  .f-btn-color {
    color: #4181fa;
    cursor: pointer;
  }
  .m-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin: 26px 0 0 0;
    .u-tips-title {
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
/deep/.el-table {
  /deep/.el-table__header {
    /deep/.el-checkbox {
      padding: 0px;
    }
  }
  /deep/.el-table__body {
    /deep/.el-checkbox {
      padding: 0px;
    }
  }
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