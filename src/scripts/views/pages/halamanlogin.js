import { homelogin } from '../templates/template-cover';

const halamanlogin={
    async render(){
    return `
        <div id="halamanlogin"></>
    `;
    },

    async afterRender(){
        const dashLoginContainer=document.querySelector('#halamanlogin');
        dashLoginContainer.innerHTML+= homelogin();
    },
};

export default halamanlogin
