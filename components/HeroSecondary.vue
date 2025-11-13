<template>
  <section
    class="hero-secondary relative bg-cover bg-center bg-no-repeat flex justify-center items-center"
    :style="{ backgroundImage: `url(${backgroundImage.url})` }"
  >
    <div class="hero-secondary__container container">
      <div class="hero-secondary__content relative">
        <div
          class="hero-secondary__text relative z-1 flex flex-col items-center text-white text-center"
        >
          <h1
            class="hero-secondary__title text-60 md:text-80 leading-none relative font-heading font-bold flex flex-col items-center z-1"
          >
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="hero-secondary__description mt-12 md:mt-16 md:text-22"
          >
            {{ description }}
          </p>
          <div
            class="flex flex-col items-center"
            :class="{ 'hidden md:block': noSubtitleMobile }"
          >
            <hr
              class="hero-secondary__separator w-200 md:w-300 h-2 border-white my-16"
            />
            <h2
              class="hero-secondary__subtitle font-title font-medium uppercase text-18 md:text-22"
            >
              {{ subTitle }}
            </h2>
          </div>
        </div>
        <img
          src="@/assets/images/hero-shadow.png"
          class="absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div class="hero-secondary__buttons mt-30 md:mt-40">
        <ButtonsGrid :items="buttons" :theme="theme" :large="largeGrid" />
      </div>
    </div>
    <ScrollIndicator :theme="theme" :label="discoverMore" @click="onClick" />
  </section>
</template>
<script>
import ButtonsGrid from '@/components/ButtonsGrid'
import ScrollIndicator from '@/components/ScrollIndicator'
import { validateArrayOfObject } from '@/utils'
export default {
  components: {
    ButtonsGrid,
    ScrollIndicator,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    nextSectionId: {
      type: String,
      default: undefined,
    },
    subTitle: {
      type: String,
      required: true,
    },
    discoverMore: {
      type: String,
      required: true,
    },
    buttons: {
      type: Array,
      required: true,
      validator: (arr) => {
        const keys = ['image', 'label', 'url']
        return validateArrayOfObject(keys, arr)
      },
    },
    backgroundImage: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      required: true,
      validator: (str) => {
        const allowedThemes = ['primary', 'orange']
        return allowedThemes.includes(str)
      },
    },
    largeGrid: {
      type: Boolean,
      default: false,
    },
    noSubtitleMobile: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      if (this.nextSectionId) {
        const element = document.getElementById(this.nextSectionId)
        if (element) {
          window.scroll({
            behavior: 'smooth',
            left: 0,
            top: element.offsetTop,
          })
        }
      }
    },
  },
}
</script>
<style>
.hero-secondary {
  height: 100vh;
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }

  min-height: 640px;
  @media only screen and (max-height: 640px) and (orientation: portrait) {
    min-height: 600px;
    &__buttons {
      @apply mt-16;
    }
  }
  @media only screen and (min-width: 414px) {
    min-height: 700px;
  }
  @screen md {
    min-height: 812px;
  }
}
</style>
