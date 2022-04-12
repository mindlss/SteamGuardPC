const { ipcRenderer, app } = require('electron');

function copyButton(id) {
    navigator.clipboard.writeText(document.getElementsByClassName(id).item(0).textContent);
}

function CloseApp() {
    ipcRenderer.send('CloseClick');
}

function MinApp() {
    ipcRenderer.send('MinClick');
}

async function OpenLoginForm() {
    document.
        getElementById('+').
        classList.
        toggle('button--loading')
    ipcRenderer.send('OpenClick');
    await setTimeout(() => resolve(), 1200);
}

function resolve() {
    document.
        getElementById('+').
        classList.
        toggle('button--loading')
}

function CloseLogin() {
    ipcRenderer.send('LoginCloseClick');
}

function MinLogin() {
    ipcRenderer.send('LoginMinClick');
}

async function test() {
    const result = await ipcRenderer.invoke('getUserData') + '\\accounts';
    console.log(result + '\\accounts');
}