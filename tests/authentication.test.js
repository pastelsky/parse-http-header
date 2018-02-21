import test from 'ava'
import parseHeaders from '../index'

test('parsed authentication headers properly', t => {
  const testCases = [{
    header: 'WWW-Authenticate: Basic',
    result: {
      'www-authenticate': {
        charset: null,
        realm: null,
        type: 'Basic',
      },
    },
  }, {
    header: 'WWW-Authenticate: Basic realm="Access to the staging site", charset="UTF-8"',
    result: {
      'www-authenticate': {
        charset: 'UTF-8',
        realm: 'Access to the staging site',
        type: 'Basic',
      },
    },
  }, {
    header: 'Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l',
    result: {
      'authorization': {
        credentials: 'YWxhZGRpbjpvcGVuc2VzYW1l',
        type: 'Basic',
      },
    },
  }, {
    header: 'Proxy-Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l',
    result: {
      'proxy-authorization': {
        credentials: 'YWxhZGRpbjpvcGVuc2VzYW1l',
        type: 'Basic',
      },
    },
  }, {
    header: 'Proxy-Authenticate: Basic realm="Access to the internal site"',
    result: {
      'proxy-authenticate': {
        realm: 'Access to the internal site',
        type: 'Basic',
      },
    },
  }, {
    header: 'Proxy-Authenticate: Basic',
    result: {
      'proxy-authenticate': {
        realm: null,
        type: 'Basic',
      },
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});