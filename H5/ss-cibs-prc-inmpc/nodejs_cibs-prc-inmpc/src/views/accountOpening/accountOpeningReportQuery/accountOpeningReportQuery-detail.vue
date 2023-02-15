<!-- 開戶申請記錄詳情 -->
<template>
  <div>
    <section>
      <div class="instant-head">
        <div>
          <span>{{ $t('RAO_CHECK.REF_NO_SYMBOL') }} </span>
          <span>{{ referenceNumber }}</span>
        </div>
        <div>
          <span>{{ $t('RAO_CHECK.CREATE_TIME_SYMBOL') }} </span>
          <span>{{ applicationInfo.creationTime }}</span>
        </div>
        <div>
          <span>{{ $t('RAO_CHECK.APPLICATION_TIME_SYMBOL') }} </span>
          <span>{{ applicationInfo.submitTime }}</span>
        </div>
        <div>
          <span>{{ $t('RAO_CHECK.STAFF_NUMBER_SYMBOL') }} </span>
          <span>{{ getUserName }}</span>
        </div>
      </div>
    </section>
    <!-- 基本信息 -->
    <section>
      <customerBaseInfo 
        ref="customerBaseInfo" 
        :customerInfo="customerInfo" 
        :operateType="operateType" 
        :applicationInfo="applicationInfo" 
        :checkType="'2'" />
    </section>
    <!-- 资料信息 -->
    <section>
      <customerInformation 
        :referenceNumber="referenceNumber"
        :fileInfos="fileInfos"
        :operateType="operateType"
        :status="applicationInfo.status"
        :isAddDoc="applicationInfo.isAddDoc"
        :identityType="customerInfo.identityType"
        :dmsStatus="dmsStatus"
        :checkType="'2'"
        :supportingType="applicationInfo.supportingType" />
    </section>
    <!-- 地址信息 -->
    <section>
      <customerAdressInfo
        :residenceAddress="addressInfo.residenceAddress"
        :communicationAddress="addressInfo.communicationAddress"
        :addrSameAsCorr="applicationInfo.addrSameAsCorr"
        ref="addresRef"
        :checkType="'2'"
      />
    </section>
    <!-- 开户信息 -->
    <section>
      <div class="transverse-table">
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.ACCOUNT_OPENING_INFO') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.CAPITAL_SOURCE') }}</div>
          <div>
            <el-checkbox-group v-model="applicationInfo.sourceOfFund" class="el-check-readonly" onclick="return false">
              <el-checkbox 
                v-for="item in capltalSourceList" 
                :key="item.value" 
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
              <el-input class="f-w-340 m-l-8" v-model="applicationInfo.sourceOfFundOther" readonly></el-input>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.INITIALAND_ONGOING_SOURCE') }}</div>
          <div>
            <el-checkbox-group v-model="applicationInfo.sustainIncomeSource" class="el-check-readonly" onclick="return false">
              <el-checkbox 
                v-for="item in initOngSourceList" 
                :key="item.value" 
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
              <el-input class="f-w-340 m-l-8" v-model="applicationInfo.sustainIncomeSourceOther" readonly></el-input>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.MONTHLY_PERSONAL_INCOME') }}</div>
          <div>{{ valueToLabel(monthlyIncomeList, applicationInfo.monthlyPersonIncome) }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.ESTIMATED_NET_WORTH') }}</div>
          <div>{{ valueToLabel(netWorthList, applicationInfo.netAsset) }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.MAIN_TRANSACTION_CATEGORY') }}</div>
          <div>
            <el-checkbox-group v-model="applicationInfo.tradeType" class="el-check-readonly" onclick="return false">
              <el-checkbox 
                v-for="item in transactionTypeList" 
                :key="item.value" 
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
              <el-input class="f-w-340 m-l-8" v-model="applicationInfo.tradeTypeOther" readonly></el-input>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.PUROSEOF_OPENING_ACCOUNT') }}</div>
          <div>
            <el-checkbox-group v-model="applicationInfo.acctOpeningPurpose" class="el-check-readonly" onclick="return false">
              <el-checkbox 
                v-for="item in openAccountPurposeList" 
                :key="item.value" 
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
              <el-input class="f-w-340 m-l-8" v-model="applicationInfo.acctOpeningPurposeOther" readonly></el-input>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row" v-if="customerInfo.identityType !== 'HKPID'">
          <div>{{ $t('RAO_CHECK.PUROSEOF_OPENING_ACCOUNT_IN_HK') }}</div>
          <div>
            <el-checkbox-group v-model="applicationInfo.acctOpeningPurposeHk" class="el-check-readonly" onclick="return false">
              <el-checkbox 
                v-for="item in purposeHKList"
                :key="item.value" 
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
              <el-input class="f-w-340 m-l-8" v-model="applicationInfo.acctOpeningPurposeHkOther" readonly></el-input>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.INDUSTRY_OF_EMPLOYER') }}</div>
          <div>
            {{ businessObj[applicationInfo.industry] }} 
            <el-input v-if="applicationInfo.industry === '9501'" class="f-w-340 m-l-8" v-model="applicationInfo.industryOther" readonly></el-input>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.JOB_POSITION') }}</div>
          <div>
            {{ jobObj[applicationInfo.workPlace] }}
            <el-input v-if="applicationInfo.workPlace === '2402'" class="f-w-340 m-l-8" v-model="applicationInfo.workPlaceOther" readonly></el-input>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.REASONSFORSELECTINGOUR_BANK_SERVICES') }}</div>
          <div>
            <el-checkbox-group v-model="applicationInfo.reasionsForChoosBank" class="el-check-readonly" onclick="return false">
              <el-checkbox
                v-for="item in reasonForBankList"
                :key="item.value"
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
              <el-input class="f-w-340 m-l-8" v-model="applicationInfo.reasionsForChoosBankOther" readonly></el-input>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.BRANCH_DISTRICT') }}</div>
          <div>{{ allBranchObj[applicationInfo.areaNumber] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.BRANCH') }}</div>
          <div>{{ allBranchObj[applicationInfo.brachNumber] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.AUTO_EXCH_ACCT_AGREEMENT') }}</div>
          <div>{{ yesNo[applicationInfo.taxedAgreement] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.WHETHER_TO_PAY_TAX_ONLY_IN_HONGKONG') }}</div>
          <div>{{ yesNo[applicationInfo.isTaxedHk] }}</div>
        </div>
        <div v-for="(item, index) in applicationInfo.crsList" :key="index">
          <div class="row">
            <div>{{ $t('RAO_CHECK.JURISDICTIONOF_RESIDENCE') }}-{{ index+1 }}</div>
            <div>{{ countryObj[item.countryName] }}</div>
          </div>
          <div class="row">
            <div>{{ $t('RAO_CHECK.TIN_NO') }}-{{ index+1 }}</div>
            <div>{{ item.tin }}</div>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.US_TAX_DECLARATION') }}</div>
          <div>{{ yesNo[applicationInfo.taxedDeclaration] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.VOLUNTARY_TAX_COM_TITLE') }}</div>
          <div>
            {{ yesNo[applicationInfo.taxedPlan] }}&nbsp;&nbsp;
            <span v-if="applicationInfo.taxedPlan === 'Y'"> -- {{ countryObj[applicationInfo.taxedCountry] }}</span>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.APPLY_HK_RESIDENT_OR_NO_HK_RESIDENT_RMB_SERVICE') }}</div>
          <div>{{ RMBService }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.RELATIONSHIP_WITH_BANK') }}</div>
          <div>{{ bankRelationshipObj[applicationInfo.isBankOfStaff] }}</div>
        </div>
        <div class="row">
          <template v-if="applicationInfo.isBankOfStaff == 'A' || applicationInfo.isBankOfStaff == 'B'">
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.COMPANY_NAME') }}</div>
            <div>{{ applicationInfo.isBankOfStaff == 'A' ? applicationInfo.employeCompanyName : applicationInfo.relativeCompanyName }}</div>
          </template>
          <template v-if="applicationInfo.isBankOfStaff == 'B'">
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.RELATIVES_NAME') }}</div>
            <div>{{ applicationInfo.nameRelatives }}</div>
          </template>
        </div>
        <div class="row" v-if="applicationInfo.isBankOfStaff == 'B'">
          <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.RELATIONSHIP') }}</div>
          <div>{{ relationShipObj[applicationInfo.relationship] }}</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.POSITON') }}</div>
          <div>{{ applicationInfo.position }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.NO_WANT_TO_PROMOTE_ME') }}</div>
          <div>
            <el-checkbox-group v-model="market" class="el-check-readonly" onclick="return false">
              <el-checkbox 
                v-for="item in marketList" 
                :key="item.value" 
                :label="item.value"
                readonly
              > {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="row" v-if="customerInfo.customerType !== 'NEW'">
          <div>{{ $t('RAO_CHECK.SIGNATURE') }}</div>
          <div>{{ applicationInfo.singtrue }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.ONLINE_BANK_ACC') }}</div>
          <div>{{ applicationInfo.pibLoginName }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.OPEN_SAT') }}</div>
          <div>{{ yesNo[applicationInfo.smallTransferFlage] }}</div>
          <template v-if="applicationInfo.smallTransferFlage === 'Y'">
            <div>{{ $t('RAO_CHECK.SAT') }}</div>
            <div>{{ applicationInfo.smallTransferMoney }}</div>
          </template>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.tfa') }}</div>
          <div>{{ yesNo[applicationInfo.dualAuthFlage] }}</div>
        </div>
      </div>
    </section>
    <!-- 开户结果 -->
    <section>
      <accountOpeningResult :accountResult="raoApplicationStageVO"></accountOpeningResult>
    </section>
    <!-- AML结果 -->
    <section>
      <AMLResult :aml-result="amlResult"></AMLResult>
    </section>
    <!-- 邀请码 -->
    <section>
      <div class="transverse-table">
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.CHANNEL_CODE') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.CHANNEL_CODE') }}</div>
          <div>{{ applicationInfo.referralCode }}</div>
        </div>
      </div>
    </section>
    <!-- 开户状态 -->
    <section>
      <div class="transverse-table">
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.ACCOUNT_OPEN_STATUS') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.ACCOUNT_OPEN_STATUS') }}</div>
          <div>{{ applicationInfo.status }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.ACCOUNT_OPEN_FLAG') }}</div>
          <div>{{ applicationInfo.isHappyFlow === 'Y' ? $t('RAO_CHECK.AUTO') : applicationInfo.isHappyFlow === 'N' ? $t('RAO_CHECK.MANUAL'): '' }}</div>
        </div>
      </div>
    </section>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
      <el-button v-if="infoConfirmBtnShow" type="primary" @click="infoConfirm">{{ $t('RAO_CHECK.INFO_CONFIRM') }}</el-button>
    </div>
  </div>
</template>

<script>
import customerBaseInfo from '../components/customer-base-info'
import customerInformation from '../components/customer-information'
import customerAdressInfo from '../components/customer-adress-info'
import accountOpeningResult from '../components/account-opening-result'
import AMLResult from '../components/aml-result'
import {
  queryAccountOpenDetail,
  confirmAccInfo
} from '@/api/accountOpening/accountOpeningCheck'
import { getRoleDetail } from '@/utils/user';
import branchMixin from '@/mixins/branch-list'
import dataDitionaryMixin from '@/mixins/dataDitionary-list'
import CONSTANTS from '@/utils/constant';
const {
  CAPLTAL_SOURCE_LIST,
  TRADE_TYPE_LIST,
  ACCT_OPEN_PUR_LIST,
  PURPOSE_HK_LIST,
  INIT_ONG_SOURCE_LIST,
  MARKET_LIST,
  MONTHLY_INCOME_LIST,
  NET_WORTH_LIST,
  TAX_DECLARATION_LIST,
  REASON_FOR_BANK,
  BANK_RELATION,
  RELATION_SHIP_OBJ,
  YES_NO
} = CONSTANTS;
export default {
  name: 'AccountOpeningCheckDetail',
  mixins: [branchMixin, dataDitionaryMixin],
  components: {
    customerBaseInfo,
    customerInformation,
    customerAdressInfo,
    accountOpeningResult,
    AMLResult
  },

  data() {
    return {
      referenceNumber: '', // 参考编号
      customerInfo: {}, // 客户基本信息
      addressInfo: {}, // 地址信息
      applicationInfo: {
        sourceOfFund: [], // 资金来源
        sustainIncomeSource: [], // 初次和持续收入来源
        tradeType: [], // 主要交易类别
        acctOpeningPurpose: [], // 开户目的
        acctOpeningPurposeHk: [], // 在港开户目的
        reasionsForChoosBank: [], // 選擇我們銀行服務的原因
      }, // 开户信息
      fileInfos: {}, // 文件信息
      raoMakerCheckerList: [], // 备注信息列表
      raoApplicationStageVO: {}, // 开户信息列表
      businessObj: {}, // 行业
      jobObj: {}, // 岗位
      allBranchObj: {}, // 所有分行区域
      countryObj: {}, // 国家map
      reasonForBankList: REASON_FOR_BANK, // 选择银行服务的原因
      remark: '', // 备注
      capltalSourceList: CAPLTAL_SOURCE_LIST, // 资金来源列表
      initOngSourceList: INIT_ONG_SOURCE_LIST, // 初次和持续收入来源列表
      monthlyIncomeList: MONTHLY_INCOME_LIST, // 每月个人入息
      netWorthList: NET_WORTH_LIST, // 估值净资产
      transactionTypeList: TRADE_TYPE_LIST, // 主要交易类别列表
      openAccountPurposeList: ACCT_OPEN_PUR_LIST, // 开户目的列表
      purposeHKList: PURPOSE_HK_LIST, // 在港开户目的列表
      USTaxDelarationList: TAX_DECLARATION_LIST, // 美国税务声明
      market: [], // 我不希望银行使用我的个人资料向我促销
      marketList: MARKET_LIST, // 我不希望银行使用我的个人资料向我促销
      bankRelationshipObj: BANK_RELATION, // 与银行关系
      relationShipObj: RELATION_SHIP_OBJ, // 親友关系
      yesNo: YES_NO,
      countryList: [], // 国家列表
      operateType: '', // view or check or confirm
      dmsStatus: '', // 归档状态
      amlResult: {}
    };
  },
  computed: {
    // 获取当前登录的用户名
    getUserName() {
      return getRoleDetail().userName
    },
    // 申请香港居民/非香港居民人民币服务判断
    RMBService() {
      return this.customerInfo.identityType && [ 'HKPID', 'HKID' ].includes(this.customerInfo.identityType)
        ? this.$t('RAO_CHECK.APPLY_HK_RMB_SERVICE')
        : this.$t('RAO_CHECK.APPLY_NO_HK_RMB_SERVICE')
    },
    // maker的操作
    makerOperate() {
      return ['分行 Maker', '中台 Maker'].includes(getRoleDetail().roleName) &&  this.applicationInfo.status === 'Pending for info maker';
    },
    // checker的操作
    checkerOperate() {
      return ['分行 Checker', '中台 Checker'].includes(getRoleDetail().roleName) &&  this.applicationInfo.status === 'Pending for info checker';
    },
    // 信息確認btn
    infoConfirmBtnShow() {
      return this.operateType === 'confirm' && ['Partly completed', 'Confirm completed'].includes(this.applicationInfo.status);
    },
  },
  activated() {
    if (this.$route.query.referenceNumber) {
      this.referenceNumber = this.$route.query.referenceNumber;
      this.operateType = this.$route.query.operateType;
      // console.log("operateType", this.$route.query.operateType)
      this.init();
      this.$route.query.referenceNumber = ''
      this.$route.query.operateType = ''
    } else {
      return
    }
  },
  async mounted() {
    // 行業
    this.businessObj = await this.dataDitionaryListToObj('INDUSTRY');
    // 崗位
    this.jobObj = await this.dataDitionaryListToObj('JOB');
    // 國家
    this.countryObj = await this.dataDitionaryListToObj('COUNTRY');
    // 分行
    let allBranchList = await this.initBranchList();
    allBranchList.forEach(item => {
      this.$set(this.allBranchObj, item.brhId, item.brhName)
    });
  },

  methods: {
    // 初始化详情数据
    async init() {
      let params = {
        referenceNumber: this.referenceNumber
      }
      let result = await queryAccountOpenDetail(params);
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        if (result.body) {
          this.detailInfo = result.body;
          let {
            customerInfo,
            address,
            application,
            fileInfos,
            raoApplicationStageVO,
            raoMakerCheckerList,
            dmsStatus
          } = result.body;
          this.customerInfo = customerInfo;
          this.addressInfo = address;
          this.applicationInfo = application;
          this.fileInfos = fileInfos;
          this.raoMakerCheckerList = raoMakerCheckerList;
          this.raoApplicationStageVO = raoApplicationStageVO;
          this.dmsStatus = dmsStatus
          this.market = [
            this.applicationInfo.marketingSMS === 'Y' ? 'SMS' : '',
            this.applicationInfo.marketingEmail === 'Y' ? 'EMAIL' : '',
            this.applicationInfo.marketingPost === 'Y' ? 'DMAIL' : '',
            this.applicationInfo.marketingPhone === 'Y' ? 'TEL' : '',
            this.applicationInfo.marketingThirdParty === 'Y' ? 'PTY' : ''
          ]
          this.applicationInfo.reasionsForChoosBank = application.reasionsForChoosBank.split(',')
          this.amlResult = {
            eCaraRiskRating: result.body.ecaraRiskRating,
            eCaraRiskResult: result.body.ecaraRiskResult,
            eCaraRiskReview: result.body.ecaraRiskReview,
            eCaraRiskScore: result.body.ecaraRiskScore,
          }
        }
      }
    },
    // 返回
    backTo() {
      if (this.operateType === 'confirm' || this.operateType === 'confirmView') {
        this.$router.push('/accountOpening/accountOpeningCheck');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/accountOpeningCheck/confirmDetail' || this.$store.getters.getActiveTab
        );
      } else {
        this.$router.push('/accountOpening/accountOpeningReportQuery');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/accountOpeningReportQuery/detail' || this.$store.getters.getActiveTab
        );
      }
    },
    // 信息确认
    infoConfirm() {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_INFO_CONFIRM'),
        confirm: () => {
          this.onlineConfirm();
        },
        cancel: () => {}
      });
    },
    // 线上确认调用
    async onlineConfirm() {
      let params = {
        referenceNumber: this.referenceNumber
      }
      let result = await confirmAccInfo(params);
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        if (result.body) {
          this.$showMsg({
            message: result.head.returnMessage,
            type: 'success'
          });
          this.init()
        }
      }
    },
    // list to obj
    async dataDitionaryListToObj(otp) {      
      let list = await this.getDataDitionaryListMixin(otp)
      let obj = {};
      list.forEach(item => {
        obj[item.id] = item.value
      })
      return obj
    },
    // value to label
    valueToLabel(list, val) {
      let label = '';
      list.forEach(item => {
        if(item.value === val) {
          label = item.label
        }
      });
      return label
    },
  }
};
</script>

<style lang="scss" scoped>
.instant-head {
  display: flex;
  justify-content: space-around;
  font-size: 14px;
}
.g-bottom {
  margin: 36px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
::v-deep .el-tabs__item {
  font-size: 16px;
  padding: 0 20px;
  box-sizing: inherit !important;
}
// .transverse-table {
//   margin-top: 25px;
// }
.f-w-340 {
  width: 340px;
}
.m-l-8{
  margin-left: 8px
}
</style>
