<!--
 * @Author: your name
 * @Date: 2021-10-26 10:50:54
 * @LastEditTime: 2022-05-17 17:00:10
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\system-manage\components\role\RoleManageEdit.vue
-->
<template>
  <div class="contain">
    <el-form :disabled="isSubmit" class="g-form" ref="formRef" label-width="calc(50% - 170px)">
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_CODE_SYMBOL')">
        <el-input v-model="roleCode" class="g-w-340" disabled />
      </el-form-item>
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_NAME_SYMBOL')" required>
        <el-input
          v-model="roleName"
          class="g-w-340"
          maxlength="50"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        ></el-input>
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
        @on-change="getChecked"
      ></tree-table>
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_DESCRIBLE_SYMBOL')" class="g-project">
        <el-input
          v-model="roleDescrible"
          type="textarea"
          maxlength="300"
          class="g-w-340"
          rows="5"
          resize="none"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="g-bottom" v-if="!isSubmit">
      <el-button class="f-cancel" @click="cancel">{{ $t('COMMON.CANCEL') }}</el-button>
      <el-button class="f-confirm" @click="submitForm()">{{ $t('COMMON.SUBMIT') }}</el-button>
    </div>

    <div class="g-bottom" v-if="isSubmit">
      <el-button class="f-cancel" @click="perviousStep">{{ $t('COMMON.PREVIOUS_STEP') }}</el-button>
      <el-button class="f-confirm" @click="confirm()">{{ $t('COMMON.CONFIRM') }}</el-button>
    </div>
  </div>
</template>

<script>
import { updateRuleInfo } from '@/api/role-management';
import { getMenuInfoList, getMenusByRole } from '@/api/menu-management';
import { formatTreeData } from '@/utils/tools.js';
import TreeTable from '@/components/tree-tables/index.vue';
import { getRoleDetail } from '@/utils/user';
export default {
  name: 'RoleManageEdit',
  props: {
    detailData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: { TreeTable },

  data() {
    const self = this;
    return {
      isSubmit: false,
      roleCode: '0000112212', //角色编号
      roleName: '', //角色名称
      roleDescrible: '角色描述', //角色描述
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
      roleMenuList: [], //角色拥有的菜单数组
      menuList: [], //保存初始的菜单数据
      menuData: {}, //选择的数据
      originData: [] //渲染的菜单数据
    };
  },

  created() {},

  mounted() {
    this.handleRoleData(); //处理角色信息
    this.search(); //查询所有菜单
  },

  methods: {
    //查询所有菜单并处理角色所拥有的菜单
    search() {
      getMenuInfoList().then(resp => {
        if (resp.body && resp.head) {
          resp.body.forEach(item => {
            item.disabled = false;
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
                menuData = this.menuArry(resp.body);
              }
              //管理员修改查看管理员
              if (loginRoleAdmiom && editRoleAdmin) {
                menuData = this.menuAdArry(resp.body);
              }

              this.$nextTick(() => {
                this.menuList = [...menuData];
                this.originData = [...menuData];
              });
            }
          });
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
      console.log('newMenuArray', newMenuArray);
      return newMenuArray;
    },

    //管理员修改管理员处理菜单
    menuAdArry(menuArry) {
      menuArry.forEach(item => {
        if (
          item.menuCode === '91541563' ||
          item.menuCode === '33039760' ||
          item.menuCode === '47407764' ||
          item.menuCode === '62458806' ||
          item.menuCode === '93235214'
        ) {
          item.disabled = true;
        }
      });
      return menuArry;
    },

    //处理角色信息
    handleRoleData() {
      this.roleName = this.detailData.roleName;
      this.roleCode = this.detailData.roleCode;
      this.roleDescrible = this.detailData.roleDescrible;
      let arr = this.detailData.roleMenuList;
      this.roleMenuList = [];
      for (let i in arr) {
        this.roleMenuList.push(arr[i]);
      }
    },

    //勾选的菜单
    getChecked(value) {
      // console.log('选择：', value);
      this.menuData = value;
    },
    //取消
    cancel() {
      this.$emit('backIndex');
    },

    //提交
    submitForm() {
      // console.log(
      //   'ddddd',
      //   getRoleDetail().roleName === this.roleName
      // );

      if (!this.roleName) {
        // return this.$showMsg.error('新增角色不能为空！');
        return this.$showMsg.error(
          this.$t('ROLE_MANAGEMENT.PLEASE_INPUT_ROLE_NAME')
        );
      }
      if (
        this.menuData.authPerm.length < 1 &&
        this.menuData.operPerm.length < 1 &&
        this.menuData.queryPerm.length < 1
      ) {
        // return this.$showMsg.error('新增菜单选择不能为空！');
        return this.$showMsg.error(
          this.$t('ROLE_MANAGEMENT.PLEASE_SELECT_MENU')
        );
      }
      // if (
      //   getRoleDetail().roleName === this.roleName &&
      //   this.roleName === '管理员'
      // ) {
      //   // return this.$showMsg.success('管理员无法添加管理员角色！');
      //   return this.$showMsg.error(
      //     this.$t('ROLE_MANAGEMENT.ADMIN_NO_ADD_ADMIN')
      //   );
      // }
      this.isSubmit = true;
      this.originData.forEach(item => {
        item.disabled = true;
      });
    },

    //上一步
    perviousStep() {
      this.isSubmit = false;
      this.originData.forEach(item => {
        item.disabled = false;
      });
    },

    //确定
    confirm() {
      let dataList = [];
      this.menuList.forEach(menuItem => {
        if (menuItem.authPerm || menuItem.operPerm || menuItem.queryPerm) {
          let obj = {
            menuCode: menuItem.menuCode,
            authPerm: menuItem.authPerm ? 'Y' : 'N',
            operPerm: menuItem.operPerm ? 'Y' : 'N',
            queryPerm: menuItem.queryPerm ? 'Y' : 'N'
          };
          dataList.push(obj);
        }
      });
      let params = {
        roleCode: this.roleCode,
        roleDescrible: this.roleDescrible,
        roleName: this.roleName,
        roleMenuRLATList: dataList
      };
      this.updateRequest(params);
    },

    //编辑角色
    updateRequest(params) {
      updateRuleInfo(params).then(resp => {
        if (resp.body) {
          this.$showMsg({
            type: 'success',
            message: this.$t('ROLE_MANAGEMENT.EDIT_ROLE_SUCCESS')
          });
          this.cancel();
          // }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// .contain {
//   padding: 32px 24px;
//   box-sizing: border-box;
//   min-width: 600px;
//   min-height: 100%;
//   background: #fff;
// }
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
.g-tree-table {
  margin: 0 80px;
  /deep/ .el-table .cell {
    margin-left: 36%;
    @media screen and (max-width: 1919px) {
      margin-left: 22%;
    }
  }
  /deep/ .el-checkbox__input {
    margin-left: 30px;
  }
  /deep/ .el-table thead {
    display: none;
  }
  /deep/ .el-table--fit {
    height: 480px;
    overflow-y: auto;
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
.g-w-340 {
  width: 340px;
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
</style>
