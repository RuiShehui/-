<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-19 11:55:19
 * @LastEditTime: 2022-06-07 14:48:51
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\quota\components\level-page\level-page-desc.vue
-->
<template>
  <el-table
    v-remove-body="{ removeClass: 'el-table__body-wrapper' }"
    class="page-desc"
    :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
  >
    <el-table-column
      :label="$t('BUSINESS_MANAGEMENT.QUOTA_DEAL_TYPE')"
      prop="tradeTypeName"
      min-width="333px"
    />
    <el-table-column
      :label="$t('BUSINESS_MANAGEMENT.QUOTA_DEAL_SINGLE')"
      prop="limitSingleStart"
      min-width="333px"
    />
    <el-table-column
      :label="$t('BUSINESS_MANAGEMENT.QUOTA_DEAL_TOTAL')"
      prop="limitDaily"
      min-width="333px"
    />
    <!-- limitSingleStart (? limitSingleEnd) -->
  </el-table>
</template>

<script>
export default {
  name: 'LevelPageDesc',
  directives: {
    removeBody: {
      bind(el, binding) {
        const { removeClass } = binding.value,
          oEl = el.querySelector(`.${removeClass}`);

        removeElement(oEl);

        /**
         * 删除子元素(兼容IE浏览器)
         */
        function removeElement(ele) {
          if (ele && ele instanceof HTMLElement) {
            if (typeof ele.remove === 'function') {
              ele.remove();
            } else {
              ele.parentNode.removeChild(ele);
            }
          }
        }
      }
    }
  }
};
</script>