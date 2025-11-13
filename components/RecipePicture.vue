<template>
  <div
    class="recipe-picture flex flex-col md:container md:grid gap-x-30 md:gap-y-16 grid-cols-12"
  >
    <div class="recipe-picture__picture relative md:col-span-6">
      <datocms-image
        :data="{ ...picture.responsiveImage, alt: picture.alt }"
        layout="fill"
        object-fit="cover"
        class="absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover"
      />
    </div>
    <div
      class="recipe-picture__heading-container pt-40 md:pt-0 md:col-span-6 px-20 md:px-0 flex justify-center items-center text-center"
    >
      <h2
        class="recipe-picture__heading font-heading text-50 leading-none text-primary"
      >
        {{ title }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    picture: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
<style>
.recipe-picture {
  &__picture {
    &::before {
      content: '';
      padding-top: calc(257 / 414 * 100%);
      @apply block w-full;
    }
    @screen sm {
      &::before {
        padding-top: calc(67 / 108 * 100%);
      }
    }
  }
  &__heading {
    max-width: 367px;
  }
}
</style>
