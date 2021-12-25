<template>
    <div class="login">
        <div class="login-header">
            邯郸区司法局指挥中心
        </div>
        <div class="login-form">
            <el-form :model="loginForm" ref="loginForm" :rules="loginRules">
                <el-form-item prop="account">
                    <el-input v-model="loginForm.account" placeholder="输入登录账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="输入验证码" style="width: 50%; float: left;"></el-input>
                    <div>{{ captchaData }}</div>
                </el-form-item>
                <el-button type="primary" @click="goLogin()">登录</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                account: '',
                password: '',
                key: '',
                answer: ''
            },
            loginRules: {
                account: {
                    required: true, message: '请输入用户名', trigger: 'blur'
                },
                password: {
                    required: true, message: '请输入密码', trigger: 'blur'
                }
            },
            captchaData: '' // 验证码
        }
    },
    mounted() {
        this.getCaptcha()
    },
    methods: {
        // 获取验证码
        getCaptcha() {
            this.$axios.post('/api/v1/display/captcha/new', {
                length: 4,
                heigh: 150,
                weight: 300,
            }).then(res => {
                console.log(res, 'res=============')
                this.captchaData = res.data.data
            })
        },
        goLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.$axios.post('/api/v1/display/staff/login', this.loginForm).then(res => {
                        console.log(res, 'res==============')
                    })
                    this.$router.push('homePage')
                }
            })
        }
    }
}
</script>

<style lang="less">
    .login {
        width: 100%;
        height: 100%;
        background: url(../../assets/login/bg.png) no-repeat center center;
        background-size: 100%;
        color: #fff;
        &-header {
            width: 100%;
            height: 296px;
            background: url(../../assets/homePage/header.png) no-repeat center center;
            background-size: 100% 100%;
            font-size: 140px;
            font-weight: bold;
            letter-spacing: 15px;
        }
        &-form{
            width: 35%;
            height: 150px;
            margin: 200px auto;
            .el-form-item {
                height: 100px;
                line-height: 100px;
                .el-form-item__content {
                    .el-input__inner {
                        height: 100px;
                        line-height: 100px;
                        font-size: 40px;
                    }
                }
            }
            .el-button {
                width: 100%;
                height: 100px;
                font-size: 40px;
            }
        }
    }
</style>