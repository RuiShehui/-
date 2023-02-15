<template>
  <div class="bank-main">
    <div class="bank-main-cont clearfix">
      <div class="bank-main-cont-left">
        <!-- 侧边栏 -->
        <silderBar></silderBar>
      </div>

      <!-- 内容区域 -->
      <div class="bank-main-cont-right">
        <!-- 面包屑 -->
        <div class="bank-main-cont-right-breadcrumb breadcrumb">
          <el-breadcrumb separator=">">
            <!-- :to="{ path: item.path }" -->
            <el-breadcrumb-item v-for="(item) in getBreadcrumb" :key="item.id">{{ item[menuName] }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 内容区 -->
        <div class="bank-main-cont-right-content">
          <keep-alive :include="keepAliveComponents">
            <router-view v-if="isShowContent" :key="key" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import silderBar from '../silderBar';
import { createNamespacedHelpers } from 'vuex';
import { remindAutherByEmail } from '@/api/public';
import keepAliveComponents from '@/utils/keep-alive-components';

const { mapGetters, mapState } = createNamespacedHelpers('app');

export default {
  name: 'bankMain',
  data() {
    return {
      isHasSilder: true,
      isShowContent: true,
      entType: Number(localStorage.getItem('entType') || '0'),
      keepAliveComponents
    };
  },
  provide() {
    return {
      clearLevelLists: this.clearLevelLists,
      scrollToTop: this.scrollToTop,
      entType: this.entType,
      sendEmail: this.sendEmail,
    };
  },
  computed: {
    ...mapState(['lang']),
    ...mapGetters(['getBreadcrumb', 'getLang']),
    menuName() {
      return this.getLang === 'zh-CN' ? 'menuNameSC' : this.getLang === 'zh-HK' ? 'menuNameTC' : 'menuNameEN'
    },
    key() {
      const result = this.$route.path;

      return result;
    }
  },
  created() {
    console.log('getBreadcrumb',this.getBreadcrumb)
  },
  watch: {
    lang(newVal) {
      console.log('vuex lang : ', newVal);
      this.isShowContent = false;
      setTimeout(() => {
        this.isShowContent = true;
      }, 50);
    },
    '$route.path'() {
      this.entType = Number(localStorage.getItem('entType') || '0');
    }
  },
  components: {
    silderBar
  },
  methods: {
    clearLevelLists() {
      localStorage.setItem('A_LEVEL_LIST', '[]');
      localStorage.setItem('B_LEVEL_LIST', '[]');
      localStorage.setItem('C_LEVEL_LIST', '[]');
    },

    scrollToTop() {
      const el = document.querySelector('.bank-main-cont-right-content');

      if (el) {
        el.scrollTop = 0;
      }
    },
    /** 公共方法-发送邮件 */
    async sendEmail(confirmData = {}) {
      const tradeType = localStorage.getItem('sliderMenusAct');
      const {
          AlevelList = [],
          BlevelList = [],
          ClevelList = []
        } = confirmData.authInfo,
        userList = [...AlevelList, ...BlevelList, ...ClevelList].reduce(
          (prev, cur) => {
            if (cur) {
              const item = {
                userCode: cur.userCode,
                email: cur.email
              };
              prev.push(item);
            }

            return prev;
          },
          []
        );
      if (userList.length) {
        const params = { tradeType, userList };
        const emailRes = await remindAutherByEmail(params);
        if (emailRes) {
          console.log('send email result', emailRes);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .bank-main-cont-right-breadcrumb {
//   padding: 20px 24px 24px;
//   box-sizing: border-box;
//   font-size: 14px;
//   width: 55%;
//   height: 30px;
//   // position: fixed;
//   background-color: #fff;
// }
.bank-main-cont-left {
  font-size: 16px !important;
}
/deep/.bank-main {
  width: 100%;
  // justify-content: center;

  &-cont {
    display: flex;
    min-width: 1392px;
    width: 1392px;
    align-items: center;
    margin: 0 auto;
    padding: 12px 0;
    height: calc(100vh - 176px);
    &-left {
      width: 264px;
      background-color: #fff;
      height: calc(100%);
      overflow: auto;
    }
    &-right {
      margin-left: 12px;
      width: 1116px;
      height: calc(100%);
      // overflow: hidden;
      background-color: #fff;
      &-breadcrumb {
        // position: absolute;
        padding: 16px 24px 24px;
        box-sizing: border-box;
        background-color: #fff;
        .el-breadcrumb {
          .el-breadcrumb__inner {
            font-size: 14px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.45);
          }
          .el-breadcrumb__item:last-child {
            .el-breadcrumb__inner {
              color: rgba(0, 0, 0, 0.85);
            }
          }
        }
      }
      &-content {
        // margin-top: 24px;
        height: calc(100% - 96px);
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0 24px;
      }
    }
  }
}

.bank-main {
  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    color: #999999;
    font-weight: 500 !important;
  }
  .el-breadcrumb__inner a:hover {
    color: #e97e0d;
  }
  .el-breadcrumb__separator {
    margin: 0 8px;
    font-weight: 100;
  }
}
@media (max-width: 1440px) {
  .bank-main {
    &-cont {
      width: 1392px;
      &-right {
        width: 1167px;
      }
      &-left {
        width: 264px;
      }
    }
  }
}
</style>
