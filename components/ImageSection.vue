<template>
  <div
    ref="bg"
    class="w-full bg-no-repeat bg-center bg-cover flex flex-col items-center pt-95 md:pt-110 image-section"
  >
    <div class="container sm:grid sm:grid-cols-12 sm:gap-30">
      <div class="xl:col-span-8 xl:col-start-3 col-span-12">
        <SectionHeading :heading="title" :description="description" special />
        <div class="text-center mt-35">
          <nuxt-link
            :to="ctaUrl"
            class="uppercase btn btn--small btn--secondary"
          >
            {{ ctaLabel }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeading from '../components/SectionHeading'

export default {
  components: {
    SectionHeading,
  },
  props: {
    img: {
      required: true,
      type: Object,
    },
    title: {
      required: true,
      type: String,
    },
    description: {
      default: '',
      type: String,
    },
    ctaUrl: {
      type: String,
      default: '',
    },
    ctaLabel: {
      default: '',
      type: String,
    },
  },

  data() {
    return {
      observer: null,
    }
  },
  mounted() {
    const obsOptions = {}
    this.observer = new IntersectionObserver(this.inViewport, obsOptions)
    const inViewport = this.$refs.bg
    this.observer.observe(inViewport)
  },

  methods: {
    inViewport(entries) {
      entries.forEach((entry) => {
        // entry.target.classList.toggle('is-inViewport', entry.isIntersecting)
        if (entry.isIntersecting) {
          entry.target.style.backgroundImage = `url(${this.img.url})`
        }
      })
    },
  },
}
</script>
<style scoped>
.image-section {
  padding-bottom: 380px;

  @screen md {
    padding-bottom: 430px;
  }
}
</style>
