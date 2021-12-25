<template>
    <div class="abnormalTable">
        <div class="abnormalTable_title">
            异常列表
        </div>
        <div class="abnormalTable_titleEN">
            EXCEPTION LIST
        </div>
        <div class="abnormalTable_filters">
            <el-table :data="tableData" ref="abnormalTable">
                <el-table-column label="序号" type="index" width="200"></el-table-column>
                <el-table-column label="姓名" prop="userName"></el-table-column>
                <el-table-column label="机构" prop="deptName"></el-table-column>
                <el-table-column label="异常信息" prop="exceName"></el-table-column>
                <el-table-column label="异常开始时间" prop="createTime"></el-table-column>
            </el-table>
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
    computed: {
        ...mapState(['actorId', 'orgId']),
    },
    watch: {
        orgId() {
            this.getData()
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        // 获取数据
        getData() {
            this.$axios.get(`/api/v1/display/location/exception/dept?actorId=${this.actorId}&deptId=${this.orgId}`).then(res => {
                let data = res.data.data
                this.tableData = data
            })
        }
    }
}
</script>

<style lang="less" scoped>
.abnormalTable {
    width: 100%;
    height: 798px;
    background: url(../../../assets/homePage/abnormal.png) no-repeat center center;
    background-size: 100% 100%;
    margin-bottom: 30px;
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
        height: 678px;
        padding: 0;
        overflow: hidden;
        float: left;
        margin-top: 40px;
        margin-left: 50px;
    }
}
</style>