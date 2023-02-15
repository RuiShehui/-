<template>
  <div class="g-account-details" v-loading="requestLoading">
    <!-- 活期账户详情 -->
    <div class="m-current-accountDetails" v-if="contentType=='0'">
      <el-main class="m-transactional-account-details-content">
        <!-- 卡片部分 -->
        <div class="m-transactional-account-details-top">
          <!-- 卡左 -->
          <div class="m-account-details-top-cardleft">
            <div class="m-card-left-up">
              <!-- 银行logo -->
              <div class="f-cxBankLogo">
                <img :src="bankLogo" />
              </div>
              <div class="m-account-num-status">
                <!-- 账户状态 -->
                <div class="f-account-status">
                  <p>{{casaAccountData.status}}</p>
                </div>
                <!-- 账户号码 -->
                <p class="u-account-num">{{casaAccountData.accountNumber}}</p>
              </div>
            </div>
          </div>
          <!-- 卡右 -->
          <div class="m-account-details-top-cardright">
            <!-- 账户结余 -->
            <div class="m-available-balance">
              <div
                class="u-available-balance-num"
              >{{isEye ? "159,172,821.00" : "159,172,821.00"? '*******' : ''}}</div>
              <!-- <div class="available-balance-num">{{casaAccountData.accountBalance}}</div> -->
              <div class="f-eye-img" @click="eyeClick">
                <img style="margin-top:5px;" :src="isEye ? eyeOn : eyeOff" />
              </div>
            </div>
            <div class="m-available-balance-describe">
              {{$t('ACCOUNT_MANAGEMENT.CASA_ACCOUNT_BALANCE')}}
              <span>{{casaAccountData.ccy}}</span>)
            </div>
            <!-- 可用结余 -->
            <div class="m-account-balance-describe">
              {{$t('ACCOUNT_MANAGEMENT.CASA_AVAILABLE_BALANCE')}}
              <span
                class="u-available-balance-ccy"
              >{{casaAccountData.ccy}}</span>
              <span>{{isEye ? casaAccountData.availableBalance: casaAccountData.availableBalance? '*******' : ''}}</span>
            </div>
          </div>
        </div>
      </el-main>
      <div class="m-transactional-account-details-bottom">
        <div class="m-detailItem">
          <!-- 账户名称 -->
          <detail-item
            :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NAME')"
            :content="casaAccountData.accountNo"
          />
          <!-- 开户银行 -->
          <detail-item
            :title="$t('ACCOUNT_MANAGEMENT.CASA_OPEN_BANK')"
            class="ml40"
            :content="casaAccountData.openBank"
          />
          <!-- 开户日期 -->
          <detail-item
            :title="$t('ACCOUNT_MANAGEMENT.CASA_OPEN_TIME')"
            :content="casaAccountData.openAccountDate"
          />
        </div>
      </div>
      <!-- 返回按钮 -->
      <div class="f-btn">
        <v-button size="w210" type @click="returnBtn">{{$t('ACCOUNT_MANAGEMENT.BACK')}}</v-button>
      </div>
    </div>
    <!-- 股票托管账户详情 -->
    <div class="m-shares-accountDetails" v-if="contentType=='2'">
      <title-bar class="f-title-bar" :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_INFORMATION')"></title-bar>
      <div class="m-shares-account-details-content">
        <!-- 账户号码 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
          :content="acctFormat(shareAccountData.accountNo)"
        />
        <!-- 账户名称 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NAME')"
          :content="shareAccountData.accountName"
        />
        <!-- 账户类型 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"
          :content="shareAccountData.accountType | accountType"
        />
        <!-- 状态 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.STATUS')"
          :content="shareAccountData.status | sharesFilter"
        />
      </div>
      <!-- 数据列表区 -->
      <el-table
        :data="shareAccountData.accountDetailsList"
        style="width：100%"
        :header-cell-style="headerStyle"
        stripe
      >
        <el-table-column prop="stockCode" :label="$t('ACCOUNT_MANAGEMENT.STOCK_CODE')" width="190"></el-table-column>
        <el-table-column prop="stockName" :label="$t('ACCOUNT_MANAGEMENT.STOCK_NAME')" width="175"></el-table-column>
        <el-table-column prop="currency" :label="$t('ACCOUNT_MANAGEMENT.STOCK_CCY')">
          <template v-slot="{row}">{{row.currency || 'HKD'}}</template>
        </el-table-column>
        <el-table-column prop="quantity" :label="$t('ACCOUNT_MANAGEMENT.STOCK_')" width="190">
          <template v-slot="{row}">{{ formatMoney(row.currency,row.quantity,false) }}</template>
        </el-table-column>
        <el-table-column
          prop="marketPrice"
          :label="$t('ACCOUNT_MANAGEMENT.STOCK_QUANTITY')"
          width="209"
        >
          <template v-slot="{row}">
            {{ formatMoney(row.currency,row.marketPrice,false) }}
            ({{ row.marketPriceDate }})
          </template>
        </el-table-column>
        <el-table-column
          prop="marketValue"
          :label="$t('ACCOUNT_MANAGEMENT.STOCK_VALUE')"
          width="150"
        >
          <template v-slot="{row}">{{ formatMoney(row.currency,row.marketValue,false) }}</template>
        </el-table-column>
      </el-table>
      <!-- 股票总值 -->
      <div class="m-money-text">
        {{ $t('ACCOUNT_MANAGEMENT.SHARES_TOTAL') + ':' }}
        {{ formatMoney('HKD',shareAccountData.stockAccValue) }}
      </div>
      <div class="f-btn">
        <v-button size="w210" type @click="returnBtn">{{$t('ACCOUNT_MANAGEMENT.BACK')}}</v-button>
      </div>
    </div>
    <!-- 投资账户详情 -->
    <div class="m-invest-accountDetails" v-if="contentType=='3'">
      <title-bar class="f-title-bar" :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_INFORMATION')"></title-bar>
      <div class="m-invest-account-details-content">
        <!-- 账户号码 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
          :content="acctFormat(investAccountData.accountNo)"
        />
        <!-- 账户名称 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NAME')"
          :content="investAccountData.accountName"
        />
        <!-- 账户类型 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"
          :content="investAccountData.accountType | accountType"
        />
        <!-- 状态 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.STATUS')"
          :content="investAccountData.status | sharesFilter"
        />
      </div>
      <!-- 数据列表区 -->
      <el-table
        :data="investAccountData.accountDetailsList"
        style="width：100%"
        default-expand-all
        :header-cell-style="headerStyle"
        :tree-props="{ children: 'grandson' }"
        stripe
        row-key="id"
      >
        <el-table-column
          prop="investmentItems"
          :label="$t('ACCOUNT_MANAGEMENT.INVESTMENT_ITEMS')"
          width="180"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="currency"
          :label="$t('ACCOUNT_MANAGEMENT.STOCK_CCY')"
          width="150"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="quantity"
          :label="$t('ACCOUNT_MANAGEMENT.INVESTMENT_AMOUNT')"
          align="left"
        >
          <template v-slot="{row}">{{ formatMoney(row.currency,row.quantity,false) }}</template>
        </el-table-column>
        <el-table-column
          prop="marketPrice"
          :label="$t('ACCOUNT_MANAGEMENT.STOCK_QUANTITY')"
          width="220"
          align="left"
        >
          <template v-slot="{row}">
            {{ formatMoney(row.currency,row.marketPrice,false) }}
            ({{ row.marketPriceDate }})
          </template>
        </el-table-column>
        <el-table-column
          prop="marketValue"
          :label="$t('ACCOUNT_MANAGEMENT.STOCK_VALUE')"
          width="200"
          align="left"
        >
          <template v-slot="{row}">{{ formatMoney(row.currency,row.marketValue) }}</template>
        </el-table-column>
      </el-table>
      <!-- 债券/基金总值 -->
      <div class="m-money-text">
        {{$t('ACCOUNT_MANAGEMENT.TOTAL_BOND_FUND_VALUE')}}:
        <span
          v-for="(item,index) in investAccountData.accInvestmentValueList"
          :key="index"
        >{{ `${formatMoney(item.currency,item.investmentValue)}` }}</span>
      </div>
      <div class="f-btn">
        <v-button size="w210" type @click="returnBtn">{{$t('ACCOUNT_MANAGEMENT.BACK')}}</v-button>
      </div>
    </div>
    <!-- 贷款账户详情 -->
    <div class="m-loan-accountDetails" v-if="contentType=='4'">
      <title-bar :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_INFORMATION')"></title-bar>
      <!-- 抵押贷款 -->
      <div class="m-loan-account-details-content" v-if="loanParams.loanType=='Mortgage Loan'">
        <!-- 账户号码 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
          :content="acctFormat(loanParams.accountNo) || '- -'"
        />
        <!-- 账户类别 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_TYPE')"
          :content="accountTypeFilter(loanParams.accountType,loanParams.currency) || '- -'"
        />
        <!-- 贷款类别 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LOAN_TYPE')"
          :content="loanParams.loanType || '- -'"
        />
        <!-- 信贷额度 -->

        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ORIGINAL_LOAN_AMOUNT')"
          :content="formatMoney(loanParams.currency,loanParams.loanAmount) || '- -'"
        />
        <!-- 结欠金额 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.AMOUNT_OWING')"
          :content="formatMoney(loanParams.currency,loanParams.balanceAmount) || '- -'"
        />
        <!-- 每期供款额 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.CONTRIBUTION_PERINSTALMENT')"
          :content="formatMoney(loanParams.currency,loanParams.repaymentAmount) || '- -'"
        />
        <!-- 还款周期 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.REPAYMENT_PERIOD')"
          :content="repaymentCycle(loanParams.repaymentCycle) || '- -'"
        />
        <!-- 利率 -->
        <detail-item :title="$t('ACCOUNT_MANAGEMENT.RATE')" :content="loanParams.rate || '- -'" />
        <!-- 下次到期日 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.NEXT_DUE_DATE')"
          :content="dateFormate(loanParams.nextDueDate) || '- -'"
        />
        <!-- 上次还款日 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LAST_PAYMENT_DATE')"
          :content="dateFormate(loanParams.lastRepaymentDate) || '- -'"
        />
        <!-- 上次还款额 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LAST_PAYMENT')"
          :content="formatMoney(loanParams.currency,loanParams.lastRepaymentAmount) || '- -'"
        />
      </div>
      <!-- 循环定期贷款 -->
      <div class="m-loan-account-details-content" v-if="loanParams.loanType=='Revolving Term Loan'">
        <!-- 账户号码 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.ACCOUNT_NUMBER')"
          :content="acctFormat(loanParams.accountNo) || '- -'"
        />
        <!-- 贷款类别 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LOAN_TYPE')"
          :content="loanParams.loanType || '- -'"
        />
        <!-- 额度编号 -->
        <detail-item :title="$t('ACCOUNT_MANAGEMENT.LIMIT_ID')" :content="loanParams.limitId" />
        <!-- 信贷额度 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LINE_OF_CREDIT')"
          :content="formatMoney(loanParams.creditLineCurrency,loanParams.creditLine) || '- -'"
        />
        <!-- 放款金额 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LOAN_AMOUNT')"
          :content="formatMoney(loanParams.currency,loanParams.loanAmount) || '- -'"
        />
        <!-- 贷款余额 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.LOAN_BALANCE')"
          :content="formatMoney(loanParams.currency,loanParams.loanBalance) || '- -'"
        />
      
        <!-- 币种 -->
        <detail-item :title="$t('ACCOUNT_MANAGEMENT.CCY')" :content="loanParams.currency || '- -'" />
        <!-- 利率 -->
        <detail-item :title="$t('ACCOUNT_MANAGEMENT.RATE')" :content="loanParams.rate || '- -'" />
        <!-- 利息 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.INTEREST')"
          :content="formatMoney(loanParams.currency,loanParams.interest) || '- -'"
        />
        <!-- 到期日 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.DUE_DATE')"
          :content="dateFormate(loanParams.nextDueDate) || '- -'"
        />
        <!-- 计息期 -->
        <detail-item
          :title="$t('ACCOUNT_MANAGEMENT.DATE_DUE')"
          :content="planBreathFormat(loanParams.planBreath) || '- -'"
        />
      </div>
      <div class="f-btn">
        <v-button size="w210" type @click="returnBtn">{{$t('ACCOUNT_MANAGEMENT.BACK')}}</v-button>
      </div>
    </div>
  </div>
