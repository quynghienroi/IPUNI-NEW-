exports.up = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.string('address');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.dropColumn('address');
  });
};
