<template>
    <div class="page page_commissionWithdrawal graybg">
        <van-form @submit="postPlanWithdrawal" label-align="right" label-width="5.5em" ref="withdrawalForm">
            <van-cell :title="__('可提现佣金')" class="balance" clickable @click="onGetBalance">
                <span r_gap>{{commissionBalance}}</span>
                <van-loading v-show="balanceLoading" type="spinner" size="1em" r_gap/>
            </van-cell>
            <van-field :label="__('提现到')" :value="form.method | f_t(withdrawalData.methods,'name','id')" is-link readonly themetext>
                <picker slot="extra" :value.sync="form.method" :columns="withdrawalData.methods" text-key="name" value-key="id"></picker>
            </van-field>
            <template v-if="form.method === 0">
                <van-field :label="__('选择银行')" :value="form.bank_id | f_t(withdrawalData.banks,'name','id')" :rules="[{validator:()=>{return !!form.bank_id},trigger:'onChange'}]" :smalltext="!!form.bank_id" is-link readonly themetext>
                    <picker slot="extra" :value.sync="form.bank_id" :columns="withdrawalData.banks" text-key="name" value-key="id"></picker>
                </van-field>
                <van-field :label="__('开户地区')" :value="form.region | f_a_t(withdrawalData.area)" :rules="[{validator:()=>{return form.region.length > 0},trigger:'onChange'}]" :smalltext="form.region.length > 0" is-link readonly themetext>
                    <picker slot="extra" type="area" :value.sync="form.region" :columns="withdrawalData.area"></picker>
                </van-field>
                <van-field :label="__('支行名称')"
                           v-model="form.branch"
                           :placeholder="__('请输入支行名称')"
                           :rules="[
                                { required: true },
                                { pattern:/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,message:__('请输入正确的支行名称')}
                           ]" clearable />
                <van-field :label="__('持卡人姓名')"
                           :disabled="!!withdrawalData.real_name"
                           v-model="form.real_name"
                           :placeholder="__('请输入持卡人姓名')"
                           :rules="[
                                { required: true },
                                { pattern:/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,message:__('请输入正确的持卡人姓名')}
                           ]" clearable />
                <van-field :label="__('银行卡号')"
                           v-model="form.account"
                           :placeholder="__('请输入银行卡号')"
                           :rules="[
                                { required: true },
                                { pattern:/^\d{16}|\d{19}$/,message:__('请输入正确的银行卡号')}
                           ]" clearable />
                <van-field :label="__('确认卡号')"
                           v-model="form.re_account"
                           :placeholder="__('请再次输入银行卡号确认')"
                           :rules="[
                                { required: true },
                                { validator:(v)=>{return v === form.account},message:__('两次输入的卡号不一致')}
                           ]" clearable />
            </template>
            <template v-if="form.method === 1">
                <van-field :label="__('真实姓名')"
                           :disabled="!!withdrawalData.real_name"
                           v-model="form.real_name"
                           :placeholder="__('请输入支付宝绑定的真实姓名')"
                           :rules="[
                                { required: true },
                                { pattern:/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/,message:__('请输入正确的真实姓名')}
                           ]" clearable />
                <van-field :label="__('支付宝账号')"
                           v-model="form.account"
                           :placeholder="__('请输入支付宝账号')"
                           :rules="[
                                { required: true },
                                { validator:(v)=>{ return v.includes('@') ? /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v) : /^1[345789]\d{9}$/.test(v) },message:__('支付宝账号格式错误')}
                           ]" clearable />
                <van-field :label="__('确认账号')"
                           v-model="form.re_account"
                           :placeholder="__('请再次输入支付宝账号确认')"
                           :rules="[
                                { required: true },
                                { validator:(v)=>{return v === form.account},message:__('两次输入的支付宝账号不一致')}
                           ]" clearable />
            </template>
            <van-cell-group class="margintop10">
                <van-field v-model="form.amount"  :label="__('提现金额')" type="number" :placeholder="__('请输入提现金额')" :rules="[{ required: true }]" clearable />
                <van-field v-model="form.password" :label="__('资金密码')" type="password" :placeholder="__('请输入资金密码')"  :rules="[{ required: true }]" autocomplete="new-password" clearable />
            </van-cell-group>
            <van-button native-type="submit" block theme main :disabled="form.method === ''">{{__('确认')}}</van-button>
        </van-form>
    </div>