</template>

<script>
// import accountCurrent from './components/accountCurrent';
import {
  getLoansAccountDetail,
  getLoansAccountNo
} from '@/api/accountManagement.js';
import { formatMoney } from '@/utils/tools.js';
import filters from '@/filters/accountManagement';
import { mapState } from 'vuex';
export default {
  components: {
    // accountCurrent
  },
  props: {
    detailData: {
      type: Array || Object,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      contentType: '', //0-活期 1-定期 2-股票 3-投资 4-贷款
      isEye: false,
      eyeOff: require('@/images/accountManage/isEyeOff.svg'),
      eyeOn: require('@/images/accountManage/isEyeOn.svg'),
      bankLogo: require('../../images/accountManage/bankLogo.png'),
      casaAccountData: {
        //活期账户详情
        ccy: '', //币种
        availableBalance: '', //可用结余
        accountBalance: '', //账户结余
        accountNumber: '', //账户号码
        status: '', //账户状态
        accountNo:
          '',
        openBank: '',
        openAccountDate: ''
      },
      //股票托管账户
      shareAccountData: [],
      //投资账户
      investAccountData: [],

      //贷款账户
      loanAccountForm: {
        accountNo: '' //户名
      },
      accountList: [],
      loanParams: {},
      showData: {},
      loanTypeCode: '', //贷款类别 Mortgage Loan 或 Revolving Term Loan
      paramss: {}
    };
  },
  filters,
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  async created() {
    console.log(JSON.parse(this.detailData), 'params');
    this.contentType = JSON.parse(this.detailData).type; //0-活期 1-定期 2-股票 3-投资 4-贷款
    if (this.contentType == '0') {
      this.casaAccountData = JSON.parse(this.detailData);
    } else if (this.contentType == '2') {
      this.shareAccountData = JSON.parse(this.detailData);
    } else if (this.contentType == '3') {
      this.investAccountData = JSON.parse(this.detailData);
    } else if (this.contentType == '4') {
      this.showData = JSON.parse(this.detailData);
      this.loanTypeCode = this.showData.loanTypeCode; //贷款类别
      this.loanAccountForm.accountNo = this.showData.accountNo;
      this.loanAccountForm.altAccId = this.showData.altAccId;
      this.loanAccountForm.loanTypeCode = this.showData.loanTypeCode;
      this.loanAccountForm.limitId = this.showData.limitId;
      // const { accountList = [] } = await getLoansAccountNo();
      // if (accountList.length) {
      //   console.log(accountList, 'accountList');
      //   this.accountList = accountList;
      // }
      this.queryLoanDetail();
    }
  },
  methods: {
    accountTypeFilter(value, ccy) {
      switch (value) {
        case 'SAVING':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.SAVING')}`;
        case 'MULTICURRENCY':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.MULTICURRENCY')}`;
        case 'CURRENT':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.CURRENT')}`;
        case 'FIXED':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.FIXED')}`;
        case 'LOAN':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.LOAN')}`;
        case 'SECURITIES':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.SECURITIES')}`;
        case 'INVESTMENT':
          return `${ccy}${this.$t('ACCOUNT_MANAGEMENT.INVESTMENT')}`;
        default:
          return value;
      }
    },
    formatMoney,
    acctFormat(val) {
      let str = val;
      if (val) {
        str = `${val.slice(0, 3)}-${val.slice(3, 5)}-${val.slice(5)}`;
      }
      return str;
    },
    loanNoFormat(val) {
      let str = val;
      if (val) {
        str = `${str.slice(0, 3)}-${str.slice(3, 5)}-${str.slice(
          5,
          11
        )}-${str.slice(11, 12)}-${str.slice(12)}`;
      }
      return str;
    },
    dateFormate(val) {
      let str = val;
      if (val) {
        str = `${val.slice(6, 8)} ${this.dateFilter(
          val.slice(4, 6)
        )} ${val.slice(0, 4)}`;
      }
      return str;
    },
    planBreathFormat(val) {
      if (val) {
        return `${val.slice(0, 4)}-${this.dateFilter(
          val.slice(4, 6)
        )}-${val.slice(6, 8)} To ${val.slice(8, 12)}-${this.dateFilter(
          val.slice(12, 14)
        )}-${val.slice(14, 16)}`;
      }
    },
    dateFilter(val) {
      switch (val) {
        case '01':
          return 'Jan';
        case '02':
          return 'Feb';
        case '03':
          return 'Mar';
        case '04':
          return 'Apr';
        case '05':
          return 'May';
        case '06':
          return 'Jun';
        case '07':
          return 'Jul';
        case '08':
          return 'Aug';
        case '09':
          return 'Sept';
        case '10':
          return 'Oct';
        case '11':
          return 'Nov';
        case '12':
          return 'Dec';
        default:
          return '';
      }
    },
    headerStyle() {
      return {
        'font-size': '14px',
        'background-color': '#f3f3f3',
        'text-align': 'left'
      };
    },
    // 账户返显
    accountInfo(item) {
      return `${this.acctFormat(item.accountNo)}  ${
        item.currency
      }  ${this.$options.filters['accountType'](item.accountType)}`;
    },
    // 还款周期
    repaymentCycle(val) {
      const str = val.charAt(val.length - 1);
      const num = val.substr(0, val.length - 1);
      switch (str) {
        case 'Y':
          return this.$t('ACCOUNT_MANAGEMENT.EVERY_YEAR', { num });
        case 'M':
          return this.$t('ACCOUNT_MANAGEMENT.EVERY_MONTH', { num });
        case 'D':
          return this.$t('ACCOUNT_MANAGEMENT.EVERY_DAY', { num });
        case 'w':
          return this.$t('ACCOUNT_MANAGEMENT.EVERY_WEEK', { num });
      }
    },
    async queryLoanDetail() {
      let params = {
        accNo: this.loanAccountForm.accountNo,
        altAccId: this.loanAccountForm.altAccId,
        loanTypeCode: this.loanAccountForm.loanTypeCode
      };
      const result = await getLoansAccountDetail(params);
      if (result) {
        this.loanParams = result;
        this.loanParams.limitId = this.loanAccountForm.limitId;
      }
    },
    returnBtn() {
      this.$emit('showIndex');
      // this.$router.go(-1);
    },
    eyeClick() {
      this.isEye = !this.isEye;
    }
  }
};
</script>

