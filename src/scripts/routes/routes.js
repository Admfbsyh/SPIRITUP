import Halamanlogin from '../views/pages/halamanlogin';
import login from '../views/pages/login';
import signup from '../views/pages/signup';


const routes = {
  '/': Halamanlogin, // default page
  '/home': Halamanlogin,
  '/signup': signup,
  '/login': login,
};

export default routes;
