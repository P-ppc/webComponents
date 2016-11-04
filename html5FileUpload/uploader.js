function Uploader (options) {
    // 配置属性
    this.file = options.file;
    this.uploadUrl = options.uploadUrl;
    this.chunkSize = options.chunkSize;
    this.uploadedSize = 0;
    this.percent = 0;
    this.fileFlag = "";
    this.uploadingFlag = false;
    // 配置事件
    this.fn = {};
    this.fn.progress = options.progress;
    this.fn.finish = options.finish;

    // 文件分块
    this._getChunk = function (file, start, chunkSize) {
        if (start >= file.size) {
            return;
        }
        if (start + chunkSize > file.size) {
            return file.slice(start, file.size);
        } else {
            return file.slice(start, start + chunkSize);
        }
    };
    // 文件上传
    this._uploading = function () {
        var fd = new FormData();
        if (this.uploadedSize == 0) {
            fd.append("baseName", this.file.name);
            fd.append("baseMimeType", this.file.type);
        }
        var chunk = this._getChunk(this.file, this.uploadedSize, this.chunkSize);
        if (!chunk) {
            this.uploadingFlag = false;
            this.fn.finish();
            return;
        }
        if (this.uploadedSize + chunk.size == this.file.size) {
            fd.append("finish", true);
        }
        fd.append("formFile", chunk);
        fd.append("fileFlag", this.fileFlag);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.uploadUrl);
        xhr.send(fd);
        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var respData = JSON.parse(xhr.responseText);
                if (respData.code == 0) {
                    if (respData.fileFlag != undefined) {
                        that.fileFlag = respData.fileFlag;
                    }
                    that.uploadedSize += chunk.size;
                    that.percent = Math.round(that.uploadedSize / that.file.size * 100);
                    that.fn.progress(that.percent);
                    if (that.uploadingFlag) {
                        that._uploading();
                    }
                }
            }
        };
    };
};
Uploader.prototype.init = function (callback) {
    callback(this.file);
};
Uploader.prototype.start = function (callback) {
    this.uploadingFlag = true;
    this._uploading();  
    callback();
};
Uploader.prototype.pause = function (callback) {
    this.uploadingFlag = false;
    callback();
};