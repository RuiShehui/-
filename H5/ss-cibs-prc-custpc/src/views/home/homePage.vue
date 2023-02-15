<!--
 * @Autor: 赵霖
 * @Date: 2021-11-16 14:22:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-02 11:06:28
 * @Description: 
 * @FilePath: \ss-cibs-prc-custpc\src\views\home\homePage.vue
-->
<template>
  
  <div class="home-page">
    <PersonalNav @childFn="parentFn" v-if="!status"/>
    <!-- <index v-if="status" style="width: 100%;"/> -->
    <messageTips @childFn="parentFn" v-if="statues" style="width: 100%;" />
    <router-view class="container" v-if="!status"/>

    <shortcut-menu v-if="!status || !statues"/>
  </div>
</template>

<script>
import PersonalNav from "@/components/home/PersonalNav";
import ShortcutMenu from "@/components/home/ShortcutMenu";
// import index from '@/views/user/index.vue'
import messageTips from './messageTips.vue'
export default {
  name: "HomePage",
  components: {
    ShortcutMenu,
    PersonalNav,
    // index,
    messageTips
  },
  data(){
    return{
      status:false,
      statues:false
    }
  },
  // mounted(){
  //   //基金回跳
  //   console.log('三方',window.location.href)
  //   let temp1=window.location.href.split('?');
  //   let pram=temp1[1];
  //   let obj={};
  //   let item=pram.split('=');
  //   let key=item[0];
  //   let value=item[1];
  //   obj[key]=value;
  //   console.log('mm',obj)
  //   let params=JSON.stringify(obj);
  //   console.log('jj',params)
  //   if(params!=='{}'){
  //     this.$router.push({
  //       path:'/allInvestment/investment/myFundsSubscription',
  //       query:{obj:obj}
  //     })
  //   }
  // },
  methods:{
    parentFn(payload){
      this.status = payload;
    }
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  // width: 1440px;
  margin: auto;
  // margin-left: 10px;
  margin-top: 10px;
  
  // .container {
  //   // @include flex-column-start;
  //   // padding: 30px;
  //   // padding-bottom: 24px;
  // }
}
</style>