import test from 'ava'
import parseHeaders from '../index'

test('parsed other headers properly', t => {
  const testCases = [{
    header: 'Date: Wed, 21 Oct 2015 07:28:00 GMT',
    result: {
      'date': new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
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
    header: 'Large-Allocation: 100',
    result: {
      'large-allocation': 100,
    },
  }, {
    header: 'Link: <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=2>; rel="next", <https://api.github.com/search/code?q=addClass+user%3Amozilla&page=34>; rel="last"',
    result: {
      'link': [{
        rel: 'next',
        url: 'https://api.github.com/search/code?q=addClass+user%3Amozilla&page=2',
      },
        {
          rel: 'last',
          url: 'https://api.github.com/search/code?q=addClass+user%3Amozilla&page=34',
        },
      ],
    },
  }, {
    header: 'Link: </images/big.jpeg>; rel=prefetch',
    result: {
      'link': [{
        url: '/images/big.jpeg',
        rel: 'prefetch',
      }]
    }
  }, {
    header:'Retry-After: Wed, 21 Oct 2015 07:28:00 GMT',
    result: {
      'retry-after': {
        date: new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
        delay: null,
      }
    }
  }, {
    header:'Retry-After: 10',
    result: {
      'retry-after': {
        date: null,
        delay: 10,
      }
    }
  }, {
    header: 'SourceMap: /path/to/file.js.map',
    result: {
      'sourcemap': '/path/to/file.js.map'
    }
  }, {
    header: 'Upgrade: TLS/1.0, HTTP/1.1',
    result: {
      'upgrade': ['TLS/1.0', 'HTTP/1.1'],
    }
  }, {
    header: 'Vary: User-Agent',
    result: {
      'vary': ['user-agent'],
    }
  }, {
    header: 'Vary: User-Agent, X-Lorem-Ipsum',
    result: {
      'vary': ['user-agent', 'x-lorem-ipsum'],
    }
  }, {
    header: 'X-DNS-Prefetch-Control: on',
    result: {
      'x-dns-prefetch-control': true
    }
  }, {
    header: 'X-DNS-Prefetch-Control: off',
    result: {
      'x-dns-prefetch-control': false
    }
  }, {
    header: 'X-UA-Compatible: IE=9; IE=8; IE=7',
    result: {
      'x-ua-compatible': [{
        name: 'ie',
        version: '9'
      }, {
        name: 'ie',
        version: '8'
      }, {
        name: 'ie',
        version: '7'
      }]
    }
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});