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
                                        <p class="h6 text-left my-1 py-0"><strong>{{timestampToTime(movie.date)}}</strong></p>
                                        <p class="text-left my-1 py-0"><small>{{movieGenresList[i].join(' | ')}}</small></p>
                                        <p class="text-left my-1 py-0"><small>{{movieActorList[i].join(' | ')}}</small></p>
                                        <p class="text-left"><small>{{movieOverviewList[i].substr(0, [150]) + '...'}}</small></p>
                                    </b-card-text>
                                </b-card-body>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-card-group>

            </b-container>

            <Pagination ref='pagination' />
        </b-col>


        <b-modal centered ref="modal-rating" :title="'为《' + model.title + '》评分'">
            <b-img-lazy center :src='moviePostList[model.tmdbid]' class="text-center"/>
            <p class="my-4">{{movieOverviewList[model.tmdbid]}}</p>
            <p class="my-4">{{ model.tmdbid }}</p>
<!--            <b-form-rating v-model="value" :locale="locale" show-value precision="1"></b-form-rating>-->
            <output dir="ltr" tabindex="0" role="slider" aria-live="off" aria-valuemin="1" aria-valuemax="5" aria-valuenow="3" class="b-rating form-control align-items-center mb-2 d-flex" id="__BVID__495"><span tabindex="-1" class="b-rating-star flex-grow-1 b-rating-star-full"><span class="b-rating-icon"><svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-star-fill b-icon bi text-danger"><g><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></g></svg></span></span><span tabindex="-1" class="b-rating-star flex-grow-1 b-rating-star-full"><span class="b-rating-icon"><svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-star-fill b-icon bi text-danger"><g><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></g></svg></span></span><span tabindex="-1" class="b-rating-star flex-grow-1 b-rating-star-full"><span class="b-rating-icon"><svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-star-fill b-icon bi text-danger"><g><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></g></svg></span></span><span tabindex="-1" class="b-rating-star flex-grow-1 b-rating-star-empty"><span class="b-rating-icon"><svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-star b-icon bi text-danger"><g><path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 00-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 00-.163-.505L1.71 6.745l4.052-.576a.525.525 0 00.393-.288l1.847-3.658 1.846 3.658a.525.525 0 00.393.288l4.052.575-2.906 2.77a.564.564 0 00-.163.506l.694 3.957-3.686-1.894a.503.503 0 00-.461 0z" clip-rule="evenodd"></path></g></svg></span></span><span tabindex="-1" class="b-rating-star flex-grow-1 b-rating-star-empty"><span class="b-rating-icon"><svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-star b-icon bi text-danger"><g><path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 00-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 00-.163-.505L1.71 6.745l4.052-.576a.525.525 0 00.393-.288l1.847-3.658 1.846 3.658a.525.525 0 00.393.288l4.052.575-2.906 2.77a.564.564 0 00-.163.506l.694 3.957-3.686-1.894a.503.503 0 00-.461 0z" clip-rule="evenodd"></path></g></svg></span></span></output>

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

                isHovered: false
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
                    url: "/api/" + this.$refs['pagination'].currentPage + "/movies",
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
            //获取海报
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