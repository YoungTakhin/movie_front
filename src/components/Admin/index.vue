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
                            label-size="sm"
                            label-for="filterInput"
                            class="mb-0"
                    >
                        <b-input-group size="sm">
                            <b-form-input
                                    v-model="filter"
                                    id="filterInput"
                                    placeholder="请输入用户名或ID"
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">清空</b-button>
                                <b-dropdown size="sm" v-bind:text="dropdownLabel+':'+dropdown" variant="info">
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
                            label-cols-sm="6"
                            label-cols-md="6"
                            label-cols-lg="4"
                            label-align-sm="right"
                            label-size="sm"
                            label-for="perPageSelect"
                            class="mb-0"
                    >
                        <b-form-select
                                v-model="perPage"
                                id="perPageSelect"
                                size="sm"
                                :options="pageOptions"
                        ></b-form-select>
                    </b-form-group>
                </b-col>

                <b-col class="my-1">
                    <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            align="center"
                            class="my-0"
                    ></b-pagination>
                </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table
                    show-empty
                    small
                    stacked="md"
                    :items="users"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
            >
                <template v-slot:cell(操作)="row">
                    <b-button size="sm" @click="row.toggleDetails" class="mr-1" variant="info">
                        {{ row.detailsShowing ? 'Hide' : 'Show' }} 更新
                    </b-button>
                    <b-button size="sm" @click="info(row.item, row.index, $event.target)" variant="danger">
                        删除
                    </b-button>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        更新表单
                        <ul>
                            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                        </ul>
                    </b-card>
                </template>
            </b-table>

            <!-- Info modal -->
            <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
                <pre>{{ infoModal.content }}</pre>
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
                fields: ['userId', 'userName', 'sex', '操作'],
                users: [],

                totalRows: 1,
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
                }
            }
        },
        watch: {
            perPage: function () {
                this.getUsers();
            }
        },
        computed: {
        },
        methods: {
            // 获取用户列表
            getUsers() {
                console.log(this.currentPage);
                console.log(this.perPage);
                this.$axios.post('/api/' + this.currentPage + '/users/' + this.perPage).then((response) => {
                    this.users = response.data;
                })
            },
            setFilter(index) {
                if (index == 1) {
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
                    this.getUsers();
                } if (this.dropdown === 1 && typeof(this.filter) !== 'string') {
                    this.$axios.get('/api/user/'+this.filter).then((response)=>{
                        this.users = [
                            response.data
                        ];
                    }).catch(() => {
                        this.users = [];
                    })
                } else if (this.dropdown === 2) {
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
                this.infoModal.title = `Row index: ${index}`;
                this.infoModal.content = JSON.stringify(item, null, 2);
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
            },
            resetInfoModal() {
                this.infoModal.title = '';
                this.infoModal.content = '';
            }
        },
        mounted() {
            this.getUsers();
            this.totalRows = this.users.length
        },
    }
</script>

<style scoped>

</style>