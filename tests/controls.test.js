import test from 'ava'
import parseHeaders from '../index'

test('parsed control headers properly', t => {
  const testCases = [{
    header: 'Expect: 100-continue',
    result: {
      'expect': '100-continue',
    },
  }, {
    header: 'Max-Forwards: 3',
    result: {
      'max-forwards': 3,
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});