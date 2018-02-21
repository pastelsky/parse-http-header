import test from 'ava'
import parseHeaders from '../index'

test('parsed do not track headers properly', t => {
  const testCases = [{
    header: 'DNT: 0',
    result: {
      'dnt': false,
    },
  }, {
    header: 'DNT: 1',
    result: {
      'dnt': true,
    },
  }, {
    header: 'Tk: N',
    result: {
      'tk': {
        status: 'not tracking',
        value: 'N'
      },
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});