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
        <!-- Se vuoi un solo H1 in pagina, valuta di NON usare <h1> qui -->
        <p class="uppercase text-50 lg:text-80 font-heading">
          {{ title }}
        </p>
      </div>
    </div>

    <!-- BODY -->
    <section class="container py-40">
      <h1
        class="uppercase font-title font-medium text-primary md:text-40 text-center"
      >
        {{ titlebody }}
      </h1>

      <h3
        v-if="subtitlebody"
        class="modular-section__paragraph-title font-bold uppercase mb-7 text-cocoa-500 text-center md:text-22"
      >
        {{ subtitlebody }}
      </h3>

      <p
        v-if="textbody"
        class="text-base leading-relaxed text-center text-gray-500"
      >
        {{ textbody }}
      </p>
    </section>

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
      const locale = 'it'
      const data = await getRicettariPage(locale)
      if (!data) throw new Error('Ricettari non trovato')

      return {
        title: data.title || '',
        heroBackground: data.heroBackground || null,
        // nuovi campi
        titlebody: data.titlebody || '',
        subtitlebody: data.subtitlebody || '',
        textbody: data.textbody || '',
        brevoForm: data.brevoForm || '',
        seo: data.seo || [],
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
      title: this.titlebody || this.title || 'Ricettari',
      meta: metaFromDato,
      link: linksFromDato,
    }
  },
}
</script>
