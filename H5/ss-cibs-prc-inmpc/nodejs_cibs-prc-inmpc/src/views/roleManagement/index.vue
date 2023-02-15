<template>
  <div class="contain">
    <el-form class="transverse-form" label-width="auto" ref="formRef">
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_CODE_SYMBOL')">
        <el-input v-model="roleCode" maxlength="11" :placeholder="$t('COMMON.PLEASE_INPUT')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_NAME_SYMBOL')">
        <el-input v-model="roleName" maxlength="50" :placeholder="$t('COMMON.PLEASE_INPUT')"></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <Form-Button style="float:right" @add="add" @submit="search" @handleReset="handleReset"></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column width="90" type="index" :label="$t('COMMON.SERIAL_NUMBER')"></el-table-column>
      <el-table-column min-width="180" prop="roleCode" :label="$t('ROLE_MANAGEMENT.ROLE_CODE')">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.roleCode }}</div>
        </template>
      </el-table-column>
      <el-table-column min-width="200" prop="roleName" :label="$t('ROLE_MANAGEMENT.ROLE_NAME')"></el-table-column>
      <el-table-column
        min-width="280"
        prop="roleDescrible"
        :label="$t('ROLE_MANAGEMENT.ROLE_DESCRIBLE')"
      ></el-table-column>

      <el-table-column :label="$t('COMMON.OPERATION')" min-width="120">
        <template slot-scope="scope">
          <div class="f-span-btns">
            <span @click="del(scope.row, scope.$index)">{{ $t('COMMON.DELETE') }}</span>
            <span @click="modify(scope.row, scope.$index)">{{ $t('COMMON.UPDATE') }}</span>
          </div>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="../../img/table-empty.png" alt />
        <span>{{ $t('ROLE_MANAGEMENT.DATANULL_ROLE') }}</span>
      </div>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      />
    </div>
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import TablePagination from '@/components/common/TablePagination.vue';
import { getRoleDetail } from '@/utils/user';
import {
  getFindRuleInfoPageList,
  findRuleInfoCode,
  removeRuleInfo
} from '@/api/role-management/index.js';
export default {
  components: {
    FormButton,
    TablePagination
  },

  data() {
    return {
      roleCode: '', //角色编号
      roleName: '', //角色名称
      tableData: [
        //保存列表数组
        // {
        //   roleCode: '00000001', //角色编号
        //   roleName: '系统管理员', //角色名称
        //   roleDescrible: '主要功能权限' //角色描述
        // }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      form: {
        payItemName: '6',
        channel: '2'
      },
      roleObject: {},
      visible: false
    };
  },

  created() {},

  mounted() {
    this.search();
  },

  methods: {
    //查询列表方法
    search() {
      let self = this;
      let params = {
        roleCode: self.roleCode,
        roleName: self.roleName,
        current: self.currentPage,
        size: self.pageSize
      };
      getFindRuleInfoPageList(params).then(resp => {
        console.log('resp', resp);
        self.total = resp.body.total;
        if (resp.body.records && resp.body.records.length > 0) {
          self.tableData = resp.body.records;
        } else {
          self.tableData = [];
        }
      });
    },

    //分页——切换每页显示条数
    handleSizeChange(val) {
      let self = this;
      self.pageSize = val;
      self.currentPage = 1;
      self.search();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      let self = this;
      self.currentPage = val;
      self.search();
    },

    //重置
    handleReset() {
      let self = this;
      self.roleCode = '';
      self.roleName = '';
      // self.currentPage = 1;
      // self.pageSize = 10;
      // self.search();
    },

    //详情
    handleCell(row) {
      findRuleInfoCode({ roleCode: row.roleCode }).then(resp => {
        if (resp.head) {
          row.roleMenuList = resp.body;
          this.$router.push({
            path: '/roleManagement/ditail',
            query: row
          });
        }
      });
    },

    //删除——弹框
    del(row, index) {
      if (getRoleDetail().roleName == row.roleName) {
        // return this.$showMsg.success('管理员无法删除管理员角色！');
        return this.$showMsg({
          type: 'success',
          message: this.$t('ROLE_MANAGEMENT.ADMIN_NO_DELETE_ADMIN')
        });
      }
      this.roleObject = row;
      this.$showBox({
        content: this.$t('ROLE_MANAGEMENT.DELETE_ROLE_TIPS'),
        confirm: () => {
          this.deleteRole();
        }
      });
      // this.$showBox({
      //   content: this.$t('CUSTOMER_MANAGEMENT.TEMPLATE_DELETE_CONFIRM'),
      //   confirm: async () => {
      //     const result = await removeRuleInfo({
      //       roleCode: row.roleCode
      //     });
      //     if (result.body) {
      //       return;
      //     }
      //     this.query();
      //   }
      // });
    },

    //删除——确认
    deleteRole() {
      let self = this;
      removeRuleInfo(self.roleObject).then(resp => {
        if (resp.body) {
          // self.$showMsg.success('删除成功！');
          // this.$showMsg.success(this.$t('ROLE_MANAGEMENT.DELETE_ROLE_SUCCESS'));
          self.$showMsg({
            type: 'success',
            message: self.$t('ROLE_MANAGEMENT.DELETE_ROLE_SUCCESS')
          });
          self.search();
        }
      });
    },

    //编辑
    modify(row, index) {
      findRuleInfoCode({ roleCode: row.roleCode }).then(resp => {
        if (resp.body) {
          row.roleMenuList = resp.body;
          this.$router.push({
            path: '/roleManagement/edit',
            query: row
          });
        }
      });
    },
    //新增
    add() {
      this.$router.push('/roleManagement/add');
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
}

.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: relative;
    left: -20%;
    // bottom: 15%;
    // left: 45%;
  }
}
.g-bolck {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  // margin-top: 32px;
  padding: 32px 20px 20px;
}
.el-button {
  border: 0;
  align-items: center;
}
.f-delete {
  color: #e34141;
  text-align: left;
}
.f-add {
  color: #f06b00;
  text-align: left;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
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
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(2) {
    margin-left: 10px;
    color: #f06b00;
  }
}
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
  .el-input {
    width: 270px;
  }
}
// /deep/ .el-table__body-wrapper {
//   height: 600px;
//   overflow-y: auto;
// }
</style>
