import { homelogin } from '../template/template-cover';
import '../component/headerNav';

const halamanlogin = {
    async render() {
        return `
        <header-nav></header-nav>
        <main tabindex="0" id="mainContent" >
        <div id="halamanlogin"></>
        </main>
        <footer>
        <p tabindex="0"> Tim Capstone C22-129 &copy;2022 <span>Spirit Up</span></p>
        </footer>
    `;
    },

    async afterRender() {
        const dashLoginContainer = document.querySelector('#halamanlogin');
        dashLoginContainer.innerHTML += homelogin();

        const humberger = document.getElementById('humberger');
        humberger.addEventListener('click', () => {
            const x = document.getElementById('myTopnav');
            if (x.className === 'topnav') {
                x.className += ' responsive';
            } else {
                x.className = 'topnav';
            }
        });
    },
};

export default halamanlogin;
