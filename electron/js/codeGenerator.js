async function getGuard() {
    //console.log('waiting');
    var child = require('child_process').exec('.\\js\\C#\\codeGenerator.exe')
    child.stdout.pipe(process.stdout)
    await child.stdout.on('data', function (result) {
        //console.log(result);
        var accounts = result.split(/\r?\n/);
        for (const data of accounts) {
            var dataFromPipe = data.split('@');
            try {
                document.getElementById(dataFromPipe[0]).innerHTML = dataFromPipe[1];
            } catch { };
        }
    });
    //console.log('finished');
    setTimeout(getGuard, 30000);
}

setTimeout(function () {
    getGuard();
}, 50);