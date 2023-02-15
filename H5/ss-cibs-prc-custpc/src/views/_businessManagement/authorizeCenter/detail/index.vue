<template>
  <div class="u-detail">
    <!-- 授权模板维护 -->
    <TemplateMainten
      v-if="base_info.businessCode === '090301'"
      @back="returnClick"
      :tableData="base_info"
    ></TemplateMainten>
    <!-- 交易授权设置 -->
    <cardDetailTransAuthorSet
      v-if="base_info.businessCode === '090302'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailTransAuthorSet>
    <!-- 用户管理 -->
    <cardDetailUserManagent
      v-if="base_info.businessCode === '0901'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailUserManagent>
    <!-- 账户管理 -->
    <cadrDetailAccountDetails
      v-if="base_info.businessCode === '0902'"
      @back="returnClick"
      :tableData="base_info"
    ></cadrDetailAccountDetails>
    <!-- 服务限额设置 -->
    <cardDetailSetService
      v-if="base_info.businessCode === '090401'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailSetService>
    <!-- FPS账户绑定 -->
    <cardDetailFPS
      v-if="base_info.businessCode === '090402'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailFPS>
    <!-- 设定小额转账 -->
    <cardDetailSetTransfer
      v-if="base_info.businessCode === '090403'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailSetTransfer>
    <!-- 设定EDDA -->
    <cardDetailSetEDDA
      v-if="base_info.businessCode === '090404'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailSetEDDA>
    <!-- 设定电子结单 -->
    <cardDetailSetStatement
      v-if="base_info.businessCode === '090405'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailSetStatement>
    <!-- 设定交易提示 -->
    <cardDetailSetTransaTips
      v-if="base_info.businessCode === '090406'"
      @back="returnClick"
      :tableData="base_info"
    ></cardDetailSetTransaTips>

    <div class="flexc mt20" v-if="!isWaitAuth">
      <v-button @click="returnClick()">{{$t('COMMON.BACK')}}</v-button>
    </div>
  </div>
</template>

<script>
import TemplateMainten from '@/views/authorizeCenter/components/cardDetail/cardDetail-template-mainten.vue';
import cardDetailUserManagent from '@/views/authorizeCenter/components/cardDetail/cardDetail-user-managent.vue';
import cardDetailTransAuthorSet from '@/views/authorizeCenter/components/cardDetail/cardDetail-trans-author-set.vue';
import cadrDetailAccountDetails from '@/views/authorizeCenter/components/cardDetail/cadrDetail-account-details.vue';
import cardDetailSetService from '@/views/authorizeCenter/components/cardDetail/cardDetail-set-service';
import cardDetailFPS from '@/views/authorizeCenter/components/cardDetail/cardDetail-FPS';
import cardDetailSetTransfer from '@/views/authorizeCenter/components/cardDetail/cardDetail-set-transfer';
import cardDetailSetEDDA from '@/views/authorizeCenter/components/cardDetail/cardDetail-set-EDDA';
import cardDetailSetStatement from '@/views/authorizeCenter/components/cardDetail/cardDetail-set-statement';
import cardDetailSetTransaTips from '@/views/authorizeCenter/components/cardDetail/cardDetail-set-transa-tips';
export default {
  components: {
    TemplateMainten,
    cardDetailUserManagent,
    cardDetailTransAuthorSet,
    cadrDetailAccountDetails,
    cardDetailSetService,
    cardDetailFPS,
    cardDetailSetTransfer,
    cardDetailSetEDDA,
    cardDetailSetStatement,
    cardDetailSetTransaTips
  },
  data() {
    return {
      base_info: {},
      isWaitAuth: true
    };
  },

  created() {},
  mounted() {
    console.log('打印，，，，，', this.$route.query);
    this.base_info = this.$route.query;
    if (
      this.base_info.authState === '0' &&
      this.base_info.authorizationType === 'WAIT_AUTH'
    ) {
      this.isWaitAuth = true;
    } else {
      this.isWaitAuth = false;
    }
  },
  methods: {
    returnClick() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>