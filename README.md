# knex-cloudflare-d1

Cloudflare D1 dialect for Knex.js.

Forked from [[https://github.com/kiddyuchina/knex-cloudflare-d1](https://github.com/kiddyuchina/knex-cloudflare-d1)] and altered to use `better-sqlite3` instead of `sqlite3`.

## Install

```
npm i knex-cloudflare-d1
// Or
pnpm add knex-cloudflare-d1
```

## Usage

```js
import Knex from "knex";
import ClientD1 from "knex-cloudflare-d1";

export interface Env {
  DB: D1Database;
}

export default {
  fetch: (req: Request, env: Env) => {
    // ...

    const knex = Knex({
      client: ClientD1,
      connection: {
        database: env.DB,
      },
      useNullAsDefault: true,
    });

    // ...
  },
};
```

## Author

Kidd Yu <https://github.com/kiddyuchina>

## License

MIT
