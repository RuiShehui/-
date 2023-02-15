<template>
  <div class="silder-bar">
    <el-row>
      <el-col :span="24">
        <el-menu
          :default-active="getSliderMenusAct"
          :default-openeds="defaultOpeneds"
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
        >
          <silderMenu v-if="getSliderMenus.children" :menuList="getSliderMenus.children"></silderMenu>
          <silderMenu v-else :menuList="getSliderMenus"></silderMenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import silderMenu from './silderMenu';
import { mapGetters, mapMutations } from 'vuex';
import { getActiveClickArr, safeGetLocalStorage } from '@/utils';
export default {
  data() {
    return {
      defaultOpeneds: [],
      dataList: [],
      dataArr: []
    };
  },
  components: {
    silderMenu
  },
  computed: {
    ...mapGetters('app', ['getSliderMenus', 'getSliderMenusAct', 'getBreadcrumb'])
  },
  methods: {
    ...mapMutations('app', [
      'setSliderMenus',
      'setUserMenusAct',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    async handleSelect(key, keyPath) {
      if (!key) return;
      if (key.substring(0, 2) !== "14" && !this.getBreadcrumb.length) {
        return;
      }
      this.setSliderMenusAct(key);
      let idArr = {
        parent: '14',
        children: ['1401', '1402', '1403']
      };
      let mentArr = await safeGetLocalStorage('userMenusAll');
      let parentArr = []
      let childrenArr = []
      parentArr = mentArr.filter(x => x.menuCode === idArr.parent)
      childrenArr = mentArr.filter(x => idArr.children.includes(x.menuCode))
      parentArr[0].children = childrenArr;
      let breadcrumbList = [];
      if (key.substring(0, 2) !== "14") {
        breadcrumbList = getActiveClickArr(key, this.getSliderMenus);
      } else {
        let arr = [parentArr[0]];
        parentArr[0].children.forEach(item => {
          if (item.id === key) {
            arr.push(item);
          }
        });
        breadcrumbList = arr;
      }
      this.setBreadcrumb(breadcrumbList);
      const keys = this.getBreadcrumb.map(item => item.id);
      const path = this.getBreadcrumb.map(item => item.path);
      this.defaultOpeneds = keys;
      if (path.length) {
        this.$router.push(path[path.length - 1]);
      } else {
        this.$router.push(this.getSliderMenus.children.filter(x => x.id === key)[0].path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.silder-bar {
  overflow: hidden;
  .el-menu {
    border-right: none !important;
  }
}
</style>
<style lang="scss" >
.silder-bar .el-menu-item span {
  font-size: 16px;
}
.silder-bar .el-submenu__title span {
  font-size: 16px;
}
.silder-bar {
  .el-submenu__icon-arrow {
    right: 16px;
  }
  .el-submenu .el-menu-item {
    min-width: 184px;
  }
  > div > .el-submenu > .el-submenu__title {
    padding-left: 16px !important;
  }
  > div > .el-menu-item {
    padding-left: 16px !important;
  }

  //设置选中el-menu-item时的样式
  /deep/ .el-menu-item.is-active {
    //  border-bottom: 4px solid;
    border-left: 4px solid #f06b00 !important;
    color: #f57e00;
    background: rgba($color: #f57e00, $alpha: 0.06);

    // background-blend-mode: normal, normal;
    // filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#c6ab75',endColorstr='#e8d2a2',gradienttype=1);
  }
  .el-menu-item:not(.is-active):focus,
  .el-menu-item:not(.is-active):hover,
  .el-submenu__title:hover {
    background: #fff;
  }
  .el-menu-item,
  .el-submenu__title {
    height: auto !important;
    padding: 15px;
    line-height: 20px !important;
    transition: none !important;
    span {
      display: block;
      // width: 7em;
      white-space: pre-wrap;
      line-height: 20px !important;
    }
  }
}
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #999999;
  font-weight: 400;
}
.el-breadcrumb__inner a:hover {
  color: #000000 !important;
}
</style>
