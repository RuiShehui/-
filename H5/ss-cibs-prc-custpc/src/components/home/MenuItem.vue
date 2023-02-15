
<script>
import { mapGetters } from 'vuex'
import FuncItem from './FuncItem.vue';

export default {
  name: 'MenuItem',
  props: {
    menu: {
      type: Object
    }
  },
  components: {
    FuncItem,
  },
  computed: {
    ...mapGetters('app', ['getLang']),
    menuName() {
      return this.getLang === 'zh-CN' ? 'menuNameSC' : this.getLang === 'zh-HK' ? 'menuNameTC' : 'menuNameEN'
    }
  },
  render() {
    const { menu } = this;

    const renderMenuItem = () => {
      // func 二级菜单
      let menuItems = [];
      let isGroup = false;
      if (menu.children) {
        menu.children.forEach(item => {
          if (item.children) isGroup = true;
        })
        menuItems = menu.children.map(func => {
          // 如果存在第三级菜单
          if (func.children && func.children.length) {
            const res = func.children.map((f) => {
              return <func-item func={f} key={f.id} />;
            });
            return (
               <div class="func-items func-children">{res}</div>
            )
          } else {
            if (isGroup) {
              return <func-item class="func-items" func={func} key={func.id} />;
            } else {
              return <func-item class="func-items" func={func} key={func.id} />;
            }
          }
        });
      } else {
        menuItems = <func-item func={menu} key={menu.id} />;
      }
      return <div class="func-items">{menuItems}</div>;
    };

    return (
      <div class="menu-item">
        <p class="item-title">{menu[this.menuName]}</p>
        {renderMenuItem()}
      </div>
    );
  }
};
</script>
 
<style lang="scss" scoped>
.menu-item {
  margin-top: 36px;
  margin-left: 20px;

  .item-title {
    font-size: 18px;
    font-weight: 500;
    color: #333333;

    &::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 15px;
      background-color: #f57e00;
      margin-right: 15px;
    }
  }

  .func-items {
    display: flex;
    flex: start;
    flex-flow: wrap;
    align-items: flex-start;
    margin-top:16px;
  }
  .children-item-box {
    margin-top: 40px;
  }
  .children-box {
    position: relative;
    display: flex;
    padding: 16px 0;
    border-radius: 6px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.09);
    margin-right: 32px;
    margin-top: 40px;
    .children-title {
      font-size: 18px;
      color: #333;
      padding: 0 24px;
      width: 18px;
      display: flex;
      align-items: center;
      line-height: 26px;
      font-weight: bold;
    }
    .children-line {
      position: absolute;
      left: 66px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 1px;
      height: 62px;
      background-color: rgb(222,222,222);
    }
  }
}

body#en {
  .menu-item {
    &:last-child {
      padding-bottom: 20px;
    }
    .func-items {
      align-items: flex-start;
    }
    .children-item-box{
      &.margin-top-116 {
        margin-top: 116px;
      }
    }
    .children-box {
      flex-direction: column;
      .children-title {
        width: auto;
        height: 60px;
        align-items: flex-start;
      }
      .children-line {
        width: 100%;
        height: 1px;
        top: -100px;
        left: 0;
      }
      .func-children {
        align-items: flex-start;
        text-align: center;
      }
    }
  }
}
</style>