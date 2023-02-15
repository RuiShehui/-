<!-- 開戶審核詳情 -->
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
        :checkType="'1'" />
    </section>
    <!-- 资料信息 -->
    <section>
      <customerInformation 
        :referenceNumber="referenceNumber"
        :fileInfos="fileInfos"
        :operateType="operateType"
        :status="applicationInfo.status"
        :isAddDoc="isAddDoc"
        :identityType="customerInfo.identityType"
        :checkType="'1'"
        :dmsStatus="dmsStatus"
        :supportingType="applicationInfo.supportingType" />
    </section>
    <!-- 地址信息 -->
    <section>
      <customerAdressInfo
        :residenceAddress="addressInfo.residenceAddress"
        :communicationAddress="addressInfo.communicationAddress"
        :addrSameAsCorr="applicationInfo.addrSameAsCorr"
        ref="addresRef"
        :checkType="'1'"
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
    <!-- <section>
      <accountOpeningResult></accountOpeningResult>
    </section> -->
    <!-- 存量客户信息 -->
    <section>
      <stockAccountInfo :stockAccountInfos="raoApplicationStageVO" v-if="stockAccountInfoShow"></stockAccountInfo>
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
        <div class="row" v-show="applicationInfo.isHappyFlow">
          <div>{{ $t('RAO_CHECK.ACCOUNT_OPEN_FLAG') }}</div>
          <div>{{ applicationInfo.isHappyFlow === 'Y' ? $t('RAO_CHECK.AUTO') : applicationInfo.isHappyFlow === 'N' ? $t('RAO_CHECK.MANUAL'): '' }}</div>
        </div>
      </div>
    </section>
    <!-- 信息检查 -->
    <infoCheck ref="infoCheck" 
      :operateType="operateType" 
      :custInfoScoreResultVos="custInfoScoreResultVos"
      :scoreResult="scoreResult"
    ></infoCheck>
    <!--  AML结果输入 -->
    <section>
      <div class="transverse-table" v-if="makerOperate">
        <div class="row">
          <div id="title">{{  $t('RAO_CHECK.AMLRESULT') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.AML_RISK_CODE') }}</div>
          <div>
              <el-input class="f-w-340 m-l-8" v-model="amlResult.eCaraRiskResult" maxlength="5" :placeholder="$t('COMMON.PLEASE_INPUT')"></el-input>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.AML_TOTAL_RISK_CODE') }}</div>
          <div>
            <el-input class="f-w-340 m-l-8" v-model.trim="amlResult.eCaraRiskScore" :placeholder="$t('COMMON.PLEASE_INPUT')" maxlength="5"></el-input>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.AML_RISK_LEVEL') }}</div>
          <div>
            <el-select
              class="g-w-270"
              v-model="amlResult.eCaraRiskRating"
              :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
              ">
              <el-option
                v-for="(item, key) in eCaraRiskRatingList"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.AML_REVIEW_LEVEL') }}</div>
          <div>
            <el-select
              class="g-w-270"
              v-model="amlResult.eCaraRiskReview"
              :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
              ">
              <el-option
                v-for="(item, key) in eCaraRiskReviewList"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <AMLResult v-else :aml-result="amlResult"></AMLResult>
    </section>
    <!-- 拒绝原因 -->
    <section>
      <div class="transverse-table">
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.REJECT_REASON') }}</div>
        </div>
        <div class="row">
          <div class="w-100-bg-fff">
            <el-input
              type="input"
              v-model="rejectResion"
              maxlength="50"
              :disabled="!makerOperate"
              :placeholder="$t('COMMON.PLEASE_INPUT')"
            />
          </div>
        </div>
      </div>
    </section>
    <!-- 备注信息 -->
    <section>
      <remarkInfo ref="remarkInfo" :raoRemarkList="raoMakerCheckerList"></remarkInfo>
    </section>
    <template>
      <el-form style="width: 100%; margin: 25px 0">
        <el-form-item :label="$t('RAO_CHECK.REMARK')" v-if="makerOperate || checkerOperate || MCISMakerOperate || MCISCheckerOperate || amenderOperate">
          <el-input
            type="textarea"
            rows="4"
            v-model="remark"
            maxlength="200"
            resize="none"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="g-bottom">
        <template v-if="makerOperate">
          <el-button class="f-cancel" @click="unlock">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="danger" @click="makerRefuse('Reject')">{{ $t('RAO_CHECK.CHECK_REJECT') }}</el-button>
          <el-button type="primary" @click="makerApproved('Approve')">{{ $t('RAO_CHECK.CHECK_PASS') }}</el-button>
        </template>
        <template v-if="checkerOperate">
          <el-button class="f-cancel" @click="unlock">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="danger" @click="checkerRefuse('BackToMaker')">{{ $t('RAO_CHECK.REFUSE') }}</el-button>
          <el-button type="primary" @click="checkerApproved('Confirm')">{{ $t('RAO_CHECK.ADOPT') }}</el-button>
        </template>
        <template v-if="MCISMakerOperate">
          <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="danger" @click="MCISMakerRefuse('Reject')">{{ $t('RAO_CHECK.BACK_UPDATE') }}</el-button>
          <el-button type="primary" @click="MCISMakerApproved('Approve')">{{ $t('RAO_CHECK.CHECK_PASS') }}</el-button>
        </template>
        <template v-if="MCISCheckerOperate">
          <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="danger" @click="MCISCheckerRefuse('BackToMaker')">{{ $t('RAO_CHECK.CHECK_REJECT') }}</el-button>
          <el-button type="primary" @click="MCISCheckerApproved('Confirm')">{{ $t('RAO_CHECK.CHECK_PASS') }}</el-button>
        </template>
        <template v-if="amenderOperate">
          <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="primary" @click="amenderApproved()">{{ $t('RAO_CHECK.UPDATE_DONE') }}</el-button>
        </template>
      </div>
    </template>
    <template v-if="operateType === 'view'">
      <div class="g-bottom">
        <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import customerBaseInfo from '../components/customer-base-info'
import customerInformation from '../components/customer-information'
import customerAdressInfo from '../components/customer-adress-info'
import accountOpeningResult from '../components/account-opening-result'
import stockAccountInfo from '../components/stock-account-info.vue'
import infoCheck from '../components/info-check'
import remarkInfo from '../components/remark-info.vue'
import AMLResult from '../components/aml-result'
import {
  queryAccountOpenDetail,
  makerSubmit,
  checkerSubmit,
  binding,
  confirmAccInfo,
  mcismaker,
  mcischecker,
  amenderApprove
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
  YES_NO,
  ECARA_RISK_RATEING_LIST,
  ECARA_RISK_REVIEW_LIST
} = CONSTANTS;
export default {
  name: 'AccountOpeningCheckDetail',
  mixins: [branchMixin, dataDitionaryMixin],
  components: {
    customerBaseInfo,
    customerInformation,
    customerAdressInfo,
    accountOpeningResult,
    stockAccountInfo,
    infoCheck,
    remarkInfo,
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
      custInfoScoreResultVos: [], // 综合评定结果
      scoreResult: {}, // 综合评定值
      businessObj: {}, // 行业
      jobObj: {}, // 岗位
      allBranchObj: {}, // 所有分行区域
      countryObj: {}, // 国家
      reasonForBankList: REASON_FOR_BANK, // 选择银行服务的原因
      remark: '', // 备注
      rejectResion: '', // 拒絕原因
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
      operateType: '', // view or check
      eCaraRiskRatingList: ECARA_RISK_RATEING_LIST,
      eCaraRiskReviewList: ECARA_RISK_REVIEW_LIST,
      amlResult:{
        eCaraRiskResult: '',
        eCaraRiskScore: '',
        eCaraRiskRating: '',
        eCaraRiskReview:''
      },
      // 归档状态
      dmsStatus: ''
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
      return ['分行 Maker', '中台 Maker'].includes(getRoleDetail().roleName) &&  this.applicationInfo.status === 'Pending for info maker' && this.operateType === 'check'
    },
    // checker的操作
    checkerOperate() {
      return ['分行 Checker', '中台 Checker'].includes(getRoleDetail().roleName) &&  this.applicationInfo.status === 'Pending for info checker' && this.operateType === 'check'
    },
    // MCIS Maker
    MCISMakerOperate() {
      return ['Partly completed', 'Confirm completed','Pending for MCIS maker'].includes(this.applicationInfo.status) && ['MCIS Maker'].includes(getRoleDetail().roleName) && this.operateType === 'confirm'
    },
    // MCIS Checker
    MCISCheckerOperate() {
      return ['Pending for MCIS checker'].includes(this.applicationInfo.status) && ['MCIS Checker'].includes(getRoleDetail().roleName) && this.operateType === 'confirm'
    },
    // Amender
    amenderOperate() {
      return ['Pending for amender'].includes(this.applicationInfo.status) && ['Amender'].includes(getRoleDetail().roleName) && this.operateType === 'confirm'
    },
    // 存量客户信息显示
    stockAccountInfoShow() {
      return ['PROSPECT', 'DEPOSIT', 'NONDEP'].includes(this.customerInfo.customerType)
    },
    // 補充資料
    isAddDoc() {
      if (['MCIS Maker', 'MCIS Checker', 'Amender'].includes(getRoleDetail().roleName)) {
        return '1'
      }
      return this.applicationInfo.isAddDoc
    },
    // 禁用下一步
    isBtnDisabled () {
      return this.dmsStatus === 'System failure'
    }
  },
  activated() {
    if (this.$route.query.referenceNumber) {
      this.referenceNumber = this.$route.query.referenceNumber;
      this.operateType = this.$route.query.operateType;
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
            custInfoScoreResultVos,
            scoreResult
          } = result.body;
          this.customerInfo = customerInfo;
          this.addressInfo = address;
          this.applicationInfo = application;
          this.rejectResion = application.rejectResion
          this.fileInfos = fileInfos;
          this.raoMakerCheckerList = raoMakerCheckerList;
          this.raoApplicationStageVO = raoApplicationStageVO;
          this.custInfoScoreResultVos = custInfoScoreResultVos;
          this.scoreResult = JSON.parse(scoreResult);
          this.amlResult = {
            eCaraRiskRating: result.body.ecaraRiskRating,
            eCaraRiskResult: result.body.ecaraRiskResult,
            eCaraRiskReview: result.body.ecaraRiskReview,
            eCaraRiskScore: result.body.ecaraRiskScore,
          }
          console.log('amlResult', this.amlResult)
          // 归档状态
          this.dmsStatus = result.body.dmsStatus
          this.market = [
            this.applicationInfo.marketingPhone === 'Y' ? 'TEL' : '',
            this.applicationInfo.marketingSMS === 'Y' ? 'SMS' : '',
            this.applicationInfo.marketingEmail === 'Y' ? 'EMAIL' : '',
            this.applicationInfo.marketingPost === 'Y' ? 'DMAIL' : '',
            this.applicationInfo.marketingThirdParty === 'Y' ? 'PTY' : ''
          ];
          this.applicationInfo.reasionsForChoosBank = application.reasionsForChoosBank.split(',');
        }
      }
    },
    // 返回
    backTo() {
      this.$router.push('/accountOpening/accountOpeningCheck');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/accountOpening/accountOpeningCheck/detail' || this.$store.getters.getActiveTab
      );
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
    // maker审核
    async makerCheck(checkType) {
      let supportingNum = this.$refs.customerBaseInfo.applicationInfo.supportingNum
      let supportingSign = this.$refs.customerBaseInfo.applicationInfo.supportingSign
      let scoreResult = JSON.stringify(this.$refs.infoCheck.scoreResult)
      let params = {
        checkType, // 审核的类型 Approve Reject
        checkerName: '', // 审核人名称 后端
        checkerOrgId: '', // 审核人名称 后端
        checkerResion: this.remark, // 审核的理由
        rejectResion: checkType == 'Reject' ? this.rejectResion : '', // 拒絕原因
        referenceNumber: this.referenceNumber, // 开户流水号
        supportingNum, // 辅助证件号码
        supportingSign, // 辅助证件签发国家
        scoreResult, // 综合评定审核结果
        ...this.amlResult
      }
      let result = await makerSubmit(params)
      if (result.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: result.head.returnMessage
        })
        this.$router.push('/accountOpening/accountOpeningCheck');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/accountOpeningCheck/detail' || this.$store.getters.getActiveTab
        );
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },
    // checker审核
    async chekerCheck(actionType) {
      let scoreResult = JSON.stringify(this.$refs.infoCheck.scoreResult)
      let params = {
        actionType, // 审核的类型 Confirm BackToMaker
        checkerName: '', // 审核人名称 后端
        checkerOrgId: '', // 审核人名称 后端
        checkerResion: this.remark, // 审核的理由
        referenceNumber: this.referenceNumber, // 开户流水号
        scoreResult // 综合评定审核结果
      }
      let result = await checkerSubmit(params)
      if (result.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: result.head.returnMessage
        })
        this.$router.push('/accountOpening/accountOpeningCheck');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/accountOpeningCheck/recheckDetail' || this.$store.getters.getActiveTab
        );
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },
    // maker审核拒绝
    makerRefuse(otp) {
      let noSelectBoolean = false
      let scoreResultObj = this.$refs.infoCheck.scoreResult
      for (const key in scoreResultObj) {
        if (scoreResultObj[key] === '') {
          noSelectBoolean = true
        }
      }
      // 信息检查存在未选择项
      if (noSelectBoolean) {
        this.$showBox({
        content: this.$t('RAO_CHECK.INFO_CHECK_NO_SEL'),
        });
        return
      }
      // 拒絕原因不為空
      if (!this.rejectResion) {
        this.$showBox({
        content: this.$t('RAO_CHECK.PLS_INPUT_REJECT_REASON'),
        });
        return
      }
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_CHECK_REJECT'),
        confirm: () => {
          this.makerCheck(otp);
        },
        cancel: () => {}
      });
    },
    // maker审核通过
    makerApproved(otp) {
      if(this.customerInfo.identityType !== 'HKPID') {
        // 校验辅助证件签发国家
        if(!this.$refs.customerBaseInfo.applicationInfo.supportingSign) {
          this.$showBox({
            content: this.$t('RAO_CHECK.PLS_SEL_SUP_ISSUE_COUNTRY'),
          });
          return
        }
        // 校验辅助证件号码
        if(!this.$refs.customerBaseInfo.applicationInfo.supportingNum) {
          this.$showBox({
            content: this.$t('RAO_CHECK.PLS_INPUT_SUP_NO'),
          });
          return
        }
      }
      // 校验检查信息
      let refuseBoolean = false
      let scoreResultObj = this.$refs.infoCheck.scoreResult
      for (const key in scoreResultObj) {
        if (scoreResultObj[key] !== 'Y') {
          refuseBoolean = true
        }
      }
      if (refuseBoolean) {
        this.$showBox({
        content: this.$t('RAO_CHECK.INFO_CHECK_NO_PASS'),
        });
        return
      }
      
      // AML结果没填的时候
      let almBoolean = false
      for (const key in this.AMLResult) {
        if (this.AMLResult[key] !== 'Y') {
          almBoolean = true
        }
      }
      if (almBoolean) {
        this.$showBox({
          content: this.$t('RAO_CHECK.INFO_CHECK_NO_PASS'),
        });
        return
      }
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_CHECK_PASS'),
        confirm: () => {
          this.rejectResion = ''
          this.makerCheck(otp);
        },
        cancel: () => {}
      });
    },
    // checker同意
    checkerApproved(otp) {
      let scoreResult = false
      let scoreResultObj = this.$refs.infoCheck.scoreResult
      // 校验检查信息
      if(this.applicationInfo.makerAction === 'Approve') {
        for (const key in scoreResultObj) {
          if (scoreResultObj[key] !== 'Y') {
            scoreResult = true
          }
        }
        if (scoreResult) {
          this.$showBox({
            content: this.$t('RAO_CHECK.INFO_CHECK_NO_PASS'),
          });
          return
        }
      }
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_ADOPT'),
        confirm: () => {
          this.chekerCheck(otp);
        },
        cancel: () => {}
      });
    },
    // checker拒绝
    checkerRefuse(otp) {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_REFUSE'),
        confirm: () => {
          this.chekerCheck(otp);
        },
        cancel: () => {}
      });
    },
    // 解锁
    async unlock() {
      let params = {
        lockType: 'unlock',
        referenceNumber: this.referenceNumber,
        userCode: getRoleDetail().userCode
      }
      let result = await binding(params);
      if (result.body) {
        this.backTo()
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },
    // MCIS maker  同意
    MCISMakerApproved() {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_ADOPT'),
        confirm: () => {
          this.MCISMakerCheck('Approve');
        },
        cancel: () => {}
      });
    },
    // MCIS maker 拒绝
    MCISMakerRefuse() {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_CHECK_REJECT'),
        confirm: () => {
          this.MCISMakerCheck('Reject');
        },
        cancel: () => {}
      });
    },

    
    // MCIS maker审核
    async MCISMakerCheck(checkType) {
      let supportingNum = this.$refs.customerBaseInfo.applicationInfo.supportingNum
      let supportingSign = this.$refs.customerBaseInfo.applicationInfo.supportingSign
      let scoreResult = JSON.stringify(this.scoreResult)
      let params = {
        checkType, // 审核的类型 Approve Reject
        checkerName: '', // 审核人名称 后端
        checkerOrgId: '', // 审核人名称 后端
        checkerResion: this.remark, // 审核的理由
        rejectResion: checkType == 'Reject' ? this.rejectResion : '', // 拒絕原因
        referenceNumber: this.referenceNumber, // 开户流水号
        supportingNum, // 辅助证件号码
        supportingSign, // 辅助证件签发国家
        scoreResult, // 综合评定审核结果
        ...this.amlResult
      }
      let result = await mcismaker(params)
      if (result.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: result.head.returnMessage
        })
        this.$router.push('/accountOpening/accountOpeningCheck');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/accountOpeningCheck/detail' || this.$store.getters.getActiveTab
        );
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },

    // MCIS checker同意
    MCISCheckerApproved() {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_INFO_CONFIRM'),
        confirm: () => {
          this.MCISCheckerCheck();
        },
        cancel: () => {}
      });
    },

    // MCIS checker拒绝
    MCISCheckerRefuse() {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_REFUSE'),
        confirm: () => {
         this.MCISCheckerCheck('Reject')
        },
        cancel: () => {}
      });
    },

    async MCISCheckerCheck(checkType) {
       let scoreResult = JSON.stringify(this.scoreResult)
          let params = {
            actionType: checkType == 'Reject' ? 'BackToMaker': 'Confirm', // 审核的类型 Confirm BackToMaker
            checkerName: '', // 审核人名称 后端
            checkerOrgId: '', // 审核人名称 后端
            checkerResion: this.remark, // 审核的理由
            referenceNumber: this.referenceNumber, // 开户流水号
            scoreResult // 综合评定审核结果
          }
          let result = await mcischecker(params)
          if (result.head.returnCode === '000000') {
            this.$showMsg({
              type: 'success',
              message: result.head.returnMessage
            })
            this.$router.push('/accountOpening/accountOpeningCheck');
            this.$store.commit(
              'tabs/DELETE_TABS',
              '/accountOpening/accountOpeningCheck/recheckDetail' || this.$store.getters.getActiveTab
            );
          } else {
            this.$showMsg({
              type: 'error',
              message: result.head.returnMessage
            })
          }
    },

    // amender 同意
    amenderApproved() {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_INFO_CONFIRM'),
        confirm: async () => {
          let supportingNum = this.$refs.customerBaseInfo.applicationInfo.supportingNum
          let supportingSign = this.$refs.customerBaseInfo.applicationInfo.supportingSign
          let scoreResult = JSON.stringify(this.scoreResult)
          let params = {
            checkType: 'Approve', // 审核的类型 Approve Reject
            checkerName: '', // 审核人名称 后端
            checkerOrgId: '', // 审核人名称 后端
            checkerResion: this.remark, // 审核的理由
            rejectResion: '', // 拒絕原因
            referenceNumber: this.referenceNumber, // 开户流水号
            supportingNum, // 辅助证件号码
            supportingSign, // 辅助证件签发国家
            scoreResult, // 综合评定审核结果
            ...this.amlResult
          }
          let result = await amenderApprove(params)
          if (result.head.returnCode === '000000') {
            this.$showMsg({
              type: 'success',
              message: result.head.returnMessage
            })
            this.$router.push('/accountOpening/accountOpeningCheck');
            this.$store.commit(
              'tabs/DELETE_TABS',
              '/accountOpening/accountOpeningCheck/detail' || this.$store.getters.getActiveTab
            );
          } else {
            this.$showMsg({
              type: 'error',
              message: result.head.returnMessage
            })
          }
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
.f-w-340 {
  width: 340px;
}
.m-l-8{
  margin-left: 8px
}
.w-100-bg-fff{
  width: 100% !important;
  background-color: #fff !important;
}
</style>
