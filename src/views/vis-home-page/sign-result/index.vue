<template>
    <div class="signList">
        <div class="signList_title">
            签到结果
        </div>
        <div class="signList_titleEN">
            CHECK IN RESULTS
        </div>
        <ul class="signList_filters">
            <li v-for="(item, index) in signList" :key="index">
                <div class="filters_photo">
                    <img src="" alt="">
                </div>
                <div class="filters_contain">
                    <div class="filters_contain_name">{{ item.name }} | {{ item.tel }}</div>
                    <div class="filters_contain_detail">
                        机构：{{ item.part }} &nbsp;&nbsp; 签到时间：{{ item.time }}
                        <br>
                        签到地址： {{ item.addr }}
                    </div>
                    <div class="filters_contain_status" :class="'sign_' + item.status">
                        {{ item.text }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            signList: [
                {
                    name: '张三',
                    tel: '15465897532',
                    part: 'xxxxxsifasuo',
                    time: '2125458965523',
                    addr: '河北省',
                    text: '签到成功',
                    status: 'success'
                },
                {
                    name: '张三111',
                    tel: '15465897532',
                    part: 'xxxxxsifasuo',
                    time: '2125458965523',
                    addr: '河北省',
                    text: '等待签到',
                    status: 'wait'
                },
                {
                    name: '张三222',
                    tel: '15465897532',
                    part: 'xxxxxsifasuo',
                    time: '2125458965523',
                    addr: '河北省',
                    text: '签到失败',
                    status: 'failed'
                },
                {
                    name: '张三33333',
                    tel: '15465897532',
                    part: 'xxxxxsifasuo',
                    time: '2125458965523',
                    addr: '河北省',
                    text: '过期未签到',
                    status: 'delay'
                }
            ],
            tempIndex: 1, // 默认选中签到成功
        }
    },
}
</script>

<style lang="less" scoped>
.signList {
    width: 100%;
    height: 1038px;
    background: url(../../../assets/homePage/signList.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
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
    &_filters {
        width: 1896px;
        height: 840px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        overflow: hidden;
        overflow-y: auto;
        > li {
            width: 100%;
            height: 245px;
            margin-bottom: 20px;
            position: relative;
            .filters_photo {
                width: 245px;
                height: 245px;
                margin-right: 32px;
                background: url(../../../assets/homePage/photo.png) no-repeat center center;
                background-size: 100% 100%;
                float: left;
                > img {
                    width: 219px;
                    height: 219px;
                    margin: 13px auto;
                }
            }
            .filters_contain {
                font-size: 36px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                background: url(../../../assets/homePage/signContain.png) no-repeat center center;
                background-size: 100% 100%;
                width: calc(100% - 381px);
                height: calc(100% - 64px);
                float: left;
                padding: 32px 52px 32px 52px;
                text-align: left;
                &_name {
                    font-size: 50px;
                    font-weight: bold;
                    margin-bottom: 30px;
                }
                &_status {
                    width: 294px;
                    height: 147px;
                    line-height: 147px;
                    padding-left: 81px;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: center center;
                    position: absolute;
                    top: 50%;
                    right: 68px;
                    transform: translateY(-50%);
                }
                .sign_success {
                    background-image: url('../../../assets/homePage/successStatus.png');
                }
                .sign_wait {
                    background-image: url('../../../assets/homePage/waitStatus.png');
                }
                .sign_failed {
                    background-image: url('../../../assets/homePage/failedStatus.png');
                }
                .sign_delay {
                    background-image: url('../../../assets/homePage/outStatus.png');
                }
            }
        }
    }
}
</style>