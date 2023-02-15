<!-- 投资户开户记录查询详情 -->
<template>
  <div>
    <section>
      <div class="instant-head">
        <div>
          <span>{{ $t('RAO_CHECK.REF_NO_SYMBOL') }} </span>
          <span>{{ referenceNumber }}</span>
        </div>
        <!-- <div>
          <span>{{ $t('RAO_CHECK.CREATE_TIME_SYMBOL') }} </span>
          <span>{{ applicationInfo.creationTime }}</span>
        </div> -->
        <div>
          <span>{{ $t('RAO_CHECK.APPLICATION_TIME_SYMBOL') }} </span>
          <span>{{ eiaoApplicationVO.creationTime }}</span>
        </div>
        <div>
          <span>{{ $t('RAO_CHECK.STAFF_NUMBER_SYMBOL') }} </span>
          <span>{{ getUserName }}</span>
        </div>
      </div>
    </section>
    <!-- 基本信息 -->
    <section>
      <customerBaseInfo ref="customerBaseInfo" :customerInfo="customerInfo" :operateType="operateType" />
    </section>
    <!-- 资料信息 -->
    <section>
      <customerInformation 
        :referenceNumber="referenceNumber"
        :fileInfos="fileInfos"
        :operateType="operateType"
        :status="eiaoApplicationVO.status"
        :isAddDoc="eiaoApplicationVO.isAddDoc"
        :identityType="customerInfo.identityType"
        :checkType="'4'" />
    </section>
    <!-- 地址信息 -->
    <section>
      <customerAdressInfo
        :communicationAddress="applicationInfo.addrSameAsCorr === 'Y' ? addressInfo.residenceAddress : addressInfo.communicationAddress"
        :addrSameAsCorr="applicationInfo.addrSameAsCorr"
        ref="addresRef"
        :checkType="'4'"
      />
    </section>
    <!-- 开户信息 -->
    <section>
      <div class="transverse-table">
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.ACCOUNT_OPENING_INFO') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.EMPLOYER_COMPANY') }}</div>
          <div>{{ eiaoApplicationVO.eiaoCompanyName }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.INDUSTRY') }}</div>
          <div>
            {{ businessObj[applicationInfo.industry] }} 
            <el-input v-if="applicationInfo.industry === '9501'" class="f-w-340 m-l-8" v-model="applicationInfo.industryOther" readonly></el-input>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.POSITON') }}</div>
          <div>
            {{ jobObj[applicationInfo.workPlace] }}
            <el-input v-if="applicationInfo.workPlace === '2402'" class="f-w-340 m-l-8" v-model="applicationInfo.workPlaceOther" readonly></el-input>
          </div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.IPQ_RESULT') }}</div>
          <div>{{ ipqObj[eiaoApplicationVO.originalRiskLevel] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.RELATIONSHIP_WITH_BANK') }}</div>
          <div>{{ bankRelationshipObj[applicationInfo.isBankOfStaff] }}</div>
        </div>
        <div class="row">
          <template v-if="applicationInfo.isBankOfStaff == 'A' || applicationInfo.isBankOfStaff == 'B'">
            <div>{{ $t('RAO_CHECK.COMPANY_NAME') }}</div>
            <div>{{ applicationInfo.isBankOfStaff == 'A' ? applicationInfo.employeCompanyName : applicationInfo.relativeCompanyName }}</div>
          </template>
          <template v-if="applicationInfo.isBankOfStaff == 'B'">
            <div>{{ $t('RAO_CHECK.RELATIVES_NAME') }}</div>
            <div>{{ applicationInfo.nameRelatives }}</div>
          </template>
        </div>
        <div class="row" v-if="applicationInfo.isBankOfStaff == 'B'">
          <div>{{ $t('RAO_CHECK.RELATIONSHIP') }}</div>
          <div>{{ relationShipObj[applicationInfo.relationship] }}</div>
          <div>{{ $t('RAO_CHECK.POSITON') }}</div>
          <div>{{ applicationInfo.position }}</div>
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
          <div>{{ $t('RAO_CHECK.MCY_ACCT_NO') }}</div>
          <div>{{ applicationInfo.mcyAcct }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.ACCOUNT_OPEN_STATUS') }}</div>
          <div>{{ eiaoApplicationVO.status }}</div>
        </div>
      </div>
    </section>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
    </div>
  </div>
</template>

<script>
import customerBaseInfo from '../components/customer-base-info'
import customerInformation from '../components/customer-information'
import customerAdressInfo from '../components/customer-adress-info'
// import accountOpeningResult from '../components/account-opening-result'
// import infoCheck from '../components/info-check'
// import remarkInfo from '../components/remark-info.vue'
import {
  queryEiaoDetail,
} from '@/api/accountOpening/investmentAccountOpeningCheck'
import { getRoleDetail } from '@/utils/user';
import branchMixin from '@/mixins/branch-list'
import dataDitionaryMixin from '@/mixins/dataDitionary-list'
import CONSTANTS from '@/utils/constant';
const {
  BANK_RELATION,
  RELATION_SHIP_OBJ,
  IPQ_OBJ
} = CONSTANTS;
export default {
  name: 'AccountOpeningCheckDetail',
  mixins: [branchMixin, dataDitionaryMixin],
  components: {
    customerBaseInfo,
    customerInformation,
    customerAdressInfo,
    // accountOpeningResult,
    // infoCheck,
    // remarkInfo
  },

  data() {
    return {
      referenceNumber: '', // 参考编号
      customerInfo: {}, // 客户基本信息
      addressInfo: {}, // 地址信息
      applicationInfo: {}, // 开户信息
      eiaoApplicationVO: {}, // 投资户开户信息
      fileInfos: {}, // 文件信息
      raoMakerCheckerList: [], // 备注信息列表
      businessObj: {}, // 行业
      jobObj: {}, // 岗位
      remark: '',
      bankRelationshipObj: BANK_RELATION, // 与银行关系
      relationShipObj: RELATION_SHIP_OBJ, // 親友关系
      ipqObj: IPQ_OBJ, // ipq映射对象
      countryList: [], // 国家列表
      operateType: '', // view check investment
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
    // PCSD的操作
    pcsdOperate() {
      return getRoleDetail().roleName === 'PCSD' &&  this.eiaoApplicationVO.status === 'Pending for info maker'
    },
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
  },

  methods: {
    // 初始化详情数据
    async init() {
      let params = {
        referenceNumber: this.referenceNumber
      }
      let result = await queryEiaoDetail(params);
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        if (result.body) {
          this.detailInfo = result.body;
          let {customerInfo, address, application, eiaoApplicationVO, fileInfos, raoMakerCheckerList} = result.body;
          this.customerInfo = customerInfo;
          this.addressInfo = address;
          this.applicationInfo = application;
          this.eiaoApplicationVO = eiaoApplicationVO;
          this.fileInfos = fileInfos;
          this.raoMakerCheckerList = raoMakerCheckerList;
        }
      }
    },
    // 返回
    backTo() {
      this.$router.push('/accountOpening/investmentAccountApplyQuery');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/accountOpening/investmentAccountApplyQuery/detail' || this.$store.getters.getActiveTab
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
</style>
