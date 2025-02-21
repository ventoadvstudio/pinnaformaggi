<template>
  <div class="section-cover flex flex-col items-center relative">
    <Headband
      v-if="headband"
      class="absolute -top-10 md:-top-30 left-0 right-0 w-full h-auto z-1"
    />
    <div
      class="relative section-cover__image w-full bg-cover bg-no-repeat bg-center"
      :class="{ 'mt-45 lg:mt-0': marginHead }"
      :style="`background-image: url('${img.url}')`"
    >
      <div
        class="items-center justify-center absolute bottom-0 left-half transform -translate-x-1/2 translate-y-1/2 text-primary bg-white focus:outline-none rounded-t-large whitespace-no-wrap text-center"
      >
        <div
          class="section-cover__title truncate px-32 sm:px-64 py-15 md:py-23"
        >
          <h1
            v-if="titleH1"
            class="uppercase text-center font-title font-medium"
          >
            {{ title }}
          </h1>
          <h2 v-else class="uppercase text-center font-title font-medium">
            {{ title }}
          </h2>
        </div>
      </div>
    </div>
    <p
      class="section-cover__description px-30 text-center text-gray-500 leading-snug mt-32 md:mt-48 md:text-18 md:text-16 mb-22 md:mb-12"
    >
      {{ description }}
    </p>
    <nuxt-link
      v-if="ctaLabel && ctaUrl"
      :to="ctaUrl"
      class="text-14 btn btn--primary"
    >
      {{ ctaLabel }}
    </nuxt-link>
  </div>
</template>

<script>
import Headband from '@/assets/icons/fascia.svg?inline'
export default {
  components: {
    Headband,
  },
  props: {
    img: {
      type: Object,
      default: () => {},
    },
    headband: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
    ctaUrl: {
      type: String,
      default: '',
    },
    titleH1: {
      type: Boolean,
      default: false,
    },
    marginHead: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
.section-cover {
  &__image {
    &::before {
      content: '';
      padding-top: calc((85 / 207) * 100%);
      @apply block w-full;
      @screen sm {
        padding-top: calc((25 / 75) * 100%);
      }
      @screen xl {
        content: none;
      }
    }
    @screen xl {
      height: 500px;
    }
  }

  &__title {
    min-width: 240px;
    border-radius: 60px;
    max-width: 90vw;
    font-size: 22px;
    @media only screen and (min-width: 375px) {
      font-size: 24px;
    }
    @screen lg {
      font-size: 40px;
    }
    @screen lg {
      min-width: 430px;
    }
  }

  &__description {
    max-width: 526px;
  }
}
</style>
