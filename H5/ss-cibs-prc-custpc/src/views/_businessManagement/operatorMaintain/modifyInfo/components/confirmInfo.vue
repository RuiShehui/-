<!--
 * @Author: your name
 * @Date: 2022-01-06 19:25:50
 * @LastEditTime: 2022-09-17 11:37:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\operatorMaintain\modifyInfo\components\confirmInfo.vue
-->
<template>
  <div class="confirmInfoWapper">
    <div class="confirmContent">
        <detail-item :title="$t('USER_MANAGEMENT.USER_TYPE')" :content="confirmInfo.userType === '1' ? $t('USER_MANAGEMENT.ADMINISTRATOR'):this.$t('USER_MANAGEMENT.GENERAL_USERS')"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_CHINESE_NAME')" :content="confirmInfo.chinaName"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_ENGLISH_COLON')" :content="confirmInfo.elishName"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_ACCOUNT_TYPE')" :content="certList[confirmInfo.certTypeValue]"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_NUMBER')" :content="confirmInfo.certNo"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_STATUS')" :content="confirmInfo.userStatus === '1' ? $t('USER_MANAGEMENT.ENABLE') : $t('USER_MANAGEMENT.DEACTIVATE')"/>
        <detail-item  :title="$t('USER_MANAGEMENT.FA')" :content="confirmInfo.isOpen2FA === '1' ? $t('COMMON.YES') : $t('COMMON.NO')"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_ADDRESS')"  :content="confirmInfo.certAddress"/>
        <detail-item :title="$t('USER_MANAGEMENT.BIRTHDAY')" :content="confirmInfo.date"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_PHONE')" :content="confirmInfo.phone"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_EMAIL')" :content="confirmInfo.emailAddress"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_MOBILE_PHONE')" :content="confirmInfo.floatPhone1 + '-' + confirmInfo.floatPhone2 + '-' + confirmInfo.floatPhone3"/>
        <detail-item :title="$t('USER_MANAGEMENT.USER_SMS_ADDRESS')" />
      </div>
    <div class="flexc">
      <v-button @click="$emit('back')" class="mr16">{{$t('COMMON.BACK')}}</v-button>
      <v-button @click="$emit('next',confirmInfo)" type="primary">{{$t('COMMON.NEXT_STEP')}}</v-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    confirmInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      certList: {
        '01': this.$t('USER_MANAGERMENT.ID_CARD'),
        '02': this.$t('USER_MANAGERMENT.HK_MACAU_PASS'),
        '03': this.$t('USER_MANAGERMENT.PASSPORT'),
        '04': this.$t('USER_MANAGERMENT.HOUSEHOLD_REG_BOOK')
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.confirmContent {
  width: 940px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 64px;
  .detailItem:not(:last-child) {
    margin-bottom: 16px;
  }
  
}
</style>