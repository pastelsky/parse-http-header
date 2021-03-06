# parse-http-header
- Parses request and response headers
- Supports a wide variety of well known headers (See [this](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers))
- Normalizes casing
- Documented and tested

## Authentication Headers

#### WWW-Authenticate: `Object`
- **type**: `string`
- **charset**: `string | null`
- **realm**: `string | null`

#### Authorization / Proxy-Authorization: `Object`
- **type**: `string`
- **credentials**: `string`

#### Proxy-Authenticate: `Object`
- **type**: `string`
- **realm**: `string | null`

## Caching Headers
#### Age: `number`

#### Cache-Control: `Object`
- **directives**: `[string]`
- **values**: `Object | {}`
  - maxAge: `number`
  
#### Expires: `Date`
#### Pragma: `string`
#### Warning: `Object`
 - **agent**: `string`,
 - **code**: `number`,
 - **date**: `Date` | `null`,
 - **text**: `string`
 
## Client Hints Headers
#### Accept-CH: `[string]`
#### Content-DPR: `number`
#### DPR: `number`
#### Width: `number`
#### Viewport-Width: `number`
#### Downlink: `number`

## Conditional Headers
#### Last-Modified: `date`
#### If-Modified-Since: `date`
#### Etag: `Object`
  - hash: `string`
  - weak: `boolean`
#### If-Match / If-None-Match: `Object`
  - any: `boolean`
  - etags: `[Object]`
    - hash: `string`
    - weak: `boolean`

## Connection Headers
#### Connection: `string`
#### Keep-Alive: `Object`
  - timeout: `number`
  - max: `number`
  
## Content Negotiation
#### Accept `[Object]`
  - name: `string`
  - qualityFactor: `number`
#### Accept-Charset: `[Object]`
  - name: `string`
  - qualityFactor: `number`
#### Accept-Language: `[Object]`
  - name: `string`
  - qualityFactor: `number`
#### Accept-Encoding: `[Object]`
  
## Control Headers
#### Expect: `string`
#### Max-Forwards: `number`

## Cookie Headers
#### Cookie: `[Object]`
  - name: `string`
  - value: `string`
#### Set-Cookie: `[Object]`
  - name: `string`
  - value: `string`
  - domain: `string`
  - path: `string`
  - expires: `date`
  - maxAge: `number`
  - secure: `boolean`
  
## CORS Headers
#### Access-Control-Allow-Origin: `string`
#### Access-Control-Allow-Credentials: `boolean`
#### Access-Control-Allow-Headers: `[string]`
#### Access-Control-Allow-Methods: `[string]`
#### Access-Control-Expose-Headers: `[string]`
#### Access-Control-Request-Headers: `[string]`
#### Access-Control-Request-Method: `string`
#### Origin: `string`
#### Timing-Allow-Origin: `[string]`

## Do Not Track Headers
#### DNT: `boolean`
#### Tk: `Object`
  - status: `string`
  - value: `string`

## Download Headers
  
