<template>
  <form
    class="search p-12 flex border border-peach rounded-small"
    @submit="handleSubmit"
  >
    <button
      type="submit"
      class="search__btn w-24 h-24 p-2 focus:outline-none mr-12"
    >
      <SearchIcon class="w-full h-full object-contain" />
    </button>
    <input
      v-model="value"
      type="text"
      class="search__input flex-1 h-full focus:outline-none"
      placeholder="Cerca nel sito"
      required
      minlength="3"
    />
  </form>
</template>
<script>
import SearchIcon from '@/assets/icons/search.svg?inline'
import { handleSlug } from '@/utils'

export default {
  components: {
    SearchIcon,
  },
  data() {
    return {
      value: '',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      if (this.value.length >= 3) {
        this.$root.$emit('closeSearchMenu')
        this.$router.push({
          path: handleSlug(this.$i18n.locale, 'search'),
          query: { query: this.value },
        })
      }
    },
  },
}
</script>
<style>
.search {
  &__input {
    transform: scale(0.875);
    transform-origin: left;
  }
}
</style>
