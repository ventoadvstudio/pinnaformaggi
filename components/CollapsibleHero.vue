<template>
  <section class="collapsible-hero">
    <div
      class="collapsible-hero__trigger xl:relative h-4/5 xl:h-auto bg-center bg-no-repeat bg-cover"
      :style="{ backgroundImage: `url(${backgroundImage.url})` }"
    >
      <div
        class="container xl:absolute xl:top-0 xl:right-0 xl:bottom-0 xl:left-0 flex flex-col items-center justify-center text-center pt-200 pb-110 lg:pb-180 lg:pt-350 text-white"
      >
        <h1 class="uppercase text-56 lg:text-90 mb-20 lg:mb-32 font-heading">
          {{ title }}
        </h1>
        <p class="text-16 lg:text-22 leading-snug mb-40">{{ description }}</p>
        <button
          type="button"
          class="btn btn--primary btn--small"
          @click="toggle"
        >
          <span v-if="isOpen">{{ closeLabel }}</span>
          <span v-if="!isOpen">{{ openLabel }}</span>
        </button>
      </div>
    </div>
    <div
      class="collapsible-hero__content overflow-hidden"
      :class="{
        'collapsible-hero__content--open': isOpen,
        'collapsible-hero__content--closed': !isOpen,
      }"
    >
      <ModularSection :items="items" />
    </div>
  </section>
</template>
<script>
import ModularSection from '@/components/ModularSection'
export default {
  components: {
    ModularSection,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    openLabel: {
      type: String,
      required: true,
    },
    closeLabel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  // mounted() {
  //   const vm = this
  //   this.$root.$on('collapsibleBoxToggled', () => {
  //     vm.isOpen = false
  //   })
  // },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
      // this.$root.$emit('collapsibleHeroToggled')
    },
  },
}
</script>
<style>
.collapsible-hero {
  &__content {
    transition: max-height 1s;
    &--open {
      max-height: 10000px;
    }

    &--closed {
      max-height: 0;
    }
  }
  &__trigger {
    @screen xl {
      &::before {
        content: '';
        padding-top: calc(400 / 711 * 100%);
        @apply block w-full;
      }
    }
  }
}
</style>
