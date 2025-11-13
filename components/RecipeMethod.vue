<template>
  <div class="recipe-method">
    <h2 class="uppercase text-primary font-medium font-title text-24 mb-16">
      {{ title }}
    </h2>
    <div
      v-for="(section, i) of sections"
      :key="`section-${i}`"
      :class="{ 'mb-50': i < sections.length - 1 }"
    >
      <h3 v-if="section.title !== ''" class="text-primary font-bold mb-16">
        {{ section.title }}
      </h3>
      <div
        v-for="(step, n) of section.items"
        :key="n.toString()"
        class="pb-30"
        :class="{
          'pt-20': n === 0,
          'pb-0': n === section.items.length - 1,
        }"
      >
        <div
          v-if="step.images && step.images.length > 0"
          class="recipe-method__images mb-20"
          :class="{ 'recipe-method__images--grid': step.images.length > 1 }"
        >
          <div
            v-for="(image, index) in step.images"
            :key="image.filename + index"
          >
            <datocms-image
              :data="{
                ...image.responsiveImage,
                alt: image.alt || image.filename,
              }"
              object-fit="cover"
              class="w-full h-full"
            />
          </div>
        </div>
        <div class="flex">
          <span
            class="recipe-method__number flex items-center justify-center flex-shrink-0 bg-primary text-white rounded-circle w-32 h-32 font-title mr-10"
          >
            {{ n + 1 }}
          </span>
          <p class="text-gray-500 leading-snug flex items-center">
            {{ step.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
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
<style scoped>
.recipe-method {
  &__images {
    &--grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-auto-rows: 1fr;
      grid-column-gap: 20px;
      grid-row-gap: 20px;
      @screen sm {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    > div {
      height: 150px;
      img {
        object-fit: cover;
      }
    }
  }
}
</style>
