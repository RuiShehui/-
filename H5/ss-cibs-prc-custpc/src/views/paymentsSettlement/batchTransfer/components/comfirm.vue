<template>
  <div class="g-comfirm">
    <div class="g-confirmContent">
      <DetailItem :title="$t('PAYMENT.PAYMENT_ACCOUNT')" :content="(formData.payString)"></DetailItem>
      <DetailItem :title="$t('PAYMENT.FEE_DEDUCTION_ACCOUNT')" :content="(formData.cutString)"></DetailItem>
      <DetailItem :title="$t('PAYMENT.CHARGE_CCY')" :content="monText"></DetailItem>
      <DetailItem
        :title="$t('PAYMENT.APPOINTMENT_DATE')"
        :content="formatDate"
        v-if="formData.checked"
      ></DetailItem>
      <DetailItem
        :title="$t('PAYMENT.RETRY_DEDUCTION')"
        v-if="formData.redebitChecked"
        :content="formData.redebitChecked ?$t('USER_MANAGEMENT.YES')  : $t('USER_MANAGEMENT.NO')"
      ></DetailItem>
      <DetailItem :title="$t('PAYMENT.TOTAL_TRANS')" :content="amount"></DetailItem>
      <DetailItem :title="$t('PAYMENT.TOTAL_AMOUNT')" :content="allMonth"></DetailItem>
      <DetailItem
        :title="$t('PAYMENT.A_LEVEL_AUTHOR')"
        :content="alevelList"
        v-if="alevelList !== ''"
      ></DetailItem>
      <DetailItem
        :title="$t('PAYMENT.B_LEVEL_AUTHOR')"
        :content="blevelList"
        v-if="blevelList !== ''"
      ></DetailItem>
      <DetailItem
        :title="$t('PAYMENT.C_LEVEL_AUTHOR')"
        :content="clevelList"
        v-if="clevelList !== ''"
      ></DetailItem>
    </div>
    <div class="m-table">
      <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe>
        <el-table-column :label="$t('PAYMENT.RECEIVE_ACCOUNT')" prop="debitAcct"></el-table-column>
        <el-table-column :label="$t('PAYMENT.PAYEE_NAME')" prop="debitAcctName"></el-table-column>
        <el-table-column prop="bankName" :label="$t(`PAYMENT.RECEIVE_BANK`)" width="165">
          <template slot-scope="scope">{{scope.row.bankCode}} {{ scope.row.bankName}}</template>
        </el-table-column>
        <el-table-column :label="$t('PAYMENT.TRANSFER_AMOUNT')" prop="amountStr"></el-table-column>
        <el-table-column :label="$t('PAYMENT.POSTSCRIPT')" prop="additionalComment" width="160"></el-table-column>
      </el-table>
      <div class="mt16">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30,50]"
          :page-size="pageSize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="(total)"
        ></el-pagination>
      </div>
    </div>
    <el-row class="u-btn mt36">
      <v-button type size="w160" @click="back" class="mlr15">{{$t('TRANSFR_INFO.BACK')}}</v-button>
      <v-button
        type="primary"
        size="w160"
        @click="next"
        :loading="btnLoading"
      >{{$t('TRANSFR_INFO.CONFIR')}}</v-button>
    </el-row>
  </div>
</template>

