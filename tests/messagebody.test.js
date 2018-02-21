import test from 'ava'
import parseHeaders from '../index'

test('parsed control headers properly', t => {
  const testCases = [{
    header: 'Content-Length: 1000',
    result: {
      'content-length': 1000,
    },
  }, {
    header: 'Content-Type: multipart/form-data; boundary=something',
    result: {
      'content-type': {
        type: 'multipart/form-data',
        boundary: 'something',
        charset: null,
      },
    },
  }, {
    header: 'Content-Type: text/html; charset=utf-8',
    result: {
      'content-type': {
        type: 'text/html',
        charset: 'utf-8',
        boundary: null,
      },
    },
  }, {
    header: 'Content-Encoding: deflate, gzip',
    result: {
      'content-encoding': ['deflate', 'gzip']
    },
  }, {
    header: 'Content-Language: en-US, de',
    result: {
      'content-language': ['en-US', 'de']
    },
  }, {
    header: 'Content-Location: https://google.com',
    result: {
      'content-location': 'https://google.com',
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});