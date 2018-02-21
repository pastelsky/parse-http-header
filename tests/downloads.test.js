import test from 'ava'
import parseHeaders from '../index'

test('parsed downloads headers properly', t => {
  const testCases = [{
    header: 'Content-Disposition: form-data; name="fieldName"; filename="filename.jpg"',
    result: {
      'content-disposition': {
        fileName: 'filename.jpg',
        'fileName*': null,
        name: 'fieldName',
        type: 'form-data',
      },
    },
  }, {
    header: 'Content-Disposition: attachment; filename="cool.html"',
    result: {
      'content-disposition': {
        fileName: 'cool.html',
        'fileName*': null,
        name: null,
        type: 'attachment',
      },
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});