<style lang="scss" scoped>
.g-account-details {
  // 储蓄账户
  .m-current-accountDetails {
    width: 100%;
    height: 100%;
    position: relative;
    .m-transactional-account-details-content {
      width: 100%;
      height: 201px;
      .m-transactional-account-details-top {
        // width: 100%;
        position: absolute;
        display: flex;
        left: 20%;
        margin-top: 36px;
        .m-account-details-top-cardleft {
          // display: flex;
          width: 280px;
          height: 124px;
          background: url('../../images/accountManage/cardBackground.png')
            no-repeat;
          z-index: 2;
          // border: 1px solid #F06b00;
          // border-radius: 4px;
          .u-isAccountType {
            height: 22px;
            margin: 10px 0 0 20px;
            color: #ffffff;
            font-weight: 400;
          }
          .m-card-left-up {
            display: flex;
            height: 85px;
            .f-cxBankLogo {
              width: 40px;
              height: 40px;
              border-radius: 60%;
              background: #ffffff;
              margin: 20px 8px 20px 20px;
              img {
                width: 32px;
                height: 32px;
                margin: 4px 0 0 4px;
              }
            }
            .m-account-num-status {
              width: 216px;
              height: 68px;
              .f-account-status {
                margin-top: 15px;
                width: 100%;
                p {
                  text-align: center;
                  width: 40px;
                  height: 21px;
                  // border: 1px solid #F06b00;
                  font-size: 12px;
                  color: #fff;
                  line-height: 20px;
                  background: #feaf03;
                  border-radius: 2px;
                  margin-left: 171px;
                  z-index: 3;
                }
              }
              .u-account-num {
                font-size: 16px;
                color: #ffffff;
                font-weight: 500;
              }
            }
          }
        }
        .m-account-details-top-cardright {
          width: 250px;
          height: 108px;
          // border: 1px solid #F06b00;
          margin-top: 8px;
          background: #fff;
          box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.17);
          border-radius: 4px;
          .m-available-balance {
            display: flex;
            padding: 16px 0 2px 0;
            width: 100%;
            justify-content: center;
            .u-available-balance-num {
              font-size: 18px;
              color: #f06b00;
              letter-spacing: 0;
              line-height: 26px;
              font-weight: 700;
            }
            .f-eye-img {
              display: flex;
              margin-left: 6px;
            }
          }
          .m-available-balance-describe {
            width: 100%;
            text-align: center;
          }
          .m-account-balance-describe {
            width: 100%;
            text-align: center;
            margin-top: 12px;
          }
        }
      }
    }
    .m-transactional-account-details-bottom {
      // position: absolute;
      display: flex;
      padding: 16px 0;
      .m-detailItem {
        width: 940px;
        display: flex;
        flex-wrap: wrap;
        // margin-left: 78px;
        .detailItem:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
  }
  // 股票账户
  .m-shares-accountDetails {
    // .f-title-bar {
    //   // margin-top: 10px;
    // }
    /deep/.el-table {
      /deep/.el-table__header,
      .el-table__body {
        /deep/.el-table__cell {
          /deep/.cell {
            margin-left: 12px;
          }
        }
      }
    }
    .nav-bar {
      margin-bottom: 20px;
    }
    .m-shares-account-details-content {
      width: 940px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 78px;
      margin-bottom: 36px;
      .detailItem:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
  .m-money-text {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 500;
    margin-top: 16px;
    > span {
      display: inline-block;
      margin-left: 4px;
      margin-right: 8px;
    }
  }
  // 投资账户
  .m-invest-accountDetails {
    // .f-title-bar {
    //   // margin-top: 10px;
    // }
    /deep/.el-table {
      /deep/.el-table__header,
      .el-table__body {
        /deep/.el-table__cell {
          /deep/.cell {
            margin-left: 12px;
          }
        }
      }
    }
    .nav-bar {
      margin-bottom: 20px;
    }
    .m-invest-account-details-content {
      width: 940px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 78px;
      margin-bottom: 36px;
      .detailItem:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
  // 贷款账户
  .m-loan-accountDetails {
    // margin-top: 14px;
    /deep/.el-table {
      /deep/.el-table__header,
      .el-table__body {
        /deep/.el-table__cell {
          /deep/.cell {
            margin-left: 12px;
          }
        }
      }
    }
    .nav-bar {
      margin-bottom: 22px;
    }
    .m-loan-account-details-content {
      width: 940px;
      display: flex;
      flex-wrap: wrap;
      margin-left: 78px;
      // margin-bottom: 36px;
      .detailItem:not(:last-child) {
        margin-bottom: 16px;
      }
    }
    .m-revolving-term-loan-details-content {
      .m-revolving-term-loan-details-content-top {
        width: 940px;
        display: flex;
        flex-wrap: wrap;
        margin-left: 78px;
        margin-bottom: 8px;
        .detailItem:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
  }
}
.f-btn {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
@media (min-width: 1440px) {
  .asset-view {
    .el-pagination {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>