const ready = true

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
}