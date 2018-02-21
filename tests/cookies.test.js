import test from 'ava'
import parseHeaders from '../index'

test('parsed cookie headers properly', t => {
  const testCases = [{
    header: 'Cookie: PHPSESSID=298zf09hf012fh2; csrftoken=u32t4o3tb3gg43; _gat=1;',
    result: {
      'cookie': [
        { name: 'PHPSESSID', value: '298zf09hf012fh2' },
        { name: 'csrftoken', value: 'u32t4o3tb3gg43' },
        { name: '_gat', value: '1' },
      ],
    },
  }, {
    header: 'Set-Cookie: sessionid=38afes7a8; HttpOnly; Path=/',
    result: {
      'set-cookie': [
        { name: 'sessionid', value: '38afes7a8', httpOnly: true, path: '/' },
      ],
    },
  }, {
    header: 'Set-Cookie: qwerty=219ffwef9w0f; Domain=somecompany.co.uk; Path=/; Expires=Wed, 30 Aug 2019 00:00:00 GMT',
    result: {
      'set-cookie': [
        {
          name: 'qwerty',
          value: '219ffwef9w0f',
          domain: 'somecompany.co.uk',
          path: '/',
          expires: new Date('Wed, 30 Aug 2019 00:00:00 GMT'),
        },
      ],
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});