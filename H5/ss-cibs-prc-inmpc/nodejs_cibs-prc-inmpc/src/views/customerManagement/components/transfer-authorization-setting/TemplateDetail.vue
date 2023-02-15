<template>
  <div>
    <div>
      <div class="detailItem">
        <div class="itemContent">
          <div class="itemLeft">{{ $t('CUSTOMER_MANAGEMENT.TEMPLATE_NAME') }}</div>
          <div class="itemRight">{{ model.modelName }}</div>
        </div>
      </div>
      <div class="detailItem">
        <div class="itemContent">
          <div class="itemLeft">{{ $t('CUSTOMER_MANAGEMENT.TRANS_TYPE') }}</div>
          <div class="itemRight">{{ model.modelType==='1'?'有金额模式':'无金额模式' }}</div>
        </div>
      </div>
    </div>

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
  name: 'TemplateDetail',
  components: {},
  props: {
    empowerTradeCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      model: {}
    };
  },
  filters,
  created() {
    this.queryAuthTradeDetail();
  },

  mounted() {},

  methods: {
    async queryAuthTradeDetail() {
      let result = await queryAuthTradeDetail({
        empowerTradeCode: this.empowerTradeCode
      });
      if (result.body) {
        this.model = result.body.body;
      }
    },
    //返回
    back() {
      this.$emit('back');
    }
  }
};
</script>

<style lang="scss" scoped>
.detailItem {
  box-sizing: border-box;
  padding: 8px 0 0;

  .itemContent {
    display: flex;
    .itemLeft,
    .itemRight {
      line-height: 22px;
      font-size: 14px;
      margin-left: 8px;
    }
    .itemLeft {
      width: 140px;
      text-align: right;
      color: rgba(0, 0, 0, 0.45);
    }
    .itemRight {
      width: 280px;
      margin-left: 8px;
      text-align: left;
      color: rgba(0, 0, 0, 0.85);
    }
  }
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