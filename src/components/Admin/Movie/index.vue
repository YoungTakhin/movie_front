<template>
    <div>
        <Navbar/>

        <b-container>
            <b-row>
                <b-col cols="12" sm="8" class="my-1">
                    <b-form-group
                            label="搜索电影"
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
                                    placeholder="请输入电影名或TMDB ID"
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">清空</b-button>
                                <b-dropdown size="sm" v-bind:text="dropdownLabel" variant="info">
                                    <b-dropdown-item @click="setFilter(1)">TMDB ID</b-dropdown-item>
                                    <b-dropdown-item @click="setFilter(2)">电影名</b-dropdown-item>
                                </b-dropdown>
                                <b-button variant="info" @click="search"><b-icon-search></b-icon-search></b-button>
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

            <b-col>
                <b-button @click="showModal" variant="primary" class="mb-1">添加电影</b-button>
            </b-col>

            <!-- Main table element -->
            <b-table
                    show-empty
                    empty-text="搜索结果为空"
                    hover
                    stacked="md"
                    :items="movies"
                    :fields="fields"
                    :per-page="perPage"
            >
                <template v-slot:cell(genres)="data" >
                    {{ getGenres(data.item.genres) }}
                </template>
                <template v-slot:cell(date)="data" >
                    {{ timestampToTime(data.item.date) }}
                </template>
                <template v-slot:cell(操作)="row">
                    <b-button size="sm" @click="row.toggleDetails" class="mr-1" variant="info">
                        <b-icon-eye></b-icon-eye>
                    </b-button>
                    <b-button size="sm" @click="deleteMovie(row.item, row.index)" class="mr-1" variant="danger">
                        <b-icon-trash></b-icon-trash>
                    </b-button>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-form-group
                                label-cols-lg="3"
                                label="详细信息"
                                label-size="lg"
                                label-class="font-weight-bold pt-0"
                                class="mx-0"
                        >
                            <b-form-group>
                                <b-row class="mb-2">
                                    <b-col sm="3" class="text-sm-right"><b>制作成本:</b></b-col>
                                    <b-col>{{ row.item.budget }}</b-col>
                                </b-row>
                                <b-row class="mb-2">
                                    <b-col sm="3" class="text-sm-right"><b>票房:</b></b-col>
                                    <b-col>{{ row.item.revenue }}</b-col>
                                </b-row>
                                <b-row class="mb-2">
                                    <b-col sm="3" class="text-sm-right"><b>TMDB评分:</b></b-col>
                                    <b-col>
                                        <b-form-rating
                                                v-model="row.item.vote"
                                                icon-empty="heart"
                                                icon-half="heart-half"
                                                icon-full="heart-fill"
                                                icon-clear="slash-circle"
                                                show-clear
                                                variant="danger"
                                                readonly
                                                show-value
                                                show-value-max
                                                stars="10"
                                                size="sm"
                                        ></b-form-rating>
                                    </b-col>
                                </b-row>
                                <b-row class="mb-2">
                                    <b-col sm="3" class="text-sm-right"><b>TMDB评分人数:</b></b-col>
                                    <b-col>{{ row.item.vote_count }}</b-col>
                                </b-row>
                            </b-form-group>
                        </b-form-group>
                    </b-card>
                </template>
            </b-table>

            <!-- Info modal -->
            <b-modal @ok="deleting(deleteModal.tmdbId)" ref="delete-Modal" :title="deleteModal.title" @hide="resetDeleteModal">
                确定要删除电影吗？
            </b-modal>

            <b-modal @ok="reload" ref="success" title="删除成功" header-bg-variant="success" header-text-variant="text" class="text-center">
                <p class="my-4">删除电影成功！</p>
            </b-modal>

            <b-modal @ok="reload" id="success-insert" ref="success-insert" title="新增成功" header-bg-variant="success" header-text-variant="text" class="text-center">
                <p class="my-4">新增电影成功！</p>
            </b-modal>

            <b-modal id="error-insert" ref="error-insert" title="新增失败" header-bg-variant="danger" header-text-variant="text" class="text-center">
                <p class="my-4">新增电影失败！请检查信息</p>
            </b-modal>
        </b-container>

        <b-modal
                id="modal-insert"
                ref="modal-insert"
                title="添加电影"
                @ok="insert"
        >
            <b-form-group
                    label="TMDB ID"
                    label-for="tmdbId"
            >
                <b-form-input
                        id="tmdbId"
                        v-model="insertMovie.tmdbId"
                        required
                ></b-form-input>
            </b-form-group>
            <b-form-group
                    label="电影名"
                    label-for="title"
            >
                <b-form-input
                        id="title"
                        v-model="insertMovie.title"
                        required
                ></b-form-input>
            </b-form-group>
            <b-form-group
                    label="分类"
                    label-for="genres"
            >
                <b-form-tags v-model="insertMovie.genres" size="lg" add-on-change no-outer-focus class="mb-2">
                    <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                        <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                            <li v-for="tag in tags" :key="tag" class="list-inline-item">
                                <b-form-tag
                                        @remove="removeTag(tag)"
                                        :title="tag"
                                        :disabled="disabled"
                                        variant="info"
                                >{{ tag }}</b-form-tag>
                            </li>
                        </ul>
                        <b-form-select
                                v-bind="inputAttrs"
                                v-on="inputHandlers"
                                :disabled="disabled || availableOptions.length === 0"
                                :options="availableOptions"
                        >
                            <template v-slot:first>
                                <!-- This is required to prevent bugs with Safari -->
                                <option disabled value="">选择分类</option>
                            </template>
                        </b-form-select>
                    </template>
                </b-form-tags>
            </b-form-group>
            <b-form-group
                    label="上映日期"
                    label-for="date"
            >
                <b-form-datepicker show-decade-nav id="date" v-model="insertMovie.date" class="mb-2"></b-form-datepicker>
            </b-form-group>
            <b-form-group
                    label="制作成本"
                    label-for="budget"
            >
                <b-form-input
                        id="budget"
                        v-model="insertMovie.budget"
                        required
                ></b-form-input>
            </b-form-group>
            <b-form-group
                    label="票房"
                    label-for="revenue"
            >
                <b-form-input
                        id="revenue"
                        v-model="insertMovie.revenue"
                        required
                ></b-form-input>
            </b-form-group>
            <b-form-group
                    label="TMDB评分"
                    label-for="vote"
            >
                <b-form-input
                        id="vote"
                        v-model="insertMovie.vote"
                        required
                ></b-form-input>
            </b-form-group>
            <b-form-group
                    label="TMDB评分人数"
                    label-for="count"
            >
                <b-form-input
                        id="count"
                        v-model="insertMovie.count"
                        required
                ></b-form-input>
            </b-form-group>
        </b-modal>

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
                    {key: 'tmdbid', label: 'TMDB ID'},
                    {key: 'title', label: '电影名'},
                    {key: 'genres', label: '类别'},
                    {key: 'date', label: '上映日期'},
                    '操作'],
                movies: [],

                insertMovie: {
                    tmdbId: null,
                    title: '',
                    date: null,
                    genres: [],
                    budget: 0,
                    revenue: 0,
                    vote: 0,
                    count: 0
                },
                options: ["Adventure", "Fantasy", "Animation", "Drama", "Horror", "Action", "Comedy", "History", "Western", "Thriller", "Crime",
                    "Documentary", "Science Fiction", "Mystery", "Music", "Romance", "Family", "War", "TV Movie",],

                pageSum: 0,
                currentPage: 1,
                perPage: 20,
                pageOptions: [20, 50, 100],

                dropdown: 1,
                dropdownLabel: 'TMDB ID',

                filter: null,

                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                },
                deleteModal: {
                    id: 'delete-modal',
                    title: '',
                    tmdbId: 0
                },
                genres: {
                    "12": "Adventure",
                    "14": "Fantasy",
                    "16": "Animation",
                    "18": "Drama",
                    "27": "Horror",
                    "28": "Action",
                    "35": "Comedy",
                    "36": "History",
                    "37": "Western",
                    "53": "Thriller",
                    "80": "Crime",
                    "99": "Documentary",
                    "878": "Science Fiction",
                    "9648": "Mystery",
                    "10402": "Music",
                    "10749": "Romance",
                    "10751": "Family",
                    "10752": "War",
                    "10770": "TV Movie",
                }
            }
        },
        watch: {
            perPage: function () {
                if (this.filter === '') {
                    this.getMovies();
                } else {
                    this.search();
                }
            },
            currentPage: function () {
                this.search();
            },
        },
        computed: {
            availableOptions() {
                return this.options.filter(opt => this.insertMovie.genres.indexOf(opt) === -1)
            }
        },
        methods: {
            getMovies() {
                this.$axios.get('/api/' + this.currentPage + '/movies/' + this.perPage).then((response) => {
                    this.movies = response.data;
                })
            },
            getMovieCount() {
                this.$axios.get('/api/movies/count')
                .then((response) => {
                    this.pageSum = Math.ceil(response.data / this.perPage) * this.perPage;
                })
            },
            setFilter(index) {
                if (index === 1) {
                    this.dropdown = 1;
                    this.dropdownLabel = 'TMDB ID';
                } else {
                    this.dropdown = 2;
                    this.dropdownLabel = '电影名';
                }
            },
            search() {
                if (this.filter === '' || this.filter == null) {
                    this.getMovieCount();
                    this.getMovies();
                } else if (this.dropdown === 1) {
                    this.$axios.get('/api/movie/'+this.filter).then((response)=>{
                        this.movies = [
                            response.data
                        ];
                        this.pageSum = Math.ceil(response.data / this.perPage) * this.perPage;
                    }).catch(() => {
                        this.movies = [];
                    })
                } else if (this.dropdown === 2) {
                    this.$axios({
                        method: 'GET',
                        url: '/api/movies/search/count',
                        params: {
                            movieName: this.filter
                        }
                    }).then((response) => {
                        this.pageSum = Math.ceil(response.data / this.perPage) * this.perPage;
                    });
                    this.$axios({
                        method: 'POST',
                        url: '/api/movies/search',
                        data: {
                            movieName: this.filter,
                            pageNo: this.currentPage,
                            perPage: this.perPage
                        }
                    }).then((response)=>{
                        this.movies = response.data;
                    }).catch(() => {
                        this.movies = [];
                    })
                } else {
                    this.movies = [];
                }
            },
            deleting(tmdbid) {
                this.$axios({
                    method: 'POST',
                    url: '/api/movie/delete/' + tmdbid,
                }).then((response) => {
                    if (response.data === 1) {
                        this.$refs['success'].show();
                    }
                })
            },
            deleteMovie(item, index) {
                this.deleteModal.index = index;
                this.deleteModal.title = `删除电影: ${item.tmdbid}`;
                this.deleteModal.tmdbId = item.tmdbid;
                this.$refs['delete-Modal'].show();
            },
            resetInfoModal() {
                this.infoModal.title = '';
                this.infoModal.content = '';
            },
            resetDeleteModal() {
                this.deleteMovie.tmdbId = 0;
                this.deleteModal.title = '';
                this.deleteModal.content = '';
            },
            // 格式化电影类别
            getGenres(genres) {
                let genresList = [];
                for (let g of genres.split('|')) {
                    genresList.push(this.genres[g]);
                }
                return genresList.join(' / ');
            },
            showModal() {
                this.$refs['modal-insert'].show()
            },
            insert() {
                let genresList = [];
                for (let g in this.genres) {
                    for (let i of this.insertMovie.genres) {
                        if (i === this.genres[g]) {
                            genresList.push(g)
                        }
                    }
                }
                let genres = genresList.join("|");
                this.$axios({
                    method: 'POST',
                    url: '/api/movie/insert',
                    params: {
                        tmdbId: this.insertMovie.tmdbId,
                        title: this.insertMovie.title,
                        date: this.insertMovie.date,
                        genres: genres,
                        budget: this.insertMovie.budget,
                        revenue: this.insertMovie.revenue,
                        vote: this.insertMovie.vote,
                        count: this.insertMovie.count,
                    }
                }).then((response) => {
                    if (response.data === 1) {
                        this.$refs['success-insert'].show();
                    } else {
                        this.$refs['error-insert'].show();
                    }
                }).catch(() => {
                    this.$refs['error-insert'].show();
                })
            },
            reload() {
                location.reload()
            }
        },
        mounted() {
            this.getMovieCount();
            this.getMovies();
        }
    }
</script>

<style scoped>

</style>