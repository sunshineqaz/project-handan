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
        height: 10%;
        // height: 296px;
        background: url(../../assets/homePage/header.png) no-repeat center center;
        background-size: 100% 100%;
    }
    &_container {
        width: calc(100% - 2rem);
        // height: 1810px;
        height: 86%;
        margin-top: 1%;
        padding: 0 1rem;
    }
    .el-table {
        width: 100%;
        height: 100%;
        background: transparent;
        font-size: 1.2rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        overflow-y: auto;
        .el-table__header-wrapper {
            width: 100%;
            min-height: 2rem;
            background: #1F4BB1;
        }
        tr, td, th {
            background: transparent;
            color: #FFFFFF;
            padding: 0;
            min-height: 2rem;
            .cell {
                min-height: 2rem;
                line-height: 2rem;
            }
        }
        td.el-table__cell {
            border-color: #2B69F8;;
        }
        th.el-table__cell {
            background: none;
        }
    }
    .el-table--border::after, .el-table--group::after, .el-table::before {
        background-color: transparent;
    }
    .el-table__empty-text {
        height: 1.5rem;
        line-height: 1.5rem;
    }
}
::-webkit-scrollbar {
    width: 0.3rem;
}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);

}
</style>