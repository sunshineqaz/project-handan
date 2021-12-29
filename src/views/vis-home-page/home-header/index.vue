<template>
    <div class="vis-homeHeader">
        <div class="homeHeader-left">
            <el-row>
                <el-col :span="7" class="homeHeader-left_time">
                    {{ timeData }}
                </el-col>
                <el-col :span="4" v-for="(tab, index) in tabData" :key="index" :class="{ activeTab: activeTab == tab.name }">
                    {{ tab.text }}
                </el-col>
            </el-row>
        </div>
        <span class="homeHeader_title">
            邯郸区司法局指挥中心
        </span>
        <div class="homeHeader-right">
            <div class="homeHeader-right_select">
                <el-select v-model="filterData.justice">
                    <el-option v-for="(item, index) in justiceOpts" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
                </el-select>
            </div>
            <div class="homeHeader-right_select">
                <el-select v-model="filterData.area" placeholder="请选择司法所" @change="getPeopleData">
                    <el-option v-for="(item, index) in areaOpts" :key="index" :value="item.deptId" :label="item.deptName"></el-option>
                </el-select>
            </div>
            <div class="homeHeader-right_select">
                <el-select v-model="filterData.name" placeholder="请选择人员姓名" @change="changeUserData">
                    <el-option v-for="(item, index) in peopleOpts" :key="index" :value="item.userId" :label="item.userName"></el-option>
                </el-select>
            </div>
            <div class="homeHeader-right_time">
                <div class="time_tip">刷新倒计时</div>
                <div>
                    {{ timeOver }}
                </div>
            </div>
            <div class="homeHeader-right_buttons">
                <el-button type="primary" class="fullScreen" @click="handleScreen"></el-button>
                <el-button type="primary" class="loginOut" @click="handleLoginOut"></el-button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import screenfull from 'screenfull'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'homeHeader',
    data() {
        return {
            timeData: '', // 系统当前时间显示
            timeOver: '', // 倒计时时间
            maxtime: 5 * 60,
            tabData: [
                {
                    name: 'first',
                    text: '定位签到监督'
                },
                {
                    name: 'second',
                    text: '矫正综合数据'
                },
                {
                    name: 'third',
                    text: '执法工作监督'
                },
                {
                    name: 'forth',
                    text: '系统运行监控'
                }
            ],
            activeTab: 'first', // 默认选中当前页
            filterData: {
                justice: '', // 司法局 
                area: '', // 司法所
                name: '' // 人员
            },
            justiceOpts: [],
            areaOpts: [],
            peopleOpts: [],
            curTime: null,
            overTime: null,
            isFullscreen: false
        }
    },
    computed: {
        ...mapState(['actorId'])
    },
    mounted() {
        this.getTimeData()
        this.curTime = setInterval(() => {
            this.getTimeData()
        }, 1000)
        this.getTimeOver()
        this.overTime = setInterval(() => {
            this.getTimeOver()
        }, 5 * 60 * 1000)
        this.getJusticeData()
        this.getAreaData()
    },
    methods: {
        ...mapActions(['changeOrgId', 'changeUserId']),
        // 当前时间
        getTimeData() {
            let tempTime = dayjs(new Date()).valueOf()
            this.timeData = dayjs(tempTime).format('YYYY-MM-DD HH:mm:ss')
        },
        // 倒计时
        getTimeOver() {
            let timer = setInterval(() => {
                if (this.maxtime >= 0) {
                    let minutes = Math.floor(this.maxtime / 60);
                    let seconds = Math.floor(this.maxtime % 60) > 9 ? Math.floor(this.maxtime % 60) : '0' + Math.floor(this.maxtime % 60);
                    let msg = '00:0' + minutes + ":" + seconds;
                    --this.maxtime;
                    this.timeOver = msg
                } else {
                    this.maxtime = 5 * 60
                    clearInterval(timer);
                }
            }, 1000)
        },
        // 获取司法局列表
        getJusticeData() {
            this.$axios.get(`/api/v1/display/dept/info?actorId=${this.actorId}&deptId=3684`).then(res => {
                this.justiceOpts = [res.data.data]
                this.filterData.justice = res.data.data.deptId
                this.changeOrgId(this.filterData.justice)
            })
        },
        // 获取司法所列表
        getAreaData() {
            this.$axios.get(`/api/v1/display/dept/list?actorId=${this.actorId}&deptId=3684`).then(res => {
                this.areaOpts = res.data.data
            })
        },
        // 获取人员列表
        getPeopleData(val) {
            this.changeOrgId(val)
            this.changeUserId('')
            this.filterData.name = ''
            this.$axios.get(`/api/v1/display/user/list?actorId=${this.actorId}&deptId=` + val).then(res => {
                this.peopleOpts = res.data.data.list
            })
        },
        // 选择人员
        changeUserData(val) {
            this.changeUserId(val)
        },
        // 全屏
        handleScreen() {
            if (!screenfull.enabled) {
                this.$message("您的浏览器不能全屏");
                return false;
            }
            screenfull.toggle();
            this.$message.success("全屏啦");
        },
        // 退出登录
        handleLoginOut() {
            this.$router.push('/')
        }
    },
    beforeDestroy() {
        clearInterval(this.curTime);
        clearInterval(this.overTime);
    }
}
</script>

