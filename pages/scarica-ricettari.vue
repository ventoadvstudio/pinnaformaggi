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
          {{ hero }}
        </p>
      </div>
    </div>

    <!-- BODY -->
    <section class="container py-40">
      <h1
        class="uppercase font-title font-medium text-primary md:text-40 text-center h1-mobile"
      >
        {{ titlebody }}
      </h1>

      <h3
        v-if="subtitlebody"
        class="modular-section__paragraph-title font-bold uppercase mb-10 text-cocoa-500 text-center md:text-22 h3-mobile"
      >
        {{ subtitlebody }}
      </h3>

      <p
        v-if="textbody"
        class="text-base leading-relaxed text-center text-gray-500 p-mobile"
      >
        {{ textbody }}
      </p>
    </section>

    <!-- GALLERIA DI BLOCCHI HTML -->
    <section v-if="gallery && gallery.length" class="container py-60">
      <div v-for="(block, i) in gallery" :key="`gal-${i}`" class="mb-10">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose max-w-none" v-html="block.htmlRicettari"></div>
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
      if (!data) throw new Error('RicettariDownload non trovato')

      return {
        hero: data.hero || '',
        heroBackground: data.heroBackground || null,
        titlebody: data.titlebody || '',
        subtitlebody: data.subtitlebody || '',
        textbody: data.textbody || '',
        gallery:
          data.gallery && Array.isArray(data.gallery) ? data.gallery : [],
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
      title: this.titlebody || this.hero || 'Scarica ricettari',
      meta: metaFromDato,
      link: linksFromDato,
    }
  },
}
</script>
