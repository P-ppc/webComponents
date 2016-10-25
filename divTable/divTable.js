// 利用div实现table
// 依赖jQuery, artTemplate.js
// 暂不支持rowspan和colspan, 多行header

(function($) {
    $.fn.divTable = function(options) {
        var options = $.extend({}, $.fn.divTable.defaults, options);

        var headers = options.headers;
        // 渲染初步表格
        var $header = $('<div class="grid-header"></div>');
        var $body = $('<div class="grid-body"></div>');

        var $freeze = $('<div class="freeze"></div>');
        var $free = $('<div class="free"></div>');
        var $gridRow = $('<div class="grid-row"></div>');
        var $gridItem = $('<div class="grid-item"></div>');

        var $headerFreeze = $freeze.clone();
        var $headerFree = $free.clone();
        var $headerFreezeGridRow = $gridRow.clone();
        var $headerFreeGridRow = $gridRow.clone();
        var freezeColumnCount = 0;
        var minWidthMap = {};
        $.each(headers, function(index, item) {
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
        $(this).append($header);
        var offsetWidth = $headerFreeze.width();
        $headerFree.css('left', offsetWidth);

        var data = options.data;
        var $bodyFreeze = $freeze.clone();
        var $bodyFree = $free.clone();
       
        $.each(data, function(index, item) {
            // 遍历item
            var _freezeColumnCount = freezeColumnCount;
            var $bodyFreezeGridRow = $gridRow.clone();
            var $bodyFreeGridRow = $gridRow.clone();
            $.each(item, function(innerIndex, innerValue) {
                var $bodyItem = $gridItem.clone();
                $bodyItem.text(innerValue).css('min-width', minWidthMap[innerIndex]).addClass("grid_" + innerIndex);
                if (_freezeColumnCount > 0) {
                    $bodyFreezeGridRow.append($bodyItem);
                    _freezeColumnCount -= 1;
                } else {
                    $bodyFreeGridRow.append($bodyItem);
                }
            });
            $bodyFreeze.append($bodyFreezeGridRow);
            $bodyFree.append($bodyFreeGridRow);
        });
        $body.append($bodyFreeze).append($bodyFree);
        $(this).append($body);
        $bodyFree.css('left', offsetWidth);
        // initTable
         var initTable = function() {
            // 计算grid-body的宽度
            var headerHeight = $(".grid-header").height();
            var currentHeight = $(".grid-body").height();
            var bodyHeight = $(".grid").height() - headerHeight;
            var bodyWidth = $(".grid").width();
            $(".grid-body").css({
                height: bodyHeight < currentHeight ? bodyHeight : currentHeight,
                width: bodyWidth
            });
            // 计算grid-body .free的宽度
            var freezeWdith = $(".grid-body .freeze").width();
            $(".grid-body .free").css({
                height: bodyHeight < currentHeight ? bodyHeight : currentHeight,
                width: bodyWidth - freezeWdith
            });
            // 计算grid-body .freeze的高度
            $(".grid-body .freeze").css({
                height: bodyHeight < currentHeight ? bodyHeight : currentHeight
            });
            
            // 计算.grid-row的宽度
            var scrollWidth = $(".grid-body .free")[0].scrollWidth;
            $(".grid-body .free .grid-row").width(scrollWidth);
            // 计算每个grid-item的宽度, 通过class标记
            // var $columnItems = $(".grid-item.property");
            // var maxWidth = 0;
            // $columnItems.each(function() {
            //     if ($(this).outerWidth() > maxWidth) {
            //         maxWidth = $(this).outerWidth();
            //     }
            // });
            // $columnItems.width(maxWidth);
        };
        initTable();
        // 委托滚动事件
         $(".grid-body .free").scroll(function() {
            // 基础的header跟随grid-body滚动
            var currentX = $(this).scrollLeft();
            $(".grid-header .free .grid-row").css("left", "-" + currentX + "px");
            var currentY = $(this).scrollTop();
            $(".grid-body .freeze").css("top", "-" + currentY + "px");
        });
    };

    // 默认参数
    $.fn.divTable.defaults = {

    };
})(jQuery);

// // 固定列数量
// var freezeColumnCount = 1;
// // 固定行数量
// var freezeColumnCount = 1;

// // 表头
// var headers = [
//     check: {
//         text: "",
//         class: "",
//         minWidth: 36
//     },
//     name: {

//     },
//     ...
// ]

// // 数据
// var dataList = [
//     {   
//         // 一行数据
//         check: "",
//         name: ,
//         ...
//     },
//     {

//     }
// ]