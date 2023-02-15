<template>
  <div class="g-login">
    <login-Header></login-Header>
    <login-Main></login-Main>
    <banner-Tips></banner-Tips>
    <login-Footer></login-Footer>
  </div>
</template>

<script>
import loginHeader from '@/components/login/loginHeader.vue';
import loginMain from '@/components/login/loginMain.vue';
import bannerTips from '@/components/login/bannerTips.vue';
import loginFooter from '@/components/home/Footer.vue';
import { preToken } from '@/api/login.js';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('app');
export default {
  name: 'Login',
  components: {
    loginHeader,
    loginMain,
    bannerTips,
    loginFooter
  },
  data() {
    return {};
  },
  created() {
    if (this.$route.query.toLogin === "1") {
      this.$router.push({query:{}})
      location.reload()
    }
    this.clearSessionItems();
  },
  methods: {
    ...mapActions(['SET_TOKEN', 'USER_LOGON', 'SET_LANG']),
    clearSessionItems() {
      sessionStorage.clear();
    }
  }
};
</script>

<style lang="less" scoped>
.g-login {
  display: flex;
  height: 100vh;
  min-width: 1440px;
  width: 100%;
  min-height: 606px;
  flex-direction: column;
  background-color: #fff;
  box-sizing: border-box;
}
</style>