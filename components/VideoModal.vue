<template>
  <div
    v-show="sources.length > 0"
    class="video-modal fixed top-0 right-0 bottom-0 left-0 w-full h-full z-100 flex items-center"
    :class="{ hidden: !active }"
    data-datocms-noindex
    @click.self="close"
  >
    <div class="video-modal__video-container mx-auto relative">
      <video
        v-show="active"
        ref="video"
        controls
        class="max-h-screen focus:outline-none"
      >
        <source
          v-for="(source, i) in sources"
          :key="`source-${i}`"
          :src="source.url"
          :type="source.mimeType"
        />
      </video>
      <button
        class="video-modal__close absolute focus:outline-none"
        @click.capture="close"
      >
        <Close />
      </button>
    </div>
  </div>
</template>
<script>
import Close from '@/assets/icons/close.svg?inline'
export default {
  components: {
    Close,
  },
  data() {
    return {
      active: false,
      sources: [],
    }
  },
  mounted() {
    this.$root.$on('playVideo', (sources) => {
      this.sources = sources
      this.active = true
      this.$refs.video.load()
      this.$refs.video.play()
    })
  },
  methods: {
    close({ target }) {
      if (!target.classList.contains('video-modal__video')) {
        this.active = false
        this.sources = []
        this.$refs.video.pause()
      }
    },
  },
}
</script>
<style>
.video-modal {
  background-color: rgba(0, 0, 0, 0.8);
  &__close {
    top: 24px;
    right: 16px;
  }
}
</style>
