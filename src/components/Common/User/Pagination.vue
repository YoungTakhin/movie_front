<template>
    <div>
        <div class="mt-3">
            <b-pagination limit="9" v-model="currentPage" :total-rows="pageSum" align="center"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Pagination",
        data () {
            return {
                isSearch: false,

                pageSum: 0, // 总页数*20，总页数=电影数/24，向上取整
                currentPage: 1,
            }
        },
        watch: {
            currentPage: function () {
                if (!this.isSearch) {
                    this.$parent.load();
                } else {
                    this.$parent.$refs['navbar'].searching();
                }
            }
        },
    }
</script>

<style scoped>

</style>