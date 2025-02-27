<template>
  <div class="recipe-calories">
    <div
      class="recipe-calories__container container lg:grid lg:grid-cols-12 lg:gap-30">
      <div
        class="recipe-calories__content md:px-0 md:col-start-3 md:col-span-8 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
        <div
          class="font-title flex flex-row justify-between items-center border-solid border-t border-cream-600">
          <div class="flex flex-row items-baseline gap-8 py-16">
            <h2 class="uppercase font-medium text-24 text-primary">
              Consigli e Conservazione
            </h2>
            {{ consigli }}
          </div>
          
        </div>

        <div class="border-b border-solid border-cream-600" />
      </div>
    </div>
  </div>
</template>

<script>
// import ChevronDown from 'assets/icons/chevron-down-black.svg?inline'

export default {
  // components: { ChevronDown },
  props: {
    consigli:{
      type: String,
      default:'',
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
