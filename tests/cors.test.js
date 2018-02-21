import test from 'ava'
import parseHeaders from '../index'

test('parsed cors properly', t => {
  const testCases = [{
    header: 'Access-Control-Allow-Origin: *',
    result: {
      'access-control-allow-origin': '*',
    },
  }, {
    header: 'Access-Control-Allow-Origin: https://developer.mozilla.org',
    result: {
      'access-control-allow-origin': 'https://developer.mozilla.org',
    },
  }, {
    header: 'Access-Control-Allow-Credentials: true',
    result: {
      'access-control-allow-credentials': true,
    },
  }, {
    header: 'Access-Control-Allow-Headers: X-Custom-Header, Vary',
    result: {
      'access-control-allow-headers': ['X-Custom-Header', 'Vary'],
    },
  }, {
    header: 'Access-Control-Allow-Methods: POST, get, OPTIONS',
    result: {
      'access-control-allow-methods': ['POST', 'GET', 'OPTIONS'],
    },
  }, {
    header: 'Access-Control-Expose-Headers: Content-Length, X-Kuma-Revision',
    result: {
      'access-control-expose-headers': ['Content-Length', 'X-Kuma-Revision'],
    },
  }, {
    header: 'Access-Control-Max-Age: 600',
    result: {
      'access-control-max-age': 600,
    }
  }, {
    header: 'Access-Control-Request-Headers: Content-Length, X-Kuma-Revision',
    result: {
      'access-control-request-headers': ['Content-Length', 'X-Kuma-Revision'],
    },
  }, {
    header: 'Access-Control-Request-Method: post',
    result: {
      'access-control-request-method': 'POST'
    }
  }, {
    header: 'Origin: https://developer.mozilla.org',
    result: {
      'origin': 'https://developer.mozilla.org'
    }
  }, {
    header: 'Timing-Allow-Origin: https://developer.mozilla.org',
    result: {
      'timing-allow-origin': ['https://developer.mozilla.org']
    }
  }, {
    header: 'Timing-Allow-Origin: https://developer.mozilla.org, https://google.com',
    result: {
      'timing-allow-origin': ['https://developer.mozilla.org', 'https://google.com']
    }
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});