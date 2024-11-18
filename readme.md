# Google Analytics Mock API Server

A mock API server simulating Google Analytics endpoints for testing and development with the `google/apiclient` package. Built using [Express.js](https://expressjs.com/), it eliminates the need for real data while testing.

## Features

- Generates realistic mock data for Google Analytics endpoints.
- Simulates dependencies between reports for consistent datasets.
- Easily extendable to support additional endpoints.
- Quick to set up and use.

## Requirements

```bash
Node.js: v20.18.0
npm: 10.8.2
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Usage

### Start the Mock API Server

Run the server:

```bash
npm run start
```

The server runs at `http://localhost:3000`.

### Update Your Client Code

Modify your client to connect to the mock API:

```php
$mockBaseUriMiddleware = Middleware::mapRequest(function (RequestInterface $request) {
    $uri = $request->getUri()->withHost('localhost')->withPort(3000)->withScheme('http');
    return $request->withUri($uri);
});

$handlerStack = HandlerStack::create();
$handlerStack->push($mockBaseUriMiddleware);

$httpClient = new \GuzzleHttp\Client([
    'proxy' => 'http://127.0.0.1:8080', // Your proxy URL and port
    'verify' => false, // Disable SSL verification if needed
    'handler' => $handlerStack
]);

$client->setHttpClient($httpClient);
```

## Development

To add or modify endpoints:

1. Create a new route file in `routes/` (e.g., `newEndpoint.js`).
2. Define route logic in the new file.
3. Mount it in `server.js`:

   ```javascript
   app.use(
     "/v1beta/properties/:propertyId:newEndpoint",
     require("./routes/newEndpoint")
   );
   ```

## Debugging API Calls with [mitmproxy](https://mitmproxy.org/)

To debug requests and responses, use `mitmproxy` as a debugging proxy:

1. **Install mitmproxy**:

   ```bash
   brew install mitmproxy  # macOS
   sudo apt install mitmproxy  # Linux
   choco install mitmproxy  # Windows
   ```

2. **Start mitmproxy**:

   ```bash
   mitmproxy --mode reverse:http://localhost:3000
   ```

3. **Configure Client**:

   - Set your HTTP client to use `http://127.0.0.1:8080` as a proxy.
   - Disable SSL verification if required.

4. **Inspect Traffic**:
   - Use the mitmproxy UI to inspect and debug API calls sent to the mock server.

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

Licensed under the MIT License.

## Author

[Dev Kabir](https://github.com/devkabir)
