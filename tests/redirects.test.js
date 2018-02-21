import test from 'ava'
import parseHeaders from '../index'

test('parsed redirect headers properly', t => {
  const testCases = [{
    header: 'Location: https://google.com',
    result: {
      'location': 'https://google.com',
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});