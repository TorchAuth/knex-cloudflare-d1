"use strict";
import path from "node:path";
import knex from "knex";
import Client_D1 from "../src/client";
import { describe, it, expect } from "vitest";

const bindings = getMiniflareBindings();

describe("better-sqlite3 unit tests", () => {
  it("basic query works", async () => {
    const knexInstance = knex({
      client: Client_D1 as unknown as typeof knex.Client,
      useNullAsDefault: true,
      connection: {
        database: bindings.__D1_BETA__D1DATA,
      },
    });

    const result = await knexInstance
      .select<{ answer: number }>(knexInstance.raw("2 + 2 as answer"))
      .first();
    expect(result.answer).to.equal(4);
  });
});
