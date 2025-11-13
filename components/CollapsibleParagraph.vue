<template>
  <div
    class="collapsible-paragraph text-center flex flex-col justify-center items-center"
    :class="isOpen ? 'collapsible-paragraph--open' : ''"
  >
    <img v-if="img !== ''" :src="img.url" :alt="img.alt" class="mb-25" />
    <h5 class="font-title font-medium text-24 text-primary uppercase mb-12">
      {{ title }}
    </h5>
    <div class="collapsible-paragraph__content relative">
      <div
        class="collapsible-paragraph__paragraph text-16 md:text-18 text-cream-700 leading-snug overflow-hidden transition-all duration-300 delay-500"
        v-html="content"
      ></div>
      <div
        class="collapsible-paragraph__show-more absolute top-0 pt-12 md:pt-22 w-full flex items-center justify-center transition-opacity duration-500"
        :class="isOpen ? 'opacity-0 pointer-events-none' : ''"
      >
        <button
          v-if="isOpen === false"
          class="font-bold uppercase text-primary flex items-center focus:outline-none"
          @click="isOpen = true"
        >
          {{ btnLabel }}
          <ChevronDown class="ml-8" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronDown from '../assets/icons/chevron-down.svg?inline'
export default {
  components: {
    ChevronDown,
  },
  props: {
    img: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    btnLabel: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
}
</script>

<style>
.collapsible-paragraph {
  &__content {
    max-width: 730px;
  }
  &__paragraph {
    max-height: 70px;
  }

  &__show-more {
    top: 85%;
  }

  &--open {
    .collapsible-paragraph__paragraph {
      max-height: 1000px;
    }
  }
}
</style>
