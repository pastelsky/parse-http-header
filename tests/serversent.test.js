import test from 'ava'
import parseHeaders from '../index'

test('parsed server sent properly', t => {
  const testCases = [{
    header: 'Ping-From: http://example.com',
    result: {
      'ping-from': 'http://example.com'
    },
  }, {
    header: 'Ping-To: http://example.com',
    result: {
      'ping-to': 'http://example.com'
    },
  },{
    header: 'Last-Event-ID: 34',
    result: {
      'last-event-id': '34'
    },
  },]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});