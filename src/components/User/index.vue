<template>
    <div id="svg-bg">
        <Navbar ref="navbar"/>

        <b-col class="p-md-2 p-0 container">
            <b-container v-if="loading" class="vh-100 my-md-5 my-0 py-md-5 py-0">
                <b-spinner variant="light" style="width: 3rem; height: 3rem; font-size: large;" label="Loading..."/>
            </b-container>
            <b-container v-else>
                <b-card-group deck class="text-center">
                    <b-card no-body border-variant="light" class="text-white bg-dark overflow-hidden rounded-0 m-md-3 m-0 my-1 b-md-5 b-0" style="min-width: 400px; border-width: 10px;" v-for="movie in movieList" :key="i=movie.tmdbid">
                        <b-row no-gutters @click="ratingModel(movie.tmdbid, movie.title)">
                            <b-col md="6" :id="'poster' + movie.tmdbid">
                                <b-card-img-lazy v-if="moviePostList[i]" :src='moviePostList[i]' class="rounded-0"/>
                                <b-card-img-lazy v-else src="https://www.themoviedb.org/assets/1/v4/logos/primary-green-d70eebe18a5eb5b166d5c1ef0796715b8d1a2cbc698f96d311d62f894ae87085.svg" />
                            </b-col>
                            <b-col md="6">
                                <b-card-body :title="movie.title" class="py-1 my-1">
                                    <b-card-text v-if="movieActorList[i]&&movieGenresList[i]">
                                        <p>{{movie.date}}</p>
                                        <p class="h6 text-left my-1 py-0"><strong>{{timestampToTime(movie.date)}}</strong></p>
                                        <p class="text-left my-1 py-0"><small>{{movieGenresList[i].join(' | ')}}</small></p>
                                        <p class="text-left my-1 py-0"><small>{{movieActorList[i].join(' | ')}}</small></p>
                                        <p class="text-left"><small>{{movieOverviewList[i].substr(0, [100]) + '...'}}</small></p>
                                    </b-card-text>
                                </b-card-body>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-card-group>

            </b-container>

            <Pagination ref='pagination' />
        </b-col>

        <b-modal centered ref="modal-rating" :title="model.title" @ok="addRating(model.tmdbid)" @close="closeRating">
            <b-img-lazy center :src='moviePostList[model.tmdbid]' class="text-center"/>

            <b-card no-body border-variant="light" class="text-white bg-dark overflow-hidden rounded-0 m-md-3 m-0 my-1 b-md-5 b-0" style="min-width: 400px; border-width: 10px;">
                <b-row no-gutters @click="ratingModel(model.tmdbid, model.title)">
                    <b-col md="6" :id="'poster' + model.tmdbid">
                        <b-card-img-lazy v-if="moviePostList[model.tmdbid]" :src='moviePostList[model.tmdbid]' class="rounded-0"/>
                        <b-card-img-lazy v-else src="https://www.themoviedb.org/assets/1/v4/logos/primary-green-d70eebe18a5eb5b166d5c1ef0796715b8d1a2cbc698f96d311d62f894ae87085.svg" />
                    </b-col>
                    <b-col md="6">
                        <b-card-body :title="model.title" class="py-1 my-1">
                            <b-card-text v-if="movieActorList[i]&&movieGenresList[model.tmdbid]">
                                <p class="h6 text-left my-1 py-0"><strong>{{timestampToTime(model.date)}}</strong></p>
                                <p class="text-left my-1 py-0"><small>{{movieGenresList[model.tmdbid].join(' | ')}}</small></p>
                                <p class="text-left my-1 py-0"><small>{{movieActorList[model.tmdbid].join(' | ')}}</small></p>
                            </b-card-text>
                        </b-card-body>
                    </b-col>
                </b-row>
            </b-card>

            <p class="my-4">{{movieOverviewList[model.tmdbid]}}</p>
            <p class="my-4">{{ model.tmdbid }}</p>

            <b-input-group>
                <b-input-group-prepend>
                    <b-button @click="value = null">清除</b-button>
                </b-input-group-prepend>
                <b-form-rating v-model="value" variant="info" stars="10"></b-form-rating>
                <b-input-group-append>
                    <b-input-group-text class="justify-content-center" style="min-width: 3em;">
                        {{ value / 2 }}
                    </b-input-group-text>
                </b-input-group-append>
            </b-input-group>
        </b-modal>
    </div>
