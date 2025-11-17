<template>
  <main class="story-page">
    <CollapsibleHero
      :title="hero.title"
      :description="hero.description"
      :background-image="hero.backgroundImage"
      :items="hero.items"
      :open-label="hero.openLabel"
      :close-label="hero.closeLabel"
      @toggleOpen="onToggle"
    />

    <!-- Se vuoi mostrare un paragrafo fuori dall'hero, togli i commenti
    <div v-show="showParagraph" class="container pt-50 pb-100 lg:pt-100 lg:pb-150">
      <div class="font-heading text-center text-cocoa-500 text-50" v-html="$sanitize(paragraph)"></div>
    </div>
    -->
  </main>
</template>

<script>
import CollapsibleHero from '@/components/CollapsibleHero'
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'

export default {
  name: 'SustainabilityPage',
  components: { CollapsibleHero },
  extends: BasePage,

  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { sustainability } = await ApiService.getSustainabilityPage(locale)
    // ritorno sicuro con fallback per evitare errori in build/SSR
    return sustainability || { hero: {}, paragraph: '', seo: [] }
  },

  data() {
    return {
      hero: {},
      paragraph: '',
      showParagraph: true,
    }
  },

  methods: {
    onToggle(val) {
      this.showParagraph = !val
    },
  },

  nuxtI18n: {
    paths: {
      it: '/azienda/sostenibilita',
      en: '/company/sustainability',
    },
  },
}
</script>