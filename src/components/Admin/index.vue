<template>
    <div>
        <Navbar/>

        <b-container>
            <b-row>
                <b-col cols="12" sm="8" class="my-1">
                    <b-form-group
                            label="搜索用户"
                            label-cols-sm="3"
                            label-align-md="2"
                            label-align-sm="right"
                            label-for="filterInput"
                            class="mb-0"
                    >
                        <b-input-group>
                            <b-form-input
                                    v-model="filter"
                                    id="filterInput"
                                    placeholder="请输入用户名或ID"
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">清空</b-button>
                                <b-dropdown size="sm" v-bind:text="dropdownLabel" variant="info">
                                    <b-dropdown-item @click="setFilter(1)">用户ID</b-dropdown-item>
                                    <b-dropdown-item @click="setFilter(2)">用户名</b-dropdown-item>
                                </b-dropdown>
                                <b-button variant="info" @click="search">搜索</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>

                <b-col cols="12" sm="4" md="4" class="my-1">
                    <b-form-group
                            label="每页记录数"
                            label-cols-sm="7"
                            label-cols-md="6"
                            label-cols-lg="4"
                            label-align-sm="right"
                            label-for="perPageSelect"
                            class="mb-0"
                    >
                        <b-form-select
                                v-model="perPage"
                                id="perPageSelect"
                                :options="pageOptions"
                        ></b-form-select>
                    </b-form-group>
                </b-col>

                <b-col class="my-1">
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="pageSum"
                            :per-page="perPage"
                            align="center"
                            class="my-0"
                    ></b-pagination>
                </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
                    show-empty
                    empty-text="搜索结果为空"
                    hover
                    stacked="md"
                    :items="users"
                    :fields="fields"
                    :per-page="perPage"
            >
                <template v-slot:cell(userId)="data" >
                    {{data.item.userId}}
                </template>
                <template v-slot:cell(userName)="data" >
                    {{ data.item.userName }}
                </template>
                <template v-slot:cell(sex)="data" >
                    {{ data.item.sex? '男':'女' }}
                </template>
                <template v-slot:cell(操作)="row">
                    <b-button size="sm" @click="row.toggleDetails" class="mr-1" variant="info">
                        <b-icon-pencil-square></b-icon-pencil-square>
                    </b-button>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-form-group
                                label-cols-lg="3"
                                label="更改密码"
                                label-size="lg"
                                label-class="font-weight-bold pt-0"
                                class="mb-0"
                        >
                            <b-form-group
                                    label-cols-sm="3"
                                    label="密码"
                                    label-align-sm="right"
                                    label-for="password"
                            >
                                <b-form-input type="password" v-model.trim="row.item.password"></b-form-input>
                            </b-form-group>
                            <b-form-group class="text-right">
                                <b-button variant="primary" @click="info(row.item, row.index, $event.target)">确认修改</b-button>
                            </b-form-group>
                        </b-form-group>
                    </b-card>
                </template>
            </b-table>

            <!-- Info modal -->
            <b-modal :id="infoModal.id" :title="infoModal.title" hide-footer @hide="resetInfoModal">
                确定要更改密码吗？
                <b-button class="mt-2" variant="primary" block @click="updatePassword(infoModal.userId)">确定</b-button>
<!--                <pre>{{ infoModal.content }}</pre>-->
            </b-modal>

            <b-modal ref="success" title="更改成功" header-bg-variant="success" header-text-variant="text" class="text-center">
                <p class="my-4">更改密码成功！</p>
            </b-modal>
        </b-container>

    </div>
</template>

<script>
    import Navbar from "@/components/Common/Admin/Navbar";

    export default {
        name: "index",
        components: {
            Navbar
        },
        data () {
            return {
                fields: [
                    {key: 'userId', label: '用户ID'},
                    {key: 'userName', label: '用户名'},
                    {key: 'sex', label: '性别'}, '操作'],
                users: [],

                pageSum: 0,

                currentPage: 1,
                perPage: 20,
                pageOptions: [20, 50, 100],

                dropdown: 1,
                dropdownLabel: 'ID',

                filter: null,
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                },
            }
        },
        watch: {
            perPage: function () {
                if (this.filter === '') {
                    this.getUsers();
                } else {
                    this.search();
                }
            },
            currentPage: function () {
                this.getUsers();
            }
        },
        methods: {
            // 获取用户列表
            getUsers() {
                this.$axios.post('/api/' + this.currentPage + '/users/' + this.perPage).then((response) => {
                    this.users = response.data;
                })
            },
            // 获取用户总数
            getUserCount() {
                this.$axios.get('/api/users/count').then((response) => {
                    this.pageSum = Math.ceil(response.data / this.perPage) * 20;
                })
            },
            setFilter(index) {
                if (index === 1) {
                    this.dropdown = 1;
                    this.dropdownLabel = 'ID';
                } else {
                    this.dropdown = 2;
                    this.dropdownLabel = '用户名';
                }
            },
            // 搜索用户
            search() {
                if (this.filter === '' || this.filter == null) {
                    this.getUserCount();
                    this.getUsers();
                } else if (this.dropdown === 1 && typeof(this.filter) !== 'string') {
                    this.$axios.get('/api/user/'+this.filter).then((response)=>{
                        this.users = [
                            response.data
                        ];
                    }).catch(() => {
                        this.users = [];
                    })
                } else if (this.dropdown === 2) {
                    this.$axios({
                        method: 'GET',
                        url: '/api/users/search/count',
                        params: {
                            userName: this.filter
                        }
                    }).then((response) => {
                        this.pageSum = Math.ceil(response.data / this.perPage) * 20;
                        console.log(this.filter);
                        console.log(this.pageSum);
                    });
                    this.$axios.get('/api/' + this.currentPage + '/users/' + this.perPage + '/' + this.filter).then((response)=>{
                        this.users = response.data;
                    }).catch(() => {
                        this.users = [];
                    })
                } else {
                    this.users = [];
                }
            },
            info(item, index, button) {
                this.infoModal.userId = index;
                this.infoModal.title = `用户: ${index} 更改密码`;
                this.infoModal.content = JSON.stringify(item, null, 2);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
            },
            resetInfoModal() {
                this.infoModal.title = '';
                this.infoModal.content = '';
            },
            // 更改密码
            updatePassword(userId) {
                if (this.users[userId].password.length >= 6 && this.users[userId].password.length <= 16) {
                    this.$axios({
                        method: "POST",
                        url: "/api/user/password",
                        data: {
                            "userId": userId,
                            "password": this.users[userId].password
                        }
                    }).then(() => {
                        this.$refs['success'].show();
                    })
                }
            }
        },
        mounted() {
            this.getUsers();
            this.getUserCount();
        },
    }
</script>

<style scoped>

</style>