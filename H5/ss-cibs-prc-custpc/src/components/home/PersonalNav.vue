<!-- 首页左侧个人信息-->
<template>
  <nav>
    <el-tooltip placement="top-start">
      <div slot="content">{{companyName}}</div>
      <div class="nav_title">{{companyName}}</div>
    </el-tooltip>

    <div class="info" style="display:flex">
      <div style="max-width:175px">
        <el-avatar class="avatar" :size="60" :src="avatar"></el-avatar>
      </div>
      <div>
        <p class="desc">
          {{$t('HOME.WELCOME_BACK',{
          userName:userName
          })}}
        </p>
        <div class="u-timeBox">
            <p class="time" :style="lang=='en'?'width:345px':''">
              {{$t('HOME.SUCCESSFUL_LOGON',{
              time:userInfo.lastLoginTime })}}
            </p>
        </div>
      </div>
    </div>

    <el-button
      class="personalSetting"
      icon="el-icon-edit-outline"
      @click="setUp"
    >{{$t("HOME.MY_SETTING")}}</el-button>
    <div class="nav-header">
      <span>{{$t("HOME.SHORTCUT_FUNCTION")}}</span>
      <el-button class="setting" @click="handleSetting">
        {{$t("HOME.MY_SETTINGS")}}
        <img
          class="u-image"
          style="padding-top:1px;"
          src="@/images/home/shezhi.png"
        />
      </el-button>
    </div>

    <ul class="menu">
      <li v-for="(item, key) of menuList" :key="key" @click="handleSelect(item)">
        <el-image class="menu-icon" :src="item.icon" />
        <div class="spanWrapper">
          <span>{{ item[menuListName] }}</span>
        </div>
        <img :src="images" style="width:12px;height:12px;" />
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapMutations, mapGetters,mapState } from 'vuex';
import { getActiveClickArr, safeGetLocalStorage } from '@/utils';
import { findShortcutMenuDetail, queryUserInfo } from '@/api/home';
import { createNamespacedHelpers } from 'vuex';

let lang = localStorage.getItem('lang');

