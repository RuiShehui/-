<template>
  <div class="g-business">
    <el-form class="g-form" ref="formRef">
      <el-form-item :label="$t(`MENU_MANAGEMENT.MENU_CODE_SYMBOL`)">
        <el-input v-model="menuCode" maxlength="8" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
      </el-form-item>
      <el-form-item :label="$t(`MENU_MANAGEMENT.MENU_NAME_SYMBOL`)" class="g-project">
        <el-input v-model="menuName" maxlength="50" :placeholder="$t(`COMMON.PLEASE_INPUT`)"></el-input>
      </el-form-item>
      <Form-Button class="g-btn" @submit="search" @add="add" @handleReset="handleReset"></Form-Button>
    </el-form>
    <el-table
      class="g-table"
      :data="tableData"
      row-key="menuCode"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="menuName" :label="$t(`MENU_MANAGEMENT.MENU_NAME`)" align="center"></el-table-column>
      <el-table-column prop="menuCode" :label="$t(`MENU_MANAGEMENT.MENU_CODE`)" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="u-btnColor"
            @click="handleCell(scope.row)"
          >{{ scope.row.menuCode }}</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="url" :label="$t(`MENU_MANAGEMENT.URL`)" align="center"></el-table-column>
      <el-table-column :label="$t(`MENU_MANAGEMENT.MENU_STATUS`)" align="center">
        <template slot-scope="scope">
          {{
          scope.row.status == 1 ? '启用' : '停用'
          }}
        </template>
      </el-table-column>

      <el-table-column :label="$t(`COMMON.OPERATION`)" align="center">
        <template slot-scope="scope">
          <el-button
            @click="del(scope.row, scope.$index)"
            type="text"
            class="f-delete"
          >{{ $t(`COMMON.DELETE`) }}</el-button>
          <el-button
            @click="modify(scope.row, scope.$index)"
            type="text"
            class="f-add"
          >{{ $t(`COMMON.UPDATE`) }}</el-button>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="../../img/table-empty.png" alt />
        <span>{{ $t(`MENU_MANAGEMENT.DATA_NULL_MENU`) }}</span>
      </div>
    </el-table>

    <!-- 删除dialog -->
    <Pop-Up ref="delete" class="m-popUp" width="513px" @confirm="deleteMenu">
      <img src="@/img/logOut.png" alt />
      <p>{{ tishi }}</p>
    </Pop-Up>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import PopUp from '@/components/common/dialog/PopUp.vue';
import TablePagination from '@/components/common/TablePagination.vue';
import { getMenuList, menudelete } from '@/api/menu-management/index.js';
import CONSTANTS from '@/utils/constant.js';
export default {
  components: {
    FormButton,
    PopUp,
    TablePagination,
    CONSTANTS
  },

  data() {
    return {
      menuCode: '', //菜单编号
      menuName: '', //菜单名称
      tishi: '',
      tableData: [
        //保存列表数组
      ],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      form: {
        payItemName: '6',
        channel: '2'
      },
      menuObject: {},
      visible: false
    };
  },

  created() {},

  mounted() {
    this.search();
  },

  methods: {
    //查询
    search() {
      let self = this;
      self.tableData = [];
      let params = {
        menuCode: self.menuCode,
        menuName: self.menuName
      };
      getMenuList(params).then(resp => {
        if (resp.head) {
          self.tableData = resp.body;
        } else {
          self.tableData = [];
        }
      });
    },

    //重置
    handleReset() {
      let self = this;
      self.menuCode = '';
      self.menuName = '';
      // self.search();
    },

    //详情
    handleCell(row) {
      this.$router.push({
        path: '/menuManagement/ditail',
        query: row
      });
    },
    //删除-打开抽屉弹框
    del(row, index) {
      let self = this;
      console.log('打印row：', row);
      if (row.children.length > 0) {
        self.tishi = self.$t('MENU_MANAGEMENT.MENU_CANNOT_DETLETE');
      } else {
        self.tishi =
          self.$t('MENU_MANAGEMENT.CONFIRM_DETLETE') +
          row.menuName +
          self.$t('MENU_MANAGEMENT.MENU_QUES_MARK');
      }
      self.menuObject = row;
      self.$refs.delete.showDialog();
    },
    //确定删除
    deleteMenu() {
      let self = this;
      if (self.menuObject.children.length > 0) {
        return;
      }
      menudelete({
        menuCode: self.menuObject.menuCode,
        menuLevel: self.menuObject.menuLevel
      }).then(resp => {
        if (resp.body) {
          // this.$showMsg.success('删除成功！');
          this.$showMsg({
            type: 'success',
            message: this.$t('MENU_MANAGEMENT.DELETE_MENU_SUCCESS')
          });
          self.search();
        } else {
          // this.$showMsg.error('删除失败！');
        }
      });
    },

    //编辑
    modify(row, index) {
      console.log('打印row：', row);
      if (row.children.length > 0) {
        this.tishi = this.$t('MENU_MANAGEMENT.MENU_CANNOT_EDIT');
        this.menuObject = row;
        this.$refs.delete.showDialog();
        return;
      }

      this.$router.push({
        path: '/menuManagement/edit',
        query: row
      });
    },

    //新增
    add() {
      this.$router.push('/menuManagement/add');
    }
  }
};
</script>

<style lang="scss" scoped>
.g-business {
  min-height: 100%;
  background: #fff;
}
.g-form {
  padding: 20px;
  display: inline-flex;
  justify-content: space-between;
  .g-project {
    margin-left: 40px;
  }
  .el-form-item {
    display: inline-flex;
    justify-content: space-between;
  }
  .el-input {
    width: 270px;
  }
  .g-btn {
    margin-left: 40px;
  }
}
/deep/ .el-table {
  width: auto;
}
.g-table {
  margin: 0 20px;
  border-bottom: none;
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: relative;
    left: -20%;
  }
}

.el-button {
  border: 0;
  align-items: center;
}
.f-delete {
  color: #e34141;
}
.f-add {
  color: #f06b00;
}
.u-btnColor {
  color: #606266;
  text-decoration: underline;
}

.m-popUp {
  p {
     
    font-size: 18px;
    color: #323c41;
    letter-spacing: 0;
    text-align: center;
    line-height: 26px;
    font-weight: 500;
  }
}
/deep/ .el-table__body-wrapper {
  height: 650px;
  overflow-y: auto;
}
.el-table::before {
  height: 0;
}
</style>
