<template>
  <main class="recipe-book-page overflow-hidden">
    <!-- HERO -->
    <div class="relative pb-100 pt-110 md:pb-140 lg:pt-180 lg:pb-420">
      <datocms-image
        v-if="heroBackground && heroBackground.responsiveImage"
        class="absolute inset-0 object-cover w-full h-full"
        :data="heroBackground.responsiveImage"
        :alt="heroBackground.alt || ''"
        layout="fill"
        object-fit="cover"
      />
      <div
        class="relative z-20 container flex flex-col items-center justify-center text-center text-white"
      >
        <h1 class="uppercase text-50 lg:text-80 font-heading">
          {{ title }}
        </h1>
      </div>
    </div>

    <!-- BREVO FORM -->
    <section class="container py-60">
      <!-- embed controllato: iframe Brevo -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="prose max-w-none" v-html="brevoForm"></div>
    </section>
  </main>
</template>

<script>
import { getRicettariPage } from '@/services/api.service'

export default {
  async asyncData({ error }) {
    try {
      const locale = 'it' // se usi i18n, ricava la lingua dinamicamente
      const data = await getRicettariPage(locale)

      if (!data) {
        throw new Error('Ricettari non trovato')
      }

      return {
        title: data.title || '',
        heroBackground: data.heroBackground || null,
        brevoForm: data.brevoForm || '',
        seo: data.seo || [],
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Pagina non trovata' })
    }
  },

  head() {
    const metaFromDato = Array.isArray(this.seo)
      ? this.seo
          .filter((t) => t.tag === 'meta')
          .map((t) => ({
            hid: t.attributes?.name || t.attributes?.property || undefined,
            ...t.attributes,
          }))
      : []

    const linksFromDato = Array.isArray(this.seo)
      ? this.seo
          .filter((t) => t.tag === 'link')
          .map((t) => ({ ...t.attributes }))
      : []

    return {
      title: this.title || 'Ricettari',
      meta: metaFromDato,
      link: linksFromDato,
    }
  },
}
</script>
