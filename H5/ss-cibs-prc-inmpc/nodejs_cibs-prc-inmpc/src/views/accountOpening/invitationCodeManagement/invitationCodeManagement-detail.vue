<!-- 邀请码详情 -->
<template>
  <div>
    <section>
      <div class="instant-head">
        <div>
          <span>{{ $t('RAO_CHECK.CHANNEL_CODE_SYMBOL') }} </span>
          <span>{{ detailInfo.recommendationCode }}</span>
        </div>
        <div>
          <span>{{ $t('RAO_CHECK.CREATE_TIME_SYMBOL') }} </span>
          <span>{{ detailInfo.createrTime }}</span>
        </div>
        <div>
          <span>{{ $t('RAO_CHECK.STAFF_NUMBER_SYMBOL') }} </span>
          <span>{{ getUserName }}</span>
        </div>
      </div>
    </section>
    <section>
      <div class="transverse-table">
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.BASE_INFO') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.CHANNEL_CODE') }}</div>
          <div>{{ detailInfo.recommendationCode }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.REFERRER_NO') }}</div>
          <div>{{ detailInfo.createrByID }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.CREATE_TIME') }}</div>
          <div>{{ detailInfo.createrTime }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.VALID_TIME') }}</div>
          <div>{{ detailInfo.effectiveTimeFrom }} - {{ detailInfo.effectiveTimeTo}}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.USAGE_STATE') }}</div>
          <div>
            <span :class="detailInfo.status === '0' ? 'disabled' : 'activated'">
              {{ valueToLabel(statusList, detailInfo.status) }}
            </span>
          </div>
        </div>
        <div class="row">
          <div id="title">{{ $t('RAO_CHECK.ASSOCIATED_INFO') }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.REFERRER_NO') }}</div>
          <div>{{ detailInfo.referrerCode }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.REFERRER_TYPE') }}</div>
          <div>{{ valueToLabel(referrerTypeList, detailInfo.referrerType) }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.AVCTIVITY_ID') }}</div>
          <div>{{ detailInfo.activityID }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.BRANCH_DISTRICT') }}</div>
          <div>{{ allBranchObj[detailInfo.imBranchArea] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.BRANCH') }}</div>
          <div>{{ allBranchObj[detailInfo.imBranch] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.CUSTOMER_INFO') }}</div>
          <div>{{ detailInfo.acctInfo }}</div>
        </div>
        <!-- <div class="row">
          <div>{{ $t('RAO_CHECK.USERS_NUMBER') }}</div>
          <div>{{ detailInfo.useTotal }}</div>
        </div> -->
      </div>
    </section>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="back">{{ $t('COMMON.BACK') }}</el-button>
      <el-button type="primary" @click="update">{{ $t('COMMON.UPDATE') }}</el-button>
      <el-button type="primary" :disabled="stopStartDisabled" @click="stopOrStart('stop')">{{ $t('COMMON.STOP_USING') }}</el-button>
      <el-button type="primary" :disabled="!stopStartDisabled" @click="stopOrStart('start')">{{ $t('COMMON.USING') }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  queryCodeDetial,
  updateCode
} from '@/api/accountOpening/invitationCodeManagement'
import { getRoleDetail } from '@/utils/user';
import CONSTANTS from '@/utils/constant';
const {
  REFFERRER_TYPE_LIST,
  REFERRAL_CODE_STATUS_LIST
} = CONSTANTS;
export default {
  name: 'InvitationCodeManagementDetail',
  inject: ['reload'],
  components: {
  },

  data() {
    return {
      recommendationCode: '', // 邀请码
      detailInfo: {}, // 详情信息
      allBranchObj: {}, // 所有分行对象
      referrerTypeList: REFFERRER_TYPE_LIST, // 推荐人类型
      statusList: REFERRAL_CODE_STATUS_LIST,
    };
  },
  computed: {
    // 禁用和启用按钮置灰
    stopStartDisabled() {
      return this.detailInfo.status === '0';
    },
    // 获取用户名
    getUserName() {
      return getRoleDetail().userName
    }
  },
  created() {
    this.recommendationCode = this.$route.query.recommendationCode;
    this.allBranchObj = this.$route.query.allBranchObj;
    this.queryCodeDetial();
  },
  activated() {
    this.recommendationCode = this.$route.query.recommendationCode ? this.$route.query.recommendationCode : this.recommendationCode;
    this.allBranchObj = this.$route.query.allBranchObj ? this.$route.query.allBranchObj : this.allBranchObj;
    this.queryCodeDetial();
  },
  mounted() {
  },

  methods: {
    async queryCodeDetial() {
      let params = {
        recommendationCode: this.recommendationCode
      }
      let result = await queryCodeDetial(params);
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.detailInfo = result.body || {};
      }
    },
    // value转label
    valueToLabel(list, val) {
      let label = '';
      list.forEach(item => {
        if(item.value === val) {
          label = item.label
        }
      });
      return label
    },
    // 返回
    back() {
      this.$router.push('/accountOpening/invitationCodeManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/accountOpening/invitationCodeManagement/detail' || this.$store.getters.getActiveTab
      );
    },
    // 修改
    update() {
      this.$router.push({
        name: 'InvitationCodeUpdate',
        params: {
          detailInfo: this.detailInfo,
          operateType: 'update',
          allBranchObj: this.allBranchObj
        }
      });
    },
    // 禁用 || 启用
    async stopOrStart(operate) {
      let currentDate = new Date();
      let effectiveTimeEnd = new Date(this.detailInfo.effectiveTimeTo);
      if (operate === 'start') {
        // 当前时间超过有效时间
        if (currentDate > effectiveTimeEnd) {
          this.$showMsg({
            type: 'error',
            message: this.$t('RAO_CHECK.CHANNEL_CODE_PAST')
          });
          return false
        }
      }
      let params = {
        recommendationCode: this.recommendationCode,
        updateType: operate === 'stop' ? 'stop' : 'start'
      }
      let result = await updateCode(params);
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        if(result.body) {
          this.$showMsg({
            type: 'success',
            message: operate === 'stop' 
              ? this.$t('RAO_CHECK.STOP_SUCCESS') 
              : this.$t('RAO_CHECK.START_SUCCESS')
          });
          // this.back();
          this.reload()
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
  .instant-head {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
  }
}
.transverse-table {
  margin-top: 25px;
}
.f-w-340 {
  width: 340px;
}
.g-bottom {
  margin: 36px;
  text-align: right;
  button {
    width: 90px;
    height: 40px;
    border-radius: 4px;
    font-size: 16px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
.activated {
  padding: 4px 16px;
  background-color: #0cc71A;
  border-radius: 4px;
  color: #ffffff;
}
.disabled {
  padding: 4px 16px;
  background-color: #F23F47;
  border-radius: 4px;
  color: #ffffff;
}
</style>
