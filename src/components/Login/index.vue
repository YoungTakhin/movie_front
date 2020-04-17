<template>
    <div id="bg" class="">
        <b-img id="glass" fluid-grow class="fixed-top" :src="backgroundImg"></b-img>
        <b-row align-h="center" class="h-100 fixed-top">
            <b-col id="loginBox" cols="auto" align-self="center" class="">
                <div class="col-12 p-4 text-left">
                    <h1 class="text-light text-center">欢迎回来!</h1>
                    <h4 class="text-light text-center">很高兴再见到你</h4>
                        <div class="form-group">
                            <label for="userId" class="text-light">账号</label>
                            <input type="text" class="form-control" id="userId" aria-describedby="emailHelp" placeholder="请输入id" v-model="userId">
<!--                            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>-->
                        </div>
                        <div class="form-group">
                            <label for="password" class="text-light">密码</label>
                            <input type="password" class="form-control" id="password" placeholder="请输入密码" v-model="password">
                        </div>
<!--                        <div class="form-check">-->
<!--                            <input type="checkbox" class="form-check-input" id="exampleCheck1">-->
<!--                            <label class="form-check-label text-light" for="exampleCheck1">Check me out</label>-->
<!--                        </div>-->
                        <button type="button" class="btn btn-primary col-12" @click="login">现在登陆</button>
                </div>
            </b-col>

        </b-row>
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import { USER_SIGNIN }from '../../store/user'
    export default {
        name: "Login",
        data () {
            return {
                backgroundImg: '',
                userId: 0,
                password: ''
            }
        },
        methods :{
            ...mapActions([USER_SIGNIN]),
            login() {
                this.$axios({
                    method: "POST",
                    url: "/api/login",
                    data: {
                        "userId": this.userId,
                        "password": this.password
                    }
                }).then((response) => {
                    if (response.data === '') {
                        window.console.log("用户名或密码错误");
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
                url: "https://api.themoviedb.org/3/movie/862/images",
                params: {
                    api_key: this.$global_msg.api_key,
                    movie_id: '862'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                //window.console.log(response.data.backdrops[0].file_path);
                this.backgroundImg = this.$global_msg.bg + response.data.backdrops[0].file_path;
                //window.console.log(this.backgroundImg);
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