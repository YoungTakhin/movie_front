<template>
    <div>
        <b-sidebar id="sidebar" title="个人中心" right shadow lazy>
            <div class="px-2 py-2 text-left">
                <dl class="row">
                    <dt class="col-4">ID:</dt>
                    <dd class="col-8">{{user.userId}}</dd>


                    <dt class="col-4">用户名:</dt>
                    <dd class="col-8">{{user.userName}}</dd>
                </dl>

<!--                <label>您的ID：</label>-->
<!--                <b-input-group for="id">-->
<!--                    <b-form-input id="id" aria-label="Small text input with custom switch"></b-form-input>-->
<!--                    <b-input-group-append is-text>-->
<!--                        <b-form-checkbox switch class="mr-n2 mb-n1">-->
<!--                            <span class="sr-only">Checkbox for previous text input</span>-->
<!--                        </b-form-checkbox>-->
<!--                    </b-input-group-append>-->
<!--                </b-input-group>-->
<!--                <div>-->
<!--                    <b-badge variant="info" class="mb-3">点击右边开关修改</b-badge>-->
<!--                </div>-->

<!--                <label>您的用户名：</label>-->
<!--                <b-input-group for="username">-->
<!--                    <b-form-input id="username" :value=user.userName v-model=user.userName></b-form-input>-->
<!--                    <b-input-group-append is-text>-->
<!--                        <b-form-checkbox switch class="mr-n2 mb-n1">-->
<!--                            <span class="sr-only">Checkbox for previous text input</span>-->
<!--                        </b-form-checkbox>-->
<!--                    </b-input-group-append>-->
<!--                </b-input-group>-->
<!--                <div>-->
<!--                    <b-badge variant="info" class="mb-3">点击右边开关修改</b-badge>-->
<!--                </div>-->

<!--                <label>您的密码：</label>-->
<!--                <b-input-group for="id">-->
<!--                    <b-form-input id="id" aria-label="Small text input with custom switch"></b-form-input>-->
<!--                    <b-input-group-append is-text>-->
<!--                        <b-form-checkbox switch class="mr-n2 mb-n1">-->
<!--                            <span class="sr-only">Checkbox for previous text input</span>-->
<!--                        </b-form-checkbox>-->
<!--                    </b-input-group-append>-->
<!--                </b-input-group>-->
<!--                <div>-->
<!--                    <b-badge variant="info" class="mb-3">点击右边开关修改</b-badge>-->
<!--                </div>-->
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                    in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                </p>
                <b-img src="https://picsum.photos/500/500/?image=54" fluid thumbnail></b-img>
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
            }
        },
        mounted() {
            this.getUser();
        }
    }
</script>

<style scoped>

</style>