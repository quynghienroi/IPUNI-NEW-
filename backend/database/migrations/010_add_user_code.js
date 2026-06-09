function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DIA';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

exports.up = async function (knex) {
  await knex.schema.table('users', (t) => {
    t.string('user_code', 12).unique();
  });

  const users = await knex('users').select('id');
  for (const u of users) {
    let code;
    let tries = 0;
    do {
      code = genCode();
      tries++;
    } while (tries < 10 && await knex('users').where({ user_code: code }).first());
    await knex('users').where({ id: u.id }).update({ user_code: code });
  }
};

exports.down = async function (knex) {
  await knex.schema.table('users', (t) => {
    t.dropColumn('user_code');
  });
};
