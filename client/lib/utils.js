// helpers
// https://gist.github.com/jmshal/b14199f7402c8f3a4568733d8bed0f25
const atob = (a) => {
    return new Buffer(a, 'base64').toString('binary');
};

const btoa = (b) => {
    return new Buffer(b).toString('base64');
};

const getParameter = (url) => {
    let allParameter = url.substring(url.indexOf("?") + 1);
    let deCodeParameter = atob(allParameter)
    let decodeValues = deCodeParameter.split("&");
    return decodeValues;
}


module.exports = {
    getParameter, atob, btoa
}