</template>

<script>
    import {getPlanWithdrawal,postPlanWithdrawal} from "../api";
    import { lang_mixin } from '@/assets/lang';
    import { __ } from '@/assets/lang';
    export default {
        mixins:[lang_mixin],
        name: 'commissionWithdrawal',
        inject:['getBalance'],
        data(){
            return{
                commissionBalance:'',
                balanceLoading:false,
                form:{
                    method:'',
                    bank_id:'',
                    region: [],
                    branch:'',
                    account:'',
                    re_account:'',
                    password:'',
                    amount:'',
                    real_name:''
                }
            }
        },
        created() {
            this.onGetBalance();
        },
        watch:{
            'form.method':function () {
                this.$refs.withdrawalForm.resetValidation();
                this.form.real_name = this.withdrawalData.real_name;
                this.form.account = '';
                this.form.re_account = '';
            }
        },
        computed:{
            ...mapGetters(['withdrawalData'])
        },
        methods:{
            ...mapMutations(['set_withdrawalData']),
            onGetBalance(){
                this.getBalance('getPlanCommissionBalance',this.balanceLoading,()=>{
                    this.balanceLoading = true;
                },(res)=>{
                    this.commissionBalance = res.data.data;
                    this.balanceLoading = false;
                })
            },
            postPlanWithdrawal(){
                loading_show('postPlanWithdrawal');
                postPlanWithdrawal(this.form).then(res=>{
                    loading_close('postPlanWithdrawal');
                    if (res.data.status === 0) {
                        if(!!res.data.data.set_name) this.set_withdrawalData({real_name:this.form.real_name});
                        this.$toast.success(res.data.msg);
                        this.$router.back();
                    }else{
                        this.$toast.fail(res.data.msg);
                    }
                }).catch(err=>{
                    loading_close('postPlanWithdrawal');
                })
            }
        },
        beforeRouteEnter(to,from,next){
            window.block_router_loading = true;
            loading_close('router_loading');
            const toSetPasswordTips = ()=>{
                vueRoot.$toast.fail(__('您还没有设置资金密码，请先设置资金密码'));
                next({
                    name:'setInfo',
                    params:{
                        name:'zjmm',
                        title:__('设置资金密码'),
                        type:'set'
                    }
                })
            };
            if(vueRoot.$store.getters.withdrawalData){
                if(vueRoot.$store.getters.userInfo.has_password){
                    next();
                }else{
                    toSetPasswordTips();
                }
            }else{
                loading_show('getPlanWithdrawal');
                getPlanWithdrawal().then(res=>{
                    loading_close('getPlanWithdrawal');
                    if(res.data.status === 0){
                        let data = res.data.data;
                        vueRoot.$store.commit('set_withdrawalData',data);
                        if(!!data.has_password){
                            next();
                        }else{
                            toSetPasswordTips();
                        }
                    }else{
                        next('/');
                        vueRoot.$toast.fail(res.data.msg);
                    }
                }).catch(err=>{
                    next('/');
                    loading_close('getPlanWithdrawal');
                })
            }
        }
    }
</script>

<style lang="scss">
    .page.page_commissionWithdrawal{
        overflow-y: auto;
        .balance{
            .van-cell__title{
                width: 5.5em;
                flex: none;
                text-align: right;
                margin-right: 12px;
            }
            .van-cell__value{
                display: flex;
                align-items: center;
                .van-loading{
                    display: flex;
                    font-size: inherit;
                }
            }
        }
    }
</style>