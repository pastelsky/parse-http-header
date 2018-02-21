import test from 'ava'
import parseHeaders from '../index'

test('parsed security headers properly', t => {
  const testCases = [{
    header: `Content-Security-Policy: default-src 'none';
     base-uri 'self'; 
     child-src render.githubusercontent.com; 
     connect-src 'self' uploads.github.com status.github.com collector.githubapp.com api.github.com www.google-analytics.com github-cloud.s3.amazonaws.com github-production-repository-file-5c1aeb.s3.amazonaws.com github-production-upload-manifest-file-7fdce7.s3.amazonaws.com github-production-user-asset-6210df.s3.amazonaws.com wss://live.github.com; 
     font-src assets-cdn.github.com; form-action 'self' github.com gist.github.com; 
     frame-ancestors 'none'; 
     img-src 'self' data: assets-cdn.github.com identicons.github.com collector.githubapp.com github-cloud.s3.amazonaws.com *.githubusercontent.com; 
     media-src 'none'; 
     script-src assets-cdn.github.com; 
     style-src 'unsafe-inline' assets-cdn.github.com`,
    result: {
      'content-security-policy': {
        'default-src': ['none'],
        'base-uri': ['self'],
        'child-src': ['render.githubusercontent.com'],
        'connect-src':
          ['self',
           'uploads.github.com',
           'status.github.com',
           'collector.githubapp.com',
           'api.github.com',
           'www.google-analytics.com',
           'github-cloud.s3.amazonaws.com',
           'github-production-repository-file-5c1aeb.s3.amazonaws.com',
           'github-production-upload-manifest-file-7fdce7.s3.amazonaws.com',
           'github-production-user-asset-6210df.s3.amazonaws.com',
           'wss://live.github.com'],
        'font-src': ['assets-cdn.github.com'],
        'form-action': ['self', 'github.com', 'gist.github.com'],
        'frame-ancestors': ['none'],
        'img-src':
          ['self',
           'data:',
           'assets-cdn.github.com',
           'identicons.github.com',
           'collector.githubapp.com',
           'github-cloud.s3.amazonaws.com',
           '*.githubusercontent.com'],
        'media-src': ['none'],
        'script-src': ['assets-cdn.github.com'],
        'style-src': ['unsafe-inline', 'assets-cdn.github.com'],
      },
    },
  }, {
    header: 'Content-Security-Policy-Report-Only: default-src https:; report-uri /csp-violation-report-endpoint/',
    result: {
      'content-security-policy-report-only': {
        'default-src': ['https:'],
        'report-uri': ['/csp-violation-report-endpoint/'],
      },
    },
  }, {
    header: 'Expect-CT: max-age=86400, enforce, report-uri="https://foo.example/report"',
    result: {
      'expect-ct': {
        maxAge: 86400,
        enforce: true,
        reportUri: 'https://foo.example/report',
      },
    },
  }, {
    header: `
    Public-Key-Pins: 
  pin-sha256="cUPcTAZWKaASuYWhhneDttWpY3oBAkE3h2+soZS7sWs="; 
  pin-sha256="M8HztCzM3elUxkcjR2S5P4hhyBNf6lHkmjAHKhpGPWE="; 
  max-age=5184000; includeSubDomains; 
  report-uri="https://www.example.org/hpkp-report"
  `,
    result: {
      'public-key-pins': {
        maxAge: 5184000,
        includeSubDomains: true,
        reportUri: 'https://www.example.org/hpkp-report',
        pinSHA256: ['cUPcTAZWKaASuYWhhneDttWpY3oBAkE3h2+soZS7sWs=',
                    'M8HztCzM3elUxkcjR2S5P4hhyBNf6lHkmjAHKhpGPWE='],
      },
    },
  }, {
    header: `
    Public-Key-Pins-Report-Only: 
  pin-sha256="cUPcTAZWKaASuYWhhneDttWpY3oBAkE3h2+soZS7sWs="; 
  pin-sha256="M8HztCzM3elUxkcjR2S5P4hhyBNf6lHkmjAHKhpGPWE="; 
  max-age=5184000; includeSubDomains; 
  report-uri="https://www.example.org/hpkp-report"
  `,
    result: {
      'public-key-pins-report-only': {
        maxAge: 5184000,
        includeSubDomains: true,
        reportUri: 'https://www.example.org/hpkp-report',
        pinSHA256: ['cUPcTAZWKaASuYWhhneDttWpY3oBAkE3h2+soZS7sWs=',
                    'M8HztCzM3elUxkcjR2S5P4hhyBNf6lHkmjAHKhpGPWE='],
      },
    },
  }, {
    header: 'Strict-Transport-Security: max-age=31536000; includeSubDomains',
    result: {
      'strict-transport-security': {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: false
      },
    },
  },  {
    header: 'Strict-Transport-Security: max-age=31536000; preload',
    result: {
      'strict-transport-security': {
        maxAge: 31536000,
        includeSubDomains: false,
        preload: true
      },
    },
  }, {
    header: 'Upgrade-Insecure-Requests: 1',
    result: {
      'upgrade-insecure-requests': true,
    },
  }, {
    header: 'X-Content-Type-Options: nosniff',
    result: {
      'x-content-type-options': 'nosniff',
    },
  }, {
    header: 'X-Frame-Options: DENY',
    result: {
      'x-frame-options': {
        directive: 'DENY',
        uri: null
      }
    },
  }, {
    header: 'X-Frame-Options: SAMEORIGIN',
    result: {
      'x-frame-options': {
        directive: 'SAMEORIGIN',
        uri: null
      },
    },
  }, {
    header: 'X-Frame-Options: ALLOW-FROM https://example.com/',
    result: {
      'x-frame-options': {
        directive: 'ALLOW-FROM',
        uri: 'https://example.com/',
      },
    },
  }, {
    header: 'X-XSS-Protection: 0',
    result: {
      'x-xss-protection': {
        mode: null,
        enabled: false,
        reportUri: null,
      },
    },
  }, {
    header: 'X-XSS-Protection: 1; mode=block\n',
    result: {
      'x-xss-protection': {
        mode: 'block',
        enabled: true,
        reportUri: null,
      },
    },
  }, {
    header: 'X-XSS-Protection: 1; report=https://example.com',
    result: {
      'x-xss-protection': {
        mode: null,
        enabled: true,
        reportUri: 'https://example.com',
      },
    },
  }
]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});