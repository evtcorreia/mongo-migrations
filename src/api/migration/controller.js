import { success, notFound } from "../../services/response/";
import { Migration } from ".";
const { MongoClient } = require("mongodb");

const fs = require("fs");
const path = require("path");

const test = "mongodb://localhost:27017";
const develop = "mongodb://localhost:27017";
const homologation = "mongodb://localhost:27017";
const production = "mongodb://localhost:27017";

export const create = ({ bodymen: { body } }, res, next) =>
  Migration.create(body)
    .then((migration) => migration.view(true))
    .then(success(res, 201))
    .catch(next);

export const executeMigration = async ({ bodymen: { body } }, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

async function runMigrations(body) {
  try {
    const migrationDirectory = path.join(__dirname, "migrations");
    const migrationFiles = fs.readdirSync(migrationDirectory);
    const sortedMigrationFiles = migrationFiles.sort();

    for (const file of sortedMigrationFiles) {
      // const migrationVersion = parseInt(file.match(/^migration(\d+)\.js$/i)[1]);

      // console.log(file);
      // if (migrationVersion > lastMigrationVersion) {
      const migrationContent = fs.readFileSync(
        path.join(migrationDirectory, file),
        "utf8"
      );
      const migration = {
        // version: migrationVersion,
        // description: `Migration ${migrationVersion}`,
        content: migrationContent,
      };
      // console.log(migration);

      await execMigration(migration, body);
      // }
    }

    // const executedMigrations = await Migration.find();
    // const executedMigrationVersions = executedMigrations.map(
    //   (migration) => migration.status !== true
    // );
  } catch (error) {
    console.log(error);
  }
}

async function execMigration(migration, body) {
  // console.log(migration);
  try {
    let client = "";
    let db = "";
    if (body.databaseName) {
      if (body.databaseName.toString().toLowerCase() === "develop") {
        client = await MongoClient.connect(develop);
        db = client.db(develop);
      } else if (
        body.databaseName.toString().toLowerCase() === "homologation"
      ) {
        client = await MongoClient.connect(homologation);
        db = client.db(homologation);
      } else if (body.databaseName.toString().toLowerCase() === "production") {
        client = await MongoClient.connect(production);
        db = client.db(production);
      } else if (body.databaseName.toString().toLowerCase() === "test") {
        const nameBase = "test";
        client = await new MongoClient.connect(test);
        db = client.db(nameBase);
      }
    }

    const myScript = require("./migrations/teste.js");

    myScript.up();

    await Migration.create(migration);

    console.log(`Migração ${migration.version} aplicada com sucesso.`);
  } catch (error) {
    console.error(`Erro ao aplicar a migração ${migration.version}:`, error);
  }
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Migration.count(query)
    .then((count) =>
      Migration.find(query, select, cursor).then((migrations) => ({
        count,
        rows: migrations.map((migration) => migration.view()),
      }))
    )
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Migration.findById(params.id)
    .then(notFound(res))
    .then((migration) => (migration ? migration.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ bodymen: { body }, params }, res, next) =>
  Migration.findById(params.id)
    .then(notFound(res))
    .then((migration) =>
      migration ? Object.assign(migration, body).save() : null
    )
    .then((migration) => (migration ? migration.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ params }, res, next) =>
  Migration.findById(params.id)
    .then(notFound(res))
    .then((migration) => (migration ? migration.remove() : null))
    .then(success(res, 204))
    .catch(next);
