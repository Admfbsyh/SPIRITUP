import { homelogin } from '../templates/template-cover';
import '../component/headerNav';

const halamanlogin = {
    async render() {
        return `
        <header-nav></header-nav>
        <main tabindex="0" id="mainContent">
        <div id="halamanlogin"></>
        </main>
        <footer></footer>
    `;
    },

    async afterRender() {
        const dashLoginContainer = document.querySelector('#halamanlogin');
        dashLoginContainer.innerHTML += homelogin();
    },
};

export default halamanlogin;
