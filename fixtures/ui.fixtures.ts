export const loginData = {
  validCredentials: {
    username: 'Admin',
    password: 'admin123',
  },
  invalidCredentials: [
    { username: 'wronguser', password: 'wrongpass', desc: 'invalid user and password' },
    { username: 'Admin', password: 'wrongpass', desc: 'valid user, invalid password' },
    { username: '', password: '', desc: 'empty credentials' },
  ],
};

export const newUserData = {
  username: `qa_user_${Date.now()}`,
  password: 'Test@1234',
  confirmPassword: 'Test@1234',
  firstName: 'QA',
  lastName: 'Tester',
  employeeId: `EMP${Date.now().toString().slice(-5)}`,
  role: 'Admin' as const,
  status: 'Enabled' as const,
};

export const userRoles = ['Admin', 'ESS'] as const;
export type UserRole = typeof userRoles[number];
