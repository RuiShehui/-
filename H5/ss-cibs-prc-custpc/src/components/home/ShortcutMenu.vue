<template>
  <el-dialog
    :title="$t('MANAGEMENT.SHORTCUT_MENU_MANAGEMENT')"
    class="shortcut-menu-manage"
    :visible.sync="showShortcutMenu"
    :show-close="false"
    width="1180px"
    top='0vh'
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <section class="selected-funcs container">
      <div class="selected-title">
        <!-- <label>{{$t('MANAGEMENT.SELECTED_FUNCTION')}}</label> -->
        <span v-show="selectedFuncs.length === 5">{{$t('MANAGEMENT.COMMONLY_USE')}}~</span>
      </div>

      <el-row class="selected-list">
        <!-- TODO -->
        <func-item v-for="(item, index) of selectedFuncs.slice(0,5)" :key="index" :func="item" />

      </el-row>
    </section>

    <scroll-list />

    <span slot="footer" class="dialog-footer">
      <el-button class="cancel double-button" @click="handleCancel">{{$t('COMMON.CANCEL')}}</el-button>
      <el-button type="primary" :disabled="isBtnState" class=" double-button" @click="handleFinish">{{$t('COMMON.COMPLETE')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'
import { updateShortcutMenuInfo } from "@/api/home"
import { ScrollList } from './index'
// import cloneDeep from 'clone-deep'

export default {
  name: 'ShortcutMenu',
  components: {
    FuncItem: () => import('./FuncItem.vue'), // 懒加载组件
    ScrollList
  },
  computed: {
    ...mapState({
      userMenus: 'userMenus'
    }),
    ...mapGetters('home', ['selectedFuncs']),
    showShortcutMenu: {
      get() {
        const ret = this.$store.state.home.showShortcutMenu
        if (ret) {
          this.$forceUpdate();
        }
        return ret
      },
      set(newVal) {
        this.setShowShortcutMenu(newVal)
      }
    },
    showAddButton({ selectedFuncs }) {
      return selectedFuncs.length < 5
    }
  },
  mounted() {

  },
  data() {
    return {
      isBtnState: false,
      addImage: require('../../images/home/coin.png'),
      // addImage: require('../../images/home/transfer.png')
    }
  },
  methods: {
    ...mapMutations('home', ['setShowShortcutMenu']),
    ...mapMutations('app', ['setQuickMenu', 'setQuickDomain', 'setUserMenus']),
    
    handleFinish() {
      this.isBtnState = true;
      updateShortcutMenuInfo({
        smId: this.$store.state.app.quickMenuId, // 获取用户快捷才菜单接口可以获取到
        menuCode: JSON.stringify(this.selectedFuncs.map(x => x.id))
      }).then(res => {
        this.isBtnState = false;
        if (res) {
          // 设置选中快捷菜单
          this.setQuickDomain(this.selectedFuncs);
          // 设置快捷菜单
          this.setUserMenus(this.$store.state.app.quickMenu);
          this.close()
        }
      }).catch(err => {
        this.isBtnState = false;
      });
    },
    handleCancel() {
      this.setQuickMenu(this.$store.state.app.userMenus);
      this.close()
    },
    close() {
      this.showShortcutMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.shortcut-menu-manage {
  ::v-deep {
    &.el-dialog {
      // margin-top: 20% !important;
    }
    .el-dialog__header {
      background-color: rgba(254, 175, 3, .1);
      padding: 11px 32px;
      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
      text-align: start;

      .el-dialog__title {
        font-size: 16px;
        color: #333333;
        font-weight: 500;
      }
    }
    .el-dialog__body {
      padding: 0px 12px;
      word-break: initial;
      word-wrap: break-word;
      overflow: hidden;
    }
    sup:hover {
      cursor: pointer;
    }
  }

  .selected-funcs {
    .selected-title {
      margin: 20px 0 0 0;
      label {
        padding: 5px 12px;
        background: rgba(240, 107, 0, 0.1);
        border-radius: 40px;
        font-size: 18px;
        line-height: 25px;
        color: #f06b00;
      }

      span {
        font-size: 14px;
        color: #e12828;
        margin-left: 15px;
      }
    }

    .selected-list {
      display: flex;
      margin: 24px 0;
      min-height: 92px;
      .addButton {
        align-self: flex-start;
        display: flex;
        justify-content: center;
      }
    }
  }

  .container {
    margin-left: 20px;
  }
  .cancel{
    color: #f06b00 !important;
  }
}
</style>