<!-- 欢迎信封打印 -->
<template>
  <div class="g-quota">
    <div class="contain">
      <!-- 查询 -->
      <el-form class="transverse-form" label-width="auto">
        <!-- 客户编号 -->
        <el-form-item label="用戶號：">
          <el-input class="g-w-270" v-model="number" :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <div style="width:270px;">
            <div style="float:right">
              <el-button class="query" type="primary" @click="search">{{ '查詢'}}</el-button>
              <el-button class="reset" @click="handleReset">{{ '重置'}}</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-table
        class="g-table"
        :data="list"
        stripe
        :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
      >
        <el-table-column prop="userCode" label="用戶號">
          <template slot-scope="scope">
            <span>{{ scope.row.userCode }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="註冊日期"></el-table-column>
        <el-table-column prop="statuss" label="狀態">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusType}}</span>
          </template>
        </el-table-column>
        <div slot="empty" class="g-empty">
          <img src="@/img/table-empty.png" alt />
          <span>
            {{
            $t(`AUTHORIZATION_CENTER.NOT_SUBMITTED_BY_ME`)
            }}
          </span>
        </div>
      </el-table>
      <el-form class="transverse-form" label-width="auto" v-show="list.length>0">
        <!-- 客户编号 -->
        <el-form-item label="備註：">
          <el-input
            class="g-w-270"
            v-model="activationText"
            :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
          ></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <div style="width:270px;">
            <div style="float:right">
              <el-button class="query" type="primary" @click="activationFun('A')">{{'激活'}}</el-button>
              <el-button class="reset" @click="activationFun('D')">{{'退回'}}</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { softTokenGet, softTokenUpdate } from '@/api/customer-management/user';

export default {
  name: 'registraTionProcessing',
  components: {},
  data() {
    return {
      list: [],
      number: '', //用戶號
      activationText: '' //備註
    };
  },
  filters: {
    statusType(val) {
      switch (val) {
        case 'PEND_ACT':
          return '待激活';
        case 'PEND_OTP':
          return '待OTP';
        case 'CPLT_1TXN':
          return '已完成';
        default:
          return value;
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 查询
    search() {
      this.list = [];
      console.log(this.number);
      if (this.number === '') {
        this.$showMsg({
          type: 'error',
          message: '請輸入用戶號'
        });
        return;
      } else {
        softTokenGet({ userCode: this.number }).then(({ body }) => {
          console.log('body', body);
          if (body) {
            this.list.push(body);
          }
          console.log(this.list.length);
        });
      }
    },
    //重置
    handleReset() {
      this.number = '';
      this.list = [];
    },
    activationFun(val) {
      softTokenUpdate({
        userCode: this.list[0].userCode,
        staOperation: val,
        activationText: this.activationText
      }).then(({ body }) => {
        if (body === 'SUCCESS') {
          this.$showMsg({
            message: '成功',
            type: 'success'
          });
          this.search();
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.g-quota {
  padding: 32px 24px;
  box-sizing: border-box;
  background: #fff;
  min-height: 100%;
  position: relative;
}
.u-tabs {
  /deep/ .el-tabs__item {
    text-align: center;
    width: 138px;
    padding-left: 20px;
  }
  /deep/ .el-tabs__item.is-active,
  /deep/ .el-tabs__item:hover {
    color: #f06b00 !important;
  }
}
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  min-width: 600px;
  min-height: 100%;
  background: #fff;
}
/deep/ .el-table__empty-block {
  text-align: center;
  @media screen and (max-width: 1919px) {
    text-align: initial;
  }
}

/deep/ .el-table {
  width: auto;
}
.g-table {
  margin-top: 20px;
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: absolute;
    bottom: 25%;
    left: 48%;
  }
}
.btn {
  cursor: pointer;
}
.g-bolck {
  text-align: right;
  margin: 40px 10px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
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
  margin: 10px 0 0 0;
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
.g-w-270 {
  width: 270px;
}
</style>