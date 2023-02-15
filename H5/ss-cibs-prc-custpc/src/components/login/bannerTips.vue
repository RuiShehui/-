<!--
 * @Autor: 朱涛
 * @Date: 2021-11-04 15:28:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-21 09:59:27
 * @Description: 
 * @FilePath: \ss-cibs-prc-custpc\src\views\login\bannerTips.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="banner-tips">
    <figure v-for="(item, index) in list" :key="index" :class="{ QRCode: item.type === 'QRCode'}" @click="listClick(index)">
      <img :src="item.image" :alt="businessAccountQuery(item)" />
      <div>
        <figcaption class="banner-tips_fig">{{ businessAccountQuery(item) }}</figcaption>
        <figcaption class="banner-tips_ident">{{ item.identification }}</figcaption>
      </div>
    </figure>
  </div>
</template>

<script>
export default {
  name: 'BannerTips',
  data() {
    return {
      list: [
        {
          image: require('../../images/login/warning.png'),
          key: 'INTERNET_BANKING_SECURITY', //个人网上银行安保
          identification: ''
        },
        {
          image: require('../../images/login/business.png'),
          key: 'FAQ',  // 常见问题
          identification: ''
        },
        {
          image: require('../../images/login/service.png'),
          key: 'SERVICE_CENTER', //服务中心
          identification: ''
        },
        {
          type: "QRCode",
          image: require('../../images/home/qrCode.png'),
          key: 'CODE_TO_DOWNLOAD',  // 下载App
          identification: 'iPhone & Android'
        }
      ]
    }
  },
  mounted() {
    // console.log("this.$t:>> ", this.$t("login"));
  },
  methods: {
    listClick(index) {
      let lang = localStorage.getItem('lang');
      if (index === 2) {
        if (lang === "zh-CN") {
          window.open("http://www.chbank.com/sc/personal/footer/about-ch-bank/branches/index.shtml");
        } else if (lang === "zh-HK") {
          window.open("http://www.chbank.com/tc/personal/footer/about-ch-bank/branches/index.shtml");
        } else if (lang === "en") {
          window.open("http://www.chbank.com/en/personal/footer/about-ch-bank/branches/index.shtml");
        }
      }
    },
    businessAccountQuery(item) {
      return this.$t(`LOGON.${item.key}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-tips {
  background: #fff;
  height: 112px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

figure {
  display: flex;
  align-items: center;
}

figcaption {
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
}

img {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}

.banner-tips_fig {
  max-width: 165px;
   
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: 0;
  text-align: left;
  font-weight: 400;
}
.banner-tips_fig:hover{
  color: #f06b00;
  cursor: pointer;
}
.banner-tips_ident {
  font-size: 14px;
  color: #666666;
  text-align: justify;
  font-weight: 400;
  margin-top: 4px;
}
figure.QRCode {
  img {
    width: 80px;
    height: 80px;
  }
  .banner-tips_fig {
    max-width: 295px;
    font-size: 16px;
  }
}
</style>
