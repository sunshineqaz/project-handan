<template>
    <div class="vis-homeHeader">
        <div class="homeHeader-left">
            <!-- <div class="homeHeader-left_time"> -->
                <!-- {{ timeData }} -->
            <!-- </div> -->
            <el-row :gutter="20">
                <el-col :span="6" class="homeHeader-left_time">
                    {{ timeData }}
                </el-col>
                <el-col :span="4">
                    aaa
                </el-col>
                <el-col :span="4">
                   bbb
                </el-col>
                <el-col :span="4">
                    ccc
                </el-col>
                <el-col :span="4">
                    ddd
                </el-col>
            </el-row>
        </div>
        <span class="homeHeader_title">
            邯郸区司法局指挥中心
        </span>
    </div>
</template>

<script>
import dayjs from 'dayjs'
console.log(dayjs, 'dayyyyyyyyyyy')
export default {
    name: 'homeHeader',
    data() {
        return {
            timeData: '' // 系统当前时间显示
        }
    },
    mounted() {
        setInterval(() => {
            this.getTimeData()
        }, 1000)
    },
    methods: {
        getTimeData() {
            let tempTime = dayjs(new Date()).valueOf()
            this.timeData = dayjs(tempTime).format('YYYY-MM-DD HH:mm:ss')
        }
    }
}
</script>

<style scoped lang="less">
.vis-homeHeader {
    width: 100%;
    height: 100%;
    color: #fff;
    padding: 0 44px;
}
.homeHeader-left {
    width: 35%;
    height: 150px;
    margin: auto;
    background: #fff;
    margin-top: 43px;
    float: left;
    .el-row {
        width: 100%;
        height: 100%;
        .el-col {
            height: 100%;
            font-weight: 400;
            color: #18A1F4;
            line-height: 25px;
            font-size: 50px;
        }
        .el-col:first-child {
            font-size: 72px;
        }
    } 
}
.homeHeader_title {
    color: #fff;
    display: inline-block;
    margin: auto;
    font-size: 140px;
    font-weight: bold;
    letter-spacing: 15px;

}
</style>