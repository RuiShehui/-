<template>
  <div class="contain">
    <el-form class="g-form" ref="formRef" label-suffix=":">
      <el-form-item :label="$t('CUSTOMER_MANAGEMENT.TRANS_TYPE')">
        <el-input :disabled="true" v-model="model.tradeType"></el-input>
      </el-form-item>
      <el-form-item class="g-from-input" :label="$t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME')">
        <el-input :disabled="true" v-model="model.modelName"></el-input>
      </el-form-item>
      <el-form-item class="g-from-input" :label="$t('CUSTOMER_MANAGEMENT.AUTH_TEMPLATE_TYPE')">
        <span>{{ modelTypeFilter(model.modelType) }}</span>
      </el-form-item>
    </el-form>
    <el-table
      v-if="model.modelType === '1'"
      class="g-table"
      :data="model.amuntUserList"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px', width:'100%'}"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.MONEY_INTERVAL')" width="430px">
        <template slot-scope="scope">
          <div class="amount">
            <el-input :disabled="true" v-model="scope.row.amountStart" class="g-w-150"></el-input>
            <div class="text">&lt; {{$t('CUSTOMER_MANAGEMENT.MONEY')}} ≤</div>
            <el-input :disabled="true" v-model="scope.row.amountEnd" class="g-w-180"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
        <template slot-scope="scope">
          <el-input :disabled="true" v-model="scope.row.levelANumber"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
        <template slot-scope="scope">
          <el-input :disabled="true" v-model="scope.row.levelBNumber"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
        <template slot-scope="scope">
          <el-input :disabled="true" v-model="scope.row.levelCNumber"></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="model.modelType === '0'"
      class="g-table"
      :data="model.amuntUserList"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px', width:'100%'}"
    >
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELA_NUMBER')">
        <template slot-scope="scope">
          <el-input :disabled="true" v-model="scope.row.levelANumber"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELB_NUMBER')">
        <template slot-scope="scope">
          <el-input :disabled="true" v-model="scope.row.levelBNumber"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.LEVELC_NUMBER')">
        <template slot-scope="scope">
          <el-input :disabled="true" v-model="scope.row.levelCNumber"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="g-bottom">
      <el-button type="primary" @click="back">{{$t('CUSTOMER_MANAGEMENT.BACK')}}</el-button>
    </div>
  </div>
</template>

<script>
import { queryAuthTradeDetail } from '@/api/customer-management/authorization';
import filters from '@/filters/clientManage';
export default {
  name: 'TrsAuSettingsDetail',
  components: {},

  data() {
    return {
      model: {},
      params: {},
      ebankCstmNo: '',
      modelCode: ''
    };
  },
  filters,
  created() {
    this.params = this.$route.params;
    console.log(this.$route.params);
    this.queryAuthTradeDetail();
  },

  mounted() {},

  methods: {
    async queryAuthTradeDetail() {
      let result = await queryAuthTradeDetail({
        ...this.params
      });
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.model = result.body;
        console.log(result);
      }
    },
    //返回
    back() {
      console.log(1111);
      this.$router.replace({
        name: 'TrsAuSettings'
      });
      this.$store.commit(
        'tabs/DELETE_TABS',
        '/customerManagement/trsAuSettings/detail'
      );
    },
    modelTypeFilter(val) {
      switch (val) {
        case '0':
          return this.$t('CUSTOMER_MANAGEMENT.NO_MONEY_MODEL');
        case '1':
          return this.$t('CUSTOMER_MANAGEMENT.HAS_MONEY_MODEL');
        default:
          return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  min-height: 100%;
  background: #fff;
  box-sizing: border-box;
}
.g-form {
  padding: 20px;
  display: inline-flex;
  justify-content: space-between;
  .el-form-item {
    display: inline-flex;
    justify-content: space-between;
  }
  .g-from-input {
    padding-left: 40px;
  }
}

/deep/ .el-table {
  width: auto;
}
.g-table {
  // padding: 0 20px;
  margin: 0 20px;
  // width: 1--
}
.amount {
  display: flex;
  align-items: center;
  justify-content: center;
  .g-w-150 {
    width: 150px;
  }
  .g-w-180 {
    width: 180px;
  }
  .text {
    margin: 0 10px;
  }
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: absolute;
    bottom: 15%;
    left: 45%;
  }
}
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
.el-button {
  border: 0;
  align-items: center;
}

.g-bottom {
  margin: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
    border-color: #f06b00;
  }
}
</style>