<template>
  <div>
    <p class="home-bottom-message">
      <app-i18n code="home.message"></app-i18n>
    </p>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'app-home-page',


  created() {
    if (this.isMobile) {
      this.collapseMenu();
    }
  },
  computed: {
    ...mapGetters({
      isMobile: 'layout/isMobile',
    })
  },

  methods: {
    ...mapActions({
      collapseMenu: 'layout/collapseMenu',
    })
  }
};
</script>

<style scoped>
.el-col {
  margin-bottom: 16px;
}

.home-bottom-message {
  width: 100%;
  text-align: center;
  color: grey;
}
</style>
