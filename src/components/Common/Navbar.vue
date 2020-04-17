<template>
    <b-navbar id="nav-bg" toggleable="lg" type="dark" class="sticky-top">
        <b-navbar-brand href="#/home">电影首页</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"/>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#/recommend/">推荐</b-nav-item>
                <b-nav-item href="#" disabled>Disabled</b-nav-item>
            </b-navbar-nav>

            <Sidebar ref="sidebar"></Sidebar>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" placeholder="在此搜索" v-model="searchText"/>
                    <b-button size="sm" class="m-sm-0" @click="clickSearch()">
                        <b-icon icon="search" scale="1.5"/>
                    </b-button>
                </b-nav-form>

                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template v-slot:button-content>
                        <em>用户</em>
                    </template>
                    <b-dropdown-item href="#" v-b-toggle.sidebar>用户中心</b-dropdown-item>
                    <b-dropdown-item href="#" @click="logout">注销</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    import {mapActions} from "vuex";
    import {USER_SIGNOUT} from "@/store/user";
    import Sidebar from "@/components/Common/Sidebar";

    export default {
        name: "Navbar",
        components: {Sidebar},
        data () {
            return {
                searchText: '',
                tempSearchText: ''
            }
        },
        methods: {
            ...mapActions([USER_SIGNOUT]),
            logout () {
                this.USER_SIGNOUT();
                this.$router.replace({ path: '/login' })
            },
            searchCount () {
                return this.$axios({
                    method: "GET",
                    url: "/api/movies/search/count",
                    params: {
                        "movieName": this.tempSearchText
                    }
                })
            },
            searchName () {
                return this.$axios({
                    method: "POST",
                    url: "/api/movies/search",
                    data: {
                        "movieName": this.tempSearchText,
                        "pageNo": this.$parent.currentPage
                    }
                })
            },
            searching () {
                this.$parent.isSearch = true;
                let t = this.tempSearchText;
                if (typeof t == "undefined" || t == null || t === "") {
                    this.$router.go(0);
                } else {
                    this.$axios.all([
                        this.searchCount(),
                        this.searchName()
                    ]).then(this.$axios.spread((response1, response2) => {
                        this.$parent.pageSum = Math.ceil(response1.data / 24) * 20;
                        this.$parent.movieList = response2.data;
                        this.$parent.getPoster();
                        this.$parent.getDetails();
                    } ))
                }
            },
            clickSearch() {
                this.tempSearchText = this.searchText;
                this.searching();
            },
            clickUserCenter() {
            }
        }
    }
</script>

<style scoped>
    #nav-bg {
        background-color:rgba(54,57,63,0.9);
    }
</style>