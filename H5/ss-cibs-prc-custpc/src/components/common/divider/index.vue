<!--
 * @Author: your name
 * @Date: 2022-05-24 10:16:48
 * @LastEditTime: 2022-09-16 15:25:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\components\common\divider\index.vue
-->
<template>
    <div class="divider">
        <div class="bill"></div>
        <div class="title">{{title}}</div>
        <slot/>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        }
    }
}
</script>
<style lang="scss" scoped>
.divider {
    // margin: 10px 0;
    display: flex;
    align-items: center;
    .bill {
    width: 4px;
    height: 18px;
    background: #f06b00;
    // border-radius: 8px;
    }

    .title {
        font-size: 18px;
         
        color: rgba(0,0,0,.85);
        padding-left: 10px;
        font-weight: 500;
        }
    }
</style>
