<!--
 * @Autor: 朱涛
 * @Date: 2021-11-04 15:28:13
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-11-04 21:26:23
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\ch-online-bank\src\components\home\FuncItem.vue
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
-->
<template>
  <div class="func-item">
    <div :class="[isShortMenu ? 'dot dot-add': 'dot dot-sub']" @click="handleClick">{{ symbol }}</div>
    <!-- TODO -->
    <el-image :src="func.icon" class="icon" />
    <p class="desc">{{ func[menuName] }}</p>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'FuncItem',
  props: {
    func: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      userMenus: state => state.app.userMenus
    }),
    ...mapGetters('app', ['getLang']),
    menuName() {
      return this.getLang === 'zh-CN' ? 'menuNameSC' : this.getLang === 'zh-HK' ? 'menuNameTC' : 'menuNameEN'
    },
    /**
     * 判断是否为添加
     */
    isShortMenu() {
      return this.func.pitchStatus === '0' ? false : true
    },
    /**
     * 显示的符号
     */
    symbol({ isShortMenu }) {
      return isShortMenu ? '-' : '+'
    },
    // 选中
    ...mapGetters('home', ['selectedFuncs'])
  },
  methods: {
    ...mapMutations('app', ['setPitchStatus']),
    // TODO
    handleClick() {
      const { isShortMenu, setPitchStatus, func } = this

      // 切换是否为快捷菜单的状态
      if (isShortMenu) {
        setPitchStatus(func.id, '0')
      } else {
        if (this.selectedFuncs && this.selectedFuncs.length > 4) {
          return
        }
        setPitchStatus(func.id, '1')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.func-item {
  // display: flex;
  // flex-direction: columns;
  position: relative;
  width: 110px;

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    color: #fff;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 18px;
    &.dot-add {
      background: #e12828;
    }
    &.dot-sub {
      background: #f06b00;
    }
  }

  .icon {
    width: 44px;
    height: 44px;
    margin: 14px auto 0;
    display: block;
  }

  .desc {
    margin-top: 12px;
    text-align: center;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, .85);
    width: 100%;
  }
}
</style>