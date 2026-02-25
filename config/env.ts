import 'dotenv/config';

export const ENV = {
  ui: {
    baseUrl: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    adminUser: process.env.ADMIN_USER || 'Admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  },
  api: {
    petstoreUrl: process.env.PETSTORE_BASE_URL || 'https://petstore.swagger.io/v2',
  },
};
