<template>
  <div class="service">
    <div class="tableClass">
      <el-table
        :data="
          tableData
        "
        ref="tableData"
        row-key="menuCode"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
       
        stripe
      >
        <el-table-column prop="menuName" label="菜单名稱" label-class-name="labelClass">
          <template slot-scope="scope">
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="全選" prop="entryPermission" label-class-name="labelClass">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              :checked="queryAll"
              :indeterminate="isIndeterminate1"
              v-model="queryAll"
              @change="querySelectAll"
            >全選</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-show="scope.row.queryShowFlag"
              v-model="scope.row.queryFlag"
              @change="querySelect($event,scope.$index, scope.row)"
            >授權查詢</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="entryPermission" label="全選" label-class-name="labelClass">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              :checked="entryAll"
              :indeterminate="isIndeterminate2"
              v-model="entryAll"
              @change="entrySelectAll"
            >全選</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.createFlag"
              @change="entrySelect($event, scope.$index, scope.row)"
              :disabled="scope.row.createDisabledFlag"
            >錄入全選</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="authAll" label-class-name="labelClass">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              :checked="authAll"
              :indeterminate="isIndeterminate3"
              v-model="authAll"
              @change="authSelectAll"
              :disabled="grantGroupDisabledFlag"
            >全選</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.grantFlag"
              @change="authSelect($event, scope.$index, scope.row)"
              :disabled="scope.row.grantDisabledFlag"
            >授權級別</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  formatTreeData,
  deepClone,
  treeToArray
} from '@/utils/tree-table.js';
import {
  queryCBMenu
} from '@/api/customer-management/customer';
export default {
  props: {
   showLoginName: {
      type: Boolean,
      default: false
    }, // 是否修改
    userCode: {
      type: String,
      default: ''
    }, // 查询条件

    //客户号
    ebankCstmNo: {
      type: String,
      default: ''
    },
    //判断客户号类型——sa/mam
    entType: {
      type: String,
      default: ''
    },
    detailData: {
      type: Object,
      default() {
        return {};
      }
    } //传入数据
  },
  data() {
    return {
      grantGroupDisabledFlag: false, //授权禁用——级别为无或为录入员时
      tableData: [],
      originData: [],
      queryAll: false, // 控制查询的全部标识
      authAll: false, // 控制授权的全部标识
      entryAll: false, // 控制录入的全部标识
      isIndeterminate1: false,
      isIndeterminate2: false,
      isIndeterminate3: false,

      queryData: [], // 用于存储【查询权限】
      authData: [], // 用于存储【授权权限】
      entryData: [] // 用于存储【录入权限】
    };
  },
  computed: {
    newTableData() {
      return this.tableData;
    }
  },
  mounted() {
    console.log(this.showLoginName,'showLoginName')
   if(this.detailData.serveSettingList){
      this.tableData = this.detailData.serveSettingList
    }else{
       this.queryAllMenu();
    }
  //  this.queryAllMenu();
  },
  methods: {
    //查询菜单
    queryAllMenu() {
      let self = this;
      queryCBMenu().then(resp => {
        console.log('查询', resp.body.menuList);
        this.originData = resp.body.menuList;
         resp.body.menuList.forEach(item => {
          item.queryFlag = false;
          item.grantFlag = false;
          item.createFlag = false;
          if (item.transType == '1') {
            item.createDisabledFlag = true; //录入禁用
            item.grantDisabledFlag = true; //授权禁用
          } else {
            item.createDisabledFlag = false; //录入禁用
            if (this.detailData.userType == '3') {
              item.grantDisabledFlag = true; //授权禁用
            } else {
              item.grantDisabledFlag = false; //授权禁用
            }
          }

          if (
            item.transType == '2' ||
            item.transType == '3' ||
            item.transType == 'P'
          ) {
            item.queryShowFlag = false;
          } else {
            item.queryShowFlag = true;
          }
        });
        if (this.detailData.empowerGroup === '0') {
          resp.body.menuList.forEach(item => {
            item.grantDisabledFlag = true; //授权禁用
          });
          this.grantGroupDisabledFlag = true;
        }
        this.tableData = formatTreeData(
          deepClone(resp.body.menuList),
          'menuCode',
          'pmenuCode'
        );
        console.log('tableData:', this.tableData);
      });
    },

    // 查询权限的全部change事件
    querySelectAll(val) {
      console.log('打印val', this.tableData, val);
      this.queryAll = val;
      this.isIndeterminate1 = false;
      this.tableData.map(el => {
        el.queryFlag = val;
        if (el.children) {
          this.changeQuery(el.children, val);
        }
      });
      if (this.queryAll) {
        this.tableData.map(item => {
          this.queryData.push(item);
        });
      } else {
        this.queryData = [];
      }
      this.render();
    },

    //查询——全部全选
    changeQuery(tabData, val) {
      tabData.map(item => {
        item.queryFlag = val;
        if (item.children) {
          this.changeQuery(item.children, val);
        }
      });
    },

    // 录入权限的全部change事件
    entrySelectAll(val) {
      this.entryAll = val;
      this.isIndeterminate2 = false;
      this.tableData.map(el => {
        console.log('el', el);
        if (!el.createDisabledFlag) {
          el.createFlag = val;
        }

        if (el.children) {
          this.changeEntry(el.children, val);
        }
      });
      if (this.entryAll) {
        this.tableData.map(item => {
          this.entryData.push(item);
        });
      } else {
        this.entryData = [];
      }
      this.render();
    },
    //录入权限——全选
    changeEntry(tabData, val) {
      tabData.map(item => {
        console.log('item', item);
        if (!item.createDisabledFlag) {
          item.createFlag = val;
        }
        if (item.children) {
          this.changeEntry(item.children, val);
        }
      });
    },

    // 授权权限的全部change事件
    authSelectAll(val) {
      console.log('val', val);
      this.authAll = val;
      this.isIndeterminate3 = false;
      this.tableData.map(el => {
        if (!el.grantDisabledFlag) {
          el.grantFlag = val;
        }
        if (el.children) {
          this.changeAuth(el.children, val);
        }
      });
      if (this.authAll) {
        this.tableData.map(item => {
          this.authData.push(item);
        });
      } else {
        this.authData = [];
      }
      this.render();
    },

    //录入权限——全选
    changeAuth(tabData, val) {
      tabData.map(item => {
        if (!item.grantDisabledFlag) {
          item.grantFlag = val;
        }
        if (item.children) {
          this.changeAuth(item.children, val);
        }
      });
    },

    //重新渲染列列表
    render() {
      this.tableData = treeToArray(this.tableData);
      this.tableData = formatTreeData(
        deepClone(this.tableData),
        'menuCode',
        'pmenuCode'
      );
    },

    //查询选择
    querySelect(e, index, row) {
      console.log('index', index, row, e, this.tableData);
      if (e) {
        this.checkQuery(this.tableData);
      } else {
        this.checkoutQuery(this.tableData);
      }
      if (row.children) {
        this.parentQuery(row.children, e);
      }
      if (row.pmenuCode) {
        this.parentQueryChange(row);
      }
      if (row.queryFlag) {
        this.queryData.push(row);
      }
      this.render();
    },

    //勾选子菜单，判断总菜单——查询
    checkQuery(tableData) {
      this.isIndeterminate1 = true;
      let flag = true;
      treeToArray(tableData).forEach(item => {
        if (!item.queryFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.queryAll = true;
      } else {
        this.queryAll = false;
      }
    },

    //取消选择的子菜单，判断总菜单是否勾选——查询
    checkoutQuery(tableData) {
      let flag = true;
      console.log('treeToArray(tableData)', treeToArray(tableData));
      treeToArray(tableData).forEach(item => {
        if (item.queryFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.isIndeterminate1 = false;
      } else {
        this.isIndeterminate1 = true;
      }
    },

    //查询权限-有子菜单
    parentQuery(tabData, e) {
      tabData.map(item => {
        item.queryFlag = e;
        if (item.children) {
          this.parentQuery(item.children, e);
        }
      });
      if (e) {
        // this.isIndeterminate1 = true;
        this.checkQuery(this.tableData);
      } else {
        this.checkoutQuery(this.tableData);
      }
    },
    //查询权限-父级菜单
    parentQueryChange(crtItem) {
      console.log('this.tableData', this.tableData);
      this.tableData = treeToArray(this.tableData);
      const pItem = this.tableData.find(
        item => item.menuCode === crtItem.pmenuCode
      );

      if (pItem) {
        const children = this.tableData.filter(
          item => item.pmenuCode === pItem.menuCode
        );
        const checkedSome = children.some(item => item.queryFlag);
        if (checkedSome) {
          pItem.queryFlag = true;
        } else {
          pItem.queryFlag = false;
        }
        if (this.tableData.some(item => item.menuCode === pItem.pmenuCode)) {
          this.parentQueryChange(pItem);
        }
      }
      this.tableData = formatTreeData(
        deepClone(this.tableData),
        'menuCode',
        'pmenuCode'
      );
      if (crtItem.queryFlag) {
        // this.isIndeterminate1 = true;
        this.checkQuery(this.tableData);
      } else {
        this.checkoutQuery(this.tableData);
      }
      console.log('打印crtItem', pItem);
    },

    //录入选择
    entrySelect(e, index, row) {
      if (e) {
        this.checkEntry(this.tableData);
      } else {
        this.checkoutEntry(this.tableData);
      }
      if (row.children) {
        this.parentEntry(row.children, e);
      }
      if (row.pmenuCode) {
        this.parentEntryChange(row);
      }
      if (row.createFlag) {
        this.entryData.push(row);
      }
      this.render();
    },

    //勾选子菜单，判断总菜单——录入
    checkEntry(tableData) {
      this.isIndeterminate2 = true;
      let flag = true;
      treeToArray(tableData).forEach(item => {
        if (!item.createFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.entryAll = true;
      } else {
        this.entryAll = false;
      }
    },
    //取消选择的子菜单，判断总菜单是否勾选——录入
    checkoutEntry(tableData) {
      let flag = true;
      console.log('treeToArray(tableData)', treeToArray(tableData));
      treeToArray(tableData).forEach(item => {
        if (item.createFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.isIndeterminate2 = false;
      } else {
        this.isIndeterminate2 = true;
      }
    },
    //录入权限-有子菜单
    parentEntry(tabData, e) {
      tabData.map(item => {
        if (!item.createDisabledFlag) {
          item.createFlag = e;
        }
        if (item.children) {
          this.parentEntry(item.children, e);
        }
      });
      if (e) {
        this.checkEntry(this.tableData);
      } else {
        this.checkoutEntry(this.tableData);
      }
    },
    //录入权限-父级菜单
    parentEntryChange(crtItem) {
      console.log('this.tableData', this.tableData);
      this.tableData = treeToArray(this.tableData);
      const pItem = this.tableData.find(
        item => item.menuCode === crtItem.pmenuCode
      );

      if (pItem) {
        const children = this.tableData.filter(
          item => item.pmenuCode === pItem.menuCode
        );
        if (!pItem.createDisabledFlag) {
          const checkedSome = children.some(item => item.createFlag);
          if (checkedSome) {
            pItem.createFlag = true;
          } else {
            pItem.createFlag = false;
          }
        }

        if (this.tableData.some(item => item.menuCode === pItem.pmenuCode)) {
          this.parentEntryChange(pItem);
        }
      }
      this.tableData = formatTreeData(
        deepClone(this.tableData),
        'menuCode',
        'pmenuCode'
      );
      if (crtItem.createFlag) {
        this.checkEntry(this.tableData);
      } else {
        this.checkoutEntry(this.tableData);
      }
      console.log('打印crtItem', pItem);
    },

    //授权选择
    authSelect(e, index, row) {
      // this.isIndeterminate3 = true;
      if (e) {
        this.checkAuth(this.tableData);
      } else {
        this.checkoutAuth(this.tableData);
      }
      if (row.children) {
        this.parentAuth(row.children, e);
      }
      if (row.pmenuCode) {
        this.parentAuthChange(row);
      }
      if (row.grantFlag) {
        this.authData.push(row);
      }
      this.render();
    },

    //勾选子菜单，判断总菜单——授权
    checkAuth(tableData) {
      this.isIndeterminate3 = true;
      let flag = true;
      treeToArray(tableData).forEach(item => {
        if (!item.grantFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.entryAll = true;
      } else {
        this.entryAll = false;
      }
    },
    //取消选择的子菜单，判断总菜单是否勾选——授权
    checkoutAuth(tableData) {
      let flag = true;
      treeToArray(tableData).forEach(item => {
        if (item.grantFlag) {
          flag = false;
        }
      });
      if (flag) {
        this.isIndeterminate3 = false;
      } else {
        this.isIndeterminate3 = true;
      }
    },
    //授权权限-有子菜单
    parentAuth(tabData, e) {
      tabData.map(item => {
        if (!item.grantDisabledFlag) {
          item.grantFlag = e;
        }
        if (item.children) {
          this.parentAuth(item.children, e);
        }
      });
      if (e) {
        this.checkAuth(this.tableData);
      } else {
        this.checkoutAuth(this.tableData);
      }
    },
    //授权权限-父级菜单
    parentAuthChange(crtItem) {
      console.log('this.tableData', this.tableData);
      this.tableData = treeToArray(this.tableData);
      const pItem = this.tableData.find(
        item => item.menuCode === crtItem.pmenuCode
      );

      if (pItem) {
        const children = this.tableData.filter(
          item => item.pmenuCode === pItem.menuCode
        );
        if (!pItem.grantDisabledFlag) {
          const checkedSome = children.some(item => item.grantFlag);
          if (checkedSome) {
            pItem.grantFlag = true;
          } else {
            pItem.grantFlag = false;
          }
        }

        if (this.tableData.some(item => item.menuCode === pItem.pmenuCode)) {
          this.parentAuthChange(pItem);
        }
      }
      this.tableData = formatTreeData(
        deepClone(this.tableData),
        'menuCode',
        'pmenuCode'
      );
      if (crtItem.grantFlag) {
        this.checkAuth(this.tableData);
      } else {
        this.checkoutAuth(this.tableData);
      }
      console.log('打印crtItem', pItem);
    },
    //提交的时候 对数据进行处理，查询的权限，已录入为准，需要排除掉查询隐藏的，以及录入禁止录入的  8 14 进行处理
    submitDataFun(tabData) {
      // queryShowFlag 查询权限是否展示 false不展示
      // queryFlag   查询权限
      // createDisabledFlag 录入权限是否可录入  false展示
      // createFlag 录入权限  
      // children 菜單集合
      tabData.map(item => {
        if (!item.queryShowFlag && !item.createDisabledFlag && item.createFlag) {
          item.queryFlag = true;
        }
        if (!item.queryShowFlag && !item.createDisabledFlag && !item.createFlag) {
          item.queryFlag = false;
        }
        if (item.children) {
          this.submitDataFun(item.children);
        }
      });
    },
    submit() {
      this.submitDataFun(this.tableData)
      console.log('this.serverSettingObj', this.serverSettingObj);
      let menuPermission = [];
      let inputMenuPermission = []; //录入权限数组
      let grantList = []; //授权数组
      treeToArray(this.tableData).forEach(item => {
        if (item.grantFlag || item.createFlag || item.queryFlag) {
          menuPermission.push(item);
        }
        if (item.createFlag) {
          inputMenuPermission.push(item);
        }
        if (item.grantFlag) {
          grantList.push(item);
        }
      });
      console.log('打印数组，，，，', menuPermission);
      if (this.detailData.userType === '2') {
        if (grantList.length < 1) {
          return this.$message({
            type: 'fail',
            message: '當前為授權員，授權權限菜單不能為空',
            delay: 3000
          });
        }
      }
      if (this.detailData.userType === '3') {
        if (inputMenuPermission.length < 1) {
          return this.$message({
            type: 'fail',
            message: '當前為錄入員，錄入權限菜單不能為空',
            delay: 3000
          });
        }
      }
      if (menuPermission.length < 1) {
        return this.$message({
          type: 'fail',
          message: '權限菜單不能為空',
          delay: 3000
        });
      }
      console.log(menuPermission,'menuPermission')
      console.log(this.tableData,'menuPermission')
      let obj = {
        menuPermission: menuPermission,
        operator: this.detailData,
        serveSettingList: this.tableData
      };
      
      this.$emit('handleShowDetail', obj);
    },
    back() {
      this.$emit('backIndex', this.detailData);
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    // changeCellStyle(row, rowIndex) {
    //   if (row.columnIndex == 0) {
    //     console.log('打印nnnn');
    //     return 'background: red';
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
.tableClass {
  padding-top: 24px;
}
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
/deep/ .el-form {
  .el-select > .el-input {
    width: 320px !important;
  }
}
/deep/ .el-table td,
.el-table th.is-leaf {
  padding: 6px 0 !important;
}
/deep/ .el-checkbox {
  padding: 0;
}
/deep/ .el-table .el-table__cell {
  padding: 6px 0 !important;
  height: 46px;
  line-height: 32px;
}
/deep/ .el-checkbox__label {
  color: #696969 !important;
}

.el-table /deep/.el-table__header /deep/.el-table__cell /deep/.cell,
.el-table .el-table__body /deep/.el-table__cell /deep/.cell {
  margin-left: 18px;
}
.el-table tr {
  background-color: #ffffff;
}
/deep/ .el-table td.el-table__cell div {
  margin-left: 14px;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
  .f-reset {
    color: rgba(0, 0, 0, 0.45);
    border-color: rgba(0, 0, 0, 0.45);
  }
}
</style>
