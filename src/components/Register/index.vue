<template>
    <div>
        <div>
            <b-carousel
                    id="carousel-fade"
                    fade
                    indicators
            >
                <b-carousel-slide
                        id="glass"
                        fluid-grow
                        class="fixed-top"
                        v-for="i in bgList" :key="i"
                        :img-src="$global_msg.bg + i"
                ></b-carousel-slide>
            </b-carousel>
        </div>

        <b-row align-h="center" class="h-100 fixed-top">
            <b-col id="loginBox" cols="auto" align-self="center" class="border" >
                <div class="col-12 p-4 text-left">
                    <h1 class="text-light text-center">创建一个账号</h1>
                    <div class="form-group">
                        <label for="username" class="text-light">用户名</label>
                        <input type="text" class="form-control" id="username" placeholder="请输入用户名" v-model="username">
                        <small v-if="registerError" id="" class="form-text text-danger">该用户名不可用</small>
                    </div>
                    <div class="form-group">
                        <label for="password" class="text-light">密码</label>
                        <input type="password" class="form-control" id="password" placeholder="请输入密码" v-model="password">
                    </div>
                    <button type="button" class="btn btn-primary col-12" @click="register">现在登陆</button>
                    <div class="mt-3">
                        <b-link href="/#/login">已有拥有账号？</b-link>
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { USER_SIGNIN }from '../../store/user'
    export default {
        name: "Register",
        data () {
            return {
                username: '',
                password: '',

                backgroundImg: '',
                bgList: [],

                registerError: false
            }
        },
        watch: {
            username: function () {
                this.registerError = false;
            },
        },
        methods: {
            ...mapActions([USER_SIGNIN]),
            register() {
                this.$axios({
                    method: "POST",
                    url: "/api/register",
                    data: {
                        "userName": this.username,
                        "password": this.password
                    }
                }).then((response) => {
                    if (response.data === null) {
                        this.registerError = true;
                    } else if (response.data.admin === true) {
                        this.USER_SIGNIN(response.data);
                        this.$router.push("/admin")
                    } else {
                        this.USER_SIGNIN(response.data);
                        this.$router.push("/home")
                    }
                }).catch((error) => {
                    window.console.log(error)
                })
            }
        },
        mounted () {
            this.$axios({
                method: "GET",
                url: "https://api.themoviedb.org/3/movie/popular?api_key="+ this.$global_msg.api_key,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                let l = [];
                for (let m of response.data.results) {
                    l.push(m.backdrop_path)
                }
                this.bgList = l;
                console.log(this.bgList)
            }).catch((error) => {
                window.console.log(error); // 请求失败处理
            });
        }
    }
</script>

<style scoped>
    /* 毛玻璃效果 */
    #glass {
        width: 100%;
        height: 100%;
        background: inherit;
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -ms-filter: blur(5px);
        -o-filter: blur(5px);
        filter: blur(5px);
        filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);  /* ie6-9*/
    }
    /* 登录框背景 */
    #loginBox {
        background-color:rgba(54,57,63,0.9);
    }
</style>