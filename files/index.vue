<template>
    <div class="page-container-user-index">
        <el-row class="security-header">
            <el-col :span="6" class="point">
                <div class="avatar">
                    <div class="circular--portrait"><img v-if="init.username" :src="$publicPath+'images/avatar/' + init.avatar + '.jpg'" /></div>
                    <br />
                    <el-button size="small" round type="primary"  @click="init.avatar_visible = true"
                        >{{__('更换头像')}}</el-button
                    >
                </div>
            </el-col>
            <el-col :span="18" class="infos">
                <el-row class="info-list">
                    <el-col :span="app_config.is_zh? 2 : 4">{{__('登陆帐号')}}</el-col>
                    <el-col :span="app_config.is_zh? 6 : 8">{{ init.username }} <span class="user_vip" @click="$router.push('/user/memberlevel')"><i>{{vip.prefix}}{{vip.level}}</i></span></el-col>
                    <el-col :span="app_config.is_zh? 2 : 4">{{__('会员类型')}}</el-col>
                    <el-col :span="app_config.is_zh? 6 : 8">{{ init.user_type }}</el-col>
                </el-row>
                <el-row class="info-list">
                    <el-col :span="app_config.is_zh? 2 : 4">{{__('昵称')}}</el-col>
                    <el-col :span="app_config.is_zh? 6 : 8">
                        {{ init.usernick }}
                        <span><a href="javascript:;" @click="setNickName.visible = true">[{{__('修改')}}]</a></span>
                        </el-col>
                    <el-col :span="app_config.is_zh? 2 : 4">{{__('可用余额')}}</el-col>
                    <el-col :span="app_config.is_zh? 6 : 8"><span class="usablebalance" @click="$eventBus.$emit('ui_toggleUserFunds')">{{ init.balance }}</span></el-col>
                </el-row>
                <el-row class="info-list" style="margin-bottom: 20px">
                    <el-col :span="app_config.is_zh? 2 : 4">{{__('预留信息')}}</el-col>
                    <el-col :span="app_config.is_zh? 6 : 8"><em style="white-space: pre-wrap;">{{ init.reserved_info }} </em></el-col>
                    <el-col v-if="!!init.realname" :span="app_config.is_zh? 2 : 4">{{__('真实姓名')}}</el-col>
                    <el-col v-if="!!init.realname" :span="app_config.is_zh? 6 : 8"><em style="white-space: pre-wrap;">{{ init.realname }} </em></el-col>
                </el-row>
                <template v-if="init.safety_level">
                    <el-rate
                            v-model="init.star"
                            disabled
                            :colors="[null, null, null]"
                            score-template="{value}"
                    >
                    </el-rate>
                    <p class="title">
                        <span v-if="init.star < 2">{{__('您的账号安全级别为低，非常危险请提升安全等级！')}}</span>
                        <span v-else-if="init.star >= 2 && init.star < 4" style="color:#F7BA2A ;">{{__('您的账号安全级别为中，还有提升空间！')}}</span>
                        <span v-else-if="init.star>=4" style="color: #67c23a;">{{__('您的账号已经非常安全！')}}</span>
                    </p>
                </template>
                <p class="tip">
                    {{__('上次登录：')}}{{ init.last_time }}，[{{ init.last_ip }}] {{__('不是本人登录？')}}
                    <el-button type="text" @click="setPassword.visible = true">{{__('修改密码')}}</el-button>
                </p>
            </el-col>
        </el-row>
        <div class="security-content">
            <el-card>
                <div class="infos">
                    <i v-if="is_setpwd" class="el-icon-success"></i>
                    <i v-else class="el-icon-warning"></i>
                    <div class="title">{{is_setpwd ? __('修改登录密码') : __('设置登录密码')}}</div>
                    <div class="help">{{__('建议您使用字母和数字的组合、混合大小写、在组合中加入下划线等符号。')}}</div>
                    <div class="actions"><a @click="setPassword.visible = true">{{is_setpwd ?__('修改登录密码'): __('设置登录密码')}}</a></div>
                </div>
            </el-card>
            <el-card :class="{ red: !init.security_password }">
                <div class="infos icon1">
                    <i v-if="init.security_password" class="el-icon-success"></i>
                    <i v-else class="el-icon-warning"></i>
                    <div class="title" v-if="init.security_password">{{__('已设置资金密码')}}</div>
                    <div class="title" v-else>{{__('未设置资金密码')}}</div>
                    <div class="help">
                        {{__('在进行银行卡绑定，转账等资金操作时需要进行资金密码确认，以提高您的资金安全性。')}}
                    </div>
                    <div class="actions">
                        <a @click="setSecurityPassword.visible = true" v-if="init.security_password"
                        >{{__('修改资金密码')}}</a
                        >
                        <a @click="setSecurityPassword.visible = true" v-else>{{__('设置资金密码')}}</a>
                    </div>
                </div>
            </el-card>
            <el-card :class="{ red: !init.security_question }">
                <div class="infos icon2">
                    <i v-if="init.security_question" class="el-icon-success"></i>
                    <i v-else class="el-icon-warning"></i>
                    <div class="title" v-if="init.security_question">{{__('密保问题')}}</div>
                    <div class="title" v-else>{{__('未设置密保问题')}}</div>
                    <div class="help">{{__('为了提升您的帐户安全性，请及时绑定密保问题。')}}</div>
                    <div class="actions" v-if="!init.security_question"><a @click="getQuestion">{{__('设置密保')}}</a></div>
                </div>
            </el-card>
            <el-card :class="{ red: !init.user_bank }">
                <div class="infos icon3">
                    <i v-if="init.user_bank" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                    <div class="title" v-if="init.user_bank">{{__('银行卡')}}</div>
                    <div class="title" v-else>{{__('未绑定银行卡')}}</div>
                    <div class="help">{{__('为保证您的资金顺利到账，请绑定与取款人对应的账号和姓名等信息。')}}</div>
                    <div class="actions">
                        <a @click="getAddUserBank">{{__('添加银行卡')}}</a>
                        <router-link v-if="init.user_bank" to="/user/bank">{{__('管理')}}({{ init.user_bank }})</router-link>
                    </div>
                </div>
            </el-card>
            <el-card :class="{ red: init.reserved_info == '' }">
                <div class="infos icon5">
                    <i v-if="init.reserved_info" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                    <div class="title" v-if="init.reserved_info">{{__('预留信息')}}</div>
                    <div class="title" v-else>{{__('未设置预留信息')}}</div>
                    <div class="help">{{__('登录后立即查看预留信息，防止钓鱼网站恶意盗取！')}}</div>
                    <div class="actions">
                        <a @click="setReservedInfo.visible = true" v-if="init.reserved_info">{{__('修改预留信息')}}</a>
                        <a @click="setReservedInfo.visible = true" v-else>{{__('设置预留信息')}}</a>
                    </div>
                </div>
            </el-card>
            <el-card v-if="init.google_bind" :class="{ red: !init.google_key }">
                <div class="infos  icon6">
                    <i v-if="init.google_key" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                    <div class="title" v-if="init.google_key">{{__('已绑定谷歌登陆器')}}</div>
                    <div class="title" v-else>{{__('未设绑定谷歌登录器')}}</div>
                    <div class="help">
                        {{__('设置动态密码提款时为必填项，请妥善保管好您的动态验证秘钥，如遗忘请联系客服重置！')}}
                    </div>
                    <div class="actions" v-if="!init.google_key">
                        <a @click="setGoogleKey.visible = true">{{__('绑定登陆器')}}</a>
                    </div>
                </div>
            </el-card>
            <el-card :class="{ red: !init.telephone }">
                <div class="infos icon10">
                    <i v-if="init.telephone" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                    <div class="title" v-if="init.telephone">{{__('已绑定手机')}}</div>
                    <div class="title" v-else>{{__('未绑定手机')}}</div>
                    <div class="help">{{__('绑定手机可增加账号安全级别，也可确保手机正常情况下取回资金密码。')}}</div>
                    <div class="actions">
                        <a v-if="!init.telephone" @click="setTelephone.visible = true">{{__('立即绑定')}}</a>
                        <a v-else>{{ init.telephone }}</a>
                    </div>
                </div>
            </el-card>
            <template v-if="init.information_bind">
                <el-card :class="{ red: !init.email }">
                    <div class="infos icon7">
                        <i v-if="init.email" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                        <div class="title" v-if="init.email">{{__('已绑定邮箱')}}</div>
                        <div class="title" v-else>{{__('未绑定邮箱')}}</div>
                        <div class="help">{{__('绑定邮箱可增加账号安全级别，也可确保邮箱正常情况下取回资金密码。')}}</div>
                        <div class="actions">
                            <a v-if="!init.email" @click="setEmail.visible = true">{{__('立即绑定')}}</a>
                            <a v-else>{{ init.email }}</a>
                        </div>
                    </div>
                </el-card>
                <el-card :class="{ red: init.weixin == '' }">
                    <div class="infos icon8">
                        <i v-if="init.weixin" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                        <div class="title" v-if="init.weixin">{{__('已绑定微信')}}</div>
                        <div class="title" v-else>{{__('未绑定微信')}}</div>
                        <div class="help">{{__('绑定微信账号可增加账号安全级别，也可确保微信账号正常情况下取回资金密码。')}}</div>
                        <div class="actions">
                            <a @click="setWeixin.visible = true" v-if="!init.weixin">{{__('立即绑定')}}</a>
                            <a v-else>{{ init.weixin }}</a>
                        </div>
                    </div>
                </el-card>
                <el-card :class="{ red: !init.qq }">
                    <div class="infos icon9">
                        <i v-if="init.qq" class="el-icon-success"></i> <i v-else class="el-icon-warning"></i>
                        <div class="title" v-if="init.qq">{{__('已绑定QQ账号')}}</div>
                        <div class="title" v-else>{{__('未设绑定QQ账号')}}</div>
                        <div class="help">{{__('绑定QQ号码可增加账号安全级别，也可确保QQ号码正常情况下取回资金密码。')}}</div>
                        <div class="actions">
                            <a v-if="!init.qq" @click="setQQ.visible = true">{{__('立即绑定')}}</a> <a v-else>{{ init.qq }}</a>
                        </div>
                    </div>
                </el-card>
            </template>
            <el-card>
                <div class="infos icon11">
                    <div class="title">{{__('个人设置')}}</div>
                    <div class="help setting">
                        <span><el-checkbox @change="saveSetting()" v-model="user_config.won_msg">{{__('中奖提示')}}</el-checkbox></span>
                        <span><el-checkbox @change="saveSetting()" v-model="user_config.sound">{{__('声音')}}</el-checkbox></span>
                        <span v-if="app_config.auto_transfer_switch == 1"><el-checkbox @change="saveSetting()" v-model="user_config.auto_transfer">{{__('自动额度转换')}}</el-checkbox></span>
                    </div>
                </div>
            </el-card>
        </div>
		<!-- 添加银行卡话框 -->
		<addbank :show.sync="addUserBank" @complete="initData"></addbank>
        <!-- 修改密码对话框 -->
        <el-dialog :title="is_setpwd ? __('修改登录密码') : __('设置登录密码')" :visible.sync="setPassword.visible" custom-class="update-password-dg" @closed="$refs.setPasswordform.resetFields()">
            <el-form
                :model="setPassword.form"
                status-icon
                ref="setPasswordform"
                :rules="setPassword.rules"
                label-width="120px">
                <el-form-item  v-if="is_setpwd" :label="__('当前登陆密码')" prop="oldpassword">
                    <el-input
                        type="password"
                        :placeholder="__('密码由 6-16 位数字或字母，下划线组成')"
                        v-model="setPassword.form.oldpassword"
                        auto-complete="new-password"
                    ></el-input>
                </el-form-item>
                <el-form-item :label-width="variable_labelWidth_pc(190,'','',190)" :label="is_setpwd ? __('请输入新密码') : __('请输入密码')" prop="newpassword">
                    <el-input
                        type="password"
                        :placeholder="__('密码由 6-16 位数字或字母，下划线组成')"
                        v-model="setPassword.form.newpassword"
                        auto-complete="new-password"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="is_setpwd ? __('确认新密码') : __('确认密码')" prop="repassword">
                    <el-input
                        type="password"
                        :placeholder="__('密码由 6-16 位数字或字母，下划线组成')"
                        v-model="setPassword.form.repassword"
                        auto-complete="new-password"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setPassword.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setPasswordform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 设置资金密码对话框 -->
        <el-dialog
            @closed="$refs.setSecurityPasswordform.resetFields()"
            :title="setSecurityPassword.title"
            :visible.sync="setSecurityPassword.visible"
            custom-class="update-password-dg">
            <el-form
                :model="setSecurityPassword.form"
                status-icon
                ref="setSecurityPasswordform"
                :rules="setSecurityPassword.rules"
                label-width="120px">
                <el-form-item v-if="init.security_password" :label="__('当前资金密码')" prop="oldpassword">
                    <el-input
                        type="password"
                        :placeholder="__('密码由 6-16 位数字或字母，下划线组成')"
                        v-model="setSecurityPassword.form.oldpassword"
                        auto-complete="new-password"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="__('新资金密码')" prop="newpassword">
                    <el-input
                        type="password"
                        :placeholder="__('密码由 6-16 位数字或字母，下划线组成')"
                        v-model="setSecurityPassword.form.newpassword"
                        auto-complete="new-password"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="__('确认资金密码')" prop="repassword">
                    <el-input
                        type="password"
                        :placeholder="__('密码由 6-16 位数字或字母，下划线组成')"
                        v-model="setSecurityPassword.form.repassword"
                        auto-complete="new-password"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setSecurityPassword.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setSecurityPasswordform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
		<!-- 设置预留信息对话框 -->
        <el-dialog
            @closed="$refs.setReservedInfoform.resetFields()"
            :title="setReservedInfo.title"
			@submit.native.prevent
            :visible.sync="setReservedInfo.visible"
            custom-class="update-password-dg">
            <el-form
                :model="setReservedInfo.form"
                status-icon
                ref="setReservedInfoform"
                :rules="setReservedInfo.rules"
                label-width="120px">
                <p style="margin-bottom: 20px;padding-left: 40px" v-if="init.reserved_info">
                    {{__('当前预留信：')}}<span style="color: red;font-size: 16px">{{ init.reserved_info }}</span>
                </p>
                <el-form-item :label="__('预留信息')" prop="reserved_info" :label-width="variable_labelWidth_pc(190)">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setReservedInfo.form.reserved_info"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setReservedInfo.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setReservedInfoform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 设置保密问题对话框 -->
        <el-dialog :title="__('设置保密问题')" :visible.sync="setSecurityQuestion.visible" @closed="$refs.setSecurityQuestionform.resetFields()">
            <el-form
                :model="setSecurityQuestion.form"
                status-icon
                ref="setSecurityQuestionform"
                :rules="setSecurityQuestion.rules"
                label-width="120px"
                size="small">
                <el-form-item :label="__('密保问题一')" prop="question_1">
                    <el-select :placeholder="__('请选择密保问题')" v-model="setSecurityQuestion.form.question_1">
                        <el-option
                            v-for="(option, key) in setSecurityQuestion.questions"
                            :key="key"
                            :label="option.question"
                            :value="option.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="__('答案一')" prop="answer_1">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setSecurityQuestion.form.answer_1"
                        auto-complete="off"
                        maxlength="20"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="__('密保问题二')" prop="question_2">
                    <el-select :placeholder="__('请选择密保问题')" v-model="setSecurityQuestion.form.question_2">
                        <el-option
                            v-for="(option, key) in setSecurityQuestion.questions"
                            :key="key"
                            :label="option.question"
                            :value="option.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="__('答案二')" prop="answer_2">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setSecurityQuestion.form.answer_2"
                        auto-complete="off"
                        maxlength="20"
                    ></el-input>
                </el-form-item>
                <el-form-item :label="__('密保问题三')" prop="question_3">
                    <el-select :placeholder="__('请选择密保问题')" v-model="setSecurityQuestion.form.question_3">
                        <el-option
                            v-for="(option, key) in setSecurityQuestion.questions"
                            :key="key"
                            :label="option.question"
                            :value="option.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="__('答案三')" prop="answer_3">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setSecurityQuestion.form.answer_3"
                        auto-complete="off"
                        maxlength="20"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setSecurityQuestion.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setSecurityQuestionform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 谷歌登录器对话框 -->
        <el-dialog :title="__('绑定谷歌验证器')" :visible.sync="setGoogleKey.visible" @submit.native.prevent @closed="$refs.setGoogleKeyform.resetFields()">
            <el-form
                :model="setGoogleKey.form"
                style="line-height: 28px"
                status-icon
                ref="setGoogleKeyform"
                :rules="setGoogleKey.rules"
            >
                <el-row :gutter="20">
                    <el-col :span="10">
                        <p>{{__('安装谷歌身份验证器后请扫描二维码')}}</p>
                        <el-form-item prop="code">
                            <el-input
                                type="text"
                                :placeholder="__('动态验证码')"
                                v-model="setGoogleKey.form.code"
                                auto-complete="off"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <img :src="setGoogleKey.googleKeyQrcode" style="width: 160px;margin-left: 40px" />
                    </el-col>
                    <p>{{__('备注：设置动态密码提款时为必填项，请妥善保管好您的动态验证秘钥，如遗忘请联系客服重置！')}}</p>
                    <p>
                        <span>{{__('Google身份验证器使用说明：')}}</span>
                        <a style="color: red" target="_blank" href="https://support.google.com/accounts/answer/1066447"
                            >https://support.google.com/accounts/answer/1066447</a
                        >
                    </p>
                    <p>
                        <span>{{__('Andriod下载地址：')}}</span>
                        <a
                            style="color: red"
                            target="_blank"
							href="https://shouji.baidu.com/software/22417419.html"
							>https://shouji.baidu.com/software/22417419.html
						</a>
                    </p>
                    <p>
                        <span>{{__('IOS下载地址：')}}</span>
                        <a
                            style="color: red"
                            target="_blank"
                            href="https://itunes.apple.com/cn/app/google-authenticator/id388497605"
                            >https://itunes.apple.com/cn/app/google-authenticator/id388497605
                        </a>
                    </p>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setGoogleKey.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setGoogleKeyform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 更改头像对话框 -->
        <el-dialog :title="__('更改头像')" :visible.sync="init.avatar_visible" custom-class="update-avatar-dg" @closed="init.avatar_selected = ''">
            <el-row :gutter="20">
                <ul>
                    <li v-for="(item, index) in init.avatars" :key="index">
                        <img
                            :src="$publicPath+'images/avatar/' + item + '.jpg'"
                            @click="select_avatar(item)"
                            :class="{ selected: init.avatar_selected == item }"
                        />
                    </li>
                </ul>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button @click="init.avatar_visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" @click="saveAvatar()">{{__('确 定')}} </el-button>
            </div>
        </el-dialog>
        <!-- 修改昵称对话框 -->
        <el-dialog :title="__('修改昵称')" :visible.sync="setNickName.visible" custom-class="update-password-dg" @closed="$refs.setNickNameform.resetFields()">
            <el-form
                :model="setNickName.form"
                status-icon
                ref="setNickNameform"
                :rules="setNickName.rules"
                label-width="120px"
				@submit.native.prevent
            >
                <el-form-item :label="__('昵称')" prop="nickname">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setNickName.form.nickname"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setNickName.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setNickNameform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 设置邮箱对话框 -->
        <el-dialog :title="__('设置邮箱地址')" :visible.sync="setEmail.visible" custom-class="update-password-dg" @closed="$refs.setEmailform.resetFields()">
            <el-form :model="setEmail.form" status-icon ref="setEmailform" :rules="setEmail.rules" label-width="120px">
                <el-form-item :label="__('邮箱地址')" prop="email">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setEmail.form.email"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setEmail.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setEmailform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 设置qq对话框 -->
        <el-dialog :title="__('设置QQ号码')" :visible.sync="setQQ.visible" custom-class="update-password-dg" @closed="$refs.setQQform.resetFields()">
            <el-form :model="setQQ.form" status-icon ref="setQQform" :rules="setQQ.rules" label-width="120px">
                <el-form-item :label="__('QQ号码')" prop="qq">
                    <el-input type="text" :placeholder="__('请输入')" v-model="setQQ.form.qq" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setQQ.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setQQform')">{{__('确 定')}} </el-button>
            </div>
        </el-dialog>
        <!-- 设置微信对话框 -->
        <el-dialog :title="__('设置微信账号')" :visible.sync="setWeixin.visible" custom-class="update-password-dg" @closed="$refs.setWeixinform.resetFields()">
            <el-form
                :model="setWeixin.form"
                status-icon
                ref="setWeixinform"
                :rules="setWeixin.rules"
                label-width="120px"
            >
                <el-form-item :label="__('微信账号')" prop="weixin">
                    <el-input
                        type="text"
                        :placeholder="__('不能为空')"
                        v-model="setWeixin.form.weixin"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setWeixin.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setWeixinform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 设置手机对话框 -->
        <el-dialog :title="__('绑定手机')" :visible.sync="setTelephone.visible" custom-class="update-password-dg" @closed="$refs.setTelephoneform.resetFields()">
            <el-form
                :model="setTelephone.form"
                size="small"
                status-icon
                ref="setTelephoneform"
                :rules="setTelephone.rules"
                label-width="120px">
                <el-form-item :label="__('手机号码')" prop="telephone">
                    <el-input
                        type="text"
                        :placeholder="__('请输入11位手机号码')"
                        v-model="setTelephone.form.telephone"
                        auto-complete="off"
                    >
                        <template slot="prepend"
                            >+86</template
                        >
                    </el-input>
                </el-form-item>
                <el-form-item :label="__('短信验证码')" prop="verify_code">
                    <el-input
                        type="text"
                        :placeholder="__('请输入短信验证码')"
                        v-model="setTelephone.form.verify_code"
                        auto-complete="off"
                    >
                        <el-button
                            slot="append"
                            :loading="submitLoading"
                            :disabled="!setTelephone.canClick"
                            icon="el-icon-message"
                            @click="sendVerifyCode"
                            >{{ setTelephone.sendTitle }}</el-button
                        >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setTelephone.visible = false">{{__('取 消')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="submitForm('setTelephoneform')"
                    >{{__('确 定')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    modifyPassword,
    setPassword,
    getIndex,
    modifySecurityPassword,
    bindGoogle,
    setProfile,
    getSecurityQuestion,
    setSecurityQuestion,
    saveUserAvatar,
    postVerifyCode,
} from '@/api/user';

import { lang_mixin, variable_labelWidth_pc } from '@/assets/lang/lang';

export default {
    name: 'userIndex',
    mixins: [lang_mixin, variable_labelWidth_pc],
    components: {
		addbank:() => import('./addbank.vue'),
	},
    data() {
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.__('请输入密码')));
            } else {
                if (this.setPassword.form.repassword !== '') {
                    this.$refs.setPasswordform.validateField('repassword');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.__('请再次输入密码')));
            } else if(value !== this.setPassword.form.newpassword) {
                callback(new Error(this.__('两次输入密码不一致!')));
            } else {
                callback();
            }
        };
        let validateSPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.__('请输入密码')));
            } else {
                if (this.setSecurityPassword.form.repassword !== '') {
                    this.$refs.setSecurityPasswordform.validateField('repassword');
                }
                callback();
            }
        };
        let validateSPass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.__('请再次输入密码')));
            } else if (value !== this.setSecurityPassword.form.newpassword) {
                callback(new Error(this.__('两次输入密码不一致!')));
            } else {
                callback();
            }
        };
        let checkPhone = (rule, value, callback) => {
            if (/^1[345789]\d{9}$/.test(value) === false) {
                callback(new Error(this.__('手机号码格式有误')));
            } else {
                callback();
            }
        };
        return {
            password:'',
            userinfo: false,
            user_config:{
                won_msg:true,
                sound:true,
                auto_transfer:true,
            },
            init: {
                safety_level:false,
                google_bind:false,
                information_bind:false,
                username: '',
                usernick: '',
                realname:'',
                user_type: '',
                balance: 0,
                security_question: false,
                security_password: false,
                reserved_info: '',
                email: '',
                qq: '',
                weixin: '',
                telephone: '',
                google_key: false,
                user_bank: false,
                star: 0,
                last_time: '',
                last_ip: this.__('火星'),
                avatar: 'no_avatar',
                avatars: [],
                avatar_visible: false,
                avatar_selected: ''
            },
            loading: true,
            submitLoading: false,
            setPassword: {
                visible: false,
                form: {
                    oldpassword: '',
                    newpassword: '',
                    repassword: ''
                },
                rules: {
                    oldpassword: [{ validator: validatePass, trigger: 'blur' }],
                    newpassword: [{ validator: validatePass, trigger: 'blur' }],
                    repassword: [{ validator: validatePass2, trigger: 'blur' }]
                }
            },
            setSecurityPassword: {
                visible: false,
                title: '',
                form: {
                    oldpassword: '',
                    newpassword: '',
                    repassword: ''
                },
                rules: {
                    oldpassword: [{ validator: validateSPass, trigger: 'blur' }],
                    newpassword: [{ validator: validateSPass, trigger: 'blur' }],
                    repassword: [{ validator: validateSPass2, trigger: 'blur' }]
                }
            },
            setGoogleKey: {
                visible: false,
                googleKeyQrcode: '',
                form: {
                    code: ''
                },
                rules: {
                    code: [
                        {
                            required: true,
                            message: this.__('请输入动态验证码'),
                            trigger: 'blur'
                        }
                    ]
                }
            },
            setReservedInfo: {
                visible: false,
                title: '',
                form: {
                    reserved_info: ''
                },
                rules: {
                    reserved_info: [
                        {
                            required: true,
                            message: this.__('请输入预留信息'),
                            trigger: 'blur'
                        },
						{
						   max: 10,
						   message: this.__('长度不能超过10个字符'),
						   trigger: 'blur'
						}
                    ]
                }
            },
            setNickName: {
                visible: false,
                title: '',
                form: {
                    nickname: ''
                },
                rules: {
                    nickname: [
                        {
                            required: true,
                            message: this.__('请输入昵称信息'),
                            trigger: 'blur'
                        },
                        {
                            validator:(rule, value, callback)=>{
                                if(value === this.init.username){
                                    callback(new Error(this.__('不能设置登录账号一样的昵称')));
                                }else{
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ]
                }
            },
            setEmail: {
                visible: false,
                title: '',
                form: {
                    email: ''
                },
                rules: {
                    email: [
                        {
                            required: true,
                            message: this.__('请输入邮箱地址'),
                            trigger: 'blur'
                        }
                    ]
                }
            },
            setQQ: {
                visible: false,
                title: '',
                form: {
                    qq: ''
                },
                rules: {
                    qq: [
                        {
                            required: true,
                            message: this.__('请输入QQ号码'),
                            trigger: 'blur'
                        }
                    ]
                }
            },
            setWeixin: {
                visible: false,
                title: '',
                form: {
                    weixin: ''
                },
                rules: {
                    weixin: [
                        {
                            required: true,
                            message: this.__('请输入微信账号'),
                            trigger: 'blur'
                        }
                    ]
                }
            },
            setTelephone: {
                visible: false,
                title: '',
                sendTitle: this.__('发送短信'),
                seconds: 60,
                canClick: true, //添加canClick
                form: {
                    telephone: '',
                    verify_code: ''
                },
                rules: {
                    telephone: [
                        {
                            required: true,
                            min: 11,
                            max: 11,
                            message: this.__('请输入11位手机号码'),
                            trigger: 'blur'
                        },
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    verify_code: [
                        {
                            required: true,
                            message: this.__('请输入短信验证码'),
                            trigger: 'blur'
                        }
                    ]
                }
            },
            setSecurityQuestion: {
                visible: false,
                questions: [],
                form: {
                    question_1: '',
                    answer_1: '',
                    question_2: '',
                    answer_2: '',
                    question_3: '',
                    answer_3: ''
                },
                rules: {
                    question_1: [
                        {
                            type: 'number',
                            required: true,
                            message: this.__('请选择问题！'),
                            trigger: 'change'
                        }
                    ],
                    answer_1: [
                        {
                            required: true,
                            message: this.__('请填写答案!'),
                            trigger: 'blur'
                        }
                    ],
                    question_2: [
                        {
                            type: 'number',
                            required: true,
                            message: this.__('请选择问题！'),
                            trigger: 'change'
                        }
                    ],
                    answer_2: [
                        {
                            required: true,
                            message: this.__('请填写答案!'),
                            trigger: 'blur'
                        }
                    ],
                    question_3: [
                        {
                            type: 'number',
                            required: true,
                            message: this.__('请选择问题!'),
                            trigger: 'change'
                        }
                    ],
                    answer_3: [
                        {
                            required: true,
                            message: this.__('请填写答案!'),
                            trigger: 'blur'
                        }
                    ]
                }
            },
			addUserBank: false,
        };
    },
    created() {
        for (let i = 1; i <= 60; i++) {
            let avatar = i;
            this.init.avatars.push(avatar);
        }
        this.initData(true);
    },
    methods: {
        select_avatar(avatar) {
            this.init.avatar_selected = avatar;
        },
        saveAvatar() {
			if(!this.init.avatar_selected){
				 this.$message.warning(this.__('请选择您喜欢的头像！'));
				return
			}
            saveUserAvatar(this.init.avatar_selected).then(res => {
                if (res.data.status == 0) {
                    this.init.avatar_visible = false;
                    this.initData();
                    this.$store.commit('SET_AVATAR',this.init.avatar_selected);
                    this.$message.success(this.__('头像修改成功！'));
                } else {
                    this.$message.error(this.__('头像修改失败！'));
                }
            });
        },
        initData(flag) {
            getIndex()
                .then(res => {
                    this.loading = false;
                    if (res.data.status == 0) {
                        let star = parseInt(res.data.data.star);
                        this.init.star = star < 1 ? 1 : star > 5 ? 5 : star;
                        this.init.google_key = res.data.data.google_key;
                        this.init.reserved_info = res.data.data.reserved_info;
                        this.init.security_password = res.data.data.security_password;
                        this.init.security_question = res.data.data.security_question;
                        this.init.last_time = res.data.data.last_time;
                        this.init.last_ip = res.data.data.last_ip;
                        this.init.user_bank = res.data.data.user_bank;
                        this.init.avatar = res.data.data.avatar;
                        this.init.username = res.data.data.username;
                        this.init.usernick = res.data.data.usernick;
                        this.init.user_type = res.data.data.user_type;
                        this.init.balance = res.data.data.balance;
                        this.init.email = res.data.data.email;
                        this.init.qq = res.data.data.qq;
                        this.init.weixin = res.data.data.weixin;
                        this.init.telephone = res.data.data.telephone;
                        this.init.realname = res.data.data.realname;

                        this.init.safety_level = !!Number(res.data.data.safety_level);
                        this.init.google_bind = !!Number(res.data.data.google_bind);
                        this.init.information_bind = !!Number(res.data.data.information_bind);

                        this.$store.commit('SET_AVATAR',res.data.data.avatar);
						this.$store.commit('SET_NICKNAME',res.data.data.usernick);
						this.$store.commit('SET_BALANCE',res.data.data.balance);
						this.$store.commit('SET_USERNAME',res.data.data.username);
                        this.$store.commit('SET_REALNAME',res.data.data.realname);

                        if (this.init.google_bind && !res.data.data.google_key) {
                            const jrQrcode = require('jr-qrcode');
                            this.setGoogleKey.googleKeyQrcode = jrQrcode.getQrBase64(res.data.data.gkey);
                        }
                        this.setSecurityPassword.title = res.data.data.security_password ? this.__('修改资金密码') : this.__('设置资金密码');
                        this.setReservedInfo.title = res.data.data.reserved_info ? this.__('修改预留信息') : this.__('设置预留信息');
                        this.user_config = res.data.data.setting;

                        if(flag){
                            let page = this.$route.params.page;
                            if(page && this[page]){
                                this[page].visible = true;
                            }
                        }
                    }
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        getAddUserBank() {
			if (!this.init.security_password) {
				this.$alert(this.__('添加提款方式前，请先设置资金密码'), {
					type: 'error',
                    confirmButtonText: this.__('立即设置'),
                    callback: action => {
                        if(action === 'confirm') this.setSecurityPassword.visible = true;
                    }
				});
				return false;
			}
			this.addUserBank = true;
        },
        getQuestion() {
            if (this.init.security_question) {
                this.alert(this.__('你已经设置了密保问题!'));
                return;
            }
            let questions = false;
            try {
                questions = JSON.parse(window.sessionStorage.getItem('SecurityQuestion'));
            } catch (e) {}
            if (questions) {
                this.setSecurityQuestion.visible = true;
                this.setSecurityQuestion.questions = questions;
            } else {
                this.loading = true;
                getSecurityQuestion()
                    .then(response => {
                        this.loading = false;
                        if (response.data.status == 0) {
                            this.setSecurityQuestion.visible = true;
                            this.setSecurityQuestion.questions = response.data.data;
                            window.sessionStorage.setItem('SecurityQuestion', JSON.stringify(response.data.data));
                        } else {
                            this.$message.error(this.__('获取数据失败！') + response.data.msg);
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                    });
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    if (formName == 'setPasswordform') {
                        if(this.is_setpwd){
                            modifyPassword(this.setPassword.form.oldpassword, this.setPassword.form.newpassword)
                                .then(response => {
                                     if (response.data.status == 0) {
                                        this.setPassword.visible = false;
                                        this.$message.success(this.__('登录密码修改成功！'));
                                    } else {
                                        this.$message.error(this.__('登录密码修改失败！') + response.data.msg);
                                    }
                                    this.submitLoading = false;
                                })
                                .catch(err => {
                                    this.submitLoading = false;
                                    this.$message.error(this.__('登录密码修改失败！') + err);
                                });
                        }else{
                            setPassword(this.setPassword.form.newpassword).then(res=>{
                                if(res.data.status == 0){
                                    this.setPassword.visible = false;
                                    this.$message.success(this.__('登录密码设置成功！') + res.data.msg);
                                    this.$store.commit('SET_ISSETPWD',true)
                                }else{
                                    this.$message.error(this.__('登录密码设置失败！') + res.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err =>{
                                this.submitLoading = false;
                                this.$message.error(this.__('登录密码设置失败！') + err);
                            })
                        }
                    } else if (formName == 'setSecurityPasswordform') {
                        modifySecurityPassword(
                            this.setSecurityPassword.form.oldpassword,
                            this.setSecurityPassword.form.newpassword
                        )
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setSecurityPassword.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(this.__('资金密码修改失败！') + response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('资金密码修改失败！') + err);
                            });
                    } else if (formName == 'setGoogleKeyform') {
                        bindGoogle(this.setGoogleKey.form.code)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setGoogleKey.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
									this.setGoogleKey.form.code='';
									this.$refs[formName].validateField('code')
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
								this.setGoogleKey.form.code='';
								this.$refs[formName].validateField('code')
                                this.submitLoading = false;
                                this.$message.error(this.__('绑定失败！') + err);
                            });
                    } else if (formName == 'setReservedInfoform') {
                        setProfile(this.setReservedInfo.form)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setReservedInfo.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    } else if (formName == 'setEmailform') {
                        setProfile(this.setEmail.form)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setEmail.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    } else if (formName == 'setQQform') {
                        setProfile(this.setQQ.form)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setQQ.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    } else if (formName == 'setWeixinform') {
                        setProfile(this.setWeixin.form)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setWeixin.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    } else if (formName == 'setTelephoneform') {
                        setProfile(this.setTelephone.form)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setTelephone.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    } else if (formName == 'setNickNameform') {
                        setProfile(this.setNickName.form)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setNickName.visible = false;
                                    this.$store.commit('SET_NICKNAME', this.setNickName.form.nickname);
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    } else if (formName == 'setSecurityQuestionform') {
                        let questions = [
                            this.setSecurityQuestion.form.question_1,
                            this.setSecurityQuestion.form.question_2,
                            this.setSecurityQuestion.form.question_3
                        ];
                        let answers = [
                            this.setSecurityQuestion.form.answer_1,
                            this.setSecurityQuestion.form.answer_2,
                            this.setSecurityQuestion.form.answer_3
                        ];
                        setSecurityQuestion(questions, answers)
                            .then(response => {
                                if (response.data.status == 0) {
                                    this.setSecurityQuestion.visible = false;
                                    this.$message.success(response.data.msg);
                                    this.initData();
                                } else {
                                    this.$message.error(response.data.msg);
                                }
                                this.submitLoading = false;
                            })
                            .catch(err => {
                                this.submitLoading = false;
                                this.$message.error(this.__('设置失败！') + err);
                            });
                    }
                } else {
                    return false;
                }
            });
        },
        countDown() {
            if (!this.setTelephone.canClick) return; //改动的是这两行代码
            this.setTelephone.canClick = false;
            this.setTelephone.sendTitle = this.setTelephone.seconds + this.__('s后重新发送');
            let clock = window.setInterval(() => {
                this.setTelephone.seconds--;
                this.setTelephone.sendTitle = this.setTelephone.seconds + this.__('s后重新发送');
                if (this.setTelephone.seconds < 0) {
                    window.clearInterval(clock);
                    this.setTelephone.sendTitle = this.__('重新发送验证码');
                    this.setTelephone.seconds = 60;
                    this.setTelephone.canClick = true; //这里重新开启
                }
            }, 1000);
        },
        sendVerifyCode() {
            if (!/^1[345789]\d{9}$/.test(this.setTelephone.form.telephone)) {
                this.$message.error(this.__('手机号码有误，请重填！'));
                return false;
            }
            this.submitLoading = true;
            postVerifyCode(this.setTelephone.form.telephone, "bindphone")
                .then(res => {
                    if (res.data.status == 0) {
                        this.countDown();
                        this.$message.success(res.data.msg);
                    } else {
                        if (res.data.status == 2) {
                            this.setTelephone.seconds = res.data.data;
                        }
                        this.countDown();
                        this.$message.error(res.data.msg);
                    }
                    this.submitLoading = false;
                })
                .catch(err => {
                    this.submitLoading = false;
                    this.$message.error(this.__('操作失败！') + err);
                });
        },
        saveSetting(){
            this.$store.commit('SET_USER_SETTING', this.user_config);
        }
    },
    computed:{
        ...MAPGETTERS(['vip','app_config','is_setpwd'])
    }
};
</script>
<style lang="scss">
.page-container-user-index {
    .update-avatar-dg {
        ul {
            max-height: 360px;
            overflow: hidden;
            overflow-y: auto;
            li {
                width: 60px;
                height: 60px;
                float: left;
                margin: 5px;
                display: inline-block;
                img {
                    width: 58px;
                    cursor: pointer;
                }
                img:hover {
                    border: 1px solid $theme;
                }
                .selected {
                    border: 1px solid $theme;
                }
            }
        }
    }
    .security-header {
        margin-bottom: 20px;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 20px;
        .point {
            .avatar {
                width: 180px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                color: $theme;
                margin: auto;
                .circular--portrait {
                    position: relative;
                    width: 160px;
                    height: 160px;
                    overflow: hidden;
                    border-radius: 50%;
                }

                .circular--portrait img {
                    width: 100%;
                    height: auto;
                }
                .text {
                    line-height: 22px;
                    padding-top: 10px;
					
                }
            }
        }
        .infos {
			color: $text_color;
            margin-top: 10px;
            .info-list {
                line-height: 28px;
                a {
                    color: $theme;
                    text-decoration: none;
                    font-size: 12px;
                }
                span {
                    color: $theme;
                    &.user_vip{
                        background-color:#fdbe00;
                        color:#FFF !important;
                        width: 40px;
                        height: 25px;
                        display: inline-block;
                        border-radius: 4px;
                        text-align: center;
                        line-height: 25px;
						&:hover{
							cursor: pointer;
						}
                    }
                }
				.usablebalance{
					cursor: pointer;
				}
            }
			.el-rate{
				.el-rate__item{
					.el-icon-star-on{
						color: $theme;
					}
				}
			}
        }
        .modifyinfobtn {
            position: absolute;
            bottom: 20px;
            right: 0;
        }
        .el-rate__icon {
            font-size: 32px;
        }
        .title {
            padding-top: 24px;
            color: $theme;
            font-size: 16px;
            margin: 0;
        }
        .tip {
            margin: 0;
            font-size: 12px;
            color: $text_color;
            line-height: 12px;
        }
    }
    .security-content {
        display: flex;
        flex-wrap: wrap;
        .el-card {
            flex: 0 0 32.3%;
            margin-bottom: 20px;
            margin-left: 1.55%;
            box-sizing: border-box;
            &:nth-child(3n + 1) {
                margin-left: 0;
            }
            .el-card__body {
                padding: 10px;
            }
        }

        .el-card:hover {
            border-color: $theme;
        }

        .infos {
            position: relative;
            height: 120px;
            padding-left: 90px;
            background: url('~_assets_d/images/manager_icon.png') 0px 13px no-repeat;
            .setting{
                display: flex;
                flex-wrap: wrap;
                span{
                    flex: 0 0 50%;
                    padding: 3px;
                    box-sizing: border-box;
                    .el-checkbox__inner{
                        border-color: #aaa;
                    }
                }
            }
            i {
                top: 0;
                left: 0;
                position: absolute;
                font-size: 24px;
            }
            i.el-icon-success {
                color: #67c23a;
            }
            i.el-icon-warning {
                color: $theme;
            }
            .title {
                line-height: 32px;
                 color: $theme;
            }
            .help {
                line-height: 22px;
                opacity: .7;
                .el-checkbox__label{
                    padding-left: 3px;
                }
                .el-checkbox{
                    margin-right: 10px;
                }
                .el-radio__label{
                    padding-left: 3px;
                }
                .el-radio{
                    margin-right: 10px;
                }
            }
            .actions {
                position: absolute;
                bottom: 0;
                right: 0;
                line-height: 24px;
                a {
                    cursor: pointer;
                    color: $theme;
                    display: inline-block;
                    text-decoration: none;
                    padding: 6px 8px;
                    border-radius: 4px;
                    transition-duration: 0.2s;
                    &:hover {
                        background: $theme;
                        color: $theme_text_color;
                    }
                }
            }
        }
        .icon1 {
            background-position: 0px -172px;
        }
        .icon2 {
            background-position: 0px -359px;
        }
        .icon3 {
            background-position: 0px -528px;
        }
        .icon4 {
            background-position: 0px -720px;
        }
        .icon5 {
            background-position: 0px -718px;
        }
        .icon6 {
            background-position: 0px -905px;
        }
        .icon7 {
            background-position: 0px -1089px;
        }  
        .icon8 {
            background-position: 0px -1279px;
        }     
        .icon9 {
            background-position: 0px -1459px;
        }
        .icon10 {
            background-position: 0px -1642px;
        }
        .icon11 {
            background-position: 0px -1835px;
        }
        .icon12 {
            background-position: 0px -2018px;
        }
    }
	.page-container-user-index .el-dialog .el-dialog__header .el-dialog__title, .page-container-user-index .el-dialog .el-dialog__header .el-dialog__close{
		color: $theme;
	}
}
</style>
