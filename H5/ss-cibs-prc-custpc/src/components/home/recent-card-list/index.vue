<!--
 * @Author: ZhangZhen
 * @Date: 2022-05-31 10:32:20
 * @LastEditTime: 2022-10-20 19:30:33
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\home\recent-card-list\index.vue
-->
<template>
  <el-card class="recent-card-list">
    <header class="nav-title">
      <h3 class="show-title" >
        {{ $t('PAYMENT.RECENT_TRANSFER') }}
      </h3>
      <span class="more-nav-tab" @click="toTransRecords">
        {{ $t('HOME.MORE') }}
      </span>
    </header>
    <section v-if="transferList.length > 0">
      <recent-card-item
        v-for="(item, index) of transferList"
        :key="`${index} ${item.businessCode}`"
        :item="item"
        :index="index"
        @toTransRecordDetail="toTransRecordDetail"
      />
    </section>
    <el-empty
      v-else
      :image="require(`@/images/queryNot.png`)"
      :imageSize="85"
    />
  </el-card>
</template>

<script>
import RecentCardItem from './item.vue';
import { getActiveClickArr } from '@/utils';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'RecentCardList',
  components: {
    RecentCardItem
  },
  props: {
    transferList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    ...mapMutations('app', [
      'setSliderMenus',
      'setSliderMenusAct',
      'setBreadcrumb'
    ]),
    toTransRecords() {
       let menu = JSON.parse(localStorage.getItem('userMenus'));
      let menuItem = menu.filter(item => {
        return item.id === '03';
      });
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr('030106');
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });
      this.setSliderMenus(...menuItem);
        this.$router.push({
        path: '/bankTransfer/transferRecord/index',
      });
      // this.$router.push('/bankTransfer/transferRecord/index');
    },
    toTransRecordDetail(item) {
      let menu = JSON.parse(localStorage.getItem('userMenus'));
      let menuItem = menu.filter(item => {
        return item.id === '03';
      });
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr('030106');
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });
      this.setSliderMenus(...menuItem);
        this.$router.push({
        path: '/bankTransfer/transferRecord/index',
        query: {
          params: {
            ...item,
            showDetail: true,
          }
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.recent-card-list {
  width: 466px;
  max-height: 373px;
  padding: 6px 0 24px 0;
  box-sizing: border-box;
  overflow: auto;

  .nav-title {
    width: 100%;
    position: relative;
    margin-bottom: 16px;
    box-sizing: border-box;

    .show-title {
      font-size: 18px;
    }

    .more-nav-tab {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      cursor: pointer;
     color: #999999;
      font-size: 14px;
      &:hover {
        transition: all .2s;
      color: #999999;
      }
    }
  }

}
</style>