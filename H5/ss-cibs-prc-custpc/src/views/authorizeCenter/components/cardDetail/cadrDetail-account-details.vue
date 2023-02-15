<template>
  <div class="g-card-detail-wrapper">
    <div class="m-head">{{$t('COMMON.DETAIL')}}</div>
    <div class="g-card-detail-wrapper__middle">
      <div class="u-content">
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.flowNo") }}</div>
          <div class="u-content__item__right">{{tableData.flowNo}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t('COMMON.TRADE_TYPE') }}</div>
          <div class="u-content__item__right">{{tableData.businessCode | bussinessTypeFilter}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.OPERATE_TYPE") }}</div>
          <div class="u-content__item__right">{{tableData.operationType|operationType}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.createTime") }}</div>
          <div class="u-content__item__right">{{tableData.createTime}}</div>
        </div>
        <div class="u-content__item">
          <div class="u-content__item__left">{{ $t("AUTHORIZE.USER_NAME") }}</div>
          <div class="u-content__item__right">{{tableData.userName}}</div>
        </div>
        <div class="u-content__item" v-if="nodeFlag">
          <div class="u-content__item__left">{{ $t("FUND.ORDER_NUM") }}</div>
          <div class="u-content__item__right">{{accountInfo.accountNo}}</div>
        </div>
        <div class="u-content__item" v-if="nodeFlag">
          <div class="u-content__item__left">{{ $t("FUND.ACCOUNT_NAME") }}</div>
          <div class="u-content__item__right">{{accountInfo.accountName}}</div>
        </div>
        <div class="u-content__item" v-if="nodeFlag">
          <div class="u-content__item__left">{{ $t("ACCOUNT_MANAGEMENT.ACCOUNT_TYPE") }}</div>
          <div class="u-content__item__right">{{accountInfo.accountTypeName}}</div>
        </div>
      </div>
      <div v-if="!nodeFlag" style="margin-bottom: 24px">
        <el-table :data="nodengjiTable" stripe row-class-name="fontStyle">
          <el-table-column prop="accountNo" :label="$t('FUND.ORDER_NUM')">
            <template slot-scope="scope">{{ scope.row.accountNo}}</template>
          </el-table-column>
          <el-table-column prop="accountName" :label="$t('FUND.ACCOUNT_NAME')"></el-table-column>
          <el-table-column prop="accountTypeName" :label="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"></el-table-column>
          <el-table-column prop="status" :label="$t('ACCOUNT_MANAGEMENT.STATUS')">
            <template slot-scope="scope">
              <span v-if="scope.row.accountName">
                {{
                scope.row.status === 'NORMAL' ? $t('ACCOUNT_MANAGEMENT.STATUS_ACTIVE') : scope.row.status === 'DORMANT' ? $t('ACCOUNT_MANAGEMENT.STATUS_DORMANT') : scope.row.status === 'FROZEN' ? $t('ACCOUNT_MANAGEMENT.STATUS_FROZEN') : scope.row.status === 'ACTIVE' ? $t('AUTHORIZE.ACTIVE') : scope.row.status === 'CLOSED' ? $t('ACCOUNT_MANAGEMENT.STATUS_CLOSE') : scope.row.status === 'OVERDUE' ? $t('AUTHORIZE.MORE_THAN_DATE') : scope.row.status === 'O' ? $t('ACCOUNT_MANAGEMENT.ACCOUNT_OPEN') : scope.row.status === 'C' ? $t('ACCOUNT_MANAGEMENT.STATUS_CLOSE') : scope.row.status === 'F' ? $t('ACCOUNT_MANAGEMENT.STATUS_FROZEN') : scope.row.status === 'OPEN' ? $t('AUTHORIZE.OPEN') : scope.row.status === 'CLOSE' ? $t('ACCOUNT_MANAGEMENT.STATUS_CLOSE') : ''
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="isWaitAuth">
      <divider :title="$t('AUTHORIZE.WAITME')" class="mt24 mb20" />
      <el-form :model="detailForm" label-width="auto" style="margin-left:291px">
        <el-form-item :label="`${$t('AUTHORIZE.WAITME')}:`">
          <el-radio
            v-model="detailForm.authStatus"
            label="1"
            style="margin: 11px 0 0 17px"
          >{{ $t("AUTHORIZE.MY_AGRESS") }}</el-radio>
          <el-radio
            v-model="detailForm.authStatus"
            label="2"
            style="margin-left: 28px"
          >{{ $t("AUTHORIZE.MY_REFUSE") }}</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            autosize
            style="width: 336px; height: 62px"
            :placeholder="$t('AUTHORIZE.AUTH_OPINION')"
            v-model="detailForm.authActionMessage"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="u-tips">
        <p class="u-title" style="display:flex;">
          <img style="width:14px; padding-right:8px" src="@/images/logo/lingdang.png" />
          <span>{{ $t('AUTHORIZE.DOUBLE_WAY') }}</span>
        </p>
        <el-form ref="forms" :rules="rule" :model="form" style="margin-left:25%">
          <el-form-item :label="$t('AUTHORIZE.DOUBLE_WAYS')" prop="checkWay" label-width="200px">
            <el-radio-group v-model="form.checkWay" style="padding-top:10px">
              <el-radio label="1">{{ $t('AUTHORIZE.PLICE_WAY') }}</el-radio>
              <el-radio label="2">{{ $t('AUTHORIZE.OPT_RE') }}</el-radio>
              <!-- <el-radio v-for="item in checkWay" :key="item.value" :value="item.value" :label="item.label"></el-radio> -->
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="flexc mt36">
        <v-button @click="returnClick()" class="mr16">{{ $t('AUTHORIZE.BACK') }}</v-button>
        <v-button type="primary" @click="submit()">{{ $t('AUTHORIZE.SURE') }}</v-button>
      </el-row>
    </div>

    <div v-else>
      <div class="m-head">{{ $t('AUTHORIZE.AUTH_FORMATION') }}</div>
      <div class="g-card-detail-wrapper__middle">
        <div class="u-content">
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t('AUTHORIZE.authState') }}</div>
            <div class="u-content__item__right status">{{tableData.authState|authStateFilter}}</div>
          </div>
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t('AUTHORIZE.AUTH_TIME') }}</div>
            <div class="u-content__item__right">{{tableData.authTime}}</div>
          </div>
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t('AUTHORIZE.AUTH_PEOPLE') }}</div>
            <div class="u-content__item__right">{{tableData.autherName}}</div>
          </div>
          <div class="u-content__item">
            <div class="u-content__item__left">{{ $t('AUTHORIZE.AUTH_OPINION') }}</div>
            <div class="u-content__item__right">{{tableData.dealRen}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  saveRegisteredAccountAuth,
  updateBindStatusAuth,
  customerAccountDetail
} from '@/api/bankingAccountManagement';
import CONSTANTS from '@/utils/contants';
import { otpDialog, softToken } from '@/components/messageBox';
import filters from '@/filters/public';
import filter from '@/filters/accountManagement';
export default {
  props: {
    tableData: {
      type: Object
    }
  },
  filters: {
    ...filters,
    ...filter
  },
  watch: {
    tableData: function(val) {
      console.log('tableData', this.tableData);
    }
  },

  data() {
    return {
      nodengjiTable: [], //登记时数组
      nodeFlag: true, //true:解除登记;false:登记
      accountInfo: {},
      detailForm: {
        authStatus: '1', //1:通过，2：拒绝
        authActionMessage: ''
      },
      isWaitAuth: true,
      getstatus: '',
      date: '',
      sname: '',
      ager: '',
      form: {
        checkWay: ''
      },
      rule: {
        checkWay: [
          {
            required: true,
            message: this.$t('AUTHORIZE.SELECT_WAY'),
            tigger: 'change'
          }
        ]
      },
      flag: ''
    };
  },
  created() {},
  mounted() {
    console.log(this.tableData, 'tableDatasdsdsds');
    switch (this.tableData.operationType) {
      case '8':
        this.flag = '11';
        break;
      case '7':
        this.flag = '10';
        break;
    }
    if (
      this.tableData.authState === '0' &&
      this.tableData.authorizationType === 'WAIT_AUTH'
    ) {
      this.isWaitAuth = true;
    } else {
      this.isWaitAuth = false;
    }
    if (this.tableData.operationType === '7') {
      this.nodeFlag = false;
    }
    if (this.tableData.operationType === '8') {
      this.nodeFlag = true;
    }
    console.log('tableData', this.tableData);
    if (!this.tableData.dealRen) {
      this.tableData.dealRen = '- -';
    }
    this.queryDetail();
  },
  methods: {
    //查询详情
    queryDetail() {
      let params = {
        commFlow: this.tableData.flowNo
      };
      customerAccountDetail(params).then(resp => {
        if (this.tableData.operationType === '8') {
          this.accountInfo = JSON.parse(resp.tradeDetail);
          CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
            if (this.accountInfo.accountType === accountItem.value) {
              if (this.accountInfo.currencyType) {
                this.accountInfo.accountTypeName =
                  this.accountInfo.currencyType + ' ' + accountItem.label;
              } else {
                this.accountInfo.accountTypeName = accountItem.label;
              }
            }
          });
        }
        if (this.tableData.operationType === '7') {
          JSON.parse(resp.tradeDetail).unregisteAccountList.forEach(item => {
            CONSTANTS.ACCOUNT_TYPE_LIST.forEach(accountItem => {
              if (item.accountType === accountItem.value) {
                if (item.currencyType) {
                  item.accountTypeName =
                    item.currencyType + ' ' + accountItem.label;
                } else {
                  item.accountTypeName = accountItem.label;
                }
              }
            });
            this.nodengjiTable.push(item);
          });
        }
      });
    },

    //提交
    submit() {
      let tipContent = '';
      let custNo = sessionStorage.getItem('custNo');
      this.$refs['forms'].validate(valid => {
        if (valid) {
          if (this.form.checkWay == '2') {
            otpDialog({
              otpType: this.tableData.businessCode,
              otpMode: 'otp',
              flag: this.flag
            }).then(() => {
              this.comfirm();
            });
          } else {
            if (this.nodengjiTable) {
              this.tableData.unregisteAccountList = this.nodengjiTable;
            }
            this.tableData.accountNo = this.accountInfo.accountNo;
            const tradeInfo = JSON.stringify(this.tableData);
            softToken({
              softTokenCode: '',
              otpType: this.tableData.businessCode,
              tradeInfo: tradeInfo
              // randomNum:''
            }).then(() => {
              this.comfirm();
            });
          }
        }
      });
    },
    comfirm() {
      let tipContent = '';
      let custNo = sessionStorage.getItem('custNo');
      if (this.detailForm.authStatus === '1') {
        tipContent = this.$t('AUTHORIZE.AUTH_agree');
      } else {
        tipContent = this.$t('AUTHORIZE.AUTH_REFUSE');
      }
      this.$confirm({
        isIcon: true,
        type: 'warn',
        message: tipContent,
        btnText: {
          cancleText: this.$t('AUTHORIZE.CANCLE'),
          confirmText: this.$t('AUTHORIZE.SURE')
        },
        isCancle: true
      }).then(() => {
        this.submitStatus();
      });
    },
    //提交-授权
    async submitStatus() {
      let params = {
        flowNoList: [this.tableData.flowNo],
        authReqInfo: {
          authActionType: this.detailForm.authStatus,
          authActionMessage: this.detailForm.authActionMessage,
          flowNo: this.tableData.flowNo,
          bsnCode: this.tableData.businessCode
        }
      };
      if (this.tableData.operationType === '7') {
        params.authReqInfo.opType = '1'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await saveRegisteredAccountAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
      if (this.tableData.operationType === '8') {
        params.authReqInfo.opType = '3'; //操作类型  1-新增, 2-修改,3 -删除
        const result = await updateBindStatusAuth(params);
        console.log('result', result);
        if (result.head.returnCode === '000000') {
          this.$router.push({
            path: '/_businessManagement/authorizeCenter/mySubmit/result',
            query: result.body.authResultInfo
          });
        }
      }
    },
    //返回
    returnClick() {
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-card-detail-wrapper {
  .m-head {
    border-left: 4px solid #f06b00;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
    padding-left: 12px;
    margin-bottom: 20px;
  }
  &__top {
    display: flex;
    justify-content: center;
    .m-left,
    .m-right {
      width: 300px;
      height: 160px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      float: left;
      position: relative;
      background-image: url('~@/images/authorizeCenter/banklogo.png');
      background-position: right bottom;
      background-size: 132px 95px;
      background-repeat: no-repeat;
      .u-flag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 24px;
        background-color: #fdf0e5;
        border-radius: 4px;
        font-size: 12px;
        color: #f06b00;
        line-height: 24px;
        text-align: center;
      }
    }
    .m-left {
      margin-left: 87px;
      padding-left: 24px;
    }
    .m-right {
      margin-right: 87px;
      padding-left: 24px;
    }
    .u-name {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 4px;
      line-height: 20px;
    }
    .u-accountNo,
    .u-accountName {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
      font-weight: 500;
    }
    .u-bankName {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 14px;
    }
    .m-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      padding: 0 40px;
      text-align: center;
      .u-currency {
        margin-top: 40.5px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
        font-weight: 700;
      }
      img {
        width: 200px;
      }
      // .u-money {
      //   font-size: 12px;
      //   color: rgba(0, 0, 0, 0.65);
      //   line-height: 20px;
      //   margin-top: 4px;
      // }
    }
  }
  &__middle {
    margin-top: 36px;
    .u-content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: pink;
      margin-top: 36px;
      &__item {
        width: 50%;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        &__left {
          width: 222px;
          text-align: right;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          line-height: 22px;
          // margin-left: 82px;
        }
        &__right {
          flex: 1;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          line-height: 22px;
          margin-left: 24px;
        }
        .status {
          color: #f06b00;
        }
      }
    }
  }
  &__bottom {
    background-color: #f7f7f7;
    padding: 20px 0 0 62px;
    margin-bottom: 27px;
  }
  .g-btns {
    // text-align: center;
    // display: flex;
    margin-left: 453px;
    margin-top: 30px;
    .u-hasMargin {
      margin-right: 10px;
      display: initial;
      /deep/ .common-button {
        margin: 0 auto;
      }
    }
  }
}
// .u-bg-logo {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   height: 95px;
//   width: 132px;
//   z-index: 0;
// }
.submitter {
  display: flex;
  flex-direction: column;
  .people,
  .date {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .people {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
}
.u-name,
.wait,
.agree,
.refuse {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.wait {
  #name {
    display: inline-block;
    margin-right: 14px;
  }
}
.agree {
  color: #f06b00;
}
.refuse {
  color: #f23f47;
}
.opinion {
  height: 66px;
  font-size: 14px;
  line-height: 22px;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.reset {
  margin-left: 24px;
}
.people {
  width: 200px;
}
::v-deep .el-steps--horizontal {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
::v-deep .el-step {
  width: 20%;
}
::v-deep .el-step.is-horizontal .el-step__line {
  width: 95%;
}
/deep/ .el-table th.el-table__cell > .cell {
  margin-left: 14px;
}
/deep/ .el-table td.el-table__cell div {
  margin-left: 14px;
}
.u-title {
  font-size: 14px;
  color: #f06b00;
  display: flex;
  margin-left: 46px;
  margin-top: 45px;
  justify-content: center;
  align-items: center;
  // flex-direction: column;
}
</style>