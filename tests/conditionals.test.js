import test from 'ava'
import parseHeaders from '../index'

test('parsed conditional headers properly', t => {
  const testCases = [{
    header: 'Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT',
    result: {
      'last-modified': new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
    },
  }, {
    header: 'ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"',
    result: {
      'etag': {
        hash: '33a64df551425fcc55e4d42a148795d9f25f89d4',
        weak: false,
      },
    },
  }, {
    header: 'ETag: W/"0815"',
    result: {
      'etag': {
        hash: '0815',
        weak: true,
      },
    },
  }, {
    header: 'If-Match: "bfc13a64729c4290ef5b2c2730249c88ca92d82d"',
    result: {
      'if-match': {
        any: false,
        etags: [{
          hash: 'bfc13a64729c4290ef5b2c2730249c88ca92d82d',
          weak: false,
        }],
      },
    },
  }, {
    header: 'If-Match: W/"67ab43", "54ed21", "7892dd"\n',
    result: {
      'if-match': {
        any: false,
        etags: [{
          hash: '67ab43',
          weak: true,
        }, {
          hash: '54ed21',
          weak: true,
        }, {
          hash: '7892dd',
          weak: true,
        }],
      },
    },
  },
    {
      header: 'If-Match: *',
      result: {
        'if-match': {
          etags: [],
          any: true,
        },
      },
    }, {
      header: 'If-None-Match: "bfc13a64729c4290ef5b2c2730249c88ca92d82d"',
      result: {
        'if-none-match': {
          any: false,
          etags: [{
            hash: 'bfc13a64729c4290ef5b2c2730249c88ca92d82d',
            weak: false,
          }],
        },
      },
    }, {
      header: 'If-None-Match: W/"67ab43", "54ed21", "7892dd"\n',
      result: {
        'if-none-match': {
          any: false,
          etags: [{
            hash: '67ab43',
            weak: true,
          }, {
            hash: '54ed21',
            weak: true,
          }, {
            hash: '7892dd',
            weak: true,
          }],
        },
      },
    },
    {
      header: 'If-None-Match: *',
      result: {
        'if-none-match': {
          etags: [],
          any: true,
        },
      },
    },
    {
      header: 'If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT',
      result: {
        'if-modified-since': new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
      },
    },
    {
      header: 'If-Unmodified-Since: Wed, 21 Oct 2015 07:28:00 GMT',
      result: {
        'if-unmodified-since': new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
      },
    },
  ]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});