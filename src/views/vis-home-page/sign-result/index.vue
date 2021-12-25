<template>
    <div class="signList">
        <div class="signList_title">
            签到结果
        </div>
        <div class="signList_titleEN">
            CHECK IN RESULTS
        </div>
        <div class="scroll_box" id="scroll_box">
            <ul class="signList_filters" id="signList_filters">
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
            <ul class="signList_filters_copy" id="signList_filters_copy"></ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
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
    mounted() {
        this.getData()
        this.scrollAnimation()
    },
    computed: {
        ...mapState(['actorId', 'orgId', 'userId']),
    },
    watch: {
        orgId() {
            this.getData()
        },
        userId(id) {
            if (id) {
                this.getData()
            }
        }
    },
    methods: {
        // 滚动
        scrollAnimation() {
            let ul1 = document.getElementById("signList_filters");
            let ul2 = document.getElementById("signList_filters_copy");
            let ulbox = document.getElementById("scroll_box");
            ul2.innerHTML = ul1.innerHTML;
            ulbox.scrollTop = 0; // 开始无滚动时设为0
            function Marquee(){ 
                if(ulbox.scrollTop >= ul1.offsetHeight){
                    ulbox.scrollTop=0; 
                }
                else{ 
                    ulbox.scrollTop = ulbox.scrollTop + 1;
                } 
            }
            setInterval(Marquee, 40)
        },
        // 获取数据
        getData() {
            let baseUrl = '/api/v1/display/check/'
            let extendUrl = this.userId ? `user?actorId=${this.actorId}&userId=${this.userId}` : `dept?actorId=${this.actorId}&deptId=${this.orgId}`
            this.$axios.get(baseUrl + extendUrl).then(res => {
                let data = res.data.data
            })
        },
    }
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
    .scroll_box {
        width: 1896px;
        height: 840px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        overflow: hidden;
    }
    &_filters, &_filters_copy {
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