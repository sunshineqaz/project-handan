<template>
    <div class="signResult">
        <div class="signResult_title">
            签到结果统计
        </div>
        <div class="signResult_titleEN">
            CHECK IN RESULT STATISTICS
        </div>
        <div class="signResult_total" @click="handleFilter()">
            查看全部
        </div>
        <ul class="signResult_filters">
            <li v-for="(item, index) in signDict" :key="index" :class="['sign_' + item.status, {'signActive': tempIndex == index + 1}]" @click="handleFilter(index)">
                <div class="filters_key">{{ item.text }}</div>
                <div class="filters_value">{{ item.count }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            signDict: [
                {
                    text: '签到成功',
                    count: '1111111',
                    status: 'success'
                },
                {
                    text: '等待签到',
                    count: '1122222',
                    status: 'wait'
                },
                {
                    text: '签到失败',
                    count: '14444',
                    status: 'failed'
                },
                {
                    text: '过期未签到',
                    count: '1545',
                    status: 'delay'
                }
            ],
            tempIndex: 1, // 默认选中签到成功
        }
    },
    methods: {
        handleFilter(params) {
            console.log(params)
            this.tempIndex = params + 1
        }
    }
}
</script>

<style lang="less" scoped>
.signResult {
    width: 100%;
    height: 750px;
    background: url(../../../assets/homePage/signResult.png) no-repeat center center;
    background-size: 100% 100%;
    &_title {
        width: 370px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 44px;
        font-weight: bold;
        color: #A4C0FF;
        display: inline-block;
        float: left;
        letter-spacing: 5px;
    }
    &_titleEN {
        width: 450px;
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        font-weight: 400;
        color: #2557C7;
        display: inline-block;
        float: left;
        text-align: left;
        margin-left: 20px;
    }
    &_total {
        width: 300px;
        height: 70px;
        background: #071D51;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #18A1F4;
        line-height: 60px;
        background: url(../../../assets/homePage/resultAll.png) no-repeat center center;
        background-size: 100% 100%;
        float: right;
        margin-right: 48px;
        margin-top: 45px;
        cursor: pointer;
    }
    &_filters {
        width: 1075px;
        height: 530px;
        float: left;
        margin-top: 78px;
        display: flex;
        flex-wrap: wrap;
        > li {
            width: 440px;
            height: 172px;
            padding: 34px 40px;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center center;
            .filters_key {
                font-size: 36px;
                font-family: Microsoft YaHei;
                font-weight: bold;
            }
            .filters_value {
                font-size: 80px;
                font-family: zcoolqingkehuangyouti;
                font-weight: 400;
            }
        }
        > li:nth-child(odd) {
            margin-right: 35px;
        }
        .signActive {
            color: #fff;
        }
        .sign_success {
            background-image: url(../../../assets/homePage/success.png);
        }
        .sign_success.signActive {
            background-image: url(../../../assets/homePage/successActive.png);
        }
        .sign_wait {
            background-image: url(../../../assets/homePage/wait.png);
        }
        .sign_wait.signActive {
            background-image: url(../../../assets/homePage/waitActive.png);
        }
        .sign_failed {
            background-image: url(../../../assets/homePage/failed.png);
        }
        .sign_failed.signActive {
            background-image: url(../../../assets/homePage/failedActive.png);
        }
        .sign_delay {
            background-image: url(../../../assets/homePage/delay.png);
        }
        .sign_delay.signActive {
            background-image: url(../../../assets/homePage/delayActive.png);
        }
    }
}
</style>