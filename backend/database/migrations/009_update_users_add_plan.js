exports.up = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.string('plan').defaultTo('free').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.dropColumn('plan');
  });
};
