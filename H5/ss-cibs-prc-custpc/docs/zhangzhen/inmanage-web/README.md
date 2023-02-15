# 个人网银-内管系统 (基于Vue2.0)

## 目录结构划分

  - 请后续开发人员自行补充

## 常用工具讲解

  ### 1.HttpModel (@class 基于axios二次封装的请求工具)

  - 用法
    
    ``` JavaScript

    import { http } from '@/api/http';
    
    /**
     * @description 请求Foo
     * @param {{ [key: string]: any }} params 请求参数
     * @return {unknown} 返回内容 
     */
    function getFooList(params) {

      return http({
        url: '/xxx/xxxxx',
        data: {
          body: {
            ...params
          }
        },
        method: 'POST'
      });
    }

    ```

    ``` JavaScript
    import { getFooList } from '@/api/foo';

    /** SFC */
    export default {
      name: 'ComponentName',
      props: {
        /* ------ */
      },
      data() {
        return {
          /* ------ */
        };
      },
      mounted() {
        this.getFoos();
      },
      methods: {
        async getFoos() {
          const result = await getFooList({});
          const { body } = result;
          if (![undefined, null].includes(body)) {
            // TODO ......
          }
        }
      }
    };
    ```

  - 内部实现 (详情查看注释)
    
    ``` JavaScript
    const http = new HttpModel({
      /** 使用环境变量作为BASE_URL */
      baseURL: process.env.VUE_APP_AWEB_API,
      /** 请求最长等待时间 */
      timeout: 20 * 1000,
    });

    export default http;
    ```

    ``` JavaScript
      class HttpModel {
        /** 
         * 参考方法以及内部注释, 不懂请问作者
         */
      }
    ```

  ### 2.ShowMessage
    
  - 用法

    1. 直接从工具库中引入使用
    
    ``` JavaScript
      import { ShowMessage } from '@/plugins';

      ShowMessage({
        type: 'success',
        message: 'Foo',
        duration: 1500
      });
      ShowMessage({
        type: 'success',
        message: 'Foo',
        duration: 1500
      });
    ```

    2. 在SFC中使用 (vm.$showMsg)

    ``` JavaScript
    /** SFC */
    export default {
      name: 'ComponentName',
      mounted() {
        this.showMsg();
      },
      methods: {
        showMsg() {
          this.$showMsg({
            type: 'success',
            message: 'Foo',
            duration: 1500
          });
        }
      }
    };
    ```

  - 实现

    1. 外层插件安装

    ``` JavaScript
    import plugins from './plugins';

    Vue.install(plugins);
    ```

    2. 插件实现

    ``` JavaScript
    import ShowMessage from './src/show-message';

    const plugins = {};

    /**
     * 每一个在Vue中使用的插件必须实现一个第一个形参为Vue的install方法 (参照Vue2.0文档)
     * 第一个形参为Vue, 第二个为配置"Vue.use"的第二个参数的配置选项选项
     * @param {import('vue')} Vue Vue构造函数
     * @param {{ [key: string]: any }} opts Vue.use时候传入的第二个参数
     */
    plugins.install = function (Vue, opts) {

      // ShowMessage挂载到Vue的原型上
      Vue.prototype.$showMsg = ShowMessage;
    }

    export default plugins;
    ```

    ``` JavaScript (showMessage实现)
      /** 
       * 1.查看Main.js的注释
       * 2.查看message.vue的注释
       */
    ```

  ### 3.ShowBox & ShowModal

  - 用法

    1. 直接引入使用

    ``` JavaScript
    import { ShowMessageBox, ShowModal } from '@/plugins';

    ShowMessageBox({
      /** 显示内容 */
      content: 'MessageBox Content',
      /** 多少ms后自动关闭 */
      removeDeplay: 10000,
      /** 点击确认后的回调方法*/
      confirm: () => {
        console.log('confirm!');
      },
      /** 点击取消后的回调方法*/
      cancel: () => {
        console.log('cancel!');
      }
    });
    ShowModal({
      /** 显示内容 */
      content: 'MessageBox Content',
      /** 多少ms后自动关闭 */
      removeDeplay: 10000,
      /** 点击确认后的回调方法*/
      confirm: () => {
        console.log('confirm!');
      },
      /** 点击取消后的回调方法*/
      cancel: () => {
        console.log('cancel!');
      }
    });
    ```

    2. 在SFC中使用

    ``` JavaScript
    export default {
      name: 'ComponentName',
      mounted() {
        this.$showBox({
          /** 显示内容 */
          content: 'MessageBox Content',
          /** 多少ms后自动关闭 */
          removeDeplay: 10000,
          /** 点击确认后的回调方法*/
          confirm: () => {
            console.log('confirm!');
          },
          /** 点击取消后的回调方法*/
          cancel: () => {
            console.log('cancel!');
          }
        });
      }
    };
    ```

  - 实现

  ``` JavaScript
  import ShowMessageBox from './src/show-message-box';

  const plugins = {};

  /**
    * 每一个在Vue中使用的插件必须实现一个第一个形参为Vue的install方法 (参照Vue2.0文档)
    * 第一个形参为Vue, 第二个为配置"Vue.use"的第二个参数的配置选项选项
    * @param {import('vue')} Vue Vue构造函数
    * @param {{ [key: string]: any }} opts Vue.use时候传入的第二个参数
    */
  plugins.install = function (Vue, opts) {

    Vue.prototype.$showBox = ShowMessageBox;
  }

  ```

  ``` JavaScript
    /**
     * 内部实现参照show-message-box.js中的注释
     */
  ```

  ### 4.TreeTable (基于ElementUI-ElTable封装的树形选择的表格组件)

  - 用法

    ``` Html
    <tree-table
      :origin="originData"
      id="menuCode"
      pid="pMenuCode"
      :columns="columns"
      :tree-props="['operPerm', 'authPerm', 'queryPerm']"
      @on-change="getChecked"
    />
    ```

    ``` JavaScript
    /** 
     * @param {any[]} origin 原始扁平化的数据
     * @param {string} id 唯一id标识 (默认为"id")
     * @param {string} pid 父级id标识 (默认为"id")
     * @param {any[]} column 展示表格的表头
     * @param {string[]} treeProps 需要渲染的树形结构的字段
     * @param {(newValue: any[]) => void} onChange 当数据发生变化获取到的最新值
     */
    ```

  - 实现

  ``` JavaScript
    /** 
     * 具体实现请查看 components/tree-table
     */
  ```

  ### 5.MoneyInput (基于ElementUI-ElInput封装的金额输入框)

  - 用法

    ``` Html
    <money-input
      v-model="inputMoney"
      :isSaveDot="true"
    />
    ```

    ``` JavaScript
    /** 
     * 用法几乎与ElInput一致
    */
    ```

  - 使用 & 配置 & 扩展
  
    ``` JavaScript
    /** 
     * 位置: src/components/money-input
     * 使用 & 配置 & 扩展 请参考注释
     */
    ```

  ### 6.ExcelExport (针对内管和网银)

  ``` JavaScript
  /** 
   * 位置: src/utils/transform-excel
    * 使用 & 配置 & 扩展 请参考注释
    */
  ```

## 功能讲解

  ### 页面配置 (针对新开发页面)

  - 原理 (使用store(permission)中的menuList从静态路由表**white-list**中筛选出)

  - 步骤 (以APage为例)

    1. 先把A页面创建出来 (@/views/a-page/ + index.vue)

    2. 配置路由表 (@/router/ + a.js)

    ``` JavaScript
    /** 
     * @location "@/router/index.js"
     * @description 路由表入口
     */
    import Vue from 'vue';
    import VueRouter from 'vue-router';

    Vue.use(VueRouter);

    /** sub-routes import */
    import A from './a';

    const routes = [
      /** sub routes destructed */
      ...A,
    ];

    new VueRouter({
      routes
    });
    ```

    ``` JavaScript
    /** 
     * A routes
     * @location "@/router/a.js"
     */
    export default [
      {
        /** 路由路径 (必填, 面包屑需要依赖此路径) */
        path: 'a-page',
        /** 路由名称 (必填) */
        name: 'APage',
        component: () => import(`@/views/a`),
        meta: {
          /** 侧边栏标题 */
          title: 'APage',
        },
      }
    ];
    ```

    3. 配置多语言 (**vue-i18n**), 根据`path`和`title`配置多语言

     - - 在 (**zh-CN** & **zh_XG** & **en**中的`PAGE_MENU_ITEMS`中配置)

     ``` JavaScript
     export default {
       /** <sub-langs-configs /> */

       "PAGE_MENU_ITEMS": {
         /** sub langs */
         "A-PAGE": "A页面", // 面包屑标题
         "A_PAGE": "A页面", // 侧边栏标题
       }

       /** <sub-langs-configs /> */
     };
     ```

    4. 总白名单添加路径 (`@/configs/white-list.js`)

    ``` JavaScript
    export default {
      /** sub configs */

      {
        url: '/a-page', // 总的模块url
        urlMap: [
          '/a-page'
        ]
      }
    }
    ```

    5. store中配置 (`@/store/modules/permission`)

    ``` JavaScript
    /** 
     * 1.开发时, 需要在默认白名单数组下配置
     * 2.开发完成后, 需要将菜单总信息给到后端添加到数据库
     * 3.添加完成后, 删除permission-origin-list中的内容, 根据后端返回的菜单进行鉴权判断即可
     */
    ```

  ### 新增功能

  - TODO

entType =1 sa
entType =2 mam

cuSoleAuthorizerInd =1   单一批核者/其他不是单一批核者


or   no 
  ###