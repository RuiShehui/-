<!-- 待我授权详情页 -->

<template>
  <div class="contain">
    <section>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('AUTHORIZATION_CENTER.SUBMIT_INFORMATION')" name="option"></el-tab-pane>
      </el-tabs>
      <div class="transverse-table">
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.APPLICATION_SERIAL_NUMBER') }}</div>
          <div>{{ tableData.flowNum }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.BUSINESS_TYPE') }}</div>
          <div>{{ tableData.bizType }}</div>
        </div>
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.SUBMITTER') }}</div>
          <!-- <div>{{ tableData.submitUserName }}</div> -->
          <div>{{ tableData.userRealName }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.OPERATIOM_TYPE') }}</div>
          <div>{{ operTypeFilter(tableData.operTypeCode) }}</div>
        </div>
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.SUBMITITME') }}</div>
          <div>{{ tableData.submitTime }}</div>
        </div>
      </div>
    </section>
    <section style="margin-top: 40px">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="tableData.bizType" name="option"></el-tab-pane>
      </el-tabs>
      <userDitail v-if="bizTypeCode === '33039760'" :options="base_info"></userDitail>
      <announcementDitail v-if="bizTypeCode === '97783376'" :options="base_info"></announcementDitail>
      <groupDitail v-if="bizTypeCode === '93235214'" :options="base_info"></groupDitail>
      <menuDitail v-if="bizTypeCode === '62458806'" :options="base_info"></menuDitail>
      <discountDetail v-if="bizTypeCode === '67179386'" :options="base_info"></discountDetail>
      <customerAccOpenDetail v-if="bizTypeCode === '59427059'" :options="base_info"></customerAccOpenDetail>
      <customerAccountDetail
        v-if="['21521695', '35877474'].includes(bizTypeCode)"
        :options="base_info"
      ></customerAccountDetail>
      <userMaintenanceDetail v-if="bizTypeCode === '04419371'" :options="base_info"></userMaintenanceDetail>
      <!-- <informationOverviewDetail v-if="bizTypeCode === '49631187'"></informationOverviewDetail> -->
      <billManintenanceDetail v-if="bizTypeCode === '55366532'" :options="base_info"></billManintenanceDetail>
      <busineseControlDetail v-if="bizTypeCode === '93752504'" :options="base_info"></busineseControlDetail>
      <roleDetail v-if="bizTypeCode === '47407764'" :options="base_info"></roleDetail>
      <bankLimitDetail v-if="bizTypeCode === '01349243'" :options="base_info"></bankLimitDetail>
      <EPSBusinessDetail v-if="['91442342', '53219721'].includes(bizTypeCode)" :options="base_info"></EPSBusinessDetail>
      <authorizationTemolateDetail v-if="bizTypeCode === '30945897'" :options="base_info"></authorizationTemolateDetail>
      <transactionAuthDetail v-if="bizTypeCode === '10009914'" :options="base_info"></transactionAuthDetail>
      <timeDepositDetail v-if="bizTypeCode === '59638701'" :options="base_info"></timeDepositDetail>
      <register-third v-if="bizTypeCode === '93274600'" :options="base_info"></register-third>
      <customer-quota-manage v-if="bizTypeCode === '97786696'" :options="base_info"></customer-quota-manage>
      <weather-setting v-if="bizTypeCode === '56880523'" :options="base_info"></weather-setting>
      <exceptiomDetail v-if="bizTypeCode === '98593674'" :options="base_info"></exceptiomDetail>
      <PasswordReset v-if="bizTypeCode === '97796701'" :options="base_info"></PasswordReset>
      <specialInstructionAdd v-if="bizTypeCode === '99990002'" :options="base_info"></specialInstructionAdd>
    </section>

    <section v-show="!authorizerFlag">
      <div class="my-tabs">
        <div>
          <span style="color: red; margin-right: 3px">*</span>
          <span>{{ $t('HOME.AUTHORZATION') +'：' }}</span>
        </div>
        <el-radio-group v-model="radioFlag" class="my-radio">
          <el-radio label="CONSENT">{{ $t('AUTHORIZATION_CENTER.ADOPT') }}</el-radio>
          <el-radio label="REJECT">{{ $t('AUTHORIZATION_CENTER.REFUSE') }}</el-radio>
        </el-radio-group>
      </div>
      <div class="my-tabs">
        <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_OPINION_SYMBOL') }}</div>
        <div>
          <el-input
            :rows="3"
            class="f-w-340"
            type="textarea"
            maxlength="300"
            :placeholder="$t('AUTHORIZATION_CENTER.PLEASE_INPUT_AUTHORIZATION')"
            v-model="authOpinion"
          ></el-input>
        </div>
      </div>
    </section>

    <section v-show="authorizerFlag" style="margin-top: 40px">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('AUTHORIZATION_CENTER.AUTHORIZATION_INFORMATION')" name="option"></el-tab-pane>
      </el-tabs>
      <div class="transverse-table">
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_STATUS') }}</div>
          <div>{{ authStatusFilter(tableData.authStatus) }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_TIME') }}</div>
          <div>{{ tableData.authTime }}</div>
        </div>
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_OPINION') }}</div>
          <div>{{ tableData.authOpinion }}</div>
        </div>
      </div>
    </section>

    <!-- 授权为同意 -->
    <section v-show="authConsentFlag" style="margin-top: 40px">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('BUSINESS_MANAGEMENT.TRADE_STATUS')" name="option"></el-tab-pane>
      </el-tabs>
      <div class="transverse-table">
        <div class="row">
          <div>{{ $t('BUSINESS_MANAGEMENT.TRADE_STATUS') }}</div>
          <div>{{ tableData.transStatus }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.FAILURE_REASON') }}</div>
          <div>{{ tableData.transMessage }}</div>
        </div>
      </div>
    </section>
    <div class="g-bottom">
      <el-button v-show="authorizerFlag" class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
      <el-button v-show="!authorizerFlag" class="f-cancel" @click="refuse">{{ $t('COMMON.CANCEL') }}</el-button>
      <el-button v-show="!authorizerFlag" type="primary" @click="adopt">{{ $t('COMMON.SUBMIT') }}</el-button>
    </div>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
import { getRoleDetail, removeToken, removeRoleDetail } from '@/utils/user';
import { empower } from '@/api/authorization-center';
import userDitail from '@/components/auth-details/user-management';
import announcementDitail from '@/components/auth-details/announcement-management';
import groupDitail from '@/components/auth-details/group-management';
import menuDitail from '@/components/auth-details/menu-management';
import discountDetail from '@/components/auth-details/discount-management';
import exceptiomDetail from '@/components/auth-details/exceptiom-management';
import customerAccountDetail from '@/components/auth-details/customer-account-management';
import customerAccOpenDetail from '@/components/auth-details/customer-acc-open-management';
import userMaintenanceDetail from '@/components/auth-details/user-maintenance-management';
// import informationOverviewDetail from '@/components/auth-details/information-overview-management';
import billManintenanceDetail from '@/components/auth-details/bill-manintenance-management';
import busineseControlDetail from '@/components/auth-details/businese-control-management';
import roleDetail from '@/components/auth-details/role-management';
import bankLimitDetail from '@/components/auth-details/bank-limit-management';
import EPSBusinessDetail from '@/components/auth-details/EPS-business-management';
import authorizationTemolateDetail from '@/components/auth-details/authorization-temolate-management';
import transactionAuthDetail from '@/components/auth-details/transaction-auth-management';
import timeDepositDetail from '@/components/auth-details/time-deposit-management';
import RegisterThird from '@/components/auth-details/register-third';
import CustomerQuotaManage from '@/components/auth-details/customer-quota-manage'; // 限额白名单
import WeatherSetting from '@/components/auth-details/weather-setting';
import PasswordReset from '@/components/auth-details/passwordReset-management';
import specialInstructionAdd from '@/components/auth-details/specialInstructionAdd';
export default {
  name: 'SubjectAuthDetail',
  components: {
    userDitail, //用户管理详情
    announcementDitail, //公告详情
    groupDitail, //机构详情
    roleDetail, //角色详情
    menuDitail, //菜单详情
    discountDetail, //银行折扣详情
    exceptiomDetail, //批量交易异常处理
    customerAccOpenDetail, //客户开户
    customerAccountDetail, //客户开销、客户信息维护详情
    userMaintenanceDetail, //用户信息维护详情
    // informationOverviewDetail, //客户信息概览详情
    billManintenanceDetail, //账单维护
    busineseControlDetail, //业务启停控制
    bankLimitDetail, //银行限额设置
    EPSBusinessDetail, //EPS商家管理、商户类别维护、商户维护
    authorizationTemolateDetail, //授权模板维护
    transactionAuthDetail, //交易授权设置
    timeDepositDetail, //定期存款预约编号生成
    RegisterThird, //登记第三者账户
    CustomerQuotaManage, //限额白名单
    WeatherSetting, //特殊天气设置
    PasswordReset,
    specialInstructionAdd
  },

  data() {
    return {
      activeName: 'option',
      radioFlag: 'CONSENT', //单选按钮默认同意
      authorAgreeFlag: true, //true：授权同意，fasle授权失败
      authOpinion: '', //拒绝意见
      bizTypeCode: '21521695', //业务类型模块
      authorizerFlag: true, //判断是否授权，flas为待授权
      authConsentFlag: true, //true:交易成功，false：交易失败
      tableData: {
        bizType: '', //业务类型
        operType: '', //操作类型
        submitTime: '', //提交时间
        flowNum: '', //申请流水号
        submitUserName: '', //提交人

        title: '', //公告标题
        releaseTime: '', //发布时间
        content: '', //公告内容

        authStatus: '', //授权状态
        authTime: '', //授权时间
        //   authorizer: "授权人", //授权人
        authOpinion: '', //授权意见
        tradeStatus: '', //交易状态
        failuerReason: '' //失败原因
      },
      tips: '',
      operationTips: '', //操作成功提示
      base_info: {} //保存基本信息，传给模块
    };
  },
  computed: {},
  created() {
    this.base_info = this.$route.query;
  },

  mounted() {
    this.tableData = this.$route.query;
    this.$nextTick(() => {
      this.base_info = this.$route.query;
    });

    this.procseeData();
    if (this.tableData.authStatus === this.$t('AUTHORIZATION_CENTER.ADOPT')) {
      this.authConsentFlag = true;
    } else {
      this.authConsentFlag = false;
    }
    // console.log('打印传值：', this.base_info);
  },

  methods: {
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    },
    // code 过滤
    operTypeFilter(val) {
      switch (val) {
        case 'INSERT':
          return this.$t('AUTHORIZATION_CENTER.INSERT');
        case 'UPDATE':
          return this.$t('AUTHORIZATION_CENTER.UPDATE');
        case 'DELETE':
          return this.$t('AUTHORIZATION_CENTER.DELETE');
        case 'OPEN_ACCOUNT':
          return this.$t('AUTHORIZATION_CENTER.OPEN_ACCOUNT');
        case 'LOGOUT':
          return this.$t('AUTHORIZATION_CENTER.LOGOUT');
        case 'RESEND_PASSWORD':
          return this.$t('AUTHORIZATION_CENTER.RESEND_PASSWORD');
      }
    },
    //处理数据
    procseeData() {
      this.bizTypeCode = this.tableData.bizTypeCode;
      CONSTANTS.BIZ_CODE_TYPE_LIST.forEach(item => {
        if (item.value === this.tableData.bizTypeCode) {
          this.tableData.bizType = item.label;
        }
      });

      if (this.tableData.authStatus === 'WAIT_AUTH') {
        this.authorizerFlag = false;
      } else {
        this.authorizerFlag = true;
      }
      if (this.tableData.authStatus === 'OVERDUE') {
        this.overdueFlag = false;
      } else {
        this.overdueFlag = true;
      }
    },
    //返回
    backTo() {
      if (this.$route.query.homePage) {
        this.$store.commit('tabs/DELETE_TABS', '/authorizationCenter/subjectAuthorization/ditail');
        this.$router.push('/homePage');
      } else {
        this.$router.push('/authorizationCenter/subjectAuthorization');
      }
    },
    //取消
    refuse() {
      this.backTo();
    },
    //确定提交
    refuseConfirm() {
      let obj = JSON.parse(this.tableData.temp.afterMdJson).body;
      let params = {
        authStatus: this.radioFlag,
        flowNum: this.$route.query.flowNum,
        authOpinion: this.authOpinion
      };
      empower(params).then(res => {
        const { body = false } = res;
        if (body === true) {
          this.$showMsg({
            type: 'success',
            message: this.operationTips
          });
          if (
            this.radioFlag === 'CONSENT' &&
            obj.roleCode === getRoleDetail().roleCode
          ) {
            removeToken();
            removeRoleDetail();
            this.$store.commit('tabs/DELETE_ALL_TABS');
            this.$router.replace('/login');
            return;
          }
        }
        this.backTo();
      });
    },
    //提交
    adopt() {
      if (this.radioFlag === 'REJECT' && !this.authOpinion) {
        return this.$showMsg({
          type: 'error',
          message: this.$t('AUTHORIZATION_CENTER.AUTHORIZATION_NO_NULL')
        });
      }
      if (this.radioFlag === 'REJECT') {
        this.tips = this.$t('AUTHORIZATION_CENTER.REFUSE_TRANSACTION');
        this.operationTips = this.$t(
          'AUTHORIZATION_CENTER.AUTHORIZATION_REFUSE_SUCCESS'
        );
      }
      if (this.radioFlag === 'CONSENT') {
        this.tips = this.$t('AUTHORIZATION_CENTER.AGREE_TRANSACTION');
        this.operationTips = this.$t(
          'AUTHORIZATION_CENTER.AUTHORIZATION_AGREE_SUCCESS'
        );
      }
      this.$showBox({
        content: this.tips,
        confirm: () => {
          this.refuseConfirm();
        }
      });
    },
    authStatusFilter(value) {
      return CONSTANTS.AUTHSTATUS[value];
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
.g-bottom {
  margin-top: 40px;
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
.transverse-table {
  margin-top: 25px;
}
.my-tabs {
  margin-top: 40px;
  display: flex;
  .my-radio {
    margin-top: 5px;
  }
}
.f-w-340 {
  width: 340px;
}
</style>
