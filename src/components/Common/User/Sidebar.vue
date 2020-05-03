<template>
    <div>
        <b-sidebar id="sidebar" title="个人中心" right lazy backdrop>
            <div class="px-2 py-2 text-left">
                <dl class="row">
                    <dt class="col-4">ID:</dt>
                    <dd class="col-8">{{user.userId}}</dd>


                    <dt class="col-4">用户名:</dt>
                    <dd class="col-8">{{user.userName}}</dd>
                </dl>

                <label>修改密码：</label>
                <b-input-group for="password">
                    <b-form-input type="password" id="password" v-model="user.password"></b-form-input>
                    <b-input-group-append>
                        <b-button @click="updatePassword(localStorage.getItem('userId'))">修改</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </b-sidebar>
    </div>
</template>

<script>
    export default {
        name: "Sidebar",
        data () {
            return {
                user: {}
            }
        },
        methods: {
            getUser() {
                this.user = JSON.parse(localStorage.getItem("user"));
            },
            updatePassword(userId) {
                if (this.users[userId].password.length >= 6 && this.users[userId].password.length <= 16) {
                    this.$axios({
                        method: "POST",
                        url: "/api/user/password",
                        data: {
                            "userId": userId,
                            "password": this.users[userId].password
                        }
                    }).then((response) => {
                        if (response === 1) {
                            this.$refs['success'].show();
                        }
                    }).catch((error) => {
                        console.log(error);
                    })
                }
            }
        },
        mounted() {
            this.getUser();
        }
    }
</script>

<style scoped>

</style>