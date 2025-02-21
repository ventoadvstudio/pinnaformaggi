<template>
  <section ref="container" class="timeline bg-cocoa-200 py-100">
    <div class="container">
      <div v-if="title" class="timeline__title text-center">
        <h2
          class="font-heading font-bold text-46 md:text-60 text-cocoa-500 leading-none"
        >
          {{ title }}
        </h2>
      </div>
      <div class="timeline__content mt-34" :class="{ 'pt-150': hasImages }">
        <div
          class="timeline__buttons px-40 md:px-0 md:mx-16 lg:mx-32 relative flex"
        >
          <div
            v-for="(item, i) in items"
            :key="`timeline-button-${i}`"
            class="flex-1 relative z-1"
            :class="{
              'md:mr-14': i >= activeWindow[0] && i < activeWindow[1],
              hidden: activeSection !== i,
              'md:block': i >= activeWindow[0] && i <= activeWindow[1],
            }"
          >
            <img
              v-if="item.image"
              :src="item.image.url"
              :alt="item.image.alt"
              class="absolute left-half bottom-full transform -translate-x-1/2"
              :class="{
                'opacity-1 visible': activeSection === i,
                'opacity-0 invisible': activeSection !== i,
              }"
            />
            <button
              class="timeline__button w-full text-center text-24 text-white p-16 select-none focus:outline-none"
              :class="{
                'timeline__button--active bg-olive': activeSection === i,
                'bg-cocoa-300': activeSection !== i,
              }"
              @click="toggle(i)"
            >
              {{ item.title }}
            </button>
          </div>
          <div
            class="timeline__arrows absolute top-half left-0 right-0 transform -translate-y-1/2 flex justify-between items-center"
            :class="{ 'md:hidden': items.length <= 4 }"
          >
            <button
              class="timeline__prev w-20 h-20 focus:outline-none"
              :class="{ invisible: activeSection === 0 }"
              @click="prev"
            >
              <ArrowRight class="w-full h-full transform rotate-180" />
            </button>
            <button
              class="timeline__next w-20 h-20 focus:outline-none"
              :class="{ invisible: activeSection === items.length - 1 }"
              @click="next"
            >
              <ArrowRight class="w-full h-full" />
            </button>
          </div>
        </div>
        <div class="timeline__sections">
          <div
            v-for="(item, i) in items"
            :key="`timeline-section-${i}`"
            class="timeline__section pt-130"
            :class="{ hidden: activeSection !== i }"
          >
            <template v-for="(entry, n) in item.content">
              <h3
                v-if="entry._modelApiKey === 'title'"
                :key="`section-${i}-entry-${n}`"
                class="timeline__title font-title font-medium text-32 text-center text-cocoa-500 uppercase"
                :class="{ 'mb-50': n < item.content.length - 1 }"
              >
                {{ entry.content }}
              </h3>
              <div
                v-else-if="entry._modelApiKey === 'paragraph'"
                :key="`section-${i}-entry-${n}`"
                class="timeline__paragraph mx-auto"
                :class="{ 'mb-50': n < item.content.length - 1 }"
              >
                <h3
                  v-if="entry.title"
                  class="timeline__paragraph-title font-bold uppercase text-cocoa-500 mb-8"
                >
                  {{ entry.title }}
                </h3>
                <p class="timeline__paragraph-content text-gray-270">
                  {{ entry.content }}
                </p>
              </div>
              <img
                v-else-if="entry._modelApiKey === 'image'"
                :key="`section-${i}-entry-${n}`"
                :src="entry.image.url"
                :alt="entry.image.alt"
                class="timeline__image w-full mx-auto"
                :class="{ 'mb-50': n < item.content.length - 1 }"
              />
              <VideoPlayer
                v-else-if="entry._modelApiKey === 'video'"
                :key="`section-${i}-entry-${n}`"
                :sources="entry.video"
                :thumbnail="
                  entry.thumbnail
                    ? entry.thumbnail.url
                    : entry.video[0].video.thumbnailUrl
                "
                class="timeline__video w-full mx-auto"
                :class="{ 'mb-50': n < item.content.length - 1 }"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import VideoPlayer from '@/components/VideoPlayer'
import ArrowRight from '@/assets/icons/arrow-brown.svg?inline'
export default {
  components: {
    VideoPlayer,
    ArrowRight,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
      validator: (arr) =>
        arr.filter(
          (el) => typeof el.title === 'string' && Array.isArray(el.content)
        ).length === arr.length,
    },
  },
  data() {
    return {
      activeSection: 0,
      activeWindow: this.items.length > 4 ? [0, 3] : [0, this.items.length - 1],
    }
  },
  computed: {
    hasImages() {
      for (const item of this.items) {
        if (item.image) return true
      }
      return false
    },
  },
  mounted() {
    const vm = this
    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0
    this.$refs.container.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX
        touchStartY = e.changedTouches[0].screenY
      },
      false
    )
    this.$refs.container.addEventListener(
      'touchend',
      function (e) {
        touchEndX = e.changedTouches[0].screenX
        touchEndY = e.changedTouches[0].screenY
        vm.handleSwipe([touchStartX, touchEndX], [touchStartY, touchEndY])
        // Reset params
        touchStartX = 0
        touchStartY = 0
        touchEndX = 0
        touchEndY = 0
      },
      false
    )
  },
  methods: {
    toggle(i) {
      this.activeSection = i
    },
    prev() {
      if (
        this.activeSection === this.activeWindow[0] &&
        this.activeWindow[0] > 0
      ) {
        this.activeWindow = [this.activeWindow[0] - 1, this.activeWindow[1] - 1]
      }
      if (this.activeSection > 0) {
        this.activeSection = this.activeSection - 1
      }
    },
    next() {
      if (
        this.activeSection === this.activeWindow[1] &&
        this.activeWindow[1] < this.items.length - 1
      ) {
        this.activeWindow = [this.activeWindow[0] + 1, this.activeWindow[1] + 1]
      }
      if (this.activeSection < this.items.length - 1) {
        this.activeSection = this.activeSection + 1
      }
    },
    handleSwipe(x, y) {
      if (Math.abs(y[0] - y[1]) <= 50 && Math.abs(x[0] - x[1]) >= 50) {
        if (x[0] > x[1]) this.next()
        else this.prev()
      }
    },
  },
}
</script>
<style scoped>
.timeline {
  &__button {
    &--active {
      background: radial-gradient(circle at 50% 0%, #84aa4b 0%, #54883c 100%);
    }
  }
  &__paragraph {
    max-width: 854px;
  }
  &__image,
  &__video {
    max-width: 730px;
  }
  &__arrows {
    @screen md {
      left: -30px;
      right: -30px;
    }
  }
}
</style>
