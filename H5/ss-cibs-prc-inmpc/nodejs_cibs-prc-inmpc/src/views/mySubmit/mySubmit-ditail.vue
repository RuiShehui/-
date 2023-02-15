<!-- 我提交的--详情页 -->
<template>
  <div class="contain">
    <section>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('AUTHORIZATION_CENTER.SUBMIT_INFORMATION')" name="option"></el-tab-pane>
      </el-tabs>
      <div class="transverse-table">
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.BUSINESS_TYPE') }}</div>
          <div>{{ tableData.bizType }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.OPERATIOM_TYPE') }}</div>
          <div>{{ operTypeFilter(tableData.operTypeCode) }}</div>
        </div>
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.SUBMITITME') }}</div>
          <div>{{ tableData.submitTime }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.APPLICATION_SERIAL_NUMBER') }}</div>
          <div>{{ tableData.flowNum }}</div>
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
      <EPSBusinessDetail
        v-if="['91442342', '53219721'].includes(bizTypeCode)"
        :options="base_info"
        :bizTypeCode="bizTypeCode"
      ></EPSBusinessDetail>
      <authorizationTemolateDetail v-if="bizTypeCode === '30945897'" :options="base_info"></authorizationTemolateDetail>
      <transactionAuthDetail v-if="bizTypeCode === '10009914'" :options="base_info"></transactionAuthDetail>
      <timeDepositDetail v-if="bizTypeCode === '59638701'" :options="base_info"></timeDepositDetail>
      <registeredThirdPartyDetail v-if="bizTypeCode === '93274600'" :options="base_info"></registeredThirdPartyDetail>
      <customer-quota-manage v-if="bizTypeCode === '97786696'" :options="base_info"></customer-quota-manage>
      <weather-setting v-if="bizTypeCode === '56880523'" :options="base_info"></weather-setting>
      <exceptiomDetail v-if="bizTypeCode === '98593674'" :options="base_info"></exceptiomDetail>
      <PasswordReset v-if="bizTypeCode === '97796701'" :options="base_info"></PasswordReset>
      <specialInstructionAdd v-if="bizTypeCode === '99990002'" :options="base_info"></specialInstructionAdd>
    </section>
    <section style="margin-top: 40px">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('AUTHORIZATION_CENTER.AUTHORIZATION_INFORMATION')" name="option"></el-tab-pane>
      </el-tabs>
      <div v-show="!authorizerFlag" class="transverse-table">
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_STATUS') }}</div>
          <div>{{ authStatusFilter(tableData.authStatus) }}</div>
        </div>
      </div>
      <div class="transverse-table" v-show="authorizerFlag">
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_STATUS')}}</div>
          <div>{{ authStatusFilter(tableData.authStatus) }}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_TIME') }}</div>
          <div>{{ tableData.authTime }}</div>
        </div>
        <div class="row">
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZER') }}</div>
          <div>{{ tableData.authUserName}}</div>
          <div>{{ $t('AUTHORIZATION_CENTER.AUTHORIZATION_OPINION') }}</div>
          <div>{{ tableData.authOpinion }}</div>
        </div>
      </div>
    </section>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backTo">{{ $t('COMMON.BACK') }}</el-button>
      <el-button
        v-show="!authorizerFlag"
        type="primary"
        @click="revoke"
      >{{ $t('AUTHORIZATION_CENTER.REVOKE') }}</el-button>
    </div>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
import { undo } from '@/api/authorization-center/index';
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
import registeredThirdPartyDetail from '@/components/auth-details/register-third';
import CustomerQuotaManage from '@/components/auth-details/customer-quota-manage'; // 限额白名单
import WeatherSetting from '@/components/auth-details/weather-setting';
import PasswordReset from '@/components/auth-details/passwordReset-management';
import specialInstructionAdd from '@/components/auth-details/specialInstructionAdd';
export default {
  components: {
    CONSTANTS,
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
    registeredThirdPartyDetail, //登记第三者账户
    CustomerQuotaManage, //限额白名单
    WeatherSetting, //特殊天气设置
    PasswordReset,
    specialInstructionAdd
  },

  data() {
    return {
      activeName: 'option',
      base_info: {}, //保存基本信息，传给模块
      bizTypeCode: '', //业务类型模块
      authorizerFlag: false, //判断是否授权，flas为待授权
      overdueFlag: false, //判断是否为过期，false为过期
      tableData: {
        bizType: '业务类型', //业务类型
        operType: '操作类型', //操作类型
        submitTime: '提交时间', //提交时间
        flowNum: '申请流水号', //申请流水号

        title: '公告标题', //公告标题
        releaseTime: '2021-02-20 00:00:00至2021-04-03 00:00:00', //发布时间
        content: '1,银行发布新一轮公告', //公告内容

        authStatus: '授权状态', //授权状态
        authTime: '2021-10-30 12:31:32', //授权时间
        authUserName: '授权人', //授权人
        authOpinion: '授权意见' //授权意见
      },
      tips: ''
    };
  },
  computed: {},
  created() {
    this.base_info = this.$route.query;
  },

  mounted() {
    this.tableData = this.$route.query;
    this.bizTypeCode = this.tableData.bizTypeCode;
    this.$nextTick(() => {
      this.base_info = this.tableData;
    });
    this.procseeData();
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
        default:
          return val;
      }
    },
    //处理数据
    procseeData() {
      CONSTANTS.BIZ_CODE_TYPE_LIST.forEach(item => {
        if (item.value === this.tableData.bizTypeCode) {
          this.tableData.bizType = item.label;
        }
      });

      if (
        this.tableData.authStatus === '待授权' ||
        this.tableData.authStatus === 'WAIT_AUTH'
      ) {
        this.authorizerFlag = false;
      } else {
        this.authorizerFlag = true;
      }
      if (
        this.tableData.authStatus === '过期' ||
        this.tableData.authStatus === 'OVERDUE'
      ) {
        this.overdueFlag = false;
      } else {
        this.overdueFlag = true;
      }
    },

    //返回
    backTo() {
      if (this.$route.query.homePage) {
        this.$router.push('/homePage');
      } else {
        this.$router.push('/authorizationCenter/mySubmit');
      }
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/mySubmit/ditail' 
      );
    },

    //撤销
    revoke() {
      this.$showBox({
        content: this.$t('AUTHORIZATION_CENTER.REVOKE_TIPS'),
        confirm: () => {
          this.confirm();
        }
      });
    },
    //确定撤销
    confirm() {
      undo({
        flowNum: this.$route.query.flowNum,
        authType: 'consent'
      }).then(resp => {
        if (resp.body) {
          this.$showMsg({
            type: 'success',
            message: this.$t('AUTHORIZATION_CENTER.REVOKE_SUCCESS')
          });
          this.backTo();
        } else {
          this.backTo();
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
</style>
