import test from 'ava'
import parseHeaders from '../index'

test('parsed client hint headers properly', t => {
  const testCases = [{
    header: 'Accept-CH: DPR, Width',
    result: {
      'accept-ch': ['DPR', 'Width'],
    },
  }, {
    header: 'Content-DPR: 1.0',
    result: {
      'content-dpr': 1.0,
    },
  }, {
    header: 'DPR: 2.0',
    result: {
      'dpr': 2.0,
    },
  }, {
    header: 'Width: 320',
    result: {
      'width': 320,
    },
  }, {
    header: 'Viewport-Width: 320',
    result: {
      'viewport-width': 320,
    },
  }, {
    header: 'Downlink: 0.384',
    result: {
      'downlink': 0.384,
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});