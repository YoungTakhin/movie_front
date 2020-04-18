<template>
    <div id="svg-bg">
        <Navbar ref="navbar"/>

        <b-col class="p-md-2 p-0 container">
            <b-container v-if="loading" class="vh-100 my-md-5 my-0 py-md-5 py-5">
                <b-spinner variant="light" style="width: 3rem; height: 3rem; font-size: large;" label="Loading..."></b-spinner>
            </b-container>
            <b-container v-else>
                <b-card-group deck class="text-center">
                    <b-card no-body class="text-white bg-dark overflow-hidden border-0 rounded-0 m-md-3 m-0" style="min-width: 320px;" v-for="movie in movieList" :key="i=movie.tmdbid">
                        <b-row no-gutters>
                            <b-col md="6" :id="'poster' + movie.tmdbid">
                                <b-card-img-lazy v-if="moviePostList[i]" :src='moviePostList[i]' class="rounded-0"/>
                                <b-card-img-lazy v-else src="https://www.themoviedb.org/assets/1/v4/logos/primary-green-d70eebe18a5eb5b166d5c1ef0796715b8d1a2cbc698f96d311d62f894ae87085.svg"/>
                            </b-col>
                            <b-col md="6">
                                <b-card-body :title="movie.title">
                                    <b-card-text v-if="movieActorList[i]&&movieGenresList[i]">
                                        <h6>{{movie.recommendScore}}</h6>
                                        <!--                                    {{moviePostList[index]}}-->
                                        <p class="h6 text-left my-1 py-0"><strong>{{timestampToTime(movie.date)}}</strong></p>
                                        <p class="text-left my-1 py-0"><small>{{movieGenresList[i].join(' | ')}}</small></p>
                                        <p class="text-left my-1 py-0"><small>{{movieActorList[i].join(' | ')}}</small></p>
                                        <p class="text-left"><small>{{movieOverviewList[i].substr(0, [100]) + '...'}}</small></p>
<!--                                        {{index}}-->
<!--                                        {{moviePostList[i]}}-->
                                    </b-card-text>
                                </b-card-body>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-card-group>
            </b-container>

        </b-col>
    </div>
</template>

<script>
    import Navbar from "@/components/Common/User/Navbar"

    export default {
        name: "index",
        data () {
            return {
                loading: true,
                movieList: [],
                moviePostList: {},
                movieActorList: {},
                movieGenresList: {},
                movieOverviewList: {}
            }
        },
        components: {
            'Navbar': Navbar
        },
        methods: {
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
            }
        },
        created() {
            let user =  JSON.parse(localStorage.getItem("user"));
            this.$axios({
                method: "GET",
                url: "/api/"+ user.userId +"/recommend",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                this.movieList = response.data.recommendList;
                this.getPoster();
                this.getDetails();
                this.loading = false;
            });
        }
    }
</script>

<style scoped>
    #svg-bg {
        background-color: #ddffaa;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='207' height='207' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23AE9' points='120 120 60 120 90 90 120 60 120 0 120 0 60 60 0 0 0 60 30 90 60 120 120 120 '/%3E%3C/svg%3E");
    }
</style>