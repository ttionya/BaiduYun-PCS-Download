// ==UserScript==
// @name        百度网盘黑科技
// @namespace   https://github.com/ttionya/BaiduYun-PCS-Download
// @description 使用 PCS 下载自己网盘中的资源
// @author      ttionya
// @encoding    utf-8
// @include     http*://pan.baidu.com/disk/home*
// @include     http*://yun.baidu.com/disk/home*
// @license     https://raw.githubusercontent.com/ttionya/BaiduYun-PCS-Download/master/LICENSE
// @updateURL   https://raw.githubusercontent.com/ttionya/BaiduYun-PCS-Download/master/BaiduYun-PCS-Download.user.js
// @downloadURL https://raw.githubusercontent.com/ttionya/BaiduYun-PCS-Download/master/BaiduYun-PCS-Download.user.js
// @run-at      document-end
// @grant       none
// @version     1.4.0
// ==/UserScript==


(function () {
    "use strict";

    var d = document,
        tools = { // 工具
            /*
             * 祖先元素
             * elem: element
             * className: className support only
             */
            parents: function (elem, className) {
                var matched = [];

                while ((elem = elem.parentNode) && elem.nodeType !== 9) {
                    if (elem.nodeType === 1 && elem.classList.contains(className)) {
                        matched.push(elem);
                    }
                }

                return matched;
            }
        },
        dlLink = 'http://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=266719&path=',
        time = 10,
        toolsLastButton, dlButton, iframeDiv, interval;

    // 循环判断是否取到元素，只判断 10 次
    // 因为莫名取不到相应元素，只好延迟判断
    interval = setInterval(function () {
        time--;
        toolsLastButton = tools.parents(d.querySelector('[title=上传]'), 'g-dropdown-button')[0]; // '.tools > span:last-child'

        // 取到了
        if (toolsLastButton) {
            toolsLastButton = toolsLastButton.parentNode.lastChild;

            clearInterval(interval); // 取消

            init(); // 初始化
        }
        else if (!time) {
            console.warn('百度网盘黑科技获取 DOM 失败');

            clearInterval(interval); // 取消，没有然后了
        }
    }, 500);

    // 初始化
    function init () {
        // 添加伪元素、按钮、容器和监听
        addStyle();
        dlButton = addButton();
        iframeDiv = addDiv();
        dlButton.addEventListener('click', getdlUri);

        // 第一次加载时判断是否显示
        checkUri(location.href);
        // hash 变化时判断是否显示
        window.addEventListener('hashchange', function (e) {
            checkUri(e.newURL);
        });
    }


    // 获得下载地址
    function getdlUri () {
        var hash = location.hash,
            path,
            activeItems,
            activeItemsLen,
            filename;


        if (hash.indexOf('vmode=grid') !== -1) {

            // 网格模式
            activeItems = d.querySelectorAll('.cEefyz.duqD6l'); // '.grid-view-item.item-active'
        }
        else {

            // 列表模式
            activeItems = d.querySelectorAll('.AuPKyz.duqD6l'); // '.list-view-item.item-active'
        }

        activeItemsLen = activeItems.length;
        path = decodeURIComponent(hash.split('path=')[1].split('&')[0]);


        if (!activeItemsLen) {
            alert('选中至少一个文件才能下载哟');
        }
        else if (!checkFolder(activeItems, activeItemsLen)) {
            alert('不能下载文件夹哦~');
        }
        else {
            for (; activeItemsLen--;) {
                filename = activeItems[activeItemsLen].querySelector(".file-name .yezXdy").innerText; // '.file-name .filename'

                var iframe = d.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = dlLink + encodeURIComponent(path + '/' + filename);
                iframeDiv.appendChild(iframe);
            }
        }
    }


    //  添加下载按钮
    function addButton () {
        var a = d.createElement('a');

        a.innerHTML = '<span class="g-button-right"><em class="icon icon-black" title="黑科技下载"></em><span class="text" style="width: auto;">黑科技下载</span></span>';
        a.id = 'PCS-dl';
        a.classList.add('g-button', 'PCS-hidden');

        toolsLastButton.parentNode.insertBefore(a, toolsLastButton);

        return d.getElementById('PCS-dl');
    }

    // 添加容器
    function addDiv() {
        var div = d.createElement('div');

        div.id = 'PCS-iframe';
        d.body.appendChild(div);

        return d.getElementById('PCS-iframe');
    }

    // 添加相关样式
    function addStyle() {
        var style = d.createElement('style');

        style.innerText = '.icon-black::before{content:"\\9ed1";}.PCS-hidden{display:none;}';
        d.head.appendChild(style);
    }

    // 检查是否在“全部文件”中，控制是否显示
    function checkUri(url) {
        if (url.indexOf('/home') === -1 || url.indexOf('search/key=') !== -1) {

            // 不是“全部文件”页面
            // 是搜索页面
            dlButton.classList.add('PCS-hidden');
        }
        else {
            url.indexOf('category/type=') === -1 ?
                dlButton.classList.remove('PCS-hidden') :
                dlButton.classList.add('PCS-hidden');
        }
    }

    // 检测是否含文件夹
    function checkFolder(activeItems, len) {
        for (; len--;) {

            // 确认是否是文件夹
            if (activeItems[len].querySelector('.mtglG7l').classList.value.indexOf('dir-') !== -1) { // '.fileicon'
                return false;
            }
        }

        return true;
    }
})();