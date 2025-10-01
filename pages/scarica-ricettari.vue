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

    <!-- GALLERY: mobile=2 col, lg=3 col -->
    <section class="container pb-60">
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <article
          v-for="(block, idx) in gallery"
          :key="block.id || idx"
          class="rounded-2xl overflow-hidden bg-white shadow-md"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div
            class="prose max-w-none ricettari-card"
            v-html="block.htmlRicettari"
          ></div>
        </article>
      </div>
    </section>

    <div id="form-ricettari" class="bg-olive">
      <!--testo sopra il form-->
      <section class="container py-120">
        <h1
          class="uppercase font-title font-medium text-primary md:text-40 text-center h1-mobile light"
        >
          {{ titleform }}
        </h1>

        <h2
          v-if="subtitleform"
          class="modular-section__paragraph-title font-bold uppercase mb-10 text-cocoa-500 text-center md:text-22 h2-mobile text-cream"
        >
          {{ subtitleform }}
        </h2>

        <p
          v-if="textform"
          class="text-base leading-relaxed text-center p-mobile light"
        >
          {{ textform }}
        </p>
      </section>

      <!-- BREVO FORM -->

      <section>
        <!-- embed controllato: iframe Brevo -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose max-w-none" v-html="brevoForm"></div>
      </section>
    </div>
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
        // testo sopra il form
        titleform: data.titleform || '',
        subtitleform: data.subtitleform || '',
        textform: data.textform || '',
        // gallery di blocchi html
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        // brevo form
        brevoForm: data.brevoForm || '',
        // seo
        seo: data.seo || [],
        title: 'Ricettari',
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Pagina non trovata' })
    }
  },

  mounted() {
    // Migliora performance/a11y dell’iframe Brevo, se presente
    this.$nextTick(() => {
      const iframe = document.querySelector('.prose iframe')
      if (iframe) {
        iframe.setAttribute('loading', 'lazy')
        iframe.setAttribute('title', 'Iscrizione Ricettari Brevo')
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
        iframe.setAttribute(
          'sandbox',
          'allow-forms allow-scripts allow-same-origin'
        )
      }
    })

    // Carica dinamicamente lo script Brevo se non già presente
    if (!document.getElementById('brevo-form-js')) {
      const script = document.createElement('script')
      script.id = 'brevo-form-js'
      script.src =
        'https://cdn.jsdelivr.net/gh/Ventoadv/form-brevo@2c19289/brevo-form.js'
      script.defer = true
      document.body.appendChild(script)
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
