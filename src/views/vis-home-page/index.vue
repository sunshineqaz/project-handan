<template>
    <div class='vis-homePage'>
        <div class='vis-homePage_header'>
            <home-header></home-header>
        </div>
        <div class='vis-homePage_container'>
            
        </div>
    </div>
</template>

<script>
import homeHeader from './home-header/index'
export default {
    components: {
        homeHeader
    }
}
</script>


<style scoped>
.vis-homePage {
    width: 100%;
    height: 100%;
    background: url('../../assets/login/bg.png') no-repeat center center;
    background-size: 100% 100%;
}
.vis-homePage_header {
    width: 100%;
    height: 10%;
    /* height: 296px; */
}
</style>