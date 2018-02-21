import test from 'ava'
import parseHeaders from '../index'

test('parsed request context headers properly', t => {
  const testCases = [{
    header: 'From: s@k.com',
    result: {
      'from': 's@k.com',
    },
  }, {
    header: 'Host: localhost:9000',
    result: {
      'host': 'localhost:9000',
    },
  }, {
    header: 'Referer: https://google.com',
    result: {
      'referer': 'https://google.com',
    },
  },  {
    header: 'Referrer-Policy: no-referrer',
    result: {
      'referrer-policy': 'no-referrer',
    },
  },  {
    header: 'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
    result: {
      'user-agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});