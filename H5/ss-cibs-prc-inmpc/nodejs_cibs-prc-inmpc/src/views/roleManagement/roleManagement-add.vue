<!--
 * @Author: your name
 * @Date: 2021-10-26 10:50:54
 * @LastEditTime: 2022-01-12 10:57:57
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\roleManagement\roleManagement-add.vue
-->
<template>
  <div class="g-business">
    <el-form :disabled="isSubmit" class="g-form" ref="formRef" label-width="calc(50% - 170px)">
      <!-- <el-form-item label="角色编号：">
        <span>{{ roleCode }}</span>
      </el-form-item>-->
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_NAME_SYMBOL')" required>
        <el-input
          v-model="roleName"
          maxlength="50"
          class="g-w-340"
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
      <!-- <div class="g-role-title">
      <span class="g-role-title-symbol">*</span>
      <span>{{ $t('ROLE_MANAGEMENT.ASSIGN_ROLE_PERMISSIONS') }}</span>
    </div>
    <tree-table
      :origin="originData"
      id="menuCode"
      pid="pMenuCode"
      :columns="columns"
      :tree-props="['operPerm', 'authPerm', 'queryPerm']"
      @on-change="getChecked"
      ></tree-table>-->
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_DESCRIBLE_SYMBOL')" class="g-project">
        <el-input
          v-model="roleDescrible"
          class="g-w-340"
          type="textarea"
          rows="5"
          resize="none"
          maxlength="300"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="g-bottom" v-if="!isSubmit">
      <el-button class="f-cancel" @click="cancel">
        {{
        $t('COMMON.CANCEL')
        }}
      </el-button>
      <el-button class="f-confirm" @click="submitForm()">
        {{
        $t('COMMON.SUBMIT')
        }}
      </el-button>
    </div>
    <div class="g-bottom" v-if="isSubmit">
      <el-button class="f-cancel" @click="perviousStep">
        {{
        $t(`COMMON.PREVIOUS_STEP`)
        }}
      </el-button>
      <el-button class="f-confirm" @click="confirm()">
        {{
        $t(`COMMON.CONFIRM`)
        }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { roleAdd } from '../../api/role-management';
import { getMenuInfoList } from '@/api/menu-management';
import { formatTreeData } from '@/utils/tools.js';
import TreeTable from '@/components/tree-tables/index.vue';
import { getRoleDetail } from '@/utils/user';
import { parse } from 'querystring';
export default {
  components: { roleAdd, TreeTable },

  data() {
    const self = this;
    return {
      isSubmit: false,
      roleCode: '0000112212', //角色编号
      roleName: '', //角色名称
      roleDescrible: '', //角色描述
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
      menuList: [], //保存初始的菜单数据
      menuData: {}, //选择的数据
      originData: []
    };
  },

  created() {
    this.search();
  },

  mounted() {
    // this.search();
    // let list = [
    //   { id: 1, pid: '' },
    //   { id: 11, pid: '1' },
    //   { id: 12, pid: '1' },
    //   { id: 111, pid: '11' },
    //   { id: 2, pid: '' },
    //   { id: 21, pid: '2' },
    //   { id: 22, pid: '2' }
    // ];
    // let map = {};
    // let node;
    // let tree = [];
    // let i;
    // tree = formatTreeData(list, 'id', 'pid');
    // // console.log('打印处理树状数组tree', tree);
    // var queen = [];
    // var out = [];
    // queen = queen.concat(tree);
    // while (queen.length) {
    //   var first = queen.shift();
    //   if (first.children) {
    //     queen = queen.concat(first.children);
    //     delete first['children'];
    //   }
    //   out.push(first);
    // }
  },

  methods: {
    //查询所有菜单并处理成树状渲染
    search() {
      getMenuInfoList().then(resp => {
        if (resp.body && resp.head) {
          resp.body.forEach(item => {
            item.disabled = false;
            item.authPerm = false;
            item.operPerm = false;
            item.queryPerm = false;
          });
          if (getRoleDetail().roleName == '系统管理员') {
            let menuData = this.menuArry(resp.body);
            this.$nextTick(() => {
              this.menuList = [...menuData];
              this.originData = [...menuData];
              console.log('originData', this.originData);
            });
          } else {
            this.$nextTick(() => {
              this.menuList = [...resp.body];
              this.originData = [...resp.body];
            });
          }
        }
      });
    },

    //系统管理员新增角色——移除系统管理，不显示
    menuArry(menuArry) {
      let newMenuArray = [];
      menuArry.forEach(item => {
        if (item.menuCode !== '91541563') {
          newMenuArray.push(item);
        }
        // if (
        // item.menuCode !== '91541563' ||
        // item.menuCode !== '33039760' ||
        // item.menuCode !== '47407764' ||
        // item.menuCode !== '62458806' ||
        // item.menuCode !== '93235214'
        // ) {
        // return newMenuArray.push(item);
        // }
      });

      return newMenuArray;
    },

    getChecked(value) {
      // console.log('选择：', value);
      this.menuData = value;
    },

    //取消
    cancel() {
      this.$router.push('/systemManagement/roleManagement');
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/roleManagement/add'
      );
    },

    //提交
    submitForm() {
      let self = this;
      if (!self.roleName) {
        // return self.$showMsg.error('请输入角色名称');
        return this.$showMsg({
          message: this.$t('ROLE_MANAGEMENT.PLEASE_INPUT_ROLE_NAME'),
          type: 'error'
        });
      }
      if (
        self.menuData.authPerm.length < 1 &&
        self.menuData.operPerm.length < 1 &&
        self.menuData.queryPerm.length < 1
      ) {
        // return self.$showMsg.error('请至少选择一个角色权限');
        return this.$showMsg({
          message: this.$t('ROLE_MANAGEMENT.PLEASE_SELECT_MENU'),
          type: 'error'
        });
      }

      if ((getRoleDetail().roleName == self.roleName)) {
        // return this.$showMsg.success('管理员无法添加管理员角色！');
        return this.$showMsg({
          message: this.$t('ROLE_MANAGEMENT.ADMIN_NO_ADD_ADMIN'),
          type: 'error'
        });
      }

      self.isSubmit = true;
      self.originData.forEach(item => {
        item.disabled = true;
      });
    },

    //上一步
    perviousStep() {
      let self = this;
      self.isSubmit = false;
      this.originData.forEach(item => {
        item.disabled = false;
      });
    },

    //确定
    confirm() {
      let self = this;
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
        roleDescrible: self.roleDescrible,
        roleName: self.roleName,
        roleMenuRLATList: dataList
      };
      // console.log('打印。。。。', params);
      self.addRequest(params);
    },

    //发送新增请求
    addRequest(params) {
      let self = this;
      roleAdd(params).then(resp => {
        console.log('新增角色：', resp);
        if (resp.body) {
          // self.$showMsg.success('操作成功！');
          // self.$showMsg.success(self.$t('ROLE_MANAGEMENT.ADD_ROLE_SUCCESS'));
          self.$showMsg({
            type: 'success',
            message: self.$t('ROLE_MANAGEMENT.ADD_ROLE_SUCCESS')
          });
          self.cancel();
        } else {
          // self.$showMsg.error('操作失败！');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-business {
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
  min-width: 600px;
}
.g-role-title {
  margin-top: 12px;
  font-size: 14px;
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
  padding: 10px 0 20px;
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
