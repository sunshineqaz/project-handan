<template>
    <div class='vis-homePage'>
        <div class='vis-homePage_header'>
            <home-header></home-header>
        </div>
        <div class='vis-homePage_container'>
            <home-container></home-container>
        </div>
    </div>
</template>

<script>
import homeHeader from './home-header/index'
import homeContainer from './home-container'
export default {
    components: {
        homeHeader,
        homeContainer
    }
}
</script>

<style lang="less">
.vis-homePage {
    width: 100%;
    height: 100%;
    background: url('../../assets/login/bg.png') no-repeat center center;
    background-size: 100% 100%;
    &_header {
        width: 100%;
        /* height: 10%; */
        height: 296px;
        background: url(../../assets/homePage/header.png) no-repeat center center;
        background-size: 100% 100%;
    }
    &_container {
        width: calc(100% - 80px);
        height: 1810px;
        margin: 40px auto;
    }
}
</style>