<template>
    <div :class="[userId ? 'trailTable' : 'TrailTableUser']">
        <div class="trailTable_title" :class="{trailTableZoom: !userId}">
            轨迹描述
        </div>
        <div class="trailTable_titleEN">
            TRAJECTORY DESCRIPTION
        </div>
        <div class="trailTable_filters" v-if="userId">
            <el-table ref="trailTable" :data="tableData">
                <el-table-column label="序号" type="index" width="60"></el-table-column>
                <el-table-column label="定位方式" prop="type" width="100">
                    <template slot-scope="scoped">
                        {{ typeDict[scoped.row.type] }}
                    </template>
                </el-table-column>
                <el-table-column label="定位状态" prop="status" width="100">
                    <template slot-scope="scoped">
                        {{ statusDict[scoped.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column label="定位时间" prop="createTime"></el-table-column>
                <el-table-column label="轨迹描述" prop="addr"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            tableData: [],
            statusDict: {
                1: '成功',
                2: '请假',
                3: '关机',
                4: '定位失败',
                5: '脱区',
                6: '无边界',
                7: '未开户',
                8: '无电话',
                9: '未绑定'
            },
            typeDict: {
                1: 'gps',
                2: '联通基站',
                3: '手环',
                4: '移动基站',
                5: '电信基站'
            }
        }
    },
    computed: {
        ...mapState(['actorId', 'userId', 'isUpdateTime'])
    },
    watch: {
        userId(v) {
            if (v) {
                this.getData()
            }
        },
        isUpdateTime() {
            this.getData()
        }
    },
    methods: {
        // 获取数据
        getData() {
            this.$axios.get(`/api/v1/display/location/path?actorId=${this.actorId}&userId=${this.userId}`).then(res => {
                let data = res.data.data
                let geocoder = new AMap.Geocoder({});
                data.forEach(v => {
                    let latlan = v.lng.toFixed(14) + ',' + v.lat.toFixed(14)
                    geocoder.getAddress(latlan, function (status, result) {
                        if (status === "complete" && result.regeocode) {
                            v.addr = result.regeocode.formattedAddress;
                        } else {
                            console.log("根据经纬度查询地址失败");
                        }
                    })
                })
                setTimeout(() => {
                    this.tableData = data
                }, 3 * 1000)
            })
        }
    }
}
</script>

<style lang="less" scoped>
.TrailTableUser {
    width: 100%;
    height: 4rem;
    background: url(../../../assets/homePage/trail.png) no-repeat center center;
    background-size: 100% 100%;
    .trailTable_title {
        width: 18%;
        height: 100%;
        font-size: 1rem;
        font-weight: bold;
        color: #A4C0FF;
        float: left;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .trailTable_titleEN {
        width: 45%;
        height: 100%;
        font-size: 1rem;
        font-weight: 400;
        color: #2557C7;
        float: left;
        margin-left: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.trailTable {
    width: 100%;
    height: 51%;
    background: url(../../../assets/homePage/trail.png) no-repeat center center;
    background-size: 100% 100%;
    .trailTable_title {
        width: 18%;
        height: 8%;
        font-size: 1rem;
        font-weight: bold;
        color: #A4C0FF;
        display: flex;
        align-items: center;
        justify-content: center;
        float: left;
        margin-top: -3%;
    }
    .trailTable_titleEN {
        width: 45%;
        height: 10%;
        font-size: 1rem;
        font-weight: 400;
        color: #2557C7;
        display: inline-block;
        float: left;
        text-align: left;
        margin-left: 0.5rem;
        margin-top: -1%;
    }
}
.trailTable_filters {
    width: 96%;
    height: 84%;
    overflow: hidden;
    float: left;
    margin-top: 0.2rem;
    margin-left: 1rem;
}
</style>