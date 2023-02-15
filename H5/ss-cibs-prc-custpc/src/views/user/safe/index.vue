<!--
 * @Author: your name
 * @Date: 2022-07-04 19:47:56
 * @LastEditTime: 2022-07-12 16:28:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\user\safe\index.vue
-->
<template>
  <div>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    };
  },
  created(){
    
  },
  methods:{
    submit(){
      console.log(2222)
      this.$router.replace('/user/myUserName')
    }
  }
};
</script>

<style lang="scss" scoped>
.u-title {
  font-size: 14px;
  color: #000;
  font-weight: 400;
}
.u-content {
  margin: 0 auto;
  margin-top: 36px;

  .tips {
    font-size: 12px;
    color: rgba($color: #000000, $alpha: 0.45);
    line-height: 20px;
  }
}
.u-btn {
  margin-top: 36px;
  margin-left: 38%;
}
.u-tips {
  margin-top: 180px;
}
.u-conten {
  margin-top: 18px;
  margin-bottom: 14px;
  font-size: 12px;
  color: rgba($color: #000000, $alpha: 0.45);
  line-height: 20px;
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00 !important;
}
/deep/ .el-tabs__active-bar{
  background-color: #f06b00 !important;
}
</style>