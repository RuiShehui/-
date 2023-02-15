<!--
 * @Autor: 赵霖
 * @Date: 2021-10-25 10:15:52
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-01-27 09:38:47
 * @Description: 银行公告管理--银行公告详情
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\announcement\announcement-add-confirm.vue
-->
<template>
  <div class="g-detail">
    <el-table :show-header="false" :data="tableData" border :cell-style="columnStyle">
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.START_TIME')}}</p>
      </el-table-column>
      <el-table-column prop="inputStartTime" align="left">
        <template
          v-slot="{ row }"
        >{{ row.inputStartTime.length ? row.inputStartTime : formatDate(new Date()) }}</template>
      </el-table-column>
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.END_TIME')}}</p>
      </el-table-column>
      <el-table-column prop="inputEndTime" align="left">
        <template
          v-slot="{ row }"
        >{{ row.inputEndTime.length ? row.inputEndTime : $t('BUSINESS_MANAGEMENT.FOREVER_EFFECTED') }}</template>
      </el-table-column>
    </el-table>
    <el-radio-group v-model="lang" class="my-radio">
      <el-radio-button label="cn">{{$t('lang.simplify')}}</el-radio-button>
      <el-radio-button label="tc">{{$t('lang.traditional')}}</el-radio-button>
      <el-radio-button label="en">{{$t('lang.english')}}</el-radio-button>
    </el-radio-group>
    <el-table
      v-if="lang==='en'"
      :show-header="false"
      :data="tableData"
      border
      :cell-style="columnStyle"
    >
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.EN_TITLE')}}</p>
      </el-table-column>
      <el-table-column prop="enAnnouncementTitle" align="left" width="1380" min-width="600" />
    </el-table>
    <el-table
      v-if="lang==='en'"
      :show-header="false"
      :data="tableData"
      border
      :cell-style="columnStyle"
    >
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.EN_CONTENT')}}</p>
      </el-table-column>
      <el-table-column prop="enAnnouncementContent" align="left" width="1380" min-width="600" />
    </el-table>
    <el-table
      v-if="lang==='cn'"
      :show-header="false"
      :data="tableData"
      border
      :cell-style="columnStyle"
    >
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.CN_TITLE')}}</p>
      </el-table-column>
      <el-table-column prop="cnAnnouncementTitle" align="left" width="1380" min-width="600" />
    </el-table>
    <el-table
      v-if="lang==='cn'"
      :show-header="false"
      :data="tableData"
      border
      :cell-style="columnStyle"
    >
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.CN_CONTENT')}}</p>
      </el-table-column>
      <el-table-column prop="cnAnnouncementContent" align="left"></el-table-column>
    </el-table>
    <el-table
      v-if="lang==='tc'"
      :show-header="false"
      :data="tableData"
      border
      :cell-style="columnStyle"
    >
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.TC_TITLE')}}</p>
      </el-table-column>
      <el-table-column prop="tcAnnouncementTitle" align="left"></el-table-column>
    </el-table>
    <el-table
      v-if="lang==='tc'"
      :show-header="false"
      :data="tableData"
      border
      :cell-style="columnStyle"
    >
      <el-table-column width="180" align="left">
        <p>{{$t('BUSINESS_MANAGEMENT.TC_CONTENT')}}</p>
      </el-table-column>
      <el-table-column prop="tcAnnouncementContent" align="left"></el-table-column>
    </el-table>
    <div class="g-bottom">
      <el-button class="f-cancel" @click="backTo">{{$t('COMMON.PREVIOUS_STEP')}}</el-button>
      <el-button type="primary" @click="handleSubmit">{{$t('COMMON.SUBMIT')}}</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { saveAnnounce } from '@/api/business-management/announcement';
import dateTools from '@/utils/dateTools';

const { mapMutations } = createNamespacedHelpers('tabs');
const { formatDate } = dateTools;

export default {
  name: 'AnnouncementDetailPage',
  filters: {},
  data() {
    return {
      tableData: [],
      lang: 'en'
    };
  },
  created() {
    this.tableData = [this.$route.query];
  },
  methods: {
    ...mapMutations(['DELETE_TABS', 'ADD_TABS']),
    formatDate,
    // 返回
    backTo() {
      this.$router.push({
        path: '/businessMangament/announcement/add',
        query: { submitData: { ...this.tableData[0] } }
      });
      this.DELETE_TABS('/businessMangament/announcement/add-confirm');
    },
    handleSubmit() {
      const crtItem = this.tableData[0];
      const submitData = {
        ...crtItem
        // inputStartTime: crtItem.inputStartTime.length ? crtItem.inputStartTime : formatDate(new Date()),
        // inputEndTime: crtItem.inputEndTime,
      };
      console.log(submitData);
      this.$showBox({
        content: this.$t('BUSINESS_MANAGEMENT.CONFIRM_SUBMIT_ANNOUNCEMENT'),
        confirm: () => {
          this.confirmAdd(submitData);
        }
      });
    },
    async confirmAdd(submitData) {
      const result = await saveAnnounce(submitData);

      if (result.body) {
        this.$showMsg({
          type: 'success',
          message: this.$t('BUSINESS_MANAGEMENT.ADD_ANNOUNCEMENT_SUCCESS')
        });
      } else
        this.$showMsg({
          type: 'error',
          message: this.$t('BUSINESS_MANAGEMENT.ADD_ANNOUNCEMENT_FAIL', {
            message: result
          })
        });

      setTimeout(() => {
        this.$router.push('/businessMangament/announcement');
        // this.DELETE_TABS('/businessMangament/announcement/add-confirm');
        // this.DELETE_TABS('/businessMangament/announcement/add');
      }, 3000);
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 2) {
        return 'background:#f3f6fc;';
      } else {
        return 'background:#ffffff';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.g-detail {
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  padding: 32px 24px;
}
.g-tabs {
  margin-top: 3.5%;
  .el-tabs__item.is-active {
    color: #f06b00 !important;
  }
}
/deep/ .el-tabs__item.is-active {
  color: #f06b00;
}
/deep/.el-tabs__active-bar {
  background: #f06b00;
  height: 4px;
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
}
.my-radio {
  margin: 32px 20px;
}
</style>
