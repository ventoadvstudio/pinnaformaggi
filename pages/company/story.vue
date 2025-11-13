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
    <!--    <div-->
    <!--      v-show="showParagraph"-->
    <!--      class="container pt-50 pb-100 lg:pt-100 lg:pb-150"-->
    <!--    >-->
    <!--      <div-->
    <!--        class="font-heading text-center text-cocoa-500 text-50"-->
    <!--        v-html="$sanitize(paragraph)"-->
    <!--      ></div>-->
    <!--    </div>-->
  </main>
</template>
<script>
import CollapsibleHero from '@/components/CollapsibleHero'
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'
export default {
  name: 'StoryPage',
  components: {
    CollapsibleHero,
  },
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { companyStoryPage } = await ApiService.getCompanyStoryPage(locale)
    return companyStoryPage
  },
  data() {
    return {
      hero: {},
      paragraph: '',
      timeline: {},
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
      it: '/azienda/storia',
      en: '/company/story',
    },
  },
}
</script>
