<template>
  <div class="md:grid gap-x-30 gap-y-16 grid-cols-12">
    <div
      v-for="(item, index) of items"
      :key="index.toString()"
      class="col-span-6"
      :class="{ 'mb-16 md:mb-0': index !== items.length - 1 }"
    >
      <RecipeEntry
        :img="item.img"
        :categories="item.categories"
        :title="item.title"
        :description="item.description"
        :difficulty="item.difficulty"
        :time="item.time"
        :calories="item.calories"
        :cta-label="item.ctaLabel"
        :cta-url="item.ctaUrl"
        :title-h3="titleH3"
      />
    </div>
  </div>
</template>

<script>
import { validateArrayOfObject } from '@/utils'
import RecipeEntry from '../components/RecipeEntry'

export default {
  components: {
    RecipeEntry,
  },
  props: {
    items: {
      type: Array,
      required: true,
      validator: (data) => {
        const keys = ['img', 'title', 'time', 'ctaLabel', 'ctaUrl']
        return validateArrayOfObject(keys, data)
      },
    },
    titleH3: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
