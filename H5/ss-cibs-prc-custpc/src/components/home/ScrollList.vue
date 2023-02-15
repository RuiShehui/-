<template>
  <section class="scroll-list">
    <div class="header">
      <span
        :key="menu.id"
        v-for="(menu, index) of menus"
        :class="{
          menu: true,
          'is-active': index === current,
        }"
        @click="handleJump(index)"
      >{{ menu[menuName] }}</span>
    </div>

    <div id="shortcut-menu-list" class="container" ref="scrollBar">
      <!-- menu 一级菜单 -->
      <menu-item class="anchor" v-for="menu of menus" :key="menu.id" :menu="menu" />
    </div>
  </section>
</template>

<script>
import MenuItem from './MenuItem'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    MenuItem
  },
  name: 'ScrollList',
  computed: {
    ...mapState({
      userMenus: state => state.app.quickMenu
    }),
    ...mapGetters('app', ['getLang']),
    menus({ userMenus }) {
      return userMenus.slice(1)
    },
    menuName() {
      return this.getLang === 'zh-CN' ? 'menuNameSC' : this.getLang === 'zh-HK' ? 'menuNameTC' : 'menuNameEN'
    }
  },
  data() {
    return {
      current: 0, // 当前激活的index
      scrollBar: null,
      firstTop: 0 // 滚动区域第一个元素的 getBoundingClientRect().top 的值
    }
  },
  methods: {
    handleSelect(index, indexPath) {},
    /**
     * 点击滚动
     */
    handleJump(index) {
      const { scrollBar } = this
      this.current = index
      scrollBar.scrollTo({
        top: this.tops[index],
        behavior: 'smooth'
      })
    }
  },
  mounted() {
    const scrollBar = (this.scrollBar = this.$refs['scrollBar'])
    const anchors = scrollBar.querySelectorAll('.anchor')
    this.firstTop = anchors[0].getBoundingClientRect().top
    let tops = []
    let heightArr = []
    // 将 top 距离推入tops数组
    for (let index = 0; index < anchors.length; index++) {
      const { top, height } = anchors[index].getBoundingClientRect()
      tops.push(top - this.firstTop)
      heightArr.push(height)
    }
    this.tops = tops;
    // 给 scrollBar 添加滚动监听
    scrollBar.addEventListener(
      'scroll',
      () => {
        const current_offset_top = scrollBar.scrollTop
        for (let i = 0; i < tops.length; i++) {
          if (current_offset_top <= (tops[i] + heightArr[i])) {
            // 根据滚动距离判断应该滚动到第几个导航的位置
            this.current = i
            break
          }
        }
      },
      true
    )
  },
}
</script>

<style lang="scss" scoped>
.scroll-list {
  ::v-deep {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .header {
   display: flex;
    height: 50px;
    background: #fffaf4;
    margin: 0 -25px;
    padding: 0 32px;

    .menu {
      display: flex;
      align-items: center;
      overflow-x: auto;
      cursor: pointer;
      padding: 0 12px;
      font-size: 16px;
      color: #333;
      // fw500
    }

    .is-active {
      color: #f57e00;

      &::after {
        content: '';
        height: 3px;
        background: #f57e00;
        /* width: 100%; */
        /* position: absolute; */
        display: block;
        bottom: 0;
        transform: translateY(-3px);
      }
    }
  }

  .container {
    height: 350px;
    width: 100%;
    max-height: 350px;
    // margin-left: 20px;
    overflow: auto;
  }
}
</style>