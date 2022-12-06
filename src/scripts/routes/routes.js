/* eslint-disable camelcase */
import Halamanlogin from '../views/pages/halamanlogin';
import login from '../views/pages/login';
import signup from '../views/pages/signup';
import forgot_password from '../views/pages/forgot_password';
import dashboard from '../views/pages/dashboard';

const routes = {
    '/': Halamanlogin, // default page
    '/home': Halamanlogin,
    '/signup': signup,
    '/login': login,
    '/forgot_password': forgot_password,
    '/dashboard': dashboard,
};

export default routes;
