<!--
 * @Author: ZhangZhen
 * @Date: 2021-12-13 17:43:36
 * @LastEditTime: 2022-05-09 15:09:19
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\components\pagination-card\index.vue
-->
<template>
  <div class="pagination-card" v-bind="$attrs" v-on="$listeners">
    <el-card class="g-excel-list" v-infinite-scroll="true" style="overflow: auto;">
      <!-- <template slot="header">
        <header class="g-excel-list-header">
          {{ $t('BUSINESS_MANAGEMENT.DISCOUNT_OBJECT_CODE') + $t('COMMON.LIST') }}
          {{ title }}
        </header>
      </template>-->
      <!-- <p
        class="g-excel-list-text"
        v-for="(item, index) of filterData"
        :key="index"
      >{{ `${index + 1}.${item.discountObjectCode || ''}` }}</p>-->
      <section class="g-excel-item-content">
        <el-tag
          class="g-excel-item"
          v-for="(item, index) of filterData"
          :key="index"
          color="#fff"
        >{{ item[renderProp] }}</el-tag>
      </section>
    </el-card>
    <el-pagination
      class="g-content-pagination"
      :background="true"
      :current-page.sync="pageInfo.current"
      :page-size="pageInfo.size"
      :total="pageInfo.total"
      :hide-on-single-page="true"
      :pager-count="5"
      layout="total,prev,pager,next,jumper"
      @size-change="getContentByPageInfo($event, 'size')"
      @current-change="getContentByPageInfo($event, 'current')"
    />
    <!-- sizes,prev,next -->
  </div>
</template>

<script>
export default {
  name: 'PaginationCard',
  props: {
    title: String,
    origin: {
      type: Array,
      default() {
        return [];
      }
    },
    renderProp: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      originData: [],
      pageInfo: {
        current: 1,
        size: 20,
        total: 0
      }
    };
  },
  computed: {
    filterData() {
      const { current, size } = this.pageInfo;
      const filterData = this.originData.slice(
        (0 + (current - 1)) * size,
        (0 + (current - 1)) * size + size
      );

      return filterData;
    }
  },
  watch: {
    origin() {
      this.setOriginData();
    }
  },
  mounted() {
    this.setOriginData();
  },
  methods: {
    setOriginData() {
      this.originData = [...this.origin];
      this.setPageInfo();
    },
    setPageInfo() {
      this.pageInfo.total = this.originData.length;
    },
    getContentByPageInfo(value, prop) {
      this.pageInfo[prop] = value;
    }
  }
};
</script>

<style scoped lang="scss">
.pagination-card {
  width: 100%;
  .g-excel-list {
    width: 370px;
    margin-top: 10px;
    overflow-y: auto;
    .g-excel-item-content {
      // text-align: center;
      .g-excel-item {
        margin-left: 5px;
      }
    }
    .g-excel-list-header {
      line-height: 1;
    }
    .g-excel-list-text {
      line-height: 1.5;
    }
  }
  .g-content-pagination {
    margin-top: 10px;
  }
}
</style>