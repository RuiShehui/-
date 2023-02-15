<template>
  <div class="language-mode">
    <span :class="getLang === 'zh-CN' ? 'language_select' : 'language'" @click="handleCommand('zh-CN')">简体</span> 
    <span style="color:#ccc;">|</span>
    <span
      :class="getLang === 'zh-HK' ? 'language_select' : 'language'"
      @click="handleCommand('zh-HK')"
    >繁体</span> 
    <span style="color:#ccc;">|</span> 
    <span
      :class="getLang === 'en' ? 'language_select' : 'language'"
      @click="handleCommand('en')"
    >English</span>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapGetters } from 'vuex';
import Bus from "@/utils/bus.js"
const { mapActions } = createNamespacedHelpers('app');

export default {
  name: 'LangSwitch',
  data() {
    return {
      chineseImg: require('../../images/home/feedback.png'),
      langField: '语言版本切换',
      lang: Object.freeze({
        en: 'English',
        "zh-HK": '繁體',
        "zh-CN": '简体'
      })
    };
  },
  computed: {
    ...mapGetters('app', ['getLang'])
  },
  created() {
    this.setBoayLang(this.getLang)
  },
  methods: {
    ...mapActions(['SET_LANG']),
    setBoayLang(lang) {
      let body = document.getElementsByTagName("body")[0];
      let att = document.createAttribute('id')
      att.value = lang
      body.setAttributeNode(att)
    },
    handleCommand(command) {
      if (command === 'zh-CN') {
        document.title = '演示个人网上银行'
      }else if (command === 'zh-HK'){
        document.title = '創興個人網上銀行'
      }else {
        document.title = 'Yan Shi Personal Internet Banking'
      }
      console.log('command',command)
      const { lang } = this;
      this.langField = lang[command];
      this.switchLang(command);
    },

    switchLang(lang) {
      // this.$router.go(0);
      this.switchLocalLang(lang);
      this.switchI18nLocale(lang);
    },
    switchLocalLang(lang) {
      this.SET_LANG({
        lang,
        cover: true
      });
      Bus.$emit('langs',lang)
      this.setBoayLang(lang)
    },
    switchI18nLocale(lang) {
      this.$i18n.locale = lang;
      // location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  .button {
    border-radius: 15px;
    font-size: 13px;
    padding: 0.5em 1em;
  }
  i {
    display: inline-block !important;
  }
}
.language-mode {
  background: #f5f5f5;
  line-height: 30px;
  // padding-left: 20px;
  text-align: center;
  width: 183px;
  height: 30px;
  border-radius: 3px;
}
.chineseIcon {
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
}
.language {
  width: 15px;
  height: 20px;
   
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0.88px;
  font-weight: 400px;
  padding: 0 8px;
}
.language_select {
  width: 15px;
  height: 20px;
   
  font-size: 14px;
  color: #f06b00;
  letter-spacing: 0.88px;
  font-weight: 400px;
  padding: 0 8px;
}
span {
  cursor: pointer;
}
span:hover {
  color: #f06b00;
}
</style>
