<template>
    <div class="trailTable">
        <div class="trailTable_title">
            轨迹描述
        </div>
        <div class="trailTable_titleEN">
            TRAJECTORY DESCRIPTION
        </div>
        <div class="trailTable_filters">
            <el-table ref="trailTable">
                <el-table-column label="序号"></el-table-column>
                <el-table-column label="定位方式"></el-table-column>
                <el-table-column label="定位状态"></el-table-column>
                <el-table-column label="定位时间"></el-table-column>
                <el-table-column label="轨迹描述"></el-table-column>
            </el-table>
        </div>
        <div class="trailTable_detail_dialog">
            <div class="portrait_container">
                <div class="portrait"></div>
            </div>
            <div class="left_content">
                <div class="left_content_top">
                    <div class="left_content_top_container">
                        <div class="name">张三</div>
                        <ul>
                            <li>
                                <span class="title">机构：</span>
                                <span class="info">XXX司法所</span>
                            </li>
                            <li>
                                <span class="title">证件号码：</span>
                                <span class="info">130628199009098899</span>
                            </li>
                            <li>
                                <span class="title">固定居住地：</span>
                                <span class="info">河北省邯郸市xx区</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="left_content_bottom">
                    <div class="left_content_bottom_container">
                        <div class="type_info">
                            <span class="type">矫正类别</span>
                            <span class="gz">管制</span>
                            <span class="fz_type">犯罪类型</span>
                        </div>
                        <ul>
                            <li>
                                <span>最后一次签到结果：</span>
                                <span>签到成功</span>
                            </li>
                            <li>
                                <span>最后一次签到地址：</span>
                                <span>河北省邯郸市XX区河北省邯郸市XX区河北省邯郸市XX区</span>
                            </li>
                            <li>
                                <span>矫正开始时间：</span>
                                <span>2021-11-20</span>
                            </li>
                            <li>
                                <span>矫正结束时间：</span>
                                <span>2021-11-30</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="right_content">
                <div class="right_content_container">
                    <ul>
                        <li>
                            <span>请假状态：</span>
                            <span>签到成功</span>
                        </li>
                        <li>
                            <span>请假目的：</span>
                            <span>河北省邯郸市XX区河北省邯郸市XX区河北省邯郸市XX区</span>
                        </li>
                        <li>
                            <span>定位电话：</span>
                            <span>2021-11-20</span>
                        </li>
                        <li>
                            <span>定位间隔：</span>
                            <span>2021-11-30</span>
                        </li>
                        <li>
                            <span>最后一次定位时间：</span>
                            <span>2021-11-20</span>
                        </li>
                        <li>
                            <span>定位地址：</span>
                            <span>2021-11-30</span>
                        </li>
                    </ul>
                    <div class="track_path"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            tableData: []
        }
    },
    mounted() {
        this.getData()
    },
    computed: {
        ...mapState(['actorId', 'userId'])
    },
    methods: {
        // 获取数据
        getData() {
            this.$axios.get(`/api/v1/display/location/path?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                this.tableData = data
            })
        },
    }
}
</script>

<style lang="less" scoped>
.trailTable {
    width: 100%;
    height: 958px;
    background: url(../../../assets/homePage/trail.png) no-repeat center center;
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
    &_filters {
        width: 1900px;
        height: 828px;
        padding: 0;
        overflow: hidden;
        float: left;
        margin-top: 40px;
        margin-left: 50px;
    }
    &_detail_dialog {
        position: absolute;
        width: 2672px;
        height: auto;
        top: 730px;
        left: 50%;
        margin-left: -1336px;
        border: 1px solid #f00;
        ul {
            margin: 0;
            padding: 0;
            li {
                line-height: 60px;
            }
        }
        .portrait_container {
            display: inline-block;
            float: left;
            width: 350px;
            height: 400px;
            background: rgba(36, 73, 159, 0.8);
            border-top: 4px solid #2B69F8;
            border-bottom: 4px solid #2B69F8;
            .portrait {
                width: 350px;
                height: 350px;
                margin-top: 25px;
                border: 1px solid #f00;
            }
        }
        .left_content {
            display: inline-block;
            float: left;
            width: 1000px;
            height: 100%;
            margin-left: 31px;
            &_top {
                width: 100%;
                height: 400px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                background: rgba(36, 73, 159, 0.8);
                border-top: 4px solid #2B69F8;
                border-bottom: 4px solid #2B69F8;
                &_container {
                    height: 350px;
                    margin-top: 25px;
                    padding-left: 37px;
                    padding-right: 37px;
                    background: #021F3F;
                    .name {
                        font-size: 50px;
                        margin-bottom: 60px;
                        padding-top: 30px;
                    }
                }
            }
            &_bottom {
                width: 100%;
                height: 560px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                margin-top: 72px;
                background: rgba(36, 73, 159, 0.8);
                border-top: 4px solid #2B69F8;
                border-bottom: 4px solid #2B69F8;
                &_container {
                    height: 500px;
                    margin-top: 30px;
                    padding-left: 37px;
                    padding-right: 37px;
                    background: #021F3F;
                    .type_info {
                        padding-top: 27px;
                        margin-bottom: 62px;
                        span {
                            display: inline-block;
                        }
                        .type {
                            width: 200px;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #FFFF59;
                            text-align: center;
                            margin-right: 26px;
                            background: url(../../../assets/map/type_1.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .gz {
                            width: 200px;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #FF7E15;
                            text-align: center;
                            margin-right: 26px;
                            background: url(../../../assets/map/type_2.png) no-repeat;
                            background-size: 100% 100%;
                        }
                        .fz_type {
                            width: 200px;
                            height: 80px;
                            line-height: 80px;
                            font-size: 36px;
                            color: #2CFFC3;
                            text-align: center;
                            margin-right: 26px;
                            background: url(../../../assets/map/type_3.png) no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }
        }
        .right_content {
            display: inline-block;
            float: left;
            width: 1000px;
            height: 1032px;
            margin-left: 291px;
            background: rgba(36, 73, 159, 0.8);
            border-top: 4px solid #2B69F8;
            border-bottom: 4px solid #2B69F8;
            &_container {
                height: 972px;
                font-size: 36px;
                color: #fff;
                text-align: left;
                margin-top: 30px;
                padding-left: 37px;
                padding-right: 37px;
                background: #021F3F;
                ul {
                    padding-top: 32px;
                }
                .track_path {
                    width: 100%;
                    height: 480px;
                    border: 2px solid #2B69F8;
                    border-radius: 10px;
                    margin-top: 12px;
                }
            }
        }
    }
}
</style>