<template>
    <div class="vis-homeContainer">
        <div class="homeContainer_charts">
            左侧
        </div>
        <div class="homeContainer_map">
            地图
        </div>
        <div class="homeContainer_charts">
            右侧
        </div>
    </div>
</template>

<script>
export default {
    components: {
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
        background: red;
    }
    .homeContainer_map {
        width: 3520px;
        height: 100%;
        background: coral;
    }
}
</style>