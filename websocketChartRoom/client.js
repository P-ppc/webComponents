var CLIENT = (function () {
    var socket = io.connect('ws://127.0.0.1:3000');
    var user = {};

    var genUid = function () {
        return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    };

    var initLogin = function () {
        var loginBtn = document.getElementById("loginBtn");
        var userNameInput = document.getElementById("userName");
        var cover = document.getElementById("cover");

        loginBtn.onclick = function () {
            var userName = userNameInput.value;
            if (!userName) {
                alert("请输入用户名!");
            }
            user.userid = genUid();
            user.username = userName;
            socket.emit('login', user);
        }; 
    };

    var init = function () {
        initLogin();
    };

    return {
        init: function () {
            init();
        }
    };
})();

CLIENT.init();
// 登录 -> 连接 -> 登录 -> 监听事件 -> 退出:reload