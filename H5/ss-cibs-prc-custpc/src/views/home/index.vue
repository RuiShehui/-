<!--
 * @Author: your name
 * @Date: 2021-11-29 09:22:04
 * @LastEditTime: 2022-09-16 16:17:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\home\index.vue
-->
<template>
  <div class="g-home" >
   
      <BankHeader></BankHeader>
      <!-- <main :class="[getActiveMenuIndex > -1 ? 'content content-height' : 'content']"> -->
      <main class="content">
         <router-view />
      </main>
      <Footer colour="white" />
  </div>

</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import BankHeader from '@/components/bankHeader/index.vue';
import Footer from "@/components/home/Footer";

export default {
  components: {
    BankHeader,
    Footer,
    
  },
  data(){
    return{
      logOut:false,
      lastTime:"",
      currentTime:"",
      timeOut:1000,
      timer:null,
    }
  },
  computed: {
    ...mapGetters('home', ['getActiveMenuIndex']),
  },
  methods:{
    isTimeOut(){
      clearInterval(this.timer);
      this.timer = setInterval(()=>{
        let lastClickTime = sessionStorage.getItem("lastTime")*1;
        let nowTime = new Date().getTime();
        // console.log("当前时间和之前点击时间",nowTime,lastClickTime);
        if(nowTime - lastClickTime > 1000*5){
          // console.log("你好，已超时",);
          this.logOut = true;
          clearInterval(this.timer);
          //  this.$router.push('/login');
        }
      },1000);
    },
  },
  mounted(){
    this.isTimeOut();
  },
  created(){
    window.addEventListener("click",()=>{
      sessionStorage.setItem("lastTime",new Date().getTime());
    },true);
  }
};
</script>

<style lang="scss" scoped>
.g-home{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-basis: 100%;
  min-height: 100vh;
  .content {
    // background: #fafbfc;
    width: 1440px;
    min-width: 1440px;
    // flex-grow: 1;
    // padding: 0 20px;
    // margin-left: 20px;
    margin: 0 auto;
    height: calc(100vh - 176px);
    // height: 100%;
    overflow: auto;
    &.content-height {
      height: calc(100vh - 208px);
    }
  }
}

</style>