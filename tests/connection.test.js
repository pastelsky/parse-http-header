import test from 'ava'
import parseHeaders from '../index'

test('parsed connection managements headers properly', t => {
  const testCases = [{
    header: 'Connection: keep-alive',
    result: {
      'connection': 'keep-alive',
    },
  }, {
    header: 'Keep-Alive: timeout=5, max=1000',
    result: {
      'keep-alive': {
        timeout: 5,
        max: 1000,
      },
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});