<template>
  <header class="header" data-datocms-noindex>
    <HeaderMobile :items="items" class="lg:hidden" />
    <HeaderDesktop :items="items" class="hidden lg:block" />
  </header>
</template>
<script>
import HeaderMobile from '@/components/HeaderMobile'
import HeaderDesktop from '@/components/HeaderDesktop'

export default {
  components: {
    HeaderMobile,
    HeaderDesktop,
  },
  props: {
    items: {
      type: Array,
      required: true,
      validator: (arr) =>
        arr.filter(
          (el) =>
            ((Array.isArray(el.entries) && el.entries.length > 0) ||
              typeof el.link === 'string') &&
            typeof el.label === 'string'
        ).length === arr.length,
    },
  },
}
</script>
