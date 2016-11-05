var step1 = function () {
    console.log("run: step1");
    var p = new Promise(function (resolve, reject) {
        // 模拟异步操作
        setTimeout(function () {
            resolve("promise success");
        }, 3000);
    });
    return p;
}

var step2 = function (data) {
    // 第二次异步操作
    console.log("run: step2");
    setTimeout(function() {
        console.log(data);
    }, 2000);
}

var step3 = function (data) {
    console.log("run: step3");
    console.log(data);
}

step1().then(step2);
step1().then(step3);