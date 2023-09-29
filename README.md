# @shgysk8zer0/netlify-func-utils
 A collection of helpful functions for building Netlify Functions

> [!IMPORTANT]
> This package relies on `FormData` and `File` support, which was added in Node 20
> and will be available on Netlify and AWS Lambda sometime after it reaches LTS
> on or about 2023-10-24. In Node 18, `FormData` is supported, but uploads will
be `Blob`s instead of `File`s.

## Features
- Custom `NetlifyRequest` class extending `Request`
  - Created from a `HandlerEvent` event
  - Adds convenient `searchParams` property (`URLSearchParams`)
  - Adds `cookies` property as a `Map` from the `Cookie` header
- A `createHandler` function
  - Accepts an object of HTTP Methods and callbacks
  - Automatically handles errors
  - Callbacks are passed a `NetlifyRequest` object and must return a `Response`
  - Automatically adds CORS headers (can be disabled)
  
## Example

```js
import { createHandler } from '@shgysk8zer0/netlify-func-utils`;
import { BAD_REQUEST, NOT_AUTHORIZED } from '@shgysk8zer0/http/status';
import { HttpError } from '@shgysk8zer0/http/error';

export const handler  = createHandler({
  get: async req => {
    if (req.searchParams.has('id')) {
      return Response.json(await getItem(req.searchParams.get('id)));
    }
  },
  post: async req = {
    if (! req.cookies.has('token')) {
      throw new HTTPError('You must be signed-in.', { status: NOT_AUTHORIZED });
    } else {
      const data = await req.formData(); // `FormData`, including `File` objects
      
      if (! data.has('required-field')) {
        throw new HTTPError('Missing requied field.', { status: BAD_REQUEST });
      } else {
        // Maybe save something to a DB.
        return Response.json({ created: item.id });
      }
    }
  },
  delete: async req => {
    //
  },
}, {
  cors: true,
  headers: new Headers({ 'X-UID': crypto.randomUUID() }),
  allowHeaders: ['X-Foo', 'X-UID'],
}
```
