import test from 'ava'
import parseHeaders from '../index'

test('parsed transfer coding properly', t => {
  const testCases = [{
    header: 'Transfer-Encoding: chunked',
    result: {
      'transfer-encoding': ['chunked']
    },
  }, {
    header: 'Transfer-Encoding: gzip, chunked',
    result: {
      'transfer-encoding': ['gzip', 'chunked']
    },
  }, {
    header: 'TE: compress',
    result: {
      'te': [{ name: 'compress', qualityFactor: 1}]
    },
  }, {
    header: 'TE: trailers, deflate;q=0.5',
    result: {
      'te': [{ name: 'trailers', qualityFactor: 1}, { name: 'deflate', qualityFactor: 0.5}]
    },
  }, {
    header: 'Trailer: Expires',
    result: {
      'trailer': ['expires']
    },
  }, {
    header: 'Trailer: Expires, Max-Age',
    result: {
      'trailer': ['expires', 'max-age']
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});