<template>
  <div class="contain">
    <RoleManageAdd v-if="showAddFlag" @backIndex="backIndex" />
    <RoleManageEdit v-if="showEditFlag" :detailData="detailData" @backIndex="backIndex" />
    <RoleManageDetail v-if="showDetailFlag" :detailData="detailData" @backIndex="backIndex" />
    <div v-if="showIndexFlag">
      <el-form class="transverse-form" label-width="auto" ref="searchForm" :model="searchForm">
        <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_CODE_SYMBOL')" prop="roleCode">
          <el-input
            v-model="searchForm.roleCode"
            maxlength="11"
            :placeholder="$t('COMMON.PLEASE_INPUT')"
          />
        </el-form-item>
        <el-form-item :label="$t('ROLE_MANAGEMENT.ROLE_NAME_SYMBOL')" prop="roleName">
          <el-input
            v-model="searchForm.roleName"
            maxlength="50"
            :placeholder="$t('COMMON.PLEASE_INPUT')"
          />
        </el-form-item>
        <el-form-item label=" ">
          <div style="width:270px;">
            <Form-Button style="float:right" @add="add" @submit="search" @handleReset="handleReset"></Form-Button>
          </div>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        class="g-table"
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
  </div>
</template>

<script>
import FormButton from '@/components/common/FormButton.vue';
import RoleManageAdd from './components/role/RoleManageAdd';
import RoleManageEdit from './components/role/RoleManageEdit';
import RoleManageDetail from './components/role/RoleManageDetail';
import _ from 'lodash';
import { getRoleDetail } from '@/utils/user';
import {
  getFindRuleInfoPageList,
  findRuleInfoCode,
  removeRuleInfo
} from '@/api/role-management/index.js';
export default {
  name: 'roleManage',
  components: {
    FormButton,
    RoleManageAdd,
    RoleManageEdit,
    RoleManageDetail
  },

  data() {
    return {
      searchForm: {
        roleCode: '', //角色编号
        roleName: '' //角色名称
      },
      tableData: [],
      showAddFlag: false,
      showEditFlag: false,
      showDetailFlag: false,
      showIndexFlag: true,
      detailData: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      roleObject: {},
      visible: false
    };
  },

  created() {},

  mounted() {
    this.search();
  },

  methods: {
    backIndex() {
      this.showAddFlag = false;
      this.showEditFlag = false;
      this.showDetailFlag = false;
      this.showIndexFlag = true;
    },
    //查询列表方法
    search() {
      let params = {
        ...this.searchForm,
        current: this.currentPage,
        size: this.pageSize
      };
      getFindRuleInfoPageList(params).then(resp => {
        this.total = resp.body.total;
        if (resp.body.records && resp.body.records.length > 0) {
          this.tableData = resp.body.records;
        } else {
          this.tableData = [];
        }
      });
    },

    //分页——切换每页显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.search();
    },
    //分页——切换当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    },

    //重置
    handleReset() {
      this.$refs['searchForm'].resetFields();
      // this.currentPage = 1;
      // this.pageSize = 10;
      // this.search();
    },

    //详情
    handleCell(row) {
      findRuleInfoCode({ roleCode: row.roleCode }).then(resp => {
        if (resp.head) {
          row.roleMenuList = resp.body;
          this.detailData = _.cloneDeep(row);
          this.showDetailFlag = true;
          this.showIndexFlag = false;
          console.log(this.detailData, 'this.detailData');
          // this.$router.push({
          //   path: '/roleManagement/ditail',
          //   query: row
          // });
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
      removeRuleInfo(this.roleObject).then(resp => {
        if (resp.body) {
          // this.$showMsg.success('删除成功！');
          // this.$showMsg.success(this.$t('ROLE_MANAGEMENT.DELETE_ROLE_SUCCESS'));
          this.$showMsg({
            type: 'success',
            message: this.$t('ROLE_MANAGEMENT.DELETE_ROLE_SUCCESS')
          });
          this.search();
        }
      });
    },

    //编辑
    modify(row, index) {
      findRuleInfoCode({ roleCode: row.roleCode }).then(resp => {
        if (resp.body) {
          row.roleMenuList = resp.body;
          this.showEditFlag = true;
          this.showIndexFlag = false;
          this.detailData = _.cloneDeep(row);
          // this.$router.push({
          //   path: '/roleManagement/edit',
          //   query: row
          // });
        }
      });
    },
    //新增
    add() {
      this.showAddFlag = true;
      this.showIndexFlag = false;
      // this.$router.push('/roleManagement/add');
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
.g-table {
  margin-top: 20px;
}
// /deep/ .el-table__body-wrapper {
//   height: 600px;
//   overflow-y: auto;
// }
</style>
