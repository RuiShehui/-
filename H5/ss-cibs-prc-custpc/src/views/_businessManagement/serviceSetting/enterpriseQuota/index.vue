<template>
  <div class="enterpriseQuota">
    <!-- 步骤条 -->
    <steps :stepsList="stepsList" class="steps" :activeIndex="activeIndex" />
    <input-info :confirmInfo="confirmInfo" v-if="activeIndex === 0" @next="next" />
    <confirm-info
      v-if="activeIndex === 1"
      
      v-on:confirmClick="confirmClick"
      @back="back"
      :confirmInfo="confirmInfo"
    />
    <info-success
      v-if="activeIndex === 2"
      :message="message"
      :confirmInfo="confirmInfo"
      @next="next"
    />
    <div class="u-tips" v-if="activeIndex !== 2">
      <p class="u-title">{{$t('COMMON.TIPS')}}</p>
      <ul class="u-content">
        <li>{{$t('USER_MANAGERMENT.GEXIA')}}</li>
        <li>{{$t('USER_MANAGERMENT.YU_XIAN')}}</li>
        <li>{{$t('USER_MANAGERMENT.YU_XIAN_ONE')}}</li>
        <li>{{$t('USER_MANAGERMENT.YU_XIAN_TWO')}}</li>
        <li>{{$t('USER_MANAGERMENT.YU_XIAN_THREE')}}</li>
        <li>{{$t('USER_MANAGERMENT.YU_XIAN_FOUR')}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import InputInfo from './components/inputInfo';
import ConfirmInfo from './components/confirmInfo';
import InfoSuccess from './components/infoSuccess';
import { updateQuotaInfo, checkAuthQuata } from '@/api/setServiceQuota.js';
import mathTools from '@/utils/mathTools.js';
export default {
  components: {
    InputInfo,
    ConfirmInfo,
    InfoSuccess
  },
  data() {
    return {
      // quoatLoading: false,
      stepsList: [
        {
          title: this.$t('COMMON.STEPS_FILL_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('COMMON.STEPS_COMFIRM_INFORMATION'),
          description: ''
        },
        {
          title: this.$t('USER_MANAGERMENT.TIJIAO'),
          description: ''
        }
      ],
      activeIndex: 0,
      // 存储填入页面的信息
      confirmInfo: [],
      // 结果页的信息
      message: {}
    };
  },
  methods: {
    next(params) {
      this.confirmInfo = params;
      if (this.activeIndex === 2) {
        // return this.$router.go(-1);
        this.activeIndex = 0;
      } else {
        this.activeIndex++;
      }
    },
    back(confirmInfo) {
      this.confirmInfo = confirmInfo;
      console.log('打印。。。。', confirmInfo);
      this.activeIndex--;
    },

    //确定提交
    confirmClick(message) {
      this.message = message;
      return this.activeIndex++;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>