import test from 'ava'
import parseHeaders from '../index'

test('parsed proxy headers properly', t => {
  const testCases = [{
    header: 'Forwarded: for="_mdn"',
    result: {
      'forwarded': {
        for: ['_mdn'],
        by: [],
        host: null,
        protocol: null,
      },
    },
  }, {
    header: 'Forwarded: For="[2001:db8:cafe::17]:4711"',
    result: {
      'forwarded': {
        for: ['[2001:db8:cafe::17]:4711'],
        by: [],
        host: null,
        protocol: null,
      },
    },
  }, {
    header: 'Forwarded: for=192.0.2.60; proto=http; host=https://google.com; by=203.0.113.43',
    result: {
      'forwarded': {
        for: ['192.0.2.60'],
        by: ['203.0.113.43'],
        host: 'https://google.com',
        protocol: 'http',
      },
    },
  }, {
    header: 'Forwarded: for=192.0.2.43, for="[2001:db8:cafe::17]"',
    result: {
      'forwarded': {
        for: ['192.0.2.43', '[2001:db8:cafe::17]'],
        by: [],
        host: null,
        protocol: null,
      },
    },
  }, {
    header: 'X-Forwarded-For: 203.0.113.195, 70.41.3.18, 150.172.238.178',
    result: {
      'x-forwarded-for': ['203.0.113.195', '70.41.3.18', '150.172.238.178']
    },
  }, {
    header: 'X-Forwarded-Host: 203.0.113.195',
    result: {
      'x-forwarded-host': '203.0.113.195',
    },
  }, {
    header: 'X-Forwarded-Proto: https',
    result: {
      'x-forwarded-proto': 'https',
    },
  }, {
    header: 'Via: 1.1 vegur',
    result: {
      'via': [{ protocol: '1.1', pseudonym: 'vegur', host: null }],
    },
  },  {
    header: 'Via: HTTP/1.1 GWA',
    result: {
      'via': [{ protocol: 'HTTP/1.1', pseudonym: 'GWA', host: null }],
    },
  },  {
    header: 'Via: 1.0 fred, 1.1 p.example.net',
    result: {
      'via': [
        { protocol: '1.0', pseudonym: 'fred', host: null },
        { protocol: '1.1', pseudonym: null , host: 'p.example.net' }
      ],
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});