<template>
    <div class="login">
        <div class="login-header">
            邯山区司法局指挥中心
        </div>
        <div class="login-form">
            <el-form :model="loginForm" ref="loginForm" :rules="loginRules">
                <el-form-item prop="account">
                    <el-input v-model="loginForm.account" placeholder="输入登录账号"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input v-model="loginForm.pwd" type="password" placeholder="输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="输入验证码" v-model="captchaInput" @blur="verifyCaptcha" style="width: 50%; float: left;"></el-input>
                    <div @click="changeCaptcha">
                        <img :src="captchaData.b64" alt="">
                    </div>
                </el-form-item>
                <el-button type="primary" @click="goLogin()">登录</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import Base64  from 'base-64';
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            loginForm: {
                account: '',
                pwd: '',
                key: '',
                answer: ''
            },
            loginRules: {
                account: {
                    required: true, message: '请输入用户名', trigger: 'blur'
                },
                pwd: {
                    required: true, message: '请输入密码', trigger: 'blur'
                }
            },
            captchaData: {}, // 验证码
            captchaInput: ''
        }
    },
    mounted() {
        this.getCaptcha()
    },
    methods: {
        ...mapActions(['changeActorId', 'changeDeptId']),
        changeCaptcha() {
            this.getCaptcha()
        },
        // 获取验证码
        getCaptcha() {
            this.$axios.post('/api/v1/display/captcha/new', {
                length: 4,
                width: 270,
                height: 60,
                type: 0,
                fonts: [
                    0
                ],
                showLineOptions: [
                    0
                ],
                noiseCount: 0,
                bgColor: {
                    r: 10,
                    g: 0,
                    b: 0,
                    a: 100
                }
            }).then(res => {
                this.captchaData = res.data.data
            })
        },
        verifyCaptcha() {
            this.$axios.post('/api/v1/display/captcha/verify', {
                key: this.captchaData.key,
                answer: this.captchaInput
            }).then(res => {
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '验证码错误'
                })
                return
            })
        },
        goLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    let params = {}
                    params.account = Base64.encode(this.loginForm.account)
                    params.pwd = Base64.encode(this.loginForm.pwd)
                    params.key = this.captchaData.key
                    params.answer = this.captchaInput
                    this.$axios.post('/api/v1/display/staff/login', params).then(res => {
                        if (res.data.code == '404') {
                            this.$message({
                                type: 'error',
                                message: '用户名密码错误'
                            })
                            return
                        } else {
                            this.changeActorId(res.data.data.actorId)
                            this.changeDeptId(res.data.data.deptId)
                            this.$router.push('homePage')
                        }
                    })
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
        background: url('../../assets/login/bg.png') no-repeat center center;
        background-size: 100% 100%;
        &-header {
            width: 100%;
            height: 10%;
            background: url(../../assets/homePage/header.png) no-repeat center center;
            background-size: 100% 100%;
            font-size: 2.2rem;
            font-weight: bold;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &-form{
            width: 30%;
            height: 30%;
            margin: 200px auto;
            .el-form-item {
                height: 3.7rem;
                line-height: 3.7rem;
                .el-form-item__content {
                    .el-input__inner {
                        height: 3.7rem;
                        line-height: 3.7rem;
                        font-size: 1.8rem;
                    }
                }
            }
            .el-button {
                width: 100%;
                height: 3.7rem;
                font-size: 1.8rem;
            }
        }
    }
</style>