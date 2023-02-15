<!-- 投资户开户审核详情 -->
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
        :isAddDoc="eiaoApplicationVO.addUpdateTimes > 4 ? eiaoApplicationVO.isAddDoc : '0'"
        :identityType="customerInfo.identityType"
        :checkType="'3'"
        @further-info="furtherInfo"
        />
    </section>
    <!-- 地址信息 -->
    <section>
      <customerAdressInfo
        :communicationAddress="applicationInfo.addrSameAsCorr === 'Y' ? addressInfo.residenceAddress : addressInfo.communicationAddress"
        :addrSameAsCorr="applicationInfo.addrSameAsCorr"
        ref="addresRef"
        :checkType="'3'"
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
              :disabled="!pcsdOperate"
              :placeholder="$t('COMMON.PLEASE_INPUT')"
            />
          </div>
        </div>
      </div>
    </section>
    <section>
      <remarkInfo :raoRemarkList="raoMakerCheckerList"></remarkInfo>
    </section>
    <template v-if="pcsdOperate || pcsdOperateConfirm">
      <el-form style="width: 100%; margin: 25px 0">
        <el-form-item :label="$t('RAO_CHECK.REMARK')">
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
        <template v-if="pcsdOperate">
          <el-button class="f-cancel" @click="unlock">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="danger" @click="refuse('Reject')">{{ $t('RAO_CHECK.CHECK_REJECT') }}</el-button>
          <el-button type="primary" @click="approved('Approve')">{{ $t('RAO_CHECK.CHECK_PASS') }}</el-button>
        </template>
        <template v-if="pcsdOperateConfirm">
          <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
          <el-button type="danger" @click="approvedFail('Fail')">{{ $t('RAO_CHECK.ACC_OPRN_FAIL') }}</el-button>
          <el-button type="primary" :disabled="isBtnDisabled" @click="approvedPass('Success')">{{ $t('RAO_CHECK.ACC_OPRN_SUCCESS') }}</el-button>
        </template>
      </div>
    </template>
    <template v-else>
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
// import accountOpeningResult from '../components/account-opening-result'
// import infoCheck from '../components/info-check'
import remarkInfo from '../components/remark-info.vue'
import {
  queryEiaoDetail,
  eiaoBinding,
  eiaoCheck,
  eiaoResultConfirm
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
    remarkInfo
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
      remark: '', // 备注
      rejectResion: '', // 拒绝原因
      bankRelationshipObj: BANK_RELATION, // 与银行关系
      relationShipObj: RELATION_SHIP_OBJ, // 親友关系
      ipqObj: IPQ_OBJ, // ipq映射对象
      operateType: '', // view check investment
      isBtnDisabled: false // 禁用按钮
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
      return false
      // return getRoleDetail().roleName === 'PCSD' &&  this.eiaoApplicationVO.status === 'Pending for PCSD' && this.operateType === 'investment'
    },
    // PCSD的操作结果确认
    pcsdOperateConfirm() {
      return getRoleDetail().roleName === 'PCSD' &&  this.eiaoApplicationVO.status === 'Pending for PCSD' && this.operateType === 'investment'
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
    // 补充资料
    furtherInfo (status) {
      if (status !== 0) {
        this.isBtnDisabled = true
      }
    },
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
          this.rejectResion = eiaoApplicationVO.rejectResion
        }
      }
    },
    // 返回
    backTo() {
      this.$router.push('/accountOpening/investmentAccountOpeningCheck');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/accountOpening/investmentAccountOpeningCheck/detail' || this.$store.getters.getActiveTab
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
    async pcsdCheck(checkType) {
      let params = {
        checkType, // 审核的类型 Approv Reject
        checkerName: '', // 审核人名称 后端
        checkerOrgId: '', // 审核人名称 后端
        checkerResion: this.remark, // 审核的理由
        referenceNumber: this.referenceNumber, // 开户流水号
        rejectResion: checkType == 'Reject' ? this.rejectResion : '' // 拒絕原因
      }
      let result = await eiaoCheck(params)
      if (result.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: result.head.returnMessage
        })
        this.init()
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },
    // 开户结果
    async checkResultConfirm(actionType) {
      let params = {
        actionType, // 审核的类型 Confirm BackToMaker
        checkerName: '', // 审核人名称 后端
        checkerOrgId: '', // 审核人名称 后端
        checkerResion: this.remark, // 审核的理由
        referenceNumber: this.referenceNumber, // 开户流水号
      }
      let result = await eiaoResultConfirm(params)
      if (result.head.returnCode === '000000') {
        this.$showMsg({
          type: 'success',
          message: result.head.returnMessage
        })
        this.$router.push('/accountOpening/investmentAccountOpeningCheck');
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/accountOpening/investmentAccountOpeningCheck/detail' || this.$store.getters.getActiveTab
        );
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    },
    // 审核拒绝
    refuse(otp) {
      // 拒絕原因不為空
      if (!this.rejectResion) {
        this.$showBox({
        content: this.$t('RAO_CHECK.PLS_INPUT_REJECT_REASON'),
        });
        return
      }
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_REFUSE'),
        confirm: () => {
          this.pcsdCheck(otp);
        },
        cancel: () => {}
      });
    },
    // 审核通过
    approved(otp) {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_CHECK_PASS'),
        confirm: () => {
          this.rejectResion = ''
          this.pcsdCheck(otp);
        },
        cancel: () => {}
      });
    },
    // 开户成功
    approvedPass(otp) {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_ACC_OPRN_SUCCESS'),
        confirm: () => {
          this.checkResultConfirm(otp);
        },
        cancel: () => {}
      });
    },
    // 开户失败
    approvedFail(otp) {
      this.$showBox({
        content: this.$t('RAO_CHECK.SURE_ACC_OPRN_FAIL'),
        confirm: () => {
          this.checkResultConfirm(otp);
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
      let result = await eiaoBinding(params);
      if (result.body) {
        this.backTo()
      } else {
        this.$showMsg({
          type: 'error',
          message: result.head.returnMessage
        })
      }
    }
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
.w-100-bg-fff{
  width: 100% !important;
  background-color: #fff !important;
}
.f-w-340 {
  width: 340px;
}
.m-l-8{
  margin-left: 8px
}
</style>
