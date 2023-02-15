<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-11-08 10:16:56
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\home\homePage.vue
-->
<template>
  <div class="contain">
    <div>
      <user-info></user-info>
    </div>
    <div class="table-data">
      <my-mission></my-mission>
    </div>
  </div>
</template>

<script>
import userInfo from '@/components/home/user-info.vue';
import myMission from '@/components/home/my-mission.vue';

export default {
  name: 'HomeIndexPage',
  components: { userInfo, myMission },
  // inject: ['setLastBread'],
  data() {
    return {};
  },
  watch: {},
  mounted() {
    console.log(sessionStorage.getItem('specialInstruction'),'ssss')
    if(sessionStorage.getItem('specialInstruction')){
      this.$router.push('/customerManagement/specialManagement')
    }
    // this.setLastBread(this.$t('COMMON.CONFIRM'));
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.table-data {
  padding-top: 34px;
  background: #f5f5f5;
}
.contain {
  box-sizing: border-box;
  background: #fff;
  min-width: 800px;
  min-height: 100%;
  padding-bottom: 24px;
}
</style>
