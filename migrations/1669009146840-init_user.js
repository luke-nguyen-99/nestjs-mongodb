const mongoose = require('mongoose');
const { USER_MODEL_NAME } = require('../dist/data/constant');
const { UserSchema, USER_ROLE } = require('../dist/data/user/user.schema');

const model = mongoose.model(USER_MODEL_NAME, UserSchema);

async function up() {
  mongoose.connect(process.env.MIGRATE_dbConnectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await model.insertMany([
    {
      username: 'admin',
      full_name: 'admin',
      email: 'admin@gmail.com',
      password: '$2b$12$CYGl7/01toqPwu7FvmrdOeZu5maKsrX9sdTGtjRkQTKONVhx3l93m',
      role: USER_ROLE.ADMIN,
    },
  ]);
  mongoose.disconnect();
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
