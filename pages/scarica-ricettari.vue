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
        <p class="uppercase text-50 lg:text-80 font-heading no-mobile">
          {{ hero || title || 'Ricettari' }}
        </p>
      </div>
    </div>

    <!-- BODY (titoli) -->
    <section class="container py-40">
      <h1
        class="uppercase font-title font-medium text-primary md:text-40 text-center h1-mobile"
      >
        {{ titlebody }}
      </h1>

      <h2
        v-if="subtitlebody"
        class="modular-section__paragraph-title font-bold uppercase mb-10 text-cocoa-500 text-center md:text-22 h2-mobile"
      >
        {{ subtitlebody }}
      </h2>

      <p
        v-if="textbody"
        class="text-base leading-relaxed text-center text-gray-500 p-mobile"
      >
        {{ textbody }}
      </p>
    </section>

    <!-- GALLERY: xs=1 col, sm=2 col, lg=3 col -->
    <section class="container pb-60">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <article
          v-for="(block, idx) in gallery"
          :key="block.id || idx"
          class="rounded-2xl overflow-hidden bg-white shadow-md"
        >
          <!-- Il contenuto arriva da DatoCMS come HTML controllato -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            class="prose max-w-none ricettari-card"
            v-html="block.htmlRicettari"
          ></div>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import { getRicettariDownloadPage } from '@/services/api.service'

export default {
  async asyncData({ error }) {
    try {
      const locale = 'it'
      const data = await getRicettariDownloadPage(locale)
      if (!data) throw new Error('Ricettari download non trovato')

      return {
        // hero
        hero: data.hero || '',
        heroBackground: data.heroBackground || null,
        // body
        titlebody: data.titlebody || '',
        subtitlebody: data.subtitlebody || '',
        textbody: data.textbody || '',
        // gallery di blocchi html
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        // seo
        seo: data.seo || [],
        title: 'Ricettari',
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
            hid:
              (t.attributes && (t.attributes.name || t.attributes.property)) ||
              undefined,
            ...t.attributes,
          }))
      : []
    const linksFromDato = Array.isArray(this.seo)
      ? this.seo
          .filter((t) => t.tag === 'link')
          .map((t) => ({ ...t.attributes }))
      : []

    return {
      title: this.titlebody || this.hero || this.title || 'Ricettari',
      meta: metaFromDato,
      link: linksFromDato,
    }
  },
}
</script>

<style scoped>
/* Rende i blocchi HTML della gallery più coerenti nella card */
.ricettari-card a {
  display: block;
  text-decoration: none;
}
.ricettari-card img {
  display: block;
  width: 100%;
  height: auto;
  border: 0;
}
</style>
