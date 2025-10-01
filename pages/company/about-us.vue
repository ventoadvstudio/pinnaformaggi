<template>
  <main class="about-page">
    <CollapsibleHero
      :title="hero.title"
      :description="hero.description"
      :background-image="hero.backgroundImage"
      :items="hero.items"
      :open-label="hero.openLabel"
      :close-label="hero.closeLabel"
      @toggleOpen="onToggle"
    />


    <!-- Paragrafo extra (fuori dall'hero) 
    <section
      v-show="showParagraph && paragraph"
      class="container pt-50 pb-100 lg:pt-100 lg:pb-150"
    >
   
      <div
        class="font-heading text-center text-cocoa-500 text-50"
        v-html="$sanitize(paragraph)"
      >
    </div>
  -->
    </section>

  </main>
</template>

<script>
import CollapsibleHero from '@/components/CollapsibleHero'
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'

export default {
  name: 'AboutPage',
  components: { CollapsibleHero },
  extends: BasePage,

  async asyncData({ app, error }) {
    try {
      const locale = app.i18n.locale
      const { about } = await ApiService.getAboutPage(locale)

      return about
        ? {
            title: about.title || '',
            hero: about.hero || {},
            paragraph: about.paragraph || '',
            seo: about.seo || [],
          }
        : { title: '', hero: {}, paragraph: '', seo: [] }
    } catch (e) {
      if (typeof error === 'function') {
        error({ statusCode: 500, message: 'Errore nel caricamento della pagina' })
      }
      return { title: '', hero: {}, paragraph: '', seo: [] }
    }
  },

  data() {
    return {
      // valori di fallback; verranno sovrascritti da asyncData
      title: '',
      hero: {},
      paragraph: '',
      seo: [],
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
      it: '/azienda/chi-siamo',
      en: '/company/about-us',
    },
  },
}
</script>
