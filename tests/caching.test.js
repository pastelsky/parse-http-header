import test from 'ava'
import parseHeaders from '../index'

test('parsed caching headers properly', t => {
  const testCases = [{
    header: 'Age: 24',
    result: {
      'age': 24,
    },
  }, {
    header: 'Cache-Control: public, max-age=31536000',
    result: {
      'cache-control': {
        directives: ['public', 'max-age'],
        values: {
          maxAge: 31536000,
        },
      },
    },
  }, {
    header: 'Cache-Control: no-cache, no-store, must-revalidate',
    result: {
      'cache-control': {
        directives: ['no-cache', 'no-store', 'must-revalidate'],
        values: {},
      },
    },
  }, {
    header: 'Cache-Control: max-age=0, private, no-store, no-cache, must-revalidate',
    result: {
      'cache-control': {
        directives: ['max-age', 'private', 'no-store', 'no-cache',
                     'must-revalidate'],
        values: {
          maxAge: 0,
        },
      },
    },
  }, {
    header: 'Expires: Wed, 21 Oct 2015 07:28:00 GMT',
    result: {
      'expires': new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
    },
  }, {
    header: 'Pragma: no-cache',
    result: {
      'pragma': 'no-cache',
    },
  }, {
    header: 'Warning: 110 anderson/1.3.37 "Response is stale"',
    result: {
      'warning': {
        agent: 'anderson/1.3.37',
        code: 110,
        date: null,
        text: 'Response is stale'
      },
    },
  }, {
    header: 'Warning: 112 - "cache down" "Wed, 21 Oct 2015 07:28:00 GMT"',
    result: {
      'warning': {
        agent: '-',
        code: 112,
        date: new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
        text: 'cache down',
      }
    }
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});
