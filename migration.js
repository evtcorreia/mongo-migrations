const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const databaseURL = 'mongodb://localhost:27017'
const migrationDirectory = path.join(__dirname, 'src/api/migration/migrations')

;(async function () {
  try {
    const [command, fileMigration] = process.argv.slice(2)
    
    if (command === 'migrate') {
      await runMigrations(fileMigration)
    } else if (command === 'rollback') {
      await rollbackMigrations()
    } else if (command === 'create') {
      fileModelMigration(fileMigration)
    } else {
      console.log(`Invalid command: ${command}`)
    }
  } catch (error) {
    console.error('An error occurred:', error)
  }
})()

async function runMigrations(fileMigration) {
  const migrationFiles = fs.readdirSync(migrationDirectory).sort()

  for (const file of migrationFiles) {
    console.log(file);

    if(file === `migration_sprint_${fileMigration}.js`){

      const now = new Date()
      const createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      const updatedAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      const migrationContent = fs.readFileSync(path.join(migrationDirectory, file), 'utf8')
      const migration = { migration: `migration_sprint_${fileMigration}`, createdAt, updatedAt }
      
      await executeMigration(migration, fileMigration)
    }
  }
}

async function executeMigration(migration, fileMigration) {
  try {
    const client = await MongoClient.connect(databaseURL)
    const db = client.db('test')

    const migrationFilePath = path.join(migrationDirectory, `migration_sprint_${fileMigration}.js`)
    if (!fs.existsSync(migrationFilePath)) {
      console.error(`Migration file ${fileMigration}.js does not exist.`)
      process.exit(1)
    }

    const migrationScript = require(migrationFilePath)
    console.log(migrationScript)
    migrationScript.up(fileMigration)

    const result = await db.collection('migrations').insertOne(migration)
    console.log(`Migration ${fileMigration} applied successfully. Inserted ID: ${result.insertedId}`)

    client.close()
  } catch (error) {
    console.error(`Error applying migration:`, error)
    process.exit(1)
  }
}

async function rollbackMigrations() {
  console.log('Rollback not implemented yet.')
}

function fileModelMigration(fileMigration) {
  const caminhoArquivo = `./src/api/migration/migrations/migration_sprint_${fileMigration}.js`
  const conteudo = `const ready = false

if (ready) {
  function up(fileMigration) {
    console.log('Enter the migration code')
  }

  function down() {
    console.log('Enter the rollback code')
  }

  module.exports = {
    up: up,
    down: down,
  }
} else {
  console.log('A função nao esta liberada para aplicação, altere a chave ready')
  process.exit(1)
}`

  try {
    fs.writeFileSync(caminhoArquivo, conteudo)
    console.log(`Arquivo "${caminhoArquivo}" gerado com sucesso.`)
  } catch (error) {
    console.error('Ocorreu um erro ao gerar o arquivo:', error)
  }
}

