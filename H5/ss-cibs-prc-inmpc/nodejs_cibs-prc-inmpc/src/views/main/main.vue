<template>
  <div class="app-container">
    <div class="welcome-wrapper">
      <div class="welcome-ctn">
        <img src="../../img/custom-aweb-logo.png" />
        <h1 class="example-header">欢迎使用 AWEB！</h1>
      </div>
      <ul data-role="exampleLinkList" class="example-link-list">
        <li class="example-link-item" v-for="(item,index) in mainList" :key="index">
          <a target="_blank" :href="item.href" :title="item.name">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="welcome-footer">
      <ul class="welcome-footer-list">
        <li>
          <a href="https://git.awebide.com/webide-open/user-doc/issues/394" target="_blank">自定义首页</a>
        </li>
        <li>|</li>
        <li>
          <a href="https://nanyan.agree.cn/vue-spa/user-guide/dev/api.html" target="_blank">自定义后台地址</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainList: [
        {
          name: "WebIDE 用户手册",
          href: "https://nanyan.agree.cn/webide/user-guide/"
        },
        {
          name: "Vue SPA 用户手册",
          href: "https://nanyan.agree.cn/vue-spa/user-guide/"
        },
        {
          name: "资源市场",
          href: "https://market.awebide.com"
        },
        {
          name: "演示案例",
          href: "https://nanyan.agree.cn/webide/user-guide/presentation.html"
        },
        {
          name: "问答区",
          href: "https://git.awebide.com/webide-open/user-doc/issues"
        },
        {
          name: "常见功能",
          href:
            "https://git.awebide.com/webide-open/user-doc/wikis/WebIDE/%E5%85%B6%E4%BB%96%E5%8A%9F%E8%83%BD%E7%9B%AE%E5%BD%95"
        }
      ]
    };
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.app-container {
  text-align: center;
}
.welcome-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
.example-link-list {
  margin: 0;
  padding: 0;
  // display:flex;
  width: 100%;
  margin: 10px 0;
  list-style: none;
  text-align: center;
  margin-top: 50px;
}
.example-link-item {
  display: inline-block;
  list-style: none;
  padding: 2em;
  margin: 1em;
  border-radius: 6px;
  box-shadow: 0px 0px 6px #efefef;
}
.example-link-item a {
  text-decoration: none;
  color: $--color-primary;
}
.example-link-item a:hover {
  text-decoration: underline;
}
.welcome-footer {
  position: absolute;
  bottom: 1em;
  left: 1em;
  right: 2em;
  display: flex;
  justify-content: flex-end;
}
.welcome-footer-list {
  display: flex;

  > li {
    padding: 0 5px;
  }
}
</style>
