<template>
    <div class="trailTable">
        <div class="trailTable_title">
            轨迹描述
        </div>
        <div class="trailTable_titleEN">
            TRAJECTORY DESCRIPTION
        </div>
        <div class="trailTable_filters">
            <el-table ref="trailTable" :data="tableData">
                <el-table-column label="序号" type="index" width="200"></el-table-column>
                <el-table-column label="定位方式"></el-table-column>
                <el-table-column label="定位状态" prop="status">
                    <template slot-scope="scoped">
                        {{ statusDict[scoped.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column label="定位时间" prop="createTime"></el-table-column>
                <el-table-column label="轨迹描述"></el-table-column>
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
                this.tableData = data
            })
        }
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
}
</style>