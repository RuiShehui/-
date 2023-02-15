<!--
 * @Author: your name
 * @Date: 2021-11-29 09:22:04
 * @LastEditTime: 2022-11-16 17:42:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webbank-pc\src\components\login\loginMain.vue
-->
<template>
  <div class="g-main-content">
    <!-- d登录页背景图 -->
    <el-carousel :interval="4000" class="m-carousel" :autoplay="true">
      <el-carousel-item v-for="item of carouselList" :key="item">
        <img class="u-banner" :src="item" :alt="item" />
      </el-carousel-item>
    </el-carousel>
    <!-- 登录表单 -->
    <div class="m-content">
      <loginForm />
    </div>
  </div>
</template>

<script>
import loginForm from './loginForm.vue';

export default {
  components: {
    loginForm
  },
  inject: ['handleRedirect', 'imageBase'],
  data() {
    return {
      // 登录页轮播图
      carouselList: [
        require('../../images/login/banner1.png'),
        require('../../images/login/banner2.png'),
        require('../../images/login/banner3.png')
      ]
    };
  },
  mounted() {
    this.handleRedirect();
  }
};
</script>

<style lang="scss" scoped>
.g-main-content {
  width: 100%;
  position: relative;
  height: 568px;
  min-height: 450px;
  // max-height: 740px;
  flex: 1;
  overflow: hidden;

  .m-carousel {
    height: 100%;
  }

  .u-banner {
    object-fit: cover;
    width: 100%;
  }

  ::v-deep .el-carousel__container {
    height: 100%;
  }
  .m-content {
    // width: 1550px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 80%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 2;
  }
}
</style>
<style lang="scss">
.g-main-content {
  .el-carousel__button {
    display: block;
    opacity: 0.48;
    width: 30px;
    height: 5px;
    // background-color: #F06B00;
    border-radius: 10px;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s;
  }
  .el-carousel__indicator--horizontal.is-active .el-carousel__button {
    background-color: #f06b00;
  }
}
</style>