 <template>
    <div class="reg-container">
        <el-card class="box-card" v-loading="loading">
            <el-form
                    :label-width="variable_labelWidth_pc(120, 120, 120, 120, 80)"
                    class="reg-form"
                    status-icon
                    auto-complete="off"
                    :model="regForm"
                    ref="regForm"
                    label-position="left"
                    :rules="rules"
            >
                <h3 class="title">{{__('用户注册')}}</h3>
                <el-form-item :label="__('用户名')" prop="username">
                    <el-input :placeholder="__('字母开头数字,下划线组合6-16字符')" v-model="regForm.username"></el-input>
                </el-form-item>
                <el-form-item :label="__('密码')" prop="password">
                    <el-input auto-complete="new-password"
                            type="password"
                            :placeholder="__('字母数字下划线组合6-16个字符')"
                            v-model="regForm.password"
                    ></el-input>
                </el-form-item>

                <el-form-item :label="__('确认密码')" prop="checkPass">
                    <el-input
                            type="password"
                            :placeholder="__('请输入确认密码')"
                            auto-complete="new-password"
                            v-model="regForm.checkPass"
                    ></el-input>
                </el-form-item>
                <el-form-item v-if="bindcode" :label="__('邀请码')" prop="regCode" required>
                    <el-input :readonly="true" :value="regForm.regCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item v-else :label="__('邀请码')" prop="regCode" :required="app_config.reg_public_disabled">
                    <el-input :readonly="!!$route.query.code" :placeholder="__('请输入邀请码')" v-model="regForm.regCode"></el-input>
                </el-form-item>
                <el-form-item v-if="app_config.reg_real_name" :label="__('真实姓名')" prop="realname">
                    <el-input :placeholder="__('请输入真实姓名')" v-model="regForm.realname"></el-input>
                </el-form-item>
                <el-form-item v-if="enabled_captcha" :label="__('验证码')" prop="captcha">
                    <el-input
                            type="text"
                            auto-complete="off"
                            name="captcha"
                            :placeholder="__('验证码')"
                            v-model="regForm.captcha"
                            style="width: 54%;" />
                    <img
                            :src="captchaUrl"
                            :title="__('点击刷新')"
                            @click="refreshCaptcha"
                            style="cursor: pointer;vertical-align: middle;" />
                </el-form-item>
                <el-button
                        type="primary"
                        style="width:100%;margin-bottom:30px;margin-top: 20px"
                        :loading="isLoading"
                        @click.native.prevent="onSubmit()">{{__('注册')}}
                </el-button>
                <div class="tips">
                    <a href="javascript:;" @click.prevent="$root.openKefu">{{__('在线客服')}}</a>
                    <router-link to="/login">{{__('返回登录')}}</router-link>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { lang_mixin, variable_labelWidth_pc } from '@/assets/lang/lang';
    import { reg } from '@/api/user';
    import {get_regCode} from '@/assets/js/common.js';

    export default {
        mixins:[lang_mixin, variable_labelWidth_pc],
		name:'domain',
        inject:['_get_captcha'],
        data() {
            let v_username = (rule, value, callback) => {
                if (!/^[a-zA-Z][a-zA-Z0-9_]{5,15}$/.test(value)) {
                    callback(new Error(this.__('用户名以字母开头长度在 6 到 16 个字符')));
                } else {
                    callback();
                }
            };
            let v_password = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
                    callback(new Error(this.__('密码由字母数字下划线组成长度在 6 到 16 个字符')));
                } else {
                    callback();
                }
            };
            let v_checkPass = (rule, value, callback) => {
                if (value !== this.regForm.password) {
                    callback(new Error(this.__('确认密码不相同')));
                } else {
                    callback();
                }
            };
            let v_regCode = (rule, value, callback) => {
                if ((this.app_config.reg_public_disabled || this.bindcode) && value === '') {
                    callback(new Error(this.__('请输入邀请码')));
                } else {
                    callback();
                }
            };
            let v_realname = (rule, value, callback) => {
                if (!/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(value)) {
                    callback(new Error(this.__('真实姓名必须是中文')));
                } else {
                    callback();
                }
            };
            return {
                enabled_captcha:false,
                loading:false,
                isLoading: false,
                captchaUrl: this._get_captcha(),
                regForm: {
                    username: '',
                    password: '',
                    checkPass: '',
                    captcha: '',
                    regCode: '',
                    realname:''
                },
                bindcode:false,
                rules: {
                    username: [
                        {required: true,message: this.__('请输入用户名'),trigger: 'blur'},
                        {validator: v_username, trigger: 'blur' }
                    ],
                    password: [
                        {required: true,message: this.__('请输入密码'),trigger: 'blur'},
                        {validator: v_password, trigger: 'blur' }
                    ],
                    checkPass: [
                        {required: true, message: this.__('请输入确认密码'),trigger: 'blur'},
                        {validator: v_checkPass, trigger: 'blur' }
                    ],
                    captcha:[
                        {required: true, message: this.__('请输入验证码'),trigger: 'blur'},
                    ],
                    realname:[
                        {required: true, message: this.__('请输入真实姓名'),trigger: 'blur'},
                        {validator: v_realname, trigger: 'blur' }
                    ],
                    regCode:[
                        {validator: v_regCode, trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
			 ...MAPGETTERS(['app_config','username']),
		},
        methods: {
            ...MAPMUTATIONS(['SET_USER_SETTING']),
            refreshCaptcha() {
                this.captchaUrl = this._get_captcha();
                this.regForm.captcha = '';
            },
            onSubmit() {
                this.$refs['regForm'].validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        reg(this.regForm).then(res => {
                            this.isLoading = false;
                            if (res.data.status == 0) {
                                window.localStorage.setItem('userInfo', JSON.stringify(res.data.data));
                                //必须优先设置token
                                this.$store.commit('SET_TOKEN', res.data.data.token);
                                this.$store.commit('SET_ID', res.data.data.info.id);
                                this.$store.commit('SET_USERNAME', res.data.data.info.username);
                                this.$store.commit('SET_NICKNAME', res.data.data.info.usernick);
                                this.$store.commit('SET_AVATAR',res.data.data.info.avatar);
                                this.$store.commit('SET_BALANCE', res.data.data.info.balance);
                                this.$store.commit('SET_LEVEL', res.data.data.info.level);
                                this.$store.commit('SET_USERTYPE', res.data.data.info.user_type);
                                this.$store.commit('SET_USER_GROUP', res.data.data.info.user_group_id);
                                this.$alert(this.__('恭喜您注册成功！'), this.__('提示'), {type: 'success'}).then(()=>{
                                    this.$router.push('/');
                                });
                                this.SET_USER_SETTING([{won_msg:true,sound:true,share_bet:true,auto_transfer:true},true]);
                            } else {
                                this.refreshCaptcha();
                                this.$alert(res.data.msg, this.__('提示'), {
                                    confirmButtonText: this.__('确定'),
                                    type: 'error'
                                });
                                if(res.data.status === 100) this.enabled_captcha = true;
                            }
                        }).catch(err => {
                            this.isLoading = false;
                            this.refreshCaptcha();
                        });
                    }else{
                        return false;
                    }
                });

            }
        },
        async created() {
            if(this.username){
                this.$router.push('/');
            }else{
                // this.$store.commit('SET_APPBLUE', false);
                let code = this.$route.query.code;
                if(code) this.regForm.regCode = code;
                let _code = await get_regCode(()=>{this.loading = true},()=>{this.loading = false});
                if(_code && _code.length > 0){
                    this.bindcode = true;
                    this.regForm.regCode = _code;
                }
            }
        },
        beforeRouteEnter(to, from, next){
            if(window.Router.app.$store.getters.app_config.login_mode !== 1){
                window.Router.app.$router.push({
                    name: 'login',
                    params: {
                        code: window.Router.app.$route.query.code || null
                    }
                }); 
            }else{
                next()
            }
        }
    };
</script>

<style lang="scss">
    .reg-container {
        min-width: 1200px;
        background: url(~_assets_d/images/loginbg.jpg) no-repeat fixed;
        background-size: 100% 100%;
        overflow: hidden;
        height: 100%;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        .box-card {
            width: 420px;
            margin: 0px auto 60px;
            padding: 0 20px;
            margin-top: 10px;
            .reg-form {
                label {
                    text-align: right;
					color: $text_color;
                }
            }
        }

        .tips {
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
            a {
                float: right;
                color: $text_color;
                margin-left: 10px;
            }
        }
        .title {
            font-size: 26px;
            color:$text_color;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
        .forget-password-dialog {
            .el-form-item {
                background: none;
            }
            input {
                background: none;
                border: 1px solid #d5d6d9;
                -webkit-appearance: none;
                border-radius: 4px;
                padding: 6px 9px;
                font-size: 16px;
                color: $text_color;
                height: 47px;
            }
        }
        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $text_color;
            cursor: pointer;
        }
        .thirdparty-button {
            position: absolute;
            right: 35px;
            bottom: 28px;
        }
    }
</style>
