<template>
  <div class="recipes-cta w-full stripe-5 pb-95 md:pb-110 pt-60 md:pt-100">
    <div class="container flex flex-col items-center">
      <datocms-image
        :data="{ ...img.responsiveImage, alt: img.alt }"
        object-fit="contain"
        class="recipes-cta__image mb-30"
      />
      <div class="grid grid-cols-12 gap-30 mb-35 md:mb-48">
        <div class="text-center md:col-span-8 md:col-start-3 col-span-12">
          <h2
            class="font-heading text-primary text-52 mb-14 md:mb-12 leading-none"
          >
            {{ title }}
          </h2>
          <p class="font-content text-gray-500">
            {{ description }}
          </p>
        </div>
      </div>
      <nuxt-link :to="ctaUrl" class="btn btn--small btn--primary">
        {{ ctaLabel }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import SectionHeading from '../components/SectionHeading'
export default {
  component: {
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
    ctaLabel: {
      default: '',
      type: String,
    },
    ctaUrl: {
      default: '',
      type: String,
    },
  },
}
</script>

<style scoped>
.recipes-cta {
  &__image {
    max-height: 200px;
  }
}

.stripe-5 {
  color: theme('colors.white');
  background: linear-gradient(
    to bottom,
    theme('colors.secondary') 97%,
    theme('colors.white') 3%
  );
  background-size: 100% 20px;
  @screen md {
    background-size: 100% 30px;
  }
}
</style>
