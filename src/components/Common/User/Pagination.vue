<template>
    <div>
        <div class="mt-3">
            <b-pagination limit="9" v-model="currentPage" :total-rows="pageSum" align="center"/>
        </div>


        <!-- Info modal -->
        <b-modal ref="info" hide-footer>
            确定要更改密码吗？
            <b-button class="mt-2" variant="primary" block @click="updatePassword(infoModal.userId)">确定</b-button>
            <!--                <pre>{{ infoModal.content }}</pre>-->
        </b-modal>

        <b-modal ref="success" title="更改成功" header-bg-variant="success" header-text-variant="text" class="text-center">
            <p class="my-4">更改密码成功！</p>
        </b-modal>
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