<script>
import { makeid } from '../utils'

function getTitle(data, titleSuffix) {
  let title
  if (data.title) {
    title = data.title
  } else if (data.presentation && data.presentation.title) {
    title = data.presentation.title
  } else if (data.search && data.search.title) {
    title = data.search.title
  } else if (data.sectionCoverSwitch && data.sectionCoverSwitch.title) {
    title = data.sectionCoverSwitch.title
  } else if (data.hero && data.hero.title) {
    title = data.hero.title
  }

  return title ? title + titleSuffix : data.globalSeo.fallbackSeo.title
}
export default {
  data() {
    return {
      baseUrl: process.env.URL,
    }
  },
  computed: {
    globalSeo() {
      const locale = this.$i18n.locale
      return this.$store.state.common[locale].globalSeo
    },
  },
  mounted() {
    const eventId = makeid(32)
    if (window.dataLayer) {
      window.dataLayer.push({
        event_id: eventId,
      })
    }
    this.$axios.post('.netlify/functions/pageViewFb', {
      sourceUrl: window.location.href,
      eventId,
    })
  },
  head() {
    const seo = this.seo || this.globalSeo.fallbackSeo
    const title =
      this.seo && this.seo.title
        ? this.seo.title
        : getTitle(this, this.globalSeo.titleSuffix)
    if (!Object.keys(seo).length) {
      return { title }
    }
    const meta = [
      { hid: 'og:site_name', property: 'og:site_name', content: title },
      { hid: 'og:title', property: 'og:title', content: title },
      {
        hid: 'og:url',
        property: 'og:url',
        content: this.baseUrl + this.$route.fullPath,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: seo.image ? seo.image.url : '',
      },
      {
        hid: 'og:image:secure_url',
        property: 'og:image:secure_url',
        content: seo.image ? seo.image.url : '',
      },
      {
        hid: 'og:image:alt',
        property: 'og:image:alt',
        content: title,
      },
      {
        hid: 'og:image:type',
        property: 'og:image:type',
        content: 'image/png',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: title,
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: seo.image ? seo.image.url : '',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: seo.twitterCard,
      },
    ]
    if (this.seo) {
      meta.push(
        {
          hid: 'description',
          name: 'description',
          content: this.seo.description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.seo.description,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.seo.description,
        }
      )
    }
    return {
      title,
      meta,
    }
  },
}
</script>
