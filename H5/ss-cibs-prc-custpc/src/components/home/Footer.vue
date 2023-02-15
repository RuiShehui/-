<template>
  <div :class="[colour === 'white' ? 'bank-footer white' : 'bank-footer']">
    <div class="footer-main">
      <div class="riles_span">
        <div v-for="(item, index) in list " :key="index">
          <span @click="jump(index)">{{ businessAccountQuery(item) }}</span> &nbsp;
          <span v-if="index !== list.length - 1">|</span> &nbsp;
        </div>
      </div>

      <span class="right_span">©{{sysTime}}{{$t(`LOGON.CHONG_HING_BANK_LIMITERD`)}}</span>
    </div>
  </div>
</template>

<script>
import { getNow } from '@/api/login.js';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
export default {
  name: 'Footer',
  props: {
    colour: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sysTime: '',
      list: [
        {
          key: 1,
          content: 'TERMS_OF_SERVICE'
        },
        // {
        //   key: 2,
        //   content: 'TERMS_OF_BILL'
        // },
        {
          key: 3,
          content: 'PRIVACY_POLICY_STATEMENT'
        },
        {
          key: 4,
          content: 'PERSONAL_INFORMATION'
        },
        {
          key: 5,
          content: 'DISCLAIMER'
        }
      ]
    }
  },
   computed: {
    ...mapState(['lang']),
  },
  created() {
    this.SET_LANG();
    getNow().then(res => {
      this.sysTime = res.sysTime.substr(0, 4);
      sessionStorage.setItem("sysTimeYear", this.sysTime);
    }).catch(err => {
      this.sysTime = new Date().getFullYear();
      sessionStorage.setItem("sysTimeYear", this.sysTime)
    });
  },
  methods:{
     ...mapActions(['SET_LANG']),
    businessAccountQuery(item) {
      return this.$t(`LOGON.${item.content}`)
    },
    jump(index){
      console.log(index,'indexxx')
      console.log(this.lang,'lang')
      let lang = ''
      if(this.lang =='zh-CN'){
        
        lang = 'sc'
      }else if(this.lang =='zh-XG'){
        lang = 'tc'
      }else{
        lang = 'en'
      }
      switch(index){
        case 0:
        return  window.open(`https://220.241.39.47/termOfConditionSC.html`)
        case 1:
        return window.open(`http://www.chbank.com/${lang}/personal/footer/others/privacy-policy/pps.shtml`) 
        case 2:
          console.log(1111)
        return  window.open(`http://www.chbank.com/${lang}/personal/footer/others/privacy-policy/pics.shtml`)
        case 3:
        return window.open(`http://www.chbank.com/${lang}/personal/footer/others/disclaimer/index.shtml`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bank-footer {
  width: 100%;
  background: #f5f5f5;
  &.white {
    background: #fff;
  }
}
.footer-main {
  width: $main-width;
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}
.riles_span {
  display: flex;
  font-size: 12px;
  color: #666666;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
}
.right_span {
  font-size: 12px;
  color: #666666;
  text-align: center;
  line-height: 22px;
  font-weight: 400;
}
</style>