<style lang="less">
.vis-homeHeader {
    width: calc(100% - 88px);
    height: 100%;
    padding: 0 44px;
    .homeHeader-left {
        width: 35%;
        height: 150px;
        margin: auto;
        margin-top: 43px;
        float: left;
        .el-row {
            width: 100%;
            height: 100%;
            .el-col {
                height: 100%;
                font-weight: 400;
                line-height: 25px;
                font-size: 50px;
                line-height: 150px;
                font-weight: bold;
                color: #18A1F4;
                text-align: center;
                margin-right: 35px;
                background: url(../../../assets/homePage/signTab.png) no-repeat center center;
                background-size: 100% 100%;
            }
            .el-col:nth-child(1) {
                font-size: 72px;
                text-align: left;
                color: #18A1F4;
                font-family: zcoolqingkehuangyouti;
                background: none;
                margin-right: 0;
            }
            .el-col:nth-child(5) {
                margin-right: 0;
            }
            .activeTab {
                color: #fff;
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
    .homeHeader-right {
        width: 35%;
        height: 150px;
        float: right;
        margin-top: 43px;
        display: flex;
        &_select {
            width: 590px;
            height: 150px;
            background: url(../../../assets/homePage/filter.png) no-repeat center center;
            background-size: 100% 100%;
            margin-right: 78px;
            .el-select {
                width: 100%;
                .el-input__inner {
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: none;
                    height: 150px;
                    font-size: 50px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #18A1F4;
                    line-height: 150px;
                    padding-left: 38px;
                }
                .el-input__suffix {
                    padding-right: 38px;
                }
                .el-input__icon {
                    font-size: 50px;
                    width: 50px;
                    color: #18A1F4;
                }
                .el-input__inner::-webkit-input-placeholder {
                    color: #18A1F4;
                }
            }
        }
        &_time {
            width: 332px;
            margin-right: 78px;
            font-size: 72px;
            font-family: "HYGJM";
            font-weight: 400;
            color: #18A1F4;
            text-align: center;
            .time_tip {
                font-size: 28px;
            }
        }
        &_buttons {
            .el-button {
                width: 96px;
                height: 96px;
                background-size: 38px;
                background-repeat: no-repeat;
                background-position: center center;
                margin-top: 27px;
            }
            .fullScreen {
                background-image: url(../../../assets/homePage/fullScreen.svg);
                margin-right: 33px;
            }
            .loginOut {
                background-image: url(../../../assets/homePage/loginOut.svg);
            }
        }
    }
}
.el-select-dropdown {
    height: 767px;
    background: #000000 !important;
    border: 4px solid #024F7E;
    .el-select-dropdown__wrap {
        max-height: 767px !important;
    }
    .el-select-dropdown__item {
        font-size: 50px;
        color: #fff;
        height: 150px;
        line-height: 150px;
        padding: 0 30px;
    }
    .el-select-dropdown__item:hover,
    .el-select-dropdown__item.hover,
    .selected {
        background: #001D66;
    }
}
</style>