const setCookieParser = require('set-cookie-parser')
const cookieParser = require('cookie')

function parseHeader(headerString) {
  function parseHeaderLine({ key, value }) {
    const byRegex = (value, regex, index = 1) => {
      const matches = value.match(regex)
      if (matches) {
        return matches[index]
      }
      return null
    }

    const byIndex = (array, index) => {
      if (array.length <= index) {
        return null
      }
      return array[index]
    }

    const withQualityFactor = (components) =>
      components.map(component => {
        const subComponents = component.split(';')
        return {
          name: subComponents[0],
          qualityFactor: subComponents.length === 2 ?
            parseFloat(
              subComponents[1]
                .match(/q=(.+)/)[1],
            ) : 1,
        }
      })

    const toCamelCase = (name) =>
      name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

    switch (key) {
      // Authentication
      case 'www-authenticate':
        return {
          type: value.split(' ')[0],
          realm: byRegex(value, /\brealm="(.+?)"/i),
          charset: byRegex(value, /\bcharset="(.+?)"/i),
        }

      case 'proxy-authorization':
      case 'authorization': {
        const components = value.split(' ')
        return {
          type: components[0],
          credentials: components.length > 1 ? components[1] : null,
        }
      }

      case 'proxy-authenticate':
        return {
          type: value.split(' ')[0],
          realm: byRegex(value, /\brealm="(.+?)"/i),
        }

      // Caching
      case 'age':
        return parseInt(value)

      case 'cache-control': {
        const directivesSplit = value.split(',').map(d => d.trim())
        const directives = [], values = {}

        directivesSplit.forEach(directive => {
          if (directive.indexOf('=') !== -1) {
            const directiveKey = directive.split('=')[0]
            const directiveValue = directive.split('=')[1]

            values[toCamelCase(directiveKey)] = parseInt(directiveValue)
            directives.push(directiveKey)
          } else {
            directives.push(directive)
          }
        })

        return { directives: directives, values: values }
      }

      case 'expires':
        return new Date(value)

      case 'pragma':
        return value

      case 'warning': {
        const components = value.match(/(\d+?) (.+?) "(.+?)" ?("(.+?)")?/)
        return {
          code: parseInt(components[1]),
          agent: components[2],
          text: components[3],
          date: components[4] ? new Date(components[4]) : null,
        }
      }

      // client hints
      case 'accept-ch':
        return value.split(',').map(v => v.trim())

      case 'content-dpr':
        return parseFloat(value)

      case 'dpr':
        return parseFloat(value)

      case 'downlink':
        return parseFloat(value)

      case 'save-data':
        return value.toLowerCase() === 'on'

      case 'viewport-width':
        return parseInt(value)

      case 'width':
        return parseInt(value)

      // conditionals
      case 'last-modified':
        return new Date(value)

      case 'etag': {
        const hash = value.match(/"(.+)"/)[1]
        return {
          hash: hash,
          weak: value.startsWith('W/'),
        }
      }

      case 'if-match':
      case 'if-none-match': {
        const etags = value.split(',').map(v => v.trim())
        if (value === '*') {
          return {
            etags: [],
            any: true,
          }
        }
        return {
          any: false,
          etags: etags.map((etag) => {
            const hash = etag.match(/"(.+)"/)[1]
            return {
              hash,
              weak: value.startsWith('W/'),
            }
          }),
        }
      }

      case 'if-modified-since':
      case 'if-unmodified-since':
        return new Date(value)

      // connection management
      case 'connection':
        return value

      case 'keep-alive': {
        const components = value.split(',').map(v => v.trim())
        return {
          timeout: parseInt(byRegex(value, /\btimeout=(\d+)\b/i)),
          max: parseInt(byRegex(value, /\bmax=(\d+)\b/i)),
        }
      }

      // content negotiation
      case 'accept': {
        const components = value.split(',')
          .map(v => v.trim())

        return withQualityFactor(components)
      }

      case 'accept-charset': {
        const components = value.split(',')
          .map(v => v.trim())

        return withQualityFactor(components)
      }

      case 'accept-encoding': {
        const components = value.split(',')
          .map(v => v.trim())

        return withQualityFactor(components)
      }

      case 'accept-language': {
        const components = value.split(',')
          .map(v => v.trim())

        return withQualityFactor(components)
      }

      // control
      case 'expect':
        return value

      case 'max-forwards':
        return parseInt(value)

      // Cookies
      case 'set-cookie':
        return setCookieParser(value)

      case 'cookie': {
        const cookies = cookieParser.parse(value)
        return Object
          .keys(cookies)
          .map((key) => ({ name: key, value: cookies[key] }))
      }

      // cors
      case 'access-control-allow-origin':
        return value

      case 'access-control-allow-credentials':
        return true // The only valid value is true
      case 'access-control-allow-headers':
        return value.split(',').map(v => v.trim())

      case 'access-control-allow-methods':
        return value.split(',').map(v => v.trim().toUpperCase())

      case 'access-control-expose-headers':
        return value.split(',').map(v => v.trim())

      case 'access-control-max-age':
        return parseInt(value)

      case 'access-control-request-headers':
        return value.split(',').map(v => v.trim())

      case 'access-control-request-method':
        return value.toUpperCase()


      case 'origin':
        return value

      case 'timing-allow-origin':
        return value.split(',').map(v => v.trim())

      // Do not track
      case 'dnt':
        return parseInt(value) === 1

      case 'tk': {
        const map = {
          '!': 'under construction',
          '?': 'dynamic',
          G: 'gateway or multiple parties',
          N: 'not tracking',
          T: 'tracking',
          C: 'tracking with consent',
          P: 'potential consent',
          D: 'disregarding DNT',
          U: 'updated',
        }

        return {
          status: map[value],
          value: value,
        }
      }

      // downloads
      case 'content-disposition': {
        const components = value.split(';').map(v => v.trim())
        return {
          type: components[0],
          name: byRegex(value, /\bname="(.+?)"/i),
          fileName: byRegex(value, /\bfilename="(.+?)"/i),
          'fileName*': byRegex(value, /\bfilename\*="(.+?)"/i),
        }
      }

      // message body information
      case 'content-length':
        return parseInt(value)

      case 'content-type': {
        const components = value.split(';').map(v => v.trim())
        return {
          type: components[0],
          charset: byRegex(value, /\bcharset=(.+)\b/i),
          boundary: byRegex(value, /\bboundary=(.+)\b/i),
        }
      }

      case 'content-encoding':
        return value.split(',').map(v => v.trim())

      case 'content-language':
        return value.split(',').map(v => v.trim())

      case 'content-location':
        return value

      case 'forwarded': {
        const components = value.split(';').map(v => v.trim())
        const result = {
          for: [],
          by: [],
          host: null,
          protocol: null,
        }

        components.forEach((component) => {
          const subComponents = component.split(',').map(v => v.trim())
          subComponents.forEach((subComponent) => {
            const matches = subComponent.match(/(.+)="?([^"]+)/)
            const key = matches[1].toLowerCase()
            const value = matches[2]

            if (key === 'proto') {
              result.protocol = value
            } else if (result[key]) {
              result[key].push(value)
            } else {
              result[key] = value
            }
          })
        })

        return result
      }

      case 'x-forwarded-for':
        return value.split(',').map(v => v.trim())

      case 'x-forwarded-host':
      case 'x-forwarded-proto':
        return value

      case 'via': {
        const components = value.split(',').map(v => v.trim())
        return components.map(component => {
          const directives = component.split(' ')

          const secondParam = byIndex(directives, 1)
          return {
            protocol: directives[0],
            host: secondParam.indexOf('.') > -1 ? secondParam : null,
            pseudonym: secondParam.indexOf('.') > -1 ? null : secondParam,
          }
        })
      }

      // redirects
      case 'location':
        return value

      // request context
      case 'from':
      case 'host':
      case  'referer': // misspelt in the spec
      case 'referrer-policy':
      case 'user-agent':
        return value

      // response context
      case 'allow':
        return value.split(',').map(v => v.trim().toUpperCase())

      case 'server':
        return value

      // range requests
      case 'accept-ranges':
        return value

      case 'range': {
        const components = value.split(',').map(v => v.trim())
        const rangesRegex = /(\d+)-(\d+)?/
        return {
          unit: components[0].split('=')[0],
          ranges: components.map(component => {
            const matches = component.match(rangesRegex)
            return {
              start: parseInt(matches[1]),
              end: matches[2] ? parseInt(matches[2]) : null,
            }
          }),
        }
      }

      case 'if-range': {
        const isDate = !isNaN(new Date(value).getTime())
        return {
          lastModified: isDate ? new Date(value) : null,
          etag: isDate ? null : parseHeaderLine({ key: 'etag', value }),
        }
      }

      case 'content-range': {
        const pattern1 = /(.+?) (\d+)-(\d+)?\/([\d*]+)/
        const pattern2 = /(.+?) [*]\/(\d+)/
        const rangeUndefined = value.match(pattern2)
        const matches = rangeUndefined ? value.match(pattern2) :
          value.match(pattern1)

        return {
          unit: matches[1],
          start: rangeUndefined ? null : parseInt(matches[2]),
          end: rangeUndefined ? null : parseInt(matches[3]),
          size: rangeUndefined ? parseInt(matches[2]) :
            (matches[4] === '*' ? -1 : parseInt(matches[4])),
        }
      }

      case 'status':
        return parseInt(value)

      // security
      case 'content-security-policy':
      case 'content-security-policy-report-only': {
        const result = {}
        const directives = value.split(';').map(v => v.trim())

        directives.forEach(directive => {
          const components = directive.split(' ')
            .map(d => d.replace(/['"]/g, ''))
          result[components[0]] = components.slice(1)
        })

        return result
      }

      case 'expect-ct': {
        const components = value.split(',').map(v => v.trim())
        return {
          maxAge: parseInt(byRegex(value, /\bmax-age=(\d+)\b/)),
          enforce: components.indexOf('enforce') > -1,
          reportUri: byRegex(value, /report-uri="(.+)"/),
        }
      }

      case 'public-key-pins':
      case 'public-key-pins-report-only': {
        const components = value.split(';').map(v => v.trim())
        return {
          maxAge: parseInt(byRegex(value, /\bmax-age=(\d+)\b/)),
          includeSubDomains: components.indexOf('includeSubDomains') > -1,
          reportUri: byRegex(value, /report-uri="(.+)"/),
          pinSHA256: components
            .map(component => byRegex(component, /pin-sha256="(.+)"/))
            .filter(pin => !!pin),
        }
      }

      case 'strict-transport-security': {
        const components = value.split(';').map(v => v.trim())
        return {
          maxAge: parseInt(byRegex(value, /\bmax-age=(\d+)\b/)),
          includeSubDomains: components.indexOf('includeSubDomains') > -1,
          preload: components.indexOf('preload') > -1,
        }
      }

      case 'upgrade-insecure-requests':
        return parseInt(value) === 1

      case 'x-content-type-options':
        return value

      case 'x-frame-options':
        const components = value.split(' ')
        return {
          directive: components[0],
          uri: components[1] ? components[1] : null,
        }

      case 'x-xss-protection':
        return {
          enabled: value.split(';')[0] === '1',
          mode: byRegex(value, /\bmode=(.+)\b/),
          reportUri: byRegex(value, /\breport=(.+)\b/),
        }

      // server-side events
      case 'ping-from':
      case 'ping-to':
      case 'last-event-id':
        return value

      // transfer coding
      case 'transfer-encoding':
        return value.split(',').map(v => v.trim())

      case 'te': {
        const components = value.split(',')
          .map(v => v.trim())
        return withQualityFactor(components)
      }

      case 'trailer':
        return value.split(',')
          .map(v => v.trim().toLowerCase())

      // websockets

      // others
      case 'date':
        return new Date(value)

      case 'large-allocation':
        return parseInt(value)

      case 'link': {
        const components = value.split(',')
          .map(v => v.trim())

        return components.map(component => ({
          url: byRegex(component.split(';')[0], /<(.+)>/),
          rel: byRegex(component.split(';')[1], /rel=(.+)/).replace(/"/g, ''),
        }))
      }

      case 'retry-after':
        return {
          delay: isNaN(value) ? null : parseInt(value),
          date: isNaN(value) ? new Date(value) : null,
        }

      case 'sourcemap':
        return value

      case 'upgrade':
        return value.split(',')
          .map(v => v.trim())

      case 'vary':
        return value.split(',')
          .map(v => v.trim().toLowerCase())

      case 'x-dns-prefetch-control':
        return value === 'on'

      case 'x-requested-with':
        return value

      case 'x-ua-compatible':
        return value.split(';')
          .map(v => v.trim())
          .map((browserString) => ({
            name: browserString.split('=')[0].toLowerCase(),
            version: browserString.split('=')[1],
          }))

      default:
        return value
    }
  }

  const parsed = {}
  const indexOfColon = headerString.indexOf(':')
  const headerKey = headerString.substring(0, indexOfColon).toLowerCase().trim()
  const headerValue = headerString.substring(indexOfColon + 1).trim()

  parsed[headerKey] = parseHeaderLine({
    key: headerKey,
    value: headerValue,
  })

  return parsed
}

//
//parseHeaders(`
//Cache-control: no-cache="set-cookie"
//Connection: keep-alive
//Content-Encoding: gzip
//Content-Type: text/html; charset=utf-8
//Date: Thu, 18 Jan 2018 13:07:34 GMT
//ETag: W/"aa3b1-aWHZG39wmVHucEA/g24fvw"
//Server: openresty
//Set-Cookie: AWSELB=97B3358B1C150AC96AC74F39ED34D289809132006F7BA5B2F25F07E55154F8085275EA0D2F39DF8BB21744F830D89ECD43579653C46C0C919E1E506531E2E9FA2E694132F7;PATH=/;MAX-AGE=600
//Strict-Transport-Security: max-age=31536000
//transfer-encoding: chunked
//Vary: Accept-Encoding
//X-Content-Type-Options: nosniff
//X-Frame-Options: SAMEORIGIN
//x-mach: pawslmkthomepage04
//X-PAYTM-SRV-ID: pawslmktshopapp12
//X-Powered-By: Express
//X-XSS-PROTECTION: 1; mode=block
//`)

module.exports = parseHeader