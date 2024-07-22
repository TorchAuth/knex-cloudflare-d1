const Client_SQLite3 = require("knex/lib/dialects/sqlite3/index");

class Client_D1 extends Client_SQLite3 {
  constructor(config) {
    super({
      ...config,
      connection: {
        filename: "db", // placeholder to silence warnings
      },
    });

    if (!config?.connection?.database) {
      this.logger.error("Could not find `connection.database` in config.");
    }

    this.driver = config.connection.database;
  }

  _driver() {
    return this.driver;
  }

  async acquireRawConnection() {
    return this.driver;
  }

  // Used to explicitly close a connection, called internally by the pool when
  // a connection times out or the pool is shutdown.
  async destroyRawConnection(connection) {
    return true;
  }

  // Runs the query on the specified connection, providing the bindings and any
  // other necessary prep work.
  async _query(connection, obj) {
    if (!obj.sql) throw new Error("The query is empty");

    const { method } = obj;
    let callMethod;
    switch (method) {
      case "insert":
      case "update":
        callMethod = obj.returning ? "all" : "run";
        break;
      case "counter":
      case "del":
        callMethod = "run";
        break;
      default:
        callMethod = "all";
    }

    if (!connection) {
      new Error(`Error calling ${callMethod} on connection.`);
    }

    const { results } = await connection
      .prepare(obj.sql)
      .bind(...obj.bindings)
      ?.[callMethod]();

    obj.response = results;
    obj.context = this;
    return obj;
  }

  _stream(connection, obj, stream) {
    if (!obj.sql) throw new Error("The query is empty");

    const client = this;
    stream.on("error", (error) => {
      throw error;
    });
    stream.on("end", () => {
      stream.emit("finish");
    });

    return client
      ._query(connection, obj)
      .then((obj) => obj.response)
      .then((rows) => rows.forEach((row) => stream.write(row)))
      .catch(function (err) {
        stream.emit("error", err);
      })
      .then(function () {
        stream.end();
      });
  }
}

Object.assign(Client_D1.prototype, {
  // The "dialect", for reference .
  driverName: "d1",
});

module.exports = Client_D1;
