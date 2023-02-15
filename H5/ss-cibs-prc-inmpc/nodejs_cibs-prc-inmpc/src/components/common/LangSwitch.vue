<!--
 * @Autor: 朱涛
 * @Date: 2021-11-11 09:49:36
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-29 09:11:24
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\common\LangSwitch.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <el-dropdown class="dropdown" trigger="click" @command="confirmSwitchLang">
    <span class="main-text" @click="handleSwitchIcon">
      {{ langField }}
      <i :class="iconClassList"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(lang, langIdx) in LangList" :command="langIdx" :key="langIdx">
        <!-- 当前语言 -->
        {{ lang }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { HEAD } from '@/configs/keys';
import { getHead } from '@/utils/user';

const { mapActions, mapState } = createNamespacedHelpers('app');

export default {
  name: 'LangSwitch',
  data() {
    return {
      langField: '',
      LangList: Object.freeze({
        zhCN: '简体',
        zhXG: '繁體',
        // en: 'English'
      }),
      iconClassList: ['right-icon', 'el-icon-arrow-down']
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
      // const head = getHead();
      // if (head) {
      //   const { lang } = head;
      //   if (lang) {
      //     this.handleCommand(lang);
      //     return;
      //   }
      // }
      this.handleCommand('zhXG');
    },
    confirmSwitchLang(lang) {
      if (lang === this.lang) {
        return;
      }
      this.$showBox({
        content: `${this.$t('COMMON.CONFIRM')}-${this.$t('BUSINESS_MANAGEMENT.SWITCH')} ?`,
        confirm: () => {
          this.onPageReload();
          this.handleCommand(lang);
        }
      });
    },
    handleCommand(command) {
      // console.log("打印command", command)
      const { LangList } = this;
      this.langField = LangList[command];

      this.switchLang(command);
      this.$eventBus.$emit('langSwitch');
    },

    switchLang(lang) {
      this.switchLocalLang(lang);
      this.switchI18nLocale(lang);

      this.setHeadLang(lang);
    },
    switchLocalLang(lang) {
      this.SET_LANG(lang);
    },
    switchI18nLocale(lang) {
      // console.log("lang :>> ", lang);
      this.$i18n.locale = lang;
    },
    setHeadLang(lang = '') {
      const head = getHead();
      if (head) {
        head.lang = lang;
        sessionStorage.setItem(HEAD, JSON.stringify(head));
      }
    },
    onPageReload() {
      location.reload();
    },
    handleSwitchIcon() {
      // const [, prevClassName] = this.iconClassList;
      // const newClassName = prevClassName.includes('right') ? 'el-icon-arrow-down' : 'el-icon-arrow-right';
      // this.iconClassList.splice(1, 1, newClassName);
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  .main-text {
    font-size: 13px;
    margin-left: 5px;
    &:hover {
      color: #f06b00;
    }
  }
  .right-icon {
    display: inline-block;
    margin: 0 5px;
    width: 8px;
    height: 8px;
    &:hover {
      color: #f06b00;
    }
  }
}
.el-dropdown-menu__item {
  background-color: transparent !important;
}
.el-dropdown-menu {
  top: 42px !important;
}
</style>
