<template>
  <section class="recipes-wizard-results">
    <div class="recipes-wizard-results__header pt-100 md:pt-160 bg-orange">
      <div
        class="relative container flex justify-center items-center text-center"
      >
        <div class="flex flex-col items-center pb-50 md:pb-90">
          <h1
            class="font-title font-medium text-32 text-white uppercase relative z-1"
          >
            {{ resultsLabel }}
          </h1>
          <span class="text-white uppercase mt-16 relative z-1">
            {{ items.length }} {{ quantityLabel }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="items.length > 0"
      class="recipes-wizard-results__content container px-0 md:px-20 mt-16 md:mt-30 mb-16 md:mb-30"
    >
      <RecipeGrid :items="items" />
    </div>
  </section>
</template>
<script>
import RecipeGrid from '@/components/RecipeGrid'

export default {
  components: {
    RecipeGrid,
  },
  props: {
    resultsLabel: {
      type: String,
      required: true,
    },
    quantityLabel: {
      type: String,
      required: true,
    },
    decorativeImage: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>
<style>
.recipes-wizard-results {
  &__header-image {
    width: 100px;
    @media only screen and (min-width: 375px) {
      width: 137px;
    }
    @screen md {
      width: 180px;
    }

    right: 5%;
    @screen md {
      right: 10%;
    }
  }
}
</style>
