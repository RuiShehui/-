<template>
  <div class="g-advancePayManagement" v-loading="isInit">
    <el-form label-width="auto" :model="formData" ref="formRef">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('BILLPAYMENT.BILL_NO')+':'" prop="accoNo">
            <el-input
              :placeholder="$t('BILLPAYMENT.PLEASE_ENTER_BILL_NO')"
              v-model="formData.accoNo"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('BILLPAYMENT.MERCHANT_NAME')+':'" prop="merName">
            <el-select
              :placeholder="$t('BILLPAYMENT.PLEASE_SELECT')"
              v-model="formData.merName"
              filterable
            >
              <el-option
                v-for="item in businessNameList"
                :key="item.value"
                :label="item.lang=='zh-CN'?item.merchartName:item.lang=='zh-HK'?item.merchartNameZht:item.merchartNameEn"
                :value="item.merchartName"
                :placeholder="$t('COMMON.PLEASE_SELECT')"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-row
          class="flexc mt16"
          :style="showstatus?'margin-top: 12px;float: right;padding-right: 70px;':'margin-top: 1px;'"
          v-if="!showstatus"
        >
          <v-button size="w70" class="mr16" @click="reset">{{$t('BILLPAYMENT.RESET')}}</v-button>
          <v-button size="w70" type="primary" @click="query" >
            <div :style="langstatus=='en'?'font-size: 15px;':''">{{$t('BILLPAYMENT.INQUIRE')}}</div>
            </v-button>
          <div class="u-show" @click="show()" v-if="!showstatus">
            <div class="el-icon-expand" :style="langstatus=='en'?'margin-left: 51px':''">
              <p :style="langstatus=='en'?'margin-left: -51px;':'margin-left: -30px;margin-top: 3px;'">{{$t('BILLPAYMENT.UNFOLD')}}</p>
            </div>
          </div>
          <div class="u-show" @click="show()" v-if="showstatus">
            <div class="el-icon-expandone">
              <p style="margin-top: 3px;margin-left: -30px;">{{$t('BILLPAYMENT.PUT_AWAY')}}</p>
            </div>
          </div>
        </el-row>
      </el-row>
      <el-row class="dateclass">
        <el-col :span="8" v-if="showstatus">
          <el-form-item
            :label="$t('BILLPAYMENT.PAYMENT_DATEONE')+':'"
            prop="transTime"
            class="timePick"
          >
            <el-date-picker
              v-model="transationForm.transTime.startDate"
              style="width:140px;"
              :clearable="false"
              value-format="yyyy-MM-dd"
              range-separator
            ></el-date-picker>
            <span class="line">-</span>
            <el-date-picker
              v-model="transationForm.transTime.endingDate"
              style="width:140px;"
              value-format="yyyy-MM-dd"
              :clearable="false"
              range-separator
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="showstatus" class="m-quickTimePicker">
          <el-form-item prop="timeArea">
            <el-radio-group
              style="display:flex"
              v-model="transationForm.timeArea"
              @change="changeDate"
            >
              <el-radio label="0">{{$t('BILLPAYMENT.A_WEEK')}}</el-radio>
              <el-radio label="1">{{$t('BILLPAYMENT.A_MONTH')}}</el-radio>
              <el-radio label="2">{{$t('BILLPAYMENT.THREE_MONTHS')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-row
          class="flexc mt16"
          :class="[showstatus ? 'padding-right: 22px;':'padding-right: 60px;']"
          :style="showstatus?'margin-top: 12px;float: right':'margin-top: 1px;'"
          v-if="showstatus"
        >
          <v-button size="w70" class="mr16" @click="reset" >{{$t('BILLPAYMENT.RESET')}}</v-button>
          <v-button size="w70" type="primary" @click="query" :style="langstatus=='en'?'margin-right: 10px;':''">
            <!-- {{$t('BILLPAYMENT.INQUIRE')}} -->
            <div :style="langstatus=='en'?'font-size: 15px;':''">{{$t('BILLPAYMENT.INQUIRE')}}</div>
          </v-button>
          <div class="u-show" @click="show()" v-if="!showstatus">
            <div class="el-icon-expand">
              <p :style="langstatus=='en'?'margin-left: -59px;margin-top: 3px;':'margin-left: -30px;margin-top: 3px;'">{{$t('BILLPAYMENT.UNFOLD')}}</p>
            </div>
          </div>
          <div class="u-show" @click="show()" v-if="showstatus">
            <div class="el-icon-expandone">
              <p :style="langstatus=='en'?'margin-left: -59px;margin-top: 3px;':'margin-left: -30px;margin-top: 3px;'">{{$t('BILLPAYMENT.PUT_AWAY')}}</p>
            </div>
          </div>
        </el-row>
      </el-row>
    </el-form>
    <el-table :data="tableData" class="mt20" stripe>
      <el-table-column
        align="center"
        prop="flowNo"
        :label="$t('BILLPAYMENT.ONLINE_BANKING_SERIAL_NUMBER')"
        width="200px"
      ></el-table-column>
      <el-table-column align="center" prop="payDate" :label="$t('BILLPAYMENT.PAYMENT_DATEONE')"></el-table-column>
      <el-table-column align="center" prop="merchantName" :label="$t('BILLPAYMENT.MERCHANT_NAME')"></el-table-column>
      <el-table-column align="center" prop="payAccount" :label="$t('BILLPAYMENT.FROM_ACCOUNT')">
        <template slot-scope="scope">
          {{formatAccountNo(scope.row.payAccount)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="billNo" :label="$t('BILLPAYMENT.BILL_NO')"></el-table-column>
      <el-table-column align="center" prop="tranAmt" :label="$t('BILLPAYMENT.TRANSACTION_AMOUNT')"></el-table-column>
      <el-table-column
        align="center"
        prop="accountTypeName"
        :label="$t('BILLPAYMENT.TRANSACTION_AMOUNT')"
        v-if="showsta"
      ></el-table-column>

      <el-table-column
        align="center"
        :label="$t('BILLPAYMENT.OPERATE')"
        width="150px"
        v-if="datastatus"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="modify(scope.row)" :style="langstatus=='en'?'margin-left: -8px;':''">
            {{$t('BILLPAYMENT.REVISE')}}
            </el-button>
          <div class="u-line"></div>
          <el-button type="text" @click="HandlerDelete(scope.row)">{{$t('BILLPAYMENT.CANCEL')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <pageNation class="mt16" :total="tableData.length" :page_index="currentPage" v-if="datastatus" />
  </div>
</template>
<script>
import {
  accountone,
  queryCstMessage,
  subscribePayCancel,
  queryMerchantList,
  isHighRiskMerchant
} from '@/api/payService.js';
import { queryTranIsAuth } from '@/api/authorizeCenter';
import tools from '@/dataTools/tools';
import { softToken } from '@/components/messageBox';
import mathTools from '@/utils/mathTools.js';
const { getYMD } = tools;
const startDate = '';
const endingDate = '';
export default {
  data() {
    return {
      isInit: false,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        disabledDate: time => {
          let m = 3 * 30 * 24 * 60 * 60 * 1000;
          let curDate = new Date().getTime();
          let year = new Date().getFullYear();
          let day = 365;
          if ((year % 4 === 0 && year % 100 !== 0) || year % 400 == 0) {
            day = 366; //闰年
          }
          let fullYear = day * 24 * 3600 * 1000;
          const oneYear = curDate - fullYear;
          if (this.min) {
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * day);
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() < Date.now() ||
              time.getTime() > start
            );
          } else {
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * day);
            return time.getTime() < Date.now() || time.getTime() > start;
          }
        }
      },
      choiceDate: '',
      min: '',
      formData: {
        accoNo: '',
        merType: '',
        merName: '',
        paymentDate: ''
      },
      tableData: [
        {
          flowNo: '',
          payDate: '',
          mertchantName: '',
          payAccount: '',
          billNo: '',
          tranAmt: '',
          accountTypeName: ''
        }
      ],
      businessNameList: [{}],
      currentPage: 0,
      satsu: false,
      showstatus: false,
      showsta: false,
      statustpe: false,
      startTime: '',
      endTime: '',
      datastatus: true,
      riskFlag: '',
      langstatus:'',
      transationForm: {
        transTime: { startDate, endingDate }, //交易时间
        timeArea: '', //时间快捷选择
        startDate,
        endingDate
      }
    };
  },
  watch: {
    'transationForm.transTime': {
      handler(newVal) {
        const startDate = this.transationForm.transTime.startDate;
        const endingDate = this.transationForm.transTime.endingDate;
        this.transationForm.startDate = getYMD(new Date(startDate).getTime());
        this.transationForm.endingDate = getYMD(new Date(endingDate).getTime());
      },
      deep: true
    }
  },
  created() {
    this.langstatus = localStorage.getItem('lang');
    this.Datalist();
  },
  methods: {
    async Datalist() {
      const lang = localStorage.getItem('lang');
      let langFlag = lang == 'zh-CN' ? '0' : lang == 'zh-HK' ? '1' : '2';
      this.isInit = true;
      let params = {
        billNo: '',
        current: 0,
        custNo: '',
        entType: '',
        flowNo: '',
        flowNoList: [],
        merchartName: '',
        payAmt: '',
        payDate: '',
        queryEndDate: this.endTime,
        queryStartDate: this.startTime,
        riskFlag: '',
        size: 10,
        userCode: '',
        langFlag: langFlag
      };
      let paramstwo = {
        merchartTypeCode: ''
      };
      const restwo = await queryMerchantList(paramstwo);
      this.businessNameList = restwo;
      for (let i = 0; i < this.businessNameList.length; i++) {
        const lang = localStorage.getItem('lang');
        this.businessNameList[i].lang = lang;
      }
      const ressix = await queryTranIsAuth({ businessCode: '060103' });
      this.statustpe = ressix;
      accountone(params).then(res => {
        this.isInit = false;
        if (res == null) {
          this.datastatus = false;
          this.tableData = null;
        } else {
          this.tableData = res.list;
          this.datastatus = true;
        }
      });
    },
    show() {
      this.showstatus = !this.showstatus;
    },
    changeDate(e) {
      this.setDefaultDate(+e);
    },
    setDefaultDate(day) {
      console.log('day====>', day);
      if (day === 0) {
        this.transationForm.transTime.startDate = getYMD(
          Date.now() - 7 * 24 * 3600 * 1000
        );
        this.transationForm.transTime.endingDate = getYMD();
      } else if (day === 1) {
        this.transationForm.transTime.startDate = getYMD(
          Date.now() - 3600 * 1000 * 24 * 30
        );
        this.transationForm.transTime.endingDate = getYMD();
      } else if (day === 2) {
        const end = new Date();

        this.transationForm.transTime.startDate = getYMD(
          Date.now() - 3600 * 1000 * 24 * 90
        );

        this.transationForm.transTime.endingDate = getYMD();
      }
    },
    reset() {
      this.$refs['formRef'].resetFields();
      this.startTime = '';
      this.endTime = '';
      this.transationForm = {
        transTime: { startDate, endingDate}, //交易时间
        timeArea: '', //时间快捷选择
        startDate:'',
        endingDate:''
      }
    },
    query() {
      console.log('选择的时间', this.transationForm.transTime.startDate);
      this.startTime = this.transationForm.transTime.startDate
        .split('-')
        .join('');
      this.endTime = this.transationForm.transTime.endingDate
        .split('-')
        .join('');
      const lang = localStorage.getItem('lang');
      let langFlag = lang == 'zh-CN' ? '0' : lang == 'zh-HK' ? '1' : '2';
      let params = {
        billNo: this.formData.accoNo,
        merchartName: this.formData.merName,
        current: this.currentPage,
        flowNo: '',
        payAmt: '',
        payDate: '',
        queryStartDate: this.startTime,
        queryEndDate: this.endTime,
        riskFlag: '',
        size: 10,
        langFlag: langFlag
      };

      accountone(params).then(res => {
        if (res == null) {
          this.datastatus = false;
          this.tableData = null;
        } else {
          this.tableData = res.list;
          this.datastatus = true;
        }
      });
    },
    modify(scope) {
      let fmt = scope.payDate;
      fmt = fmt.slice(0, 4) + '-' + fmt.slice(4, 6) + '-' + fmt.slice(6, 8);
      let date = new Date().getTime() - new Date(fmt).getTime();
      if (date > 0) {
        this.$message({
          type: 'fail',
          message: this.$t('BILLPAYMENT.THE_PAYMENT_DATE_CANNOT_BE_MODIFIED'),
          delay: 3000
        });
      } else {
        this.$router.push({
          path: '/payService/advancePayManagement/modify',
          query: {
            ...scope,
            type: 'edit'
          }
        });
      }
    },
    // cancle() {}
    HandlerDelete(scope) {
      let fmt = scope.payDate;
      fmt = fmt.slice(0, 4) + '-' + fmt.slice(4, 6) + '-' + fmt.slice(6, 8);
      let date = new Date().getTime() - new Date(fmt).getTime();
      if (date > 0) {
        this.$message({
          type: 'fail',
          message: this.$t('BILLPAYMENT.THE_PAYMENT_DATE_IS_NOT_CANCELABLE'),
          delay: 3000
        });
      } else {
        this.$confirm({
          title: '',
          isIcon: true,
          type: 'warn',
          message: this.$t('BILLPAYMENT.SCHEDUIED_PAYMENT'),
          btnText: {
            cancleText: this.$t('BILLPAYMENT.CANCEL'),
            confirmText: this.$t('BILLPAYMENT.SURE')
          },
          isCancle: true
        }).then(() => {
          if (scope.merchantType && scope.merchantCode && scope.billNo) {
            let paramsone = {
              merchantType: scope.merchantType,
              merchantCode: scope.merchantCode,
              billType: scope.billType,
              billNo: scope.billNo
            };
            isHighRiskMerchant(paramsone).then(res => {
              this.riskFlag = res;
              let params = {
                billNo: '',
                current: this.currentPage,
                flowNo: scope.flowNo,
                payAmt: scope.tranAmt,
                payDate: scope.payDate,
                queryStartDate: '',
                queryEndDate: '',
                riskFlag: this.riskFlag,
                currency: scope.currency,
                payAccount: scope.payAccount,
                size: 10
              };
              subscribePayCancel(params).then(
                ({ authResultInfo = {}, head = {}, body = {} }) => {
                  if (head.returnCode == 'OTP000107' && this.riskFlag == '1') {
                    const tradeInfo = JSON.stringify(params);
                    softToken({
                      softTokenCode: '',
                      otpType: '060103',
                      tradeInfo: tradeInfo
                    }).then(() => {
                      this.HandlerDelete(scope);
                    });
                  } else {
                    if (body && this.statustpe) {
                      this.$message({
                        type: 'success',
                        message: this.$t('BILLPAYMENT.SUBMIT_SUCCESS'),
                        delay: 3000
                      });
                      this.Datalist();
                    }
                    if (body && !this.statustpe) {
                      this.$message({
                        type: 'success',
                        message: this.$t('BILLPAYMENT.CANCEL_SUCCESS'),
                        delay: 3000
                      });
                      this.Datalist();
                    }
                  }
                }
              );
            });
          }
        });
      }
    },
       //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
  }
};
</script>
<style lang="scss" scoped>
.u-show {
  width: 28px;
  height: 22px;
  font-size: 14px;
  color: #4181fa;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 400;
  padding-left: 24px;
  padding-top: 10px;
}
.timePick {
  ::v-deep .el-form-item__content {
    display: flex;
  }
  /deep/.el-input__inner {
    width: 140px !important;
    // margin-bottom: 16px;
  }
}
.dateclass {
  margin-top: 10px;
  .m-quickTimePicker {
    height: 22px;
    margin: 14px 0px 10px 0px;
    .el-radio-group {
      display: flex;
    }
  }
}
.g-transation-detail-enquiry {
  // padding-top: 16px;

  .m-btn-box {
    display: flex;
    margin-left: 37px;
    .u-btn-search {
      margin-left: 16px;
    }
    .u-show-search-btn {
      // display: flex;
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
.el-icon-expand {
  margin-left: 30px;
  width: 14px;
  height: 14px;
  background-image: url('~@/images/common/jiantou_chaxunzhankai.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0 2px;
}
.el-icon-expandone {
  margin-left: 30px;
  width: 14px;
  height: 14px;
  background-image: url('~@/images/common/jiantou_chaxunshouqi.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0 2px;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 230px;
}
.u-line {
  width: 1px;
  height: 10px;
  display: inline-block;
  margin-left: 8px;
  margin-right: 8px;
  background-color: #f0f0f0;
}
/deep/.el-form-item {
  margin-bottom: 4px;
}
.line {
  margin: 10px 10px;
}
</style>