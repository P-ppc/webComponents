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
var c = 1;
