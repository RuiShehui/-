<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-10 17:13:25
 * @LastEditTime: 2022-01-07 15:56:44
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\announcement\components\col-detail\index.vue
-->
<template>
  <section class="g-detail-box">
    <el-descriptions class="g-col-detail" :column="2" :border="true">
      <el-descriptions-item>
        <template slot="label">{{ $t('BUSINESS_MANAGEMENT.SUBMITOR') }}</template>
        {{ item.creator }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">{{ $t('BUSINESS_MANAGEMENT.SUBMIT_TIME') }}</template>
        {{ item.createTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">{{ $t('BUSINESS_MANAGEMENT.ANNOUCEMENT_STATUS') }}</template>
        {{ item.announcementStatus | announcementStatusStatusText }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">{{ $t('BUSINESS_MANAGEMENT.ANNOUCEMENT_TIMESPAN') }}</template>
        {{ renderTimespan(item) }}
      </el-descriptions-item>
    </el-descriptions>
    <el-radio-group class="select-lang-tabs" v-model="lang">
      <el-radio-button
        v-for="item of langList"
        :key="item.value"
        :label="item.value"
      >{{ item.label }}</el-radio-button>
    </el-radio-group>
    <el-descriptions :column="1" :border="true">
      <el-descriptions-item class="desc-table" v-if="lang.indexOf('cn') === 0" :column="1" :label-style="{ minWidth: '200px', width: '200px' }" >
        <span slot="label" class="desc-title">{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TITLE') }}</span>
        <div class="desc-content">
          {{ item.cnAnnouncementTitle }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item class="desc-table" v-if="lang.indexOf('cn') === 0" :column="1" :label-style="{ minWidth: '200px', width: '200px' }" >
        <span slot="label" class="desc-title">{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_CONTENT') }}</span>
        <div class="desc-content">
          {{ item.cnAnnouncementContent }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item class="desc-table" v-if="lang.indexOf('tc') === 0" :column="1" :label-style="{ minWidth: '200px', width: '200px' }" >
        <span slot="label" class="desc-title">{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TITLE') }}</span>
        <div class="desc-content">
          {{ item.tcAnnouncementTitle }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item class="desc-table" v-if="lang.indexOf('tc') === 0" :column="1" :label-style="{ minWidth: '200px', width: '200px' }" >
        <span slot="label" class="desc-title">{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_CONTENT') }}</span>
        <div class="desc-content">
          {{ item.tcAnnouncementContent }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item class="desc-table" v-if="lang.indexOf('en') === 0" :column="1" :label-style="{ minWidth: '200px', width: '200px' }" >
        <span slot="label" class="desc-title">{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_TITLE') }}</span>
        <div class="desc-content">
          {{ item.enAnnouncementTitle }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item class="desc-table" v-if="lang.indexOf('en') === 0" :column="1" :label-style="{ minWidth: '200px', width: '200px' }" >
        <span slot="label" class="desc-title">{{ $t('BUSINESS_MANAGEMENT.ANNOUNCEMENT_CONTENT') }}</span>
        <div class="desc-content">
          {{ item.enAnnouncementContent }}
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </section>
</template>

<script>
export default {
  name: 'ColDetail',
  components: {},
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    announcementStatusStatusText(status) {
      switch (parseInt(status)) {
        case 0:
          return '待生效';
        case 1:
          return '生效';
        case 2:
          return '失效';
      }
    },
    createTimeText(createTime = 'yyyy-mm-ddThh:mm:ss') {
      return createTime.replace('T', () => ' ');
    }
  },
  data() {
    return {
      lang: 'en',
      langList: [
        {
          label: 'English',
          value: 'en'
        },
        {
          label: '简体',
          value: 'cn'
        },
        {
          label: '繁体',
          value: 'tc'
        }
      ]
    };
  },
  methods: {
    renderTimespan({ announcementDeadtime = '', announcementStarttime = '' }) {
      if (announcementDeadtime.includes('2999')) {
        return this.$t('BUSINESS_MANAGEMENT.FOREVER_EFFECTED');
      }
      if (!announcementDeadtime.length) {
        return this.$t('BUSINESS_MANAGEMENT.FOREVER_EFFECTED');
      }
      return `${announcementStarttime} ${this.$t('COMMON.DATESPAN_TO')} ${announcementDeadtime}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin desc-content() {
  width: 100%;
  overflow-x: auto;
  word-break: break-all;
  word-wrap: break-word;
}

.g-detail-box {
  .g-col-detail {
    padding-top: 20px;
  }
  .select-lang-tabs {
    margin: 15px 0;
  }
  .desc-title {
    width: 250px !important;
  }
  @include desc-content;
}
</style>
