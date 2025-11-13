<template>
  <div class="recipe-share container flex flex-col items-center">
    <h4 class="font-heading font-bold text-40 text-primary uppercase">
      {{ title }}
    </h4>
    <div class="recipe-share__buttons flex justify-center items-center mt-8">
      <a :href="facebook" target="_blank" class="focus:outline-none mr-18">
        <Facebook />
      </a>
      <a :href="pinterest" target="_blank" class="focus:outline-none mr-18">
        <Pinterest />
      </a>
      <a :href="twitter" target="_blank" class="focus:outline-none">
        <Twitter />
      </a>
    </div>
  </div>
</template>
<script>
import Facebook from '@/assets/icons/Facebook.svg?inline'
import Pinterest from '@/assets/icons/Pinterest.svg?inline'
import Twitter from '@/assets/icons/Twitter.svg?inline'

export default {
  components: {
    Facebook,
    Pinterest,
    Twitter,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      required: true,
    },
    pinterest: {
      type: String,
      required: true,
    },
    twitter: {
      type: String,
      required: true,
    },
  },
}
</script>
<style>
.recipe-share {
  /* a */
}
</style>
