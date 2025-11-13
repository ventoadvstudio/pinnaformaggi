<template>
  <div
    class="section-cover flex flex-col items-center"
    :class="{ 'section-cover--open': isOpen }"
  >
    <div
      class="section-cover__image relative w-full bg-cover bg-no-repeat bg-center"
      :class="{ 'mt-45 lg:mt-0': marginHead }"
      :style="`background-image: url('${img.url}')`"
    >
      <div
        class="section-cover__btn cursor-pointer items-center justify-center absolute bottom-0 z-1 left-half transform -translate-x-1/2 translate-y-1/2 text-primary bg-white focus:outline-none rounded-t-large whitespace-no-wrap"
        @click="isOpen = !isOpen"
      >
        <div
          class="section-cover__title px-32 sm:px-64 py-15 md:py-23 flex items-center justify-center bg-white"
        >
          <h1
            class="uppercase text-center font-title font-medium truncate mr-8"
          >
            {{ title }}
          </h1>
          <ChevronDown
            class="w-16 h-10 transition-transform duration-300 flex-shrink-0"
            :class="{ 'transform -rotate-180': isOpen }"
          />
        </div>
        <div
          class="section-cover__dropdown absolute left-0 w-full top-full bg-cream-100 rounded-b-large"
          :class="{
            'opacity-0 invisible poiter-events-none': !isOpen,
          }"
        >
          <div v-for="(link, index) of links" :key="index.toString()">
            <nuxt-link
              :to="link.url"
              :class="{
                'border-b border-solid border-white':
                  index !== links.length - 1,
              }"
              class="block py-20 text-gray-600 text-20 justify-start md:ml-44 ml-20"
              >{{ link.label }}</nuxt-link
            >
          </div>
        </div>
      </div>
    </div>
    <p
      class="section-cover__description px-30 text-center text-gray-500 leading-snug mt-32 md:mt-48 md:text-18 md:text-16 mb-22 md:mb-12"
    >
      {{ description }}
    </p>
  </div>
</template>
<script>
import { validateArrayOfObject } from '@/utils'
import ChevronDown from '@/assets/icons/chevron-down.svg?inline'
export default {
  components: {
    ChevronDown,
  },
  props: {
    img: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    links: {
      type: Array,
      required: true,
      validator: (data) => {
        const keys = ['label', 'url']
        return validateArrayOfObject(keys, data)
      },
    },
    marginHead: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
}
</script>

<style scoped>
.section-cover {
  &__title {
    border-radius: inherit;
    max-width: 90vw;
    font-size: 20px;
    @media only screen and (min-width: 375px) {
      font-size: 24px;
    }
    @screen lg {
      font-size: 40px;
    }
  }
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
  &__dropdown {
    &::after {
      content: '';
      box-shadow: 0 2px 16px 7px rgba(0, 0, 0, 0.1);
      border-radius: inherit;
      z-index: -1;
      @apply absolute top-0 bottom-0 right-0 left-0 bg-white;
    }
  }
  &--open {
    .section-cover__btn {
      box-shadow: 0 2px 16px 7px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
