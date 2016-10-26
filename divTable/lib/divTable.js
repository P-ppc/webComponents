// 利用div实现table
// 依赖jQuery
// 暂不支持rowspan和colspan, 多行header
// TODO 支持多列表头
// TODO 支持colspan, rowspan
// TODO 支持maxWidth
// TODO 提高高度以包含滚动条

(function($) {
    // 初始变量
    var $header = $('<div class="grid-header"></div>');
    var $body = $('<div class="grid-body"></div>');

    var $freeze = $('<div class="freeze"></div>');
    var $free = $('<div class="free"></div>');
    var $gridRow = $('<div class="grid-row"></div>');
    var $gridItem = $('<div class="grid-item"></div>');

    // 固定列数量
    var freezeColumnCount = 0;
    // min-width映射
    var minWidthMap = {};
    // 固定列宽度
    var freezeWidth = 0;

    // 渲染header
    var _renderHeader = function(target, data) {
        var $headerFreeze = $freeze.clone();
        var $headerFree = $free.clone();
        var $headerFreezeGridRow = $gridRow.clone();
        var $headerFreeGridRow = $gridRow.clone();

        $.each(data, function(index, item) {
            var $headerItem = $gridItem.clone();
            $headerItem.text(item.text).css('min-width', item.minWidth).addClass("grid_" + item.property);
            minWidthMap[item.property] = item.minWidth;
            if (item.type && item.type == 'freeze') {
                $headerFreezeGridRow.append($headerItem);
                freezeColumnCount += 1;
            } else {
                $headerFreeGridRow.append($headerItem);
            }
        });

        $headerFreeze.append($headerFreezeGridRow);
        $headerFree.append($headerFreeGridRow);
        $header.append($headerFreeze).append($headerFree);
        $(target).append($header);
    };

    // 渲染body
    var _renderBody = function(target, data) {
        var $bodyFreeze = $freeze.clone();
        var $bodyFree = $free.clone();
       
        $.each(data, function(index, item) {
            // 遍历item
            var _freezeColumnCount = freezeColumnCount;
            var $bodyFreezeGridRow = $gridRow.clone();
            var $bodyFreeGridRow = $gridRow.clone();
            $.each(item, function(innerIndex, innerValue) {
                var $bodyItem = $gridItem.clone();
                $bodyItem.text(innerValue).css('min-width', minWidthMap[innerIndex]).addClass("grid_" + innerIndex).attr("data-field", innerIndex);
                if (_freezeColumnCount > 0) {
                    $bodyFreezeGridRow.append($bodyItem);
                    _freezeColumnCount -= 1;
                } else {
                    $bodyFreeGridRow.append($bodyItem);
                }
            });
            $bodyFreezeGridRow.attr("data-index", index);
            $bodyFreeGridRow.attr("data-index", index);
            $bodyFreeze.append($bodyFreezeGridRow);
            $bodyFree.append($bodyFreeGridRow);
        });

        $body.append($bodyFreeze).append($bodyFree);
        $(target).append($body);
    };

    // 计算tbale属性
    // 计算.grid-body，.grid-body .free和.grid-body .freeze高度
    var _calcuHeight = function() {
        // 重置高度
        $(".grid-body").find(".freeze").css("height", "auto")
            .end().find(".free").css("height", "auto")
            .end().css("height", "auto");

        var headerHeight = $(".grid-header").height();
        var currentHeight = $(".grid-body").height();
        var bodyHeight = $(".grid").height() - headerHeight;
        var validHeight = bodyHeight < currentHeight ? bodyHeight : currentHeight;
        $(".grid-body").css({
            height: validHeight
        }).find(".freeze").css({
            height: validHeight
        }).end().find(".free").css({
            height: validHeight
        });
    };

    // 计算宽度
    var _calcuWidth = function() {
        // 重置宽度
        $(".grid-body").find(".freeze").css("width", "auto")
            .end().find(".free").css("width", "auto");
        var bodyWidth = $(".grid").width();
        freezeWdith = $(".grid-body .freeze").width();
        $(".grid-body").css({
            width: bodyWidth
        }).find(".freeze").css({
            width: freezeWdith
        }).end().find(".free").css({
            width: bodyWidth - freezeWdith
        });
    };

    // 宽度适配
    var _widthAdapt = function() {
        // 重置宽度
        $(".grid").find(".grid-item").css("width", "auto")
            .end().find(".grid-body .free .grid-row").css("width", "auto");
        // 计算.grid-row的宽度
        var scrollWidth = $(".grid-body .free")[0].scrollWidth;
        $(".grid-body .free .grid-row").width(scrollWidth);
        // 计算每个grid-item的宽度, 通过class标记
        var $columnItems = $(".grid-header .grid-item");
        $columnItems.each(function() {
            var classes = $(this).attr("class").split(" ");
            var classString = '.' + classes.join(".");
            var $items = $(classString);
            var maxWidth = 0;
            $items.each(function() {
                if ($(this).width() > maxWidth) {
                    maxWidth = $(this).width();
                }
            });
            $items.width(maxWidth);
        });
    };

    // .free 左位移
    var _leftOffset = function() {
        freezeWidth = $(".grid-body .freeze").width();
        $(".grid-header .free").css('left', freezeWidth);
        $(".grid-body .free").css('left', freezeWidth);
    };

    // 重置宽度方法
    var _resetWidth = function() {
        _widthAdapt();
        _calcuWidth();
        _leftOffset();
    };


    // 渲染odd和even属性
    var _renderOdd = function() {
        $(".grid-body .grid-row:nth-child(even)").removeClass("odd even").addClass("even");
        $(".grid-body .grid-row:nth-child(odd)").removeClass("odd even").addClass("odd");
    };

    // 选择事件和hover事件
    var _initSelectAndHover = function() {
        $(".grid-body .grid-row").click(function() {
            var index = $(this).attr("data-index");
            $(".grid-body .grid-row").removeClass("selected");
            $(".grid-body .grid-row[data-index=" + index + "]").addClass("selected");
        }).hover(function() {
            var index = $(this).attr("data-index");
            $(".grid-body .grid-row[data-index=" + index + "]").addClass("hover");
        }, function() {
            var index = $(this).attr("data-index");
            $(".grid-body .grid-row[data-index=" + index + "]").removeClass("hover");
        });
    };

    // 滚动事件
    var _initScroll = function() {
        $(".grid-body .free").scroll(function() {
            // 基础的header跟随grid-body滚动
            var currentX = $(this).scrollLeft();
            $(".grid-header .free .grid-row").css("left", "-" + currentX + "px");
            var currentY = $(this).scrollTop();
            $(".grid-body .freeze").css("top", "-" + currentY + "px");
        });

    };

    // 选择行的数据
    var _selectValue = function() {
        $selectItems = $(".grid-row.selected .grid-item");
        var value = {};
        $selectItems.each(function() {
            value[$(this).attr("data-field")] = $(this).text();
        });
        value["__grid-index"] = $selectItems.parent().attr("data-index");
        return value;
    };

    // 删除指定行
    var _deleteRow = function(index) {
        $(".grid-row[data-index=" + index + "]").remove();
        _calcuHeight();
        // 重算odd和even
        _renderOdd();
    };    

    // 删除选中行
    var _deleteSelectedRow = function() {
        $(".grid-row.selected").remove();
        _calcuHeight();
        // 重算odd和even
        _renderOdd();
    };

    // 更新指定行数据
    var _updateRow = function(index, values) {
        $indexItems = $(".grid-row[data-index=" + index + "] .grid-item");
        $indexItems.each(function() {
            var key = $(this).attr("data-field");
            var value = values[key];
            if (value) {
                $(this).text(value);
            }
        });
        _resetWidth();
    };

    $.fn.divTable = function(options) {
        var options = $.extend({}, $.fn.divTable.defaults, options);

        var headers = options.headers;
        _renderHeader(this, headers);
        
        var data = options.data;
        _renderBody(this, data);

        // calcuTable
        _calcuHeight();
        _resetWidth();

        _renderOdd();
    
        // 委托滚动事件
        _initScroll();
    
        _initSelectAndHover();
        return this;
    };

    
    $.extend({
        // 获取选中的数据
        divTableSelected: function() {
           return _selectValue();
        },
        // TODO 更新某行数据
        divTableUpdate: function(index, values) {
            _updateRow(index, values)
        },
        // 删除某行数据
        divTableDelete: function(index) {
           _deleteRow(index);
        },
        // 删除选中行
        divTableDeleteSelected: function() {
            _deleteSelectedRow();
        },
        // 重置宽度
        divTableResetWidth: function() {
            _resetWidth();
        }
    });
    // 默认参数
    $.fn.divTable.defaults = {

    };
})(jQuery);