<!--
 * @Author: zhangcheng
 * @Date: 2022-03-31 14:53:14
 * @LastEditTime: 2022-09-17 15:21:41
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\authShowDetail.vue
-->
<template>
  <div class="content">
    <div v-for="(item,index) in authDetailData" :key="index">
      <header>{{ item.label}}</header>
      <footer :class="item.waitAuth?'authState':''">{{ item.value }}</footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthShowDetail',
  props: {
    authDetailData: {
      type: Array,
      default() {
        return [
         
        ];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 940px;
  margin: 0 auto;
  font-size: 14px;
  > div {
    width: 444px;
    line-height: 22px;
    margin-bottom: 16px;
    display: flex;
    > header {
      width: 120px;
      text-align: right;
      color: rgba($color: #000000, $alpha: 0.45);
    }
    > footer {
      width: 240px;
      color: rgba($color: #000000, $alpha: 0.85);
      margin-left: 24px;
    }
    .authState {
      color: #f06b00;
    }
  }
}
</style>