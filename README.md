# parse-http-header
- Parses request and response headers
- Supports a wide variety of well known headers (See [this](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers))
- Normalizes casing
- Documented and tested

### Authentication Headers

#### WWW-Authenticate
- **type**: `<string>`
- **charset**: `<string> | null`
- **realm**: `<string> | null`

#### Authorization
- **type**: `<string>`
- **credentials**: `<string>`
