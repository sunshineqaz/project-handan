<template>
    <div class="vis-homeContainer">
        <div class="homeContainer_charts">
            <sign-result-total></sign-result-total>
            <sign-result></sign-result>
        </div>
        <div class="homeContainer_map">
            <china-map></china-map>
        </div>
        <div class="homeContainer_charts">
            <abnormal-table></abnormal-table>
            <trail-table></trail-table>
        </div>
    </div>
</template>

<script>
import signResultTotal from '../sign-result-total'
import signResult from '../sign-result'
import abnormalTable from '../abnormal-table'
import trailTable from '../trail-table'
import chinaMap from './china-map'
export default {
    components: {
        signResultTotal,
        signResult,
        abnormalTable,
        trailTable,
        chinaMap
    }
}
</script>

<style lang="less">
.vis-homeContainer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .homeContainer_charts {
        width: 2000px;
        height: 100%;
    }
    .homeContainer_map {
        width: 3520px;
        height: 100%;
        background: coral;
    }
}
</style>