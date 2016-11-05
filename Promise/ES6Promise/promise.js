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

// step1().then(step2);
// step1().then(step3);
// step1().then(function (data) {
//     Promise.all[step2(data), step3(data)];
// });

// 需求: 
//      1. 在首次请求某个接口后，在请求后续1个接口
//      2. 请求过第1个接口后，在请求1个接口无需等待

var _tmp;

var api1 = function () {
    console.log("mock the api 1!");
    var p = new Promise(function (resolve, reject) {
        setTimeout(function () {
            _tmp = {
                code: 0
            };
            resolve(_tmp);
        }, 3000);
    });
    return p;
}

var api2 = function () {
    console.log("mock the api 2!");
    var p = new Promise(function (resolve, reject) {
        data = _tmp;
        data.success = 0;
        resolve(data);
    });
    return p;
}

// api1().then(api2).then(function (data) {
//     console.log(data);
//     // 再次调用api2
//     setTimeout(function () {
//         console.log("----------");
//         console.log("request the api 2 again!");
//         api2().then(function (d) {
//             console.log(d);
//         });
//     }, 2000);
// });

// 需求: 异常处理

var error1 = function () {
    var p = new Promise(function (resolve, reject) {
        reject("in error 1!");
        resolve();
    });
    return p;
}

var error2 = function () {
    var p = new Promise(function (resolve, reject) {
        reject("in error 2!");
    });
    return p;
}

// 对整体Promise链进行异常处理
// error1().then(error2).catch(function (reason) {
//     console.log(reason);
// });

// 对每个Promise链上的Promise单独进行异常处理
// 太过繁杂
error1()
.then(
    function (data) {
        error2().
        then(
            function (data) {

            },
            function (reason) {
                console.log(reason);
            }
        );
    },
    function (reason) {
        console.log(reason);
    }
);

