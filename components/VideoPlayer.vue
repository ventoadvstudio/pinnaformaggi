<template>
  <div class="video-player relative cursor-pointer" @click="play">
    <img
      :src="thumbnail.url ? thumbnail.url : thumbnail"
      :alt="thumbnail.alt ? thumbnail.alt : ''"
      class="w-full h-full object-cover"
    />
    <!--    <div-->
    <!--      class="video-player__play-button absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-1"-->
    <!--    ></div>-->
  </div>
</template>
<script>
export default {
  props: {
    thumbnail: {
      type: [String, Object],
      required: true,
    },
    sources: {
      type: Array,
      required: true,
    },
  },
  methods: {
    play() {
      this.$root.$emit('playVideo', this.sources)
    },
  },
}
</script>
<style>
.video-player {
  &__play-button {
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: 0;
    height: 74px;
    border-color: transparent transparent transparent
      theme('colors.olive.default');
    border-style: solid;
    border-width: 37px 0 37px 60px;
  }
}
</style>
