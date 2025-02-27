<template>
  <div class="recipe-method">
            <h2 class="uppercase text-primary font-medium font-title text-24 mb-16">
              Consigli e Conservazione
            </h2>
            {{ consigli }}
          
  </div>
</template>

<script>

export default {

  props: {
    title:{
      type: String,
      default:'',
    },
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