export default {
  name: 'PersonalNav',
  components: {
    // index
  },
  computed: {
    ...mapState('app', ['lang']),
    ...mapGetters('app', ['getActiveClickArr', 'getLang']),
    menuList() {
      return this.$store.getters['app/getQuickDomain'];
    },
    menuListName() {
      return this.getLang === 'zh-CN'
        ? 'menuNameSC'
        : this.getLang === 'zh-HK'
        ? 'menuNameTC'
        : 'menuNameEN';
    }
  },
   watch: {
    // 切换语言
    lang(n, o) {
    console.log(n,'dsdsdsdsds')
    console.log(o,'d4324223')
    }
    // lang()
  },
  data() {
    return {
      avatar: require('../../images/user/headPortarit.png'),
      images: require('@/images/home/kuaijiecaidan.png'),
      status: false,
      logonTime: '',
      userInfo: {},
      userName: '',
      companyName: ''
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    ...mapMutations('home', ['setShowShortcutMenu', 'getUserMenus']),
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    //获取个人信息
    getUserInfo() {
      queryUserInfo().then(res => {
        this.userInfo = res;
        console.log(this.userInfo, 'this.userInfo');
        this.userInfo.lastLoginTime = this.userInfo.lastLoginTime.substring(
          0,
          this.userInfo.lastLoginTime.length - 3
        );
        // if(res.userChsName==''){
        this.userName = res.userEglsName;
        // }else{
        //   this.userName =res.userChsName
        // }
        if (res.entChsName == '') {
          this.companyName = res.entEglsName;
        } else {
          this.companyName = res.entChsName;
        }
        if (!res.lastLoginTime) {
          this.userInfo.lastLoginTime = '--';
        }
        localStorage.setItem('entType', res.entType);
        sessionStorage.setItem('userCode', res.userCode);
        sessionStorage.setItem('softTokenStatus', res.softTokenInfo.status);
      });
    },
    //个人设定
    async setUp() {
      let idArr = {
        parent: '14',
        children: ['1401', '1402', '1403']
      };
      let mentArr = await safeGetLocalStorage('userMenusAll');
      let parentArr = [];
      let childrenArr = [];
      parentArr = mentArr.filter(x => x.menuCode === idArr.parent);
      childrenArr = mentArr.filter(x => idArr.children.includes(x.menuCode));
      parentArr[0].children = childrenArr;
      this.setSliderMenusAct(parentArr[0].children[0].menuCode);
      this.$nextTick(() => {
        const breadcrumbList = [parentArr[0], parentArr[0].children[0]];
        this.setBreadcrumb(breadcrumbList);
      });
      this.setSliderMenus(parentArr[0].children);
      this.$router.push({
        path: parentArr[0].children[0].pacPath
      });
    },
    handleSetting() {
      this.setShowShortcutMenu(true);
    },
    //点击跳转
    handleSelect(item) {
      if (item.children) {
        item = item.children[0];
      }
      let id = item.id;
      this.setSliderMenusAct(id);
      let sliderMenu = [];
      if (id.length !== 2) {
        let menuItem;
        if (item.id.substr(0, 4) === '0501') {
          menuItem = this.$store.state.app.userMenus.filter(
            x => x.id === item.id.substr(0, 4)
          );
        } else {
          menuItem = this.$store.state.app.userMenus.filter(
            x => x.id === item.id.substr(0, 2)
          );
        }
        sliderMenu = [].concat(menuItem[0].children);
      } else {
        sliderMenu = [item];
      }
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr(id, sliderMenu);
        this.setBreadcrumb(breadcrumbList);
      });
      this.setSliderMenus(sliderMenu);
      this.$router.push({
        path: item.pacPath
      });
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  width: 232px;
  background-color: #fff;
  border-radius: 2px;
  justify-content: start;
  padding: 20px 24px;
  margin-right: 12px;
  margin-left: 20px;
  .nav_title {
    width: 224px;
    height: 22px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info {
    width: 100%;
    height: 90px;

    .avatar {
      margin-right: 12px;
      margin-top: 12px;
      box-shadow: 0 11px 12px 4px rgba(170, 170, 170, 0.2);
    }

    .desc {
      font-size: 14px;
      color: #333333;
      font-weight: 400;
      padding-top: 13px;
      max-width: 175px;
    }
    .u-timeBox{
      position: relative;
    }
    .time {
     margin-top: 8px;
    position: absolute;
    left: -135px;
    top: -20px;
    white-space: pre;
    font-size: 20px;
    color: #999999;
    font-weight: 400;
    -webkit-transform: scale(0.5);
    -ms-transform: scale(0.5);
    transform: scale(0.5);
    }
  }

  .personalSetting {
    width: 100%;
    height: 32px !important;
    padding-top: 9px;
    padding-bottom: 9px;
    border-radius: 17px;
    margin-top: 16px;
    color: #999999;
    border: 1px solid #999999;
    font-size: 14px;
    letter-spacing: 0;
  }
  .personalSetting:hover {
    border: 1px solid #f06b00;
    background: #fff;
    color: #f06b00;
  }
  .u-image {
    width: 12px;
    height: 12px;
    margin-left: -5px;
  }
  .nav-header {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 40px;
    justify-content: space-between;

    span {
      font-size: 17px;
      color: #333333;
      text-align: justify;
      font-weight: 500;
    }

    .setting {
      display: flex;
      // width: 65px;
      height: 24px;
      border: 1px solid #f06b00;
      color: #f06b00;
      border-radius: 12px;
      padding: 4px 13px !important;

      span {
        display: flex;
        color: #f06b00;
        font-size: 12px;
      }
    }
  }

  .menu {
    margin-top: 24px;
    width: 100%;
    cursor: pointer;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 15px 0;
      &:hover {
        color: #f06b00;
      }
      .menu-icon {
        width: 44px;
        height: 44px;
      }
      .spanWrapper {
        flex: 1;
        justify-content: start;
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        width: 100%;
        padding-left: 22px;
      }
      .spanWrapper:hover {
        color: #f06b00;
      }
      ::v-deep .el-icon--right {
        margin-top: 10px;
      }
    }
  }
}
</style>
