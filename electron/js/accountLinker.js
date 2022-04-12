const exec = require('child_process').exec
var child = exec('.\\js\\C#\\accountLinker.exe ');

document.
    getElementById('new_account').
    addEventListener('click', linkAccount);

window.onbeforeunload = closingCode;
function closingCode(){
   child.kill('SIGKILL');
   return null;
}

var once = false;

async function linkAccount() {

    var loginST = document.getElementById('loginInput').value
    var PassST = document.getElementById('passwordInput').value

    if (once) {
        return
    }

    document.
            getElementById('warning_lf').
            innerHTML = ''

    if (loginST == '') {
        document.
            getElementById('warning_lf').
            innerHTML = 'Login can not be empty.'
        return
    }

    if (PassST == '') {
        document.
            getElementById('warning_lf').
            innerHTML = 'Password can not be empty.'
        return
    }

    once = true;

    var button = 
    document.
        getElementById('new_account')

    const captcha =
    document.
        getElementById('captchaInput')
    const sms =
    document.
        getElementById('smsInput')
    const email =
    document.
        getElementById('emailInput')

    button.
        classList.
        toggle('button--loading')

    console.log(loginST + ' ' + PassST)
        
    child = exec('.\\js\\C#\\accountLinker.exe ' + loginST + ' ' + PassST)
    child.stdin.setEncoding = 'utf-8';
    await child.stdout.pipe(process.stdout)

    var onceCap = false;
    var onceSms = false;
    var onceEm = false;

    await child.stdout.on('data', function (result) {

        console.log(result);

        if (result.startsWith('1@ERR@2FA')) {
            document.
                getElementById('warning_lf').
                innerHTML = 'This account already secured with Steam Guard.'
            button.
                classList.
                toggle('button--loading')
            once = false;
        }

        else if (result.startsWith('1@ERR1')) {
            document.
                getElementById('warning_lf').
                innerHTML = 'Something went wrong. Try again later.'
            button.
                classList.
                toggle('button--loading')
            once = false;
        }

        else if (result.startsWith('1@ERR@LOP')) {
            document.
                getElementById('warning_lf').
                innerHTML = 'Login or password are incorrect.'
            button.
                classList.
                toggle('button--loading')
            once = false;
        }

        else if (result.startsWith('1@ERR@TOOMANY')) {
            document.
                getElementById('warning_lf').
                innerHTML = 'Too many attempts. Try again in 10 minutes.'
            button.
                classList.
                toggle('button--loading')
            once = false;
        }

        else if (result.startsWith('1@ERR@PHONE')) {
            document.
                getElementById('warning_lf').
                innerHTML = 'No phone number linked to account.'
            button.
                classList.
                toggle('button--loading')
            once = false;
        }

        else if (result.startsWith('1@ERR@CAPTCHA')) {

            if (onceCap) {

                document.
                    getElementById('captchaTog').
                    classList.
                    toggle('button--loading')

                captcha.value = '';

                document.
                    getElementById('warning_lfc').
                    innerHTML = 'CAPTCHA text is invalid. Try again.'

            } else {
                button.
                    classList.
                    toggle('button--loading')
                captcha.value = '';
                document.getElementById("loginInputWrap").style.display = "none";
                document.getElementById("captchaInputWrap").style.display = "block";
                document.getElementById("smsInputWrap").style.display = "none";
                document.getElementById("emailInputWrap").style.display = "none";
                onceCap = true;
                once = false;
            }
        }

        else if (result.startsWith('1@INPUT@EMAIL')) {
            
            if (onceEm) {

                document.
                    getElementById('emailTog').
                    classList.
                    toggle('button--loading')

                email.value = '';

                document.
                    getElementById('warning_lfe').
                    innerHTML = 'Email code is invalid. Try again.'

            } else {
                button.
                    classList.
                    toggle('button--loading')
                email.value = '';
                document.getElementById("loginInputWrap").style.display = "none";
                document.getElementById("captchaInputWrap").style.display = "none";
                document.getElementById("smsInputWrap").style.display = "none";
                document.getElementById("emailInputWrap").style.display = "block";
                onceEm = true;
                once = false;
            }
        }

        // ------------
        // second stage
        // ------------

        else if (result.startsWith('2@INPUT@SMS')) {

            if (onceSms) {

                document.
                    getElementById('smsTog').
                    classList.
                    toggle('button--loading')

                sms.value = '';

                document.
                    getElementById('warning_lfs').
                    innerHTML = 'SMS code is invalid. Try again.'

            } else {
                sms.value = '';
                document.getElementById("loginInputWrap").style.display = "none";
                document.getElementById("captchaInputWrap").style.display = "none";
                document.getElementById("smsInputWrap").style.display = "block";
                document.getElementById("emailInputWrap").style.display = "none";
                onceSms = true;
                once = false;
            }
        }

        else if (result.startsWith('2@ERR')) {
            document.
                getElementById('warning_lf').
                innerHTML = 'Something went wrong. Try again later.'
            document.getElementById("loginInputWrap").style.display = "block";
            document.getElementById("captchaInputWrap").style.display = "none";
            document.getElementById("smsInputWrap").style.display = "none";
            document.getElementById("emailInputWrap").style.display = "none";
            once = false;
        }

        else if (result.startsWith('SUCCESS')) {
            ipcRenderer.send('reloadMainWindow');
            ipcRenderer.send('LoginCloseClick');
        }
    });
}

async function sendEmailCode() {
    document.
        getElementById('emailTog').
        classList.
        toggle('button--loading')
    var code = document.
                getElementById('emailInput').
                value
    child.stdin.write(code + "\n");
}

async function sendSMSCode() {
    document.
        getElementById('smsTog').
        classList.
        toggle('button--loading')
    var code = document.
                getElementById('smsInput').
                value
    child.stdin.write(code + "\n");
}

async function sendCAPTCHACode() {
    document.
        getElementById('captchaTog').
        classList.
        toggle('button--loading')
    var code = document.
                getElementById('captchaInput').
                value
    child.stdin.write(code + "\n");
}