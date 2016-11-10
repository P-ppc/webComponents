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
            cover.style.display = "none";
        }; 
    };

    var initSendMessage = function () {
        var sendBtn = document.getElementById("sendBtn");
        var messageInput = document.getElementById("messageInput");

        sendBtn.onclick = function () {
            var message = messageInput.value;
            var obj = {
                username: user.username,
                content: message
            };
            console.log(`发送消息: ${obj.content}`);
            socket.emit('message', obj);
            messageInput.value = "";
        };
    };

    var initLogout = function () {
        var logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.onclick = function () {
            window.location.reload();
        };
    };

    var initListen = function () {
        var messageBoard = document.getElementById("messageBoard");
        var userBoard = document.getElementById("userBoard");
        // 监听message
        socket.on('message', function (obj) {
            var contentHtml = `<p>${obj.username} 说: ${obj.content}</p>`;
            messageBoard.innerHTML += contentHtml;
            messageBoard.scrollTop = messageBoard.scrollHeight;
        });
        // 监听新用户加入
        socket.on('login', function (obj) {
            var contentHtml = `<p>${obj.user.username}加入聊天室, 当前在线人数${obj.onlineCount}`;
            var userHtml = "";
            for (var key in obj.onlineUsers) {
                userHtml += `<p>${obj.onlineUsers[key]}</p>`;
            }
            userBoard.innerHTML = userHtml;
            messageBoard.innerHTML += contentHtml;
            messageBoard.scrollTop = messageBoard.scrollHeight;
        });
        // 监听用户退出
        socket.on('logout', function (obj) {
            var contentHtml = `<p>${obj.user.username}退出聊天室, 当前在线人数${obj.onlineCount}`;
            var userHtml = "";
            for (var key in obj.onlineUsers) {
                userHtml += `<p>${obj.onlineUsers[key]}</p>`;
            }
            userBoard.innerHTML = userHtml;
            messageBoard.innerHTML += contentHtml;
            messageBoard.scrollTop = messageBoard.scrollHeight;
        });
    };

    var init = function () {
        initLogin();
        initSendMessage();
        initListen();
        initLogout();
    };

    return {
        init: function () {
            init();
        }
    };
}());

CLIENT.init();