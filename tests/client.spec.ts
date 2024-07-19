"use strict";
import path from "node:path";
import knex from "knex";
import Client_D1 from "../src/client";
import { describe, it, expect } from "vitest";

const bindings = getMiniflareBindings();

describe("better-sqlite3 unit tests", () => {
  describe("nativeBinding", () => {
    it("should work with a custom `nativeBinding`", async () => {
      const knexInstance = knex({
        client: Client_D1 as unknown as typeof knex.Client,
        useNullAsDefault: true,
        connection: {
          database: bindings.__D1_BETA__D1DATA,
          options: {
            nativeBinding: path.resolve(
              __dirname,
              "../node_modules/better-sqlite3/build/Release/better_sqlite3.node"
            ),
          },
        },
      });

      const result = await knexInstance
        .select(knexInstance.raw("2 + 2 as answer"))
        .first();
      expect(result.answer).to.equal(4);
    });
  });
});
