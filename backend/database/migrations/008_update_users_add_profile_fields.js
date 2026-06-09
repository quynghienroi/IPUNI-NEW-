exports.up = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.string('date_of_birth');
    t.string('blood_type');
    t.text('allergies');
    t.string('insurance_number');
    t.string('insurance_expiry');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (t) => {
    t.dropColumn('date_of_birth');
    t.dropColumn('blood_type');
    t.dropColumn('allergies');
    t.dropColumn('insurance_number');
    t.dropColumn('insurance_expiry');
  });
};