<script>
import mathTools from '@/utils/mathTools.js';
import { copyFileSync } from 'fs';
import { otpDialog } from '@/components/messageBox';
import { computeCharge, submit, transferSubmit, auth } from '@/api/cashManage';
import { softToken, choosesWay } from '@/components/messageBox';
import { formatMoneyNew } from '@/utils/tools.js';
import {
  removeTransactionDraft,
} from '@/api/paymentRemittance';
let that;
export default {
  props: {
    formDataObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  data() {
    return {
      formData: this.formDataObj,
      tableData: [],
      tata: [],
      payBank: [],
      alevelList: '',
      blevelList: '',
      clevelList: '',
      bthDetailList: [], //收款人信息
      mon: 0, //手續費
      monText: 0, //手續費拼接
      canSubmit: false, //标识可以提交
      chequeBook: {},
      flag: false, //标识是否需要授权
      inputType: 1, //录入方式(1:在线编辑,2:文件录入)
      total: null,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      btnLoading: false,
      fileId: '' //文件的id
    };
  },
  computed: {
    formatDate() {
      let date = this.formData.transOutDate;
      if (typeof date !== 'string') {
        if (this.formData.checked) {
          let y = date.getFullYear();
          let m = date.getMonth() + 1;
          m = m < 10 ? '0' + m : m;
          let d = date.getDate();
          d = d < 10 ? '0' + d : d;
          return y + '-' + m + '-' + d;
        }
        return '';
      } else {
        return date;
      }
    },
    amount() {
      let len = 0;
      len = this.formData.tableData && this.formData.tableData.length;
      return `${len}${this.$t('TRANSFR_INFO.PEN')}`;
    },
    allMonth() {
      return `${this.formData.payObject.cur} ${formatMoneyNew(
        this.formData.allMonth
      )}`;
    },
    authInfo() {
      return this.formData.authInfo || [];
    }
  },
  watch: {
    formData: {
      handler(n, oldName) {
        console.log('n-----', n);
        console.log();
        this.fileId = n.fileId;
        if (this.fileId) {
          this.inputType = 2;
        } else {
          this.inputType = 1;
        }
        this.tableData = n.tableData.map((item, index) => {
          if (this.fileId) {
            return {
              bankName: item.bankName, //收款银行
              bankCode: item.bankCode, //
              debitAcctName: item.debitAcctName, //s户名
              amount: item.amount, //金额
              amountStr: `${this.formData.cutObject.cur} ${formatMoneyNew(
                item.amount
              )}`,
              debitAcct: item.debitAcct, //收款账户
              additionalComment: item.additionalComment //附言
            };
          } else {
            if (item.bankObjec) {
              return {
                bankName: item.bankObjec.label,
                bankCode: item.bankObjec.clearingCode,
                debitAcctName: item.paymentAccount,
                amount: item.payee,
                amountStr: `${this.formData.cutObject.cur} ${formatMoneyNew(
                  item.payee
                )}`,
                debitAcct: item.authorNum,
                additionalComment: item.tips //附言
              };
            } else {
              return {
                bankName: item.bankName,
                bankCode: item.bankCode,
                debitAcctName: item.paymentAccount,
                amount: item.payee,
                amountStr: `${this.formData.cutObject.cur} ${formatMoneyNew(
                  item.payee
                )}`,
                debitAcct: item.authorNum,
                tips: item.tips,
                additionalComment: item.tips //附言
              };
            }
          }
        });
        this.total = n.tableData.length;
        this.computeChargeInit();
        this.AlevelList();
        this.BlevelList();
        this.ClevelList();
      },
      immediate: true,
      deep: true
    }
  },
  filters: {},
  beforeCreate() {
    that = this;
  },
  created() {},
  methods: {
    computeChargeInit() {
      console.log('批量试算数据参数');
      this.bthDetailList = [];
      let params = {
        details: this.tableData,
        feeCur: this.formData.cutObject.cur,
        tradeType: '02'
      };
      console.log('批量试算数据参数', params, this.tableData);
      computeCharge(params).then(res => {
        this.mon = res.discountAmt;
        this.monText = ` ${this.formData.payObject.cur} ${res.discountAmt}`;
        console.log('批量试算数据', res);
      });
    },
    submitInit(confirm = 'false') {
      let s = this.formData;
      this.btnLoading = true;
      let params = {
        confirm,
        batchNo: '',
        bthDetailList: this.tableData,
        creditAcct: s.payObject.acctNo, // 收/付款账户(批量转
        creditAcctBalance: s.payAcctNoMoney, //账户余额
        creditAcctName: s.payObject.acctName, //收/付款账户名
        creditAcctType: s.payObject.type, //收/付款账户名类别
        cur: s.payObject.cur, //币种
        custNo: '', //网银客户号
        feeAcct: s.cutObject.acctNo, //手续费扣款账户
        feeAcctBalance: s.cutPayAcctNoMoney, //手续费扣款账户余额
        feeAcctName: s.cutObject.acctName, //手续费扣款账户名
        feeAcctType: s.cutObject.type, //手续费扣款账户类别
        feeCur: s.cutObject.cur, //手续费扣款账户币种
        fileFlowNum: this.fileId, //文件流水
        inputType: this.inputType, //录入方式(1:在线编辑,2:文件录入)
        isRetry: s.redebitChecked ? 'Y' : 'N', //重试扣款(Y:是,N:否)
        isSchedule: s.checked ? 'Y' : 'N', //是否为预约交易(Y:是,N:否)
        scheduleDate: this.formatDate, //预约日期
        serviceCharge: this.mon, //手续费
        tradeAmount: s.allMonth, //交易总金额
        tradeNumber: s.tableData.length, //交易总笔数
        tradeType: '02' //交易类型,01:批量发薪,02:批量转账,03:自动转账收款s
      };
      console.log('提交参数', params);
      let custNo = sessionStorage.getItem('custNo');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const entType = localStorage.getItem('entType');
      const tradeInfo = JSON.stringify(params);
      transferSubmit(params)
        .then(({ body = {}, head = {} }) => {
          console.log('得到的数据', head);
          this.btnLoading = false;
          if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '1'
              // status: status
            }).then(() => {
              this.submitInit('true');
            });
          } else if (head.returnCode == 'OTP000107' && entType == '1') {
            // const tradeInfo = JSON.stringify(params);
            softToken({
              softTokenCode: '',
              otpType: '03010401',
              tradeInfo: tradeInfo
              // randomNum:''
            }).then(() => {
              this.submitInit('true');
            });
          } else if (head.returnCode == 'COC009970') {
            this.$confirm({
              isIcon: false,
              type: 'warn',
              message: this.$t('PAYMENT.TRANSFER_REPEAT_INT'),
              btnText: {
                cancleText: this.$t('COMMON.CANCEL'),
                confirmText: this.$t('COMMON.CONFIRM')
              },
              countDown: true,
              isCancle: true
            })
              .then(() => {
                this.submitInit('true');
              })
              .catch(() => {
                this.btnLoading = false;
              });
          } else {
            if (body) {
              let res = Object.assign({ ...head, ...body });
              this.sendEmail(this.formData);
              this.$emit('next', res);
               if (this.formData.hasOwnProperty('tdId')) {
                removeTransactionDraft({
                  tdId: this.formData.tdId
                }).then({});
              }
            }

          }
        })
        .catch(err => {
          this.btnLoading = false;
        });
    },
    AlevelList() {
      if (this.authInfo) {
        if ('AlevelList' in this.authInfo) {
          if (this.authInfo.AlevelList && this.authInfo.AlevelList.length > 0) {
            let s = this.authInfo.AlevelList;
            s.map((item, index) => {
              if (this.alevelList == '') {
                this.alevelList = item.name;
              } else {
                this.alevelList = this.alevelList + ',' + item.name;
              }
            });
          }
        }
      }
    },
    BlevelList() {
      if (this.authInfo) {
        if ('BlevelList' in this.authInfo) {
          if (this.authInfo.BlevelList && this.authInfo.BlevelList.length > 0) {
            let s = this.authInfo.BlevelList;
            s.map((item, index) => {
              if (this.blevelList == '') {
                this.blevelList = item.name;
              } else {
                this.blevelList = this.blevelList + ',' + item.name;
              }
            });
          }
        }
      }
    },
    ClevelList() {
      if (this.authInfo) {
        if ('ClevelList' in this.authInfo) {
          if (this.authInfo.ClevelList && this.authInfo.ClevelList.length > 0) {
            let s = this.authInfo.ClevelList;
            s.map((item, index) => {
              if (this.clevelList == '') {
                this.clevelList = item.name;
              } else {
                this.clevelList = this.clevelList + ',' + item.name;
              }
            });
          }
        }
      }
    },
    back() {
      this.$emit('back');
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    next() {
      this.submitInit();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-left: 27%;
}
.content {
  width: 250px;
}
.u-btn {
  display: flex;
  margin-left: 35%;
}
.g-confirmContent {
  margin-left: 16%;
  width: 888px;
  display: flex;
  flex-wrap: wrap;
  // margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
}
.m-table {
  margin-top: 24px;
}
::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
::v-deep .el-table td.el-table__cell div {
  padding: 0 24px !important;
}
</style>
