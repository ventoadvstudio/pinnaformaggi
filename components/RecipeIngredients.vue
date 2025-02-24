<template>
  <div class="recipe-ingredients py-40 lg:py-60 bg-cream-100">
    <div
      class="recipe-ingredients__container container md:grid md:grid-cols-12 md:gap-30"
    >
      <div
        class="recipe-ingredients__content md:px-0 md:col-start-1 md:col-span-12 lg:col-start-4 lg:col-span-6"
      >
        <div
          class="uppercase font-title flex justify-between items-center pb-35 border-solid border-b border-cream-600"
        >
          <h2 class="font-medium text-24 text-primary">{{ title }}</h2>
          <span class="text-16 text-cream-800">{{ servings }}</span>
        </div>
        <div
          v-for="(section, i) in sections"
          :key="`section-${i}`"
          class="pt-23"
        >
          <h6 v-if="section.title" class="text-primary font-bold mb-11">
            {{ section.title }}
          </h6>
          <ul
            :class="{
              'pb-30 border-solid border-b border-cream-600':
                sections.length === 1 || i < sections.length - 1,
            }"
          >
            <li
              v-for="(ingredient, index) of section.items"
              :key="index.toString()"
              class="flex justify-between text-16 text-cream-800 mb-8"
              :class="ingredient.producedByPinna ? 'font-bold' : ''"
            >
              <span>
                {{ ingredient.name }}
              </span>
              <span class="text-right ml-16 flex-auto flex-shrink-0">
                {{ ingredient.quantity }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
<div> {{ consigli }}</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    servings: {
      type: String,
      default: '',
    },
    sections: {
      type: Array,
      required: true,
    },
  },
}
</script>
<style>
.recipe-ingredients {
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
