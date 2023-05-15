import knex from 'knex'
import database from '../config/database.js'

const connection = knex(database)

export default connection
