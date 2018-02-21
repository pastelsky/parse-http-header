import test from 'ava'
import parseHeaders from '../index'

test('parsed request context headers properly', t => {
  const testCases = [{
    header: 'Accept-Ranges: bytes',
    result: {
      'accept-ranges': 'bytes',
    },
  }, {
    header: 'Range: bytes=200-1000, 2000-6576, 19000-',
    result: {
      'range': {
        unit: 'bytes',
        ranges: [
          {
            end: 1000,
            start: 200,
          },
          {
            end: 6576,
            start: 2000,
          },
          {
            end: null,
            start: 19000,
          }],
      },
    },
  }, {
    header: 'If-Range: Wed, 21 Oct 2015 07:28:00 GMT',
    result: {
      'if-range': {
        etag: null,
        lastModified: new Date('Wed, 21 Oct 2015 07:28:00 GMT'),
      },
    },
  }, {
    header: 'If-Range: W/"675af34563dc-tr34"',
    result: {
      'if-range': {
        etag: {
          hash: '675af34563dc-tr34',
          weak: true,
        },
        lastModified: null,
      },
    },
  }, {
    header: 'Content-Range: bytes 200-1000/67589',
    result: {
      'content-range': {
        unit: 'bytes',
        start: 200,
        end: 1000,
        size: 67589,
      },
    },
  }, {
    header: 'Content-Range: bytes 200-1000/*',
    result: {
      'content-range': {
        unit: 'bytes',
        start: 200,
        end: 1000,
        size: -1,
      },
    },
  }, {
    header: 'Content-Range: bytes */500',
    result: {
      'content-range': {
        unit: 'bytes',
        start: null,
        end: null,
        size: 500,
      },
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});