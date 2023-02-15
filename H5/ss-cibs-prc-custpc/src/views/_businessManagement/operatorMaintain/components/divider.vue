<!--
 * @Author: your name
 * @Date: 2021-12-13 11:33:49
 * @LastEditTime: 2022-09-17 11:28:58
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\_businessManagement\operatorMaintain\components\divider.vue
-->
<template>
    <div class="divider">
        <div class="bill"></div>
        <div class="title">{{title}}</div>
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
    margin: 10px 0;
    display: flex;
    align-items: center;
    .bill {
    width: 4px;
    height: 18px;
    background: #f06b00;
    border-radius: 8px;
    }

    .title {
        font-size: 18px;
        color: rgba(0,0,0,.85);
        padding-left: 10px;
        font-weight: 500;
        }
    }
</style>
