var wait = function () {
    var dtd = $.Deferred();
    var tasks = function () {
        console.log("执行完毕!");
        dtd.resolve();
    };
    setTimeout(tasks, 3000);
    return dtd.promise();
};

// $.when(wait())
// .done(function () {
//     console.log("done!");
// })
// .fail(function () {
//     console.log("fail!");
// });

wait()
.done(function () {
    console.log("done!");
})
.fail(function () {
    console.log("fail!");
});