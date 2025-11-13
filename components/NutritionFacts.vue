<template>
  <section class="nutrition-facts bg-gray-700">
    <div
      class="nutrition-facts__container container md:grid gap-30 grid-cols-12"
    >
      <div
        class="nutrition-facts__content md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 py-74 md:my-120"
      >
        <div class="text-center mb-32">
          <h2
            class="md:uppercase text-primary text-24 font-title font-medium mb-8"
          >
            {{ title }}
          </h2>
          <p class="text-14 text-white">{{ description }}</p>
        </div>
        <div
          v-for="(row, index) of items"
          :key="index.toString()"
          class="nutrition-facts__row border-t border-white py-8"
          :class="{ 'border-b': index === items.length - 1 }"
        >
          <div
            v-for="(item, indexRow) of row"
            :key="indexRow.toString()"
            class=""
          >
            <div class="flex justify-between font-bold text-14">
              <span class="text-olive-250">{{ item.label }}</span>
              <span class="text-white">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { validateArrayOfObject } from '@/utils'
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
      validator: (data) => {
        if (!Array.isArray(data)) return false
        const keys = ['label', 'value']
        for (const row of data) {
          if (!Array.isArray(row)) return false
          if (!validateArrayOfObject(keys, row)) return false
        }
        return true
      },
    },
  },
}
</script>
<style>
.nutrition-facts {
  &__content {
    @media only screen and (min-width: 375px) {
      margin: 0 53px;
    }
    @screen md {
      margin: 0;
    }
  }
  &__row {
    min-height: 70px;
  }
}
</style>
