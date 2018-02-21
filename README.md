# parse-http-header
- Parses request and response headers
- Supports a wide variety of well known headers (See [this](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers))
- Normalizes casing
- Documented and tested

### Authentication Headers

#### WWW-Authenticate: `<Object>`
- **type**: `<string>`
- **charset**: `<string> | null`
- **realm**: `<string> | null`

#### Authorization / Proxy-Authorization: `<Object>`
- **type**: `<string>`
- **credentials**: `<string>`

#### Proxy-Authenticate: `<Object>`
- **type**: `<string>`
- **realm**: `<string> | null`

### Caching Headers

#### Age: `<number>`

#### Cache-Control: `<Object>`
- **directives**: `[<string>]`
- **values**: `<Object> | {}`
  - maxAge: `<number>`
  
#### Expires: `<Date>`
#### Pragma: `<string>`
#### Warning: `<Object>`
 - **agent**: <string>,
 - **code**: <number>,
 - **date**: <Date> | null,
 - **text**: <string>
