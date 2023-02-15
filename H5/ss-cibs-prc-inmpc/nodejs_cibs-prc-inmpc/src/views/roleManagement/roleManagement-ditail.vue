<!--
 * @Author: your name
 * @Date: 2021-10-26 10:50:54
 * @LastEditTime: 2022-05-18 16:37:07
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\roleManagement\roleManagement-ditail.vue
-->
<template>
  <div class="g-business">
    <el-form ref="formRef" label-width="calc(50% - 170px)">
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_CODE_SYMBOL')">
        <el-input v-model="roleCode" class="g-w-340" disabled />
      </el-form-item>
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_NAME_SYMBOL')">
        <el-input v-model="roleName" class="g-w-340" disabled />
      </el-form-item>
      <div class="title">
        <div></div>
        {{$t('ROLE_MANAGEMENT.ASSIGN_ROLE_PERMISSIONS')}}
      </div>
      <tree-table
        :origin="originData"
        id="menuCode"
        pid="pMenuCode"
        :columns="columns"
        :tree-props="['operPerm', 'authPerm', 'queryPerm']"
      ></tree-table>
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_DESCRIBLE_SYMBOL')" class="g-project">
        <el-input
          v-model="roleDescrible"
          class="g-w-340"
          disabled
          type="textarea"
          rows="5"
          resize="none"
          maxlength="300"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="g-bottom">
      <el-button class="f-cancel" @click="cancel">
        {{
        $t('COMMON.BACK')
        }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getMenuInfoList, getMenusByRole } from '@/api/menu-management';
import TreeTable from '@/components/tree-tables/index.vue';
import { getRoleDetail } from '@/utils/user';
export default {
  components: { TreeTable },

  data() {
    const self = this;
    return {
      isSubmit: false,
      roleCode: '0000112212', //角色编号
      roleName: '角色名称11', //角色名称
      roleDescrible: '角色描述11', //角色描述
      columns: [
        //菜单列
        {
          label: self.$t('MENU_MANAGEMENT.MENU_NAME_SYMBOL'),
          prop: 'menuName',
          width: '300'
        },
        {
          label: self.$t('ROLE_MANAGEMENT.OPERATION_AUTHORITY'),
          prop: 'operPerm'
        },
        {
          label: self.$t('ROLE_MANAGEMENT.AUTHORZATION_ATYHORITY'),
          prop: 'authPerm'
        },
        {
          label: self.$t('ROLE_MANAGEMENT.QUERY_AUTHORITY'),
          prop: 'queryPerm'
        }
      ],
      originData: [], //渲染的菜单数据
      roleMenuList: [] //角色拥有的菜单数组
    };
  },

  created() {},

  mounted() {
    let self = this;
    self.handleRoleData(); //处理角色信息
    this.search();
  },

  methods: {
    search() {
      //查询所有菜单——处理成树状结构
      getMenuInfoList().then(resp => {
        let arrList = [];
        if (resp.body && resp.head) {
          resp.body.forEach(item => {
            item.disabled = true;
            item.authPerm = false;
            item.operPerm = false;
            item.queryPerm = false;
            this.roleMenuList.forEach(rmItem => {
              if (rmItem.menuCode === item.menuCode) {
                if (rmItem.operPerm === 'Y') {
                  item.operPerm = true;
                }
                if (rmItem.authPerm === 'Y') {
                  item.authPerm = true;
                }
                if (rmItem.queryPerm === 'Y') {
                  item.queryPerm = true;
                }
              }
            });
            if (item.queryPerm || item.authPerm || item.operPerm) {
              arrList.push(item);
            }
          });
          let menuData = [];

          let editRoleAdmin = false; //true：被编辑的角色为管理员，false：被编辑角色不为管理员
          this.roleMenuList.forEach(item => {
            if (item.menuCode === '91541563' || item.pMenuCode === '91541563') {
              editRoleAdmin = true;
            }
          });

          getMenusByRole({
            roleCode: getRoleDetail().roleCode
          }).then(rep => {
            if (rep.body) {
              let loginRoleAdmiom = false; //true：当前角色为管理员，false：当前角色不为管理员
              rep.body.forEach(item => {
                if (
                  item.menuCode === '91541563' ||
                  item.pMenuCode === '91541563'
                ) {
                  loginRoleAdmiom = true;
                }
              });
              //管理员修改查看非管理员
              if (loginRoleAdmiom && !editRoleAdmin) {
                menuData = this.menuArry(arrList);
              }
              //管理员修改查看管理员
              if (loginRoleAdmiom && editRoleAdmin) {
                menuData = arrList;
              }

              this.$nextTick(() => {
                this.originData = [...menuData];
              });
            }
          });
          // this.$nextTick(() => {
          //   this.originData = [...resp.body];
          // });
        }
      });
    },

    //移除系统管理，不显示
    menuArry(menuArry) {
      let newMenuArray = [];
      menuArry.forEach(item => {
        if (item.menuCode !== '91541563') {
          if (item.pMenuCode !== '91541563') {
            newMenuArray.push(item);
          }
        }
      });
      return newMenuArray;
    },

    //处理角色信息
    handleRoleData() {
      let self = this;
      self.roleName = self.$route.query.roleName;
      self.roleCode = self.$route.query.roleCode;
      self.roleDescrible = self.$route.query.roleDescrible;
      let arr = self.$route.query.roleMenuList;
      self.roleMenuList = [];
      for (let i in arr) {
        self.roleMenuList.push(arr[i]);
      }
    },

    //取消
    cancel() {
      this.$router.push('/systemManagement/roleManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/roleManagement/ditail'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.g-business {
  padding: 32px 20px;
  min-height: 100%;
  box-sizing: border-box;
  background: #fff;
  min-width: 600px;
}
.g-role-title {
  padding-left: 40px;
   
  font-size: 16px;
  font-weight: 600;
  .g-role-title-symbol {
    color: red;
  }
}
.g-role-header {
  margin: 20px 80px;
  padding: 10px 0;
  border: 1px solid #696969;
  .g-role-header_span-oper {
    padding: 0 10%;
     
    font-size: 16px;
    font-weight: 600;
    @media screen and (max-width: 1919px) {
      padding-left: 9%;
    }
  }
  .g-role-header_span {
    padding: 0 10%;
     
    font-size: 16px;
    font-weight: 600;
    @media screen and (max-width: 1919px) {
      padding: 0 8%;
    }
  }
}
.g-bottom {
  display: flex;
  justify-content: center;
  align-content: center;
  // margin-top: 3.6%;
  padding-top: 10px;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    text-align: center;
    border-color: #f06b00;
  }
  .f-cancel {
    color: #f06b00;
  }
  .f-confirm {
    background: #f06b00;
    color: #ffffff;
  }
}
.g-project {
  margin-top: 40px;
}
.title {
  margin: 10px 0px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  div {
    width: 8px;
    height: 20px;
    background: #f06b00;
    margin-right: 8px;
  }
}
.g-w-340 {
  width: 340px;
}
</style>
