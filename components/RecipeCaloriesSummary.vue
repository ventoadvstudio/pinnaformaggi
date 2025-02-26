<template>
  <div class="recipe-calories">
    <div
      class="recipe-calories__container container lg:grid lg:grid-cols-12 lg:gap-30"
    >
      <div
        class="recipe-calories__content md:px-0 md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
      >
        <div
          class="font-title flex flex-row justify-between items-center border-solid border-t border-cream-600"
        >
          <div class="flex flex-row items-baseline gap-8 py-16">
            <h2 class="uppercase font-medium text-24 text-primary">
              {{ title || $t('recipe.nutrition.calories') }}
            </h2>
            <div class="flex flex-row items-baseline">
              <span class="text-18 font-bold text-cream-800">{{
                total + ` ${$t('recipe.nutrition.kcal')}`
              }}</span>
            </div>
          </div>
          <!-- <ChevronDown :class="calories.length > 0" @click="handleClick" /> -->
        </div>

        <transition v-if="isOpen" name="accordion" class="mt-16">
          <div v-for="(calorie, i) in calories" :key="`section-${i}`">
            <ul>
              <li
                v-for="(detail, index) of calorie.items"
                :key="index.toString()"
                class="flex justify-between text-16 text-cream-800 mb-16"
              >
                <span>{{ detail.name }}</span>
                <span
                  class="text-right ml-16 font-bold flex-auto flex-shrink-0"
                  >{{ detail.quantity }}</span
                >
              </li>
            </ul>
          </div>
        </transition>
        <div class="border-b border-solid border-cream-600" />
        <div>
    <h2 class="uppercase font-medium text-24 text-primary">Consigli e conservazione</h2>
    <p>
      {{ consigli }}
    </p>
  </div>
      </div>
    </div>
  </div>
</template>

<script>
// import ChevronDown from 'assets/icons/chevron-down-black.svg?inline'

export default {
  // components: { ChevronDown },
  props: {
    title: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Array,
      default: () => [
        {
          items: [
            { name: 'Proteine', quantity: '15g' },
            { name: 'Carboidrati', quantity: '40g' },
            { name: 'Grassi', quantity: '10g' },
            { name: 'Fibre', quantity: '5g' },
            { name: 'Zuccheri', quantity: '20g' },
          ],
        },
      ],
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    handleClick() {
      this.isOpen = !this.isOpen
      console.log('isOpen', this.isOpen)
    },
  },
}
</script>

<style>
.recipe-calories {
  &__content {
    padding: 0 20px;
    @media only screen and (min-width: 414px) {
      padding: 0 60px;
    }
    @screen md {
      padding: 0;
    }
  }
}
</style>
