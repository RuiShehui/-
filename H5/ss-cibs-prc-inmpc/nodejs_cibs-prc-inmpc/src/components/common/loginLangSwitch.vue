<template>
  <div class="language-mode">
    <!-- <img class="chineseIcon" :src="chineseImg" @click="handleCommand('zhCN')" /> &nbsp| &nbsp -->
    <span
      style="cursor:pointer; padding: 10px 15px;"
      :class="zhCNSelect ? 'language_select' : 'language'"
      @click="handleCommand('zhCN')"
    >简体</span>
    |
    <span
      style="cursor:pointer; padding: 10px 15px;"
      :class="zhXGselect ? 'language_select' : 'language'"
      @click="handleCommand('zhXG')"
    >繁体</span>
    <!-- |
    <span
      style="cursor:pointer; padding: 10px 15px;"
      :class="enSelect ? 'language_select' : 'language'"
      @click="handleCommand('en')"
    >English</span> -->
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { HEAD } from '@/configs/keys';
import { getHead } from '@/utils/user';

const { mapActions, mapState } = createNamespacedHelpers('app');

export default {
  name: 'LoginLangSwitch',
  data() {
    return {
      zhCNSelect: false, //是否选中中文简体，true为选中，false为未选中
      zhXGselect: true, //是否选中中文繁体，true为选中，false为未选中
      enSelect: false, ////是否选中英文，true为选中，false为未选中

      langField: '语言版本切换',
      langList: Object.freeze({
        en: 'English',
        zhXG: '繁體',
        zhCN: '简体'
      })
    };
  },
  computed: {
    ...mapState(['lang'])
  },
  mounted() {
    this.initLang();
  },
  methods: {
    ...mapActions(['SET_LANG']),
    initLang() {
      const head = getHead();
      if (head) {
        const { lang } = head;
        if (lang) {
          this.handleCommand(lang);
          return;
        }
      }
      this.handleCommand(this.lang);
    },
    handleCommand(command) {
      if (command === 'zhCN') {
        this.zhCNSelect = true;
        this.zhXGselect = false;
        this.enSelect = false;
      } else if (command === 'zhXG') {
        this.zhCNSelect = false;
        this.zhXGselect = true;
        this.enSelect = false;
      } else if (command === 'en') {
        this.zhCNSelect = false;
        this.zhXGselect = false;
        this.enSelect = true;
      }

      const { langList } = this;
      this.langField = langList[command];

      this.switchLang(command);
      this.setHeadLang(command);
      this.$eventBus.$emit('changeLanguage');
    },

    switchLang(lang) {
      this.switchLocalLang(lang);
      this.switchI18nLocale(lang);
    },
    switchLocalLang(lang) {
      this.SET_LANG(lang);
    },
    switchI18nLocale(lang) {
      this.$i18n.locale = lang;
    },
    setHeadLang(lang = '') {
      const head = getHead();
      if (head) {
        head.lang = lang;
        sessionStorage.setItem(HEAD, JSON.stringify(head));
      }
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
  //   line-height: 10px;
  //   padding-left: 20px;
  text-align: right;
  margin: 30px 120px 0 0;
  // float: right;
}
.chineseIcon {
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
}
.lang-item {
  cursor: pointer;
  margin-left: 10px;
}
.language {
  width: 15px;
  height: 20px;
   
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0.88px;
  font-weight: 400px;
}
.language_select {
  width: 15px;
  height: 20px;
   
  font-size: 14px;
  color: #f06b00;
  letter-spacing: 0.88px;
  font-weight: 400px;
}
</style>
