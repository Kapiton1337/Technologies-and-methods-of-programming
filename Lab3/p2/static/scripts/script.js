const mainMachine = "http://localhost:5000/";
const virtualMachine = "http://10.0.2.2:5000/";

const _URL =mainMachine;

const download_button = document.getElementById("download_button");

const get_gpu = () => {
    const canvas = document.getElementById("glcanvas").getContext("experimental-webgl");
    const rerender = canvas.getExtension("WEBGL_debug_rerender_info");
    if(rerender){
        return canvas.getParameter(rerender.UNMASKED_RENDERER_WEBGL);
    }
    return false;
}

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

download_button.addEventListener("click", (event)=>{

    const sendUserInfo = (method, url, body) => {
        const header = {"Content-Type": "application/json"};
        return fetch(url, {method: method, body: JSON.stringify(body), headers: header});
    }

    /*navigator.geolocation.getCurrentPosition(success=> {sendUserInfo("POST", "http://localhost:5000/", success.coords)});
    navigator.getBattery().then(energy=> {sendUserInfo("POST", "http://10.0.2.2:5000/", energy)})*/

    const userInfoObj = {
        gpu: getVideoCardInfo().renderer,
        hardware: navigator.hardwareConcurrency,
        languages: navigator.languages,
        userAgent: navigator.userAgent
    }

    sendUserInfo("POST", _URL, userInfoObj);
})

