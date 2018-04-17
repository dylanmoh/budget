exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('transactions', function(table) {
      table.increments('id').primary();
      table.decimal('amount');
      table.boolean('isWithdraw');
      table.string('description');
      table.dateTime('created');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('transactions'),
  ]);
};
