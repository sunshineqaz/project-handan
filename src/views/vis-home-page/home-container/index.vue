<template>
    <div class="vis-homeContainer">
        <div class="homeContainer_charts">
            <sign-result-total></sign-result-total>
            <sign-result></sign-result>
        </div>
        <div class="homeContainer_map">
            <statics-comp class="statics" v-if="!userId"></statics-comp>
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
import staticsComp from '../statics-comp'
import { mapState } from 'vuex';
export default {
    components: {
        signResultTotal,
        signResult,
        abnormalTable,
        trailTable,
        chinaMap,
        staticsComp
    },
    computed: {
        ...mapState(['userId']),
    },
}
</script>

<style lang="less">
.vis-homeContainer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .homeContainer_charts {
        width: 30%;
        height: 100%;
    }
    .homeContainer_map {
        width: 47%;
        height: 100%;
        position: relative;
        .statics {
            z-index: 6;
            position: absolute;
            width: 100%;
            height: 5rem;
            top: 1rem;
        }
    }
}
</style>