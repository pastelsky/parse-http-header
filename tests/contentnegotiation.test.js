import test from 'ava'
import parseHeaders from '../index'

test('parsed content negotiation headers properly', t => {
  const testCases = [{
    header: 'Accept: text/html',
    result: {
      'accept': [{
        name: 'text/html',
        qualityFactor: 1,
      }],
    },
  }, {
    header: 'Accept: image/*',
    result: {
      'accept': [{
        name: 'image/*',
        qualityFactor: 1,
      }],
    },
  }, {
    header: 'Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
    result: {
      'accept': [{
        name: 'text/html',
        qualityFactor: 1,
      }, {
        name: 'application/xhtml+xml',
        qualityFactor: 1,
      }, {
        name: 'application/xml',
        qualityFactor: 0.9,
      }, {
        name: '*/*',
        qualityFactor: 0.8,
      }],
    },
  }, {
    header: 'Accept-Charset: utf-8, iso-8859-1;q=0.5, *;q=0.1',
    result: {
      'accept-charset': [
        { name: 'utf-8', qualityFactor: 1 },
        { name: 'iso-8859-1', qualityFactor: 0.5 },
        { name: '*', qualityFactor: 0.1 },
      ],
    },
  }, {
    header: 'Accept-Encoding: compress',
    result: {
      'accept-encoding': [{ name: 'compress', qualityFactor: 1 }],
    },
  }, {
    header: 'Accept-Encoding: deflate, gzip;q=1.0, *;q=0.5',
    result: {
      'accept-encoding': [
        { name: 'deflate', qualityFactor: 1 },
        { name: 'gzip', qualityFactor: 1.0 },
        { name: '*', qualityFactor: 0.5 },
      ],
    },
  }, {
    header: 'Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
    result: {
      'accept-language': [
        { name: 'fr-CH', qualityFactor: 1 },
        { name: 'fr', qualityFactor: 0.9 },
        { name: 'en', qualityFactor: 0.8 },
        { name: 'de', qualityFactor: 0.7 },
        { name: '*', qualityFactor: 0.5 },
      ],
    },
  }]

  testCases.forEach((testCase) => {
    const parsed = parseHeaders(testCase.header)
    t.deepEqual(parsed, testCase.result);
  })
});