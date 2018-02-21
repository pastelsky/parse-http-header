import test from 'ava'
import parseHeaders from '../index'

test('parsed response context headers properly', t => {
  const testCases = [{
    header: 'Allow: GET, POST, HEAD',
    result: {
      'allow': ['GET', 'POST', 'HEAD'],
    },
  }, {
    header: 'Server: Apache/2.4.1 (Unix)',
    result: {
      'server': 'Apache/2.4.1 (Unix)',
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});