"use strict";
import knex from "knex";
import Client_D1 from "../src/client";
import { describe, it, expect, beforeEach, beforeAll } from "vitest";

// DEBUG=knex:*

const bindings = getMiniflareBindings();

describe("better-sqlite3 unit tests", () => {
  let knexInstance: knex.Knex;

  beforeAll(async () => {
    knexInstance = knex({
      client: Client_D1 as unknown as typeof knex.Client,
      useNullAsDefault: true,
      connection: {
        database: bindings.__D1_BETA__D1DATA,
      },
    });

    await knexInstance.schema.createTable("table01", function (table) {
      table.increments();
      table.string("name");
    });
  });

  it("knex works", async () => {
    const result = await knexInstance
      .select<{ answer: number }>(knexInstance.raw("2 + 2 as answer"))
      .first();
    expect(result.answer).to.equal(4);
  });

  it("can insert and query rows", async () => {
    await knexInstance("table01").insert([{ name: "test" }, { name: "test2" }]);

    const rows = await knexInstance("table01").select("*");
    expect(rows.length).to.equal(2);
  });
});
