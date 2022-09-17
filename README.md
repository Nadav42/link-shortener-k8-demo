# link-shortener-k8-demo

### api:

GET `/api/v1/links` -> Link[]

GET `/api/v1/links/:alias` -> Link (or 404)

POST `/api/v1/links` body: `{alias, url, password?}` -> Link (or 401)

POST `/api/v1/links/delete` body: `{alias, password?}`  -> Link (or 401 or 404)

`/:alias` -> redirect (or 404)