</template>

<script>
    import Navbar from "@/components/Common/User/Navbar"
    import Pagination from "@/components/Common/User/Pagination";

    export default {
        name: "index",
        data () {
            return {
                loading: true,
                movieList: [],
                moviePostList: {},
                movieActorList: {},
                movieGenresList: {},
                movieOverviewList: {},

                model: {
                    tmdbid: "",
                    title: ""
                },

                isHovered: false,

                value: 0
            }
        },
        components: {
            'Pagination': Pagination,
            'Navbar': Navbar
        },
        methods: {
            // 获取电影总数
            getMovieCount() {
                this.$axios({
                    method: "GET",
                    url: "/api/movies/count"
                }).then((response) => {
                    this.$refs['pagination'].pageSum = Math.ceil(response.data / 24) * 20;
                    console.log(this.$refs['pagination'].pageSum)
                });
            },
            // 加载电影信息
            load() {
                this.loading = true;
                this.$axios({
                    method: "GET",
                    url: "/api/" + this.$refs['pagination'].currentPage + "/movies/" + "24",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then((response) => {
                    //window.console.log(response.data);
                    this.movieList = response.data;
                    this.getPoster();
                    this.getDetails();
                    this.loading = false;
                    //this.goUp();
                });
            },
            // 获取海报
            getPoster () {
                for (let m of this.movieList) {
                    this.$axios({
                        method: "GET",
                        url: "https://api.themoviedb.org/3/movie/" + m.tmdbid + "/images",
                        params: {
                            api_key: this.$global_msg.api_key,
                        }
                    }).then((response) => {
                        this.$set(this.moviePostList, m.tmdbid, this.$global_msg.poster_small + response.data.posters[0].file_path);
                    }).catch((error) => {
                        window.console.log(error)
                    });
                }
            },
            // 获取电影简介
            getDetails () {
                for (let m of this.movieList) {
                    this.$axios({
                        method: "GET",
                        url: "https://api.themoviedb.org/3/movie/" + m.tmdbid + "",
                        params: {
                            api_key: this.$global_msg.api_key,
                            language: "zh-CN,en-US,null",
                            append_to_response: "credits"
                        }
                    }).then((response) => {
                        let actors = [
                            response.data.credits.cast[0].name,
                            response.data.credits.cast[1].name,
                            response.data.credits.cast[2].name
                        ];
                        this.$set(this.movieActorList, m.tmdbid, actors);
                        let genres = [];
                        for (let g of response.data.genres) {
                            genres.push(g.name);
                        }
                        this.$set(this.movieGenresList, m.tmdbid, genres);
                        this.$set(this.movieOverviewList, m.tmdbid, response.data.overview);
                    }).catch((error) => {
                        window.console.log(error)
                    });
                }
            },
            // 评分
            ratingModel (tmdbid, title) {
                this.model.title = title;
                this.model.tmdbid = tmdbid;
                this.$refs['modal-rating'].show();
            },
            // 用户为电影评分
            addRating(tmdbId) {
                this.$axios({
                    method: 'POST',
                    url: '/api/rating',
                    data: {
                        "userId": localStorage.getItem("userId"),
                        "tmdbId": tmdbId,
                        "rating": this.value / 2
                    }
                }).then((response) => {
                    if (response === 1) {
                        this.value = 0;
                    }
                })
            },
            closeRating() {
                this.value = 0
            },
            hover(hovered) {
                this.isHovered = hovered;
            }
        },
        created () {
        },
        mounted () {
            this.getMovieCount();
            this.load();
        }
    }
</script>

<style scoped>
    #svg-bg {
        background-color: #ddffaa;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='207' height='207' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23AE9' points='120 120 60 120 90 90 120 60 120 0 120 0 60 60 0 0 0 60 30 90 60 120 120 120 '/%3E%3C/svg%3E");
    }
</style>