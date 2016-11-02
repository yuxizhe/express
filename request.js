var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
    //node 用XML时要安装并引用
module.exports = function request(url) {
    console.log(url);
    return new Promise(function(resolve, rej) {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.setRequestHeader('apikey', 'e4288f19fe0231d205fd43745d7b15fe')
        xhr.send()
        xhr.addEventListener('load', function() {
            console.log("load");
            //console.log(xhr.responseText);
            resolve(JSON.parse(xhr.responseText))
        })
    })


}
