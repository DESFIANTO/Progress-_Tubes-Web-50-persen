<template>
  <div id="app" v-if="!loadingInit">
    <router-view v-slot="{Component}">
    <transition mode="out-in" name="fade">
    <component :is="Component"/>
    </transition>
    </router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'app',

  created() {
    this.doInit();
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    ...mapActions({
      doInit: 'auth/doInit',
      resize: 'layout/resize',
    }),

    handleResize() {
      this.resize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    },
  },

  computed: {
    ...mapGetters({
      loadingInit: 'auth/loadingInit',
    }),
  },
};
</script>

<style>
</style>
