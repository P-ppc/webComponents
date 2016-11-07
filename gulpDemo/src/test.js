var TEST = (function () {
    var hello = function () {
        console.log("hello, I'm in test!");
    };

    return {
        hello: function () {
            hello();
        }
    };
})();

TEST.hello();
var a = 0;
var c = 1;
var b = 2;
