<template>
  <div
    class="recipes-wizard bg-orange pt-120 sm:pt-152 pb-70 min-h-screen overflow-hidden"
  >
    <div class="container lg:grid grid-cols-12 gap-30">
      <div
        class="text-white text-center lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6 relative"
      >
        <div class="relative z-2">
          <img
            :src="imageHead.url"
            :alt="imageHead.alt"
            class="mx-auto w-170 relative z-2"
          />
          <h2
            class="text-46 md:text-60 font-heading mb-13 mb-16 px-16 leading-none"
          >
            {{ title }}
          </h2>
          <p class="text-18 mb-32 sm:md-36 px-16">{{ paragraph }}</p>
          <nuxt-link
            :to="{ path: wizardRoute, query: { open: true } }"
            type="button"
            class="btn btn--primary btn--small"
          >
            {{ startLabel }}
          </nuxt-link>
          <img
            :src="imageFooter.url"
            :alt="imageFooter.alt"
            class="mt-38 w-300 max-w-full mx-auto"
          />
        </div>
        <div class="bg-radial bg-radial--top"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleSlug } from '@/utils'

export default {
  props: {
    imageHead: {
      type: Object,
      default: () => ({}),
    },
    imageFooter: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      required: true,
    },
    paragraph: {
      type: String,
      required: true,
    },
    startLabel: {
      type: String,
      required: true,
    },
  },
  computed: {
    wizardRoute() {
      const locale = this.$i18n.locale
      return handleSlug(locale, 'recipeWizard')
    },
  },
}
</script>
<style>
.recipes-wizard {
  &__buttons-container {
    margin-top: -16px;
    margin-right: -30px;
  }
  &__btn-container {
    flex-basis: 170px;
    @screen sm {
      flex-basis: 250px;
    }
  }

  .bg-radial {
    position: absolute;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
    background: radial-gradient(
      circle,
      theme('colors.orange.100') 0%,
      theme('colors.orange.100') 22%,
      theme('colors.orange') 70%
    );
    &--top {
      top: -5%;
      width: 320px;
      height: 320px;
      @screen sm {
        top: 0;
      }
      @media only screen and (min-width: 480px) {
        width: 400px;
        height: 400px;
      }
    }
  }
}
</style>
