<template>
  <div class="posters flex flex-col lg:flex-row">
    <div
      v-for="(item, index) of items"
      :key="index.toString()"
      class="lg:flex-1 posters__item flex flex-col justify-center items-center py-80"
      :class="
        item.color === 'cream'
          ? 'posters__item--secondary'
          : 'posters__item--primary'
      "
    >
      <div
        class="posters__item__container text-center mx-auto flex flex-col items-center container"
      >
        <datocms-image
          :data="item.topImg.responsiveImage"
          layout="responsive"
          object-fit="contain"
          class="posters__item__image-top mb-11"
        />
        <div class="posters__item-text">
          <h3
            class="text-24 uppercase mb-11 md:mb-8 font-title font-medium"
            :class="item.color === 'cream' ? 'text-cocoa-600' : 'text-white'"
          >
            {{ item.title }}
          </h3>
          <p
            class="text-16 md:text-18 mb-34 md:mb-27 leading-snug"
            :class="item.color === 'cream' ? 'text-cocoa-600' : 'text-white'"
          >
            {{ item.description }}
          </p>
        </div>
        <datocms-image
          class="posters__item__image-bottom"
          :data="item.bottomImg.responsiveImage"
          layout="responsive"
          object-fit="contain"
        />
        <nuxt-link
          :to="item.url"
          class="rounded-small uppercase btn btn--small btn--primary mt-11"
          :class="item.color === 'cream' ? 'btn--primary' : 'btn--secondary'"
        >
          {{ item.buttonLabel }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { validateArrayOfObject } from '@/utils'
export default {
  props: {
    items: {
      type: Array,
      required: true,
      validator: (data) => {
        const keys = [
          'topImg',
          'title',
          'description',
          'bottomImg',
          'buttonLabel',
          'url',
          'color',
        ]
        return validateArrayOfObject(keys, data)
      },
    },
  },
}
</script>

<style scoped>
.posters {
  &__item {
    &--primary {
      background-image: radial-gradient(
        50% 30% at 50% 40%,
        theme('colors.olive.100'),
        theme('colors.olive.300')
      );
      @screen md {
        background-image: radial-gradient(
          50% 30%,
          theme('colors.olive.100'),
          theme('colors.olive.300')
        );
      }
    }

    &--secondary {
      background-image: radial-gradient(
        50% 30% at 50% 40%,
        theme('colors.cream.200'),
        theme('colors.cream.400')
      );
      @screen md {
        background-image: radial-gradient(
          50% 30%,
          theme('colors.cream.200'),
          theme('colors.cream.400')
        );
      }
    }
    &__container {
      @screen md {
        max-width: 380px;
      }
    }
    &__image-top {
      max-height: 240px;
    }
    &__image-bottom {
      max-height: 160px;
    }
  }
}
</style>
