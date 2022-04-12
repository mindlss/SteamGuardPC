const fs = require('fs');

getRoaming()

async function getRoaming() {
    const roamingDir = await ipcRenderer.invoke('getUserData') + '\\accounts'
    const files = await fs.readdirSync(roamingDir)
    console.log(roamingDir)
    window.onload = () => {
        secStage(files)
    }
}

function secStage(filess) {
    for (const file of filess) {
        var accName = file.slice(0, -5);
        var span = document.createElement('button');
        span.setAttribute('id', accName);
        span.setAttribute('tabindex', '-1');
        var loginTd = document.createElement('td');
        loginTd.setAttribute('id', 'login');
        loginTd.innerHTML = accName;
        var guardTd = document.createElement('td');
        guardTd.setAttribute('tabindex', '-1');
        guardTd.setAttribute('id', 'guard');
        guardTd.setAttribute('class', accName);
        guardTd.setAttribute('onClick', 'copyButton(this.className)');
        var tr = document.createElement('tr');

        guardTd.appendChild(span);
        tr.setAttribute('class', 'table_block');
        tr.appendChild(loginTd);

        tr.appendChild(guardTd);
        document.getElementsByClassName('table').item(0).appendChild(tr);
    }
    
    setTimeout(function () {
        document.getElementById('loading').remove();
    }, 4000);
}