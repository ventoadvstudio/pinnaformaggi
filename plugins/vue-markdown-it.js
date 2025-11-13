import Vue from 'vue'
import * as MarkdownIt from 'markdown-it'

const VueMarkdown = {
  install(Vue) {
    const md = new MarkdownIt({
      html: true,
      breaks: true,
      preset: 'default',
      linkify: true,
    })
    const defaultRender =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
      }

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const aIndex = tokens[idx].attrIndex('target')

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank'])
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank'
      }

      return defaultRender(tokens, idx, options, env, self)
    }
    Vue.prototype.$md = {
      render: (string) => {
        string = string.replace(/(<p><strong>)+(<\/strong><\/p>)/g, '<br />')
        string = string.replace(/(<p>)+(<\/p>)/g, '<br />')
        const lastNewLine = string.lastIndexOf('\n')
        if (lastNewLine !== -1 && lastNewLine + 1 === string.length) {
          string = string.substring(0, lastNewLine)
        }
        string = string.replace(/\n\n(?!\n)/g, '\n')
        string = string.replace(/\n/g, '<br />')
        return md.render(string)
      },
    }
  },
}
Vue.use(VueMarkdown)
