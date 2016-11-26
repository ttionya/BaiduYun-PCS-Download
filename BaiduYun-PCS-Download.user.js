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
// @version     1.2.2
// ==/UserScript==


(function () {
    "use strict";

    var d = document,
        toolsLastButton = d.querySelector('.tools > span:last-child'),
        dlLink = 'http://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=266719&path=',
        dlButton;


    // 添加伪元素
    addStyle();

    // 添加按钮和监听
    dlButton = addButton();
    dlButton.addEventListener('click', getdlUri);


    // 第一次加载时判断是否显示
    checkUri(location.href);
    // hash 变化时判断是否显示
    window.addEventListener('hashchange', function (e) {
        checkUri(e.newURL);
    });


    // 获得下载地址
    function getdlUri () {
        var hash = location.hash,
            path,
            activeItems,
            activeItemsLen,
            filename;


        if (hash.indexOf('vmode=grid') !== -1) {

            // 网格模式
            activeItems = d.querySelectorAll('.grid-view-item.item-active');
        }
        else {

            // 列表模式
            activeItems = d.querySelectorAll('.list-view-item.item-active');
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
            var a = d.createElement('a');

            a.setAttribute('download', '');
            a.style.display = 'none';
            d.body.appendChild(a);

            for (; activeItemsLen--;) {
                filename = activeItems[activeItemsLen].querySelector(".file-name .filename").innerText;

                a.href = dlLink + encodeURIComponent(path + '/' + filename);
                a.click();
            }

            d.body.removeChild(a);
        }
    }


    //  添加下载按钮
    function addButton () {
        var a = d.createElement('a');

        a.innerHTML = '<span class="g-button-right"><em class="icon icon-black" title="黑科技下载"></em><span class="text" style="width: auto;">黑科技下载</span></span>';
        a.id = 'PCS-dl';
        a.classList.add('g-button', 'hidden');

        toolsLastButton.parentNode.insertBefore(a, toolsLastButton);

        return d.getElementById('PCS-dl');
    }

    // 添加相关样式
    function addStyle() {
        var style = d.createElement('style');

        style.innerText = '.icon-black::before{content:"\\9ed1";}.hidden{display:none;}';
        d.head.appendChild(style);
    }

    // 检查是否在“全部文件”中，控制是否显示
    function checkUri(url) {
        if (url.indexOf('/home') === -1 || url.indexOf('search/key=') !== -1) {

            // 不是“全部文件”页面
            // 是搜索页面
            dlButton.classList.add('hidden');
        }
        else {
            url.indexOf('category/type=') === -1 ?
                dlButton.classList.remove('hidden') :
                dlButton.classList.add('hidden');
        }
    }

    // 检测是否含文件夹
    function checkFolder(activeItems, len) {
        for (; len--;) {

            // 确认是否是文件夹
            if (activeItems[len].querySelector('.fileicon').classList.value.indexOf('dir-') !== -1) {
                return false;
            }
        }

        return true;
    }
})();