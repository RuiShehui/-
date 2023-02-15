<!--
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-02-18 18:06:49
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\bankHeader\MenuTree.vue
-->
<script type="text/jsx">

export default {
  name: 'MenuTree',
  functional: true, // 使用函数式组件，避免使用根元素
  props: {
    menuData: {
      type: Array,
      default: () => []
    }
  },

  render(h, context) {
    const { props } = context
    const components = props.menuData.map(menu => {
      // 根据 children 的长度判断渲染 el-menu-item 和 el-submenu
      // || typeOf() === 'undefine'
      const children = menu.children || [];
      if (
        children.length === 0 ||
        typeof children === 'undefined'
      ) {
        return (
          <el-menu-item index={ menu.path }>
            <span slot="title">{ menu.name }</span>
          </el-menu-item>
        )
      } else {
        if (menu.id.length === 2) {
          return (
            <el-submenu index={menu.path}>
              <template slot="title">{menu.name}</template>

              {/* 递归组件 */}
              <menu-tree menuData={children} />
            </el-submenu>
          )
        }else{
          return(
            <el-menu-item index={menu.path}>
              <span slot="title">{menu.name}</span>
            </el-menu-item>
          )
        }
      }
    })
    return components
  }
}
</script>

