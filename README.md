## DB migrations

Need **sequelize-cli**

- To generate the new migration file

  `node_modules/.bin/sequelize migration:generate --name <module_name>`

- To upgrade the db

  `node_modules/.bin/sequelize db:migrate`

- To downgrade the db

  `node_modules/.bin/sequelize db:migrate:undo`

## DB seeders

- To generate the new seeders file

  `node_modules/.bin/sequelize seed:generate --name <module_name>`

- To upgrade the seeders

  `node_modules/.bin/sequelize db:seed:all`

- To downgrade the seeders

  `node_modules/.bin/sequelize db:seed:undo:all`

- To upgrade specify seed

  `node_modules/.bin/sequelize db:seed --seed <file name>`

for more info visit [Documentation](http://docs.sequelizejs.com/manual/tutorial/migrations.html)

## Installation

`npm install`

## Data Sync

- To create database with required data

  `node app/sync.js`

## Start

`npm start`
