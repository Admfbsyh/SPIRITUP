import 'regenerator-runtime';
import '../styles/style.css';
import '../styles/responsive.css';
import '../styles/task_completed.css';
import '../styles/dashboard.css';
import App from './views/app';
import swRegister from './utils/sw-register';

const app = new App({
    button: document.querySelector('#menu'),
    drawer: document.querySelector('#drawer'),
    content: document.querySelector('body'),
});

window.addEventListener('hashchange', () => {
    app.renderPage();
});

window.addEventListener('load', () => {
    app.renderPage();
    swRegister();
});

// const menu = document.getElementById('menu-label');
// const sidebar = document.getElementsByClassName('sidebar-dash')[0];

// menu.addEventListener('click', () => {
//     sidebar.classList.toggle('hide');
//     console.log('ok');
// });
