import bcrypt from 'bcrypt';

import { AdminUser } from '../models/admin.model.js';

export const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('Try123??', 10);

  // TODO: Move admin password into .env

  return await AdminUser.upsert({
    name: 'Admin',
    surname: 'User',
    email: 'admin@incidents.com',
    password: hashedPassword,
    role: 'SUPER_ADMIN',
  });
};

seedAdmin()
  .then(() => {
    console.log('Database synchronized.');
    return seedAdmin();
  })
  .then((admin) => {
    console.log('::::::ADMIN CREATED::::::', admin[0].email);
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
