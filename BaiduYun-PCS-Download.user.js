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
// @version     1.1
// ==/UserScript==


(function () {
    "use strict";

    var d = document,
        toolsLastButton = d.querySelector('.tools > span:last-child'),
        dlLink = 'http://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=266719&path=',
        dlButton;

    //  添加下载按钮
    function addButton () {
        var a = d.createElement("a");
        a.innerHTML = '<span class="g-button-right"><em class="icon icon-download" title="黑科技下载"></em><span class="text" style="width: auto;">黑科技下载</span></span>';
        a.id = "PCS-dl";
        a.classList.add("g-button");

        toolsLastButton.parentNode.insertBefore(a, toolsLastButton);

        return d.getElementById('PCS-dl');
    }

    // 获得下载地址
    function getUri () {
        var ddActive = d.querySelectorAll(".list-view .item-active"),
            ddActiveLen = ddActive.length,
            path = location.href.split("list/path=")[1],
            fileName;

        if (!ddActiveLen) {
            alert('选中至少一个文件才能下载哟');
        }
        else if (!checkFolder(ddActive, ddActiveLen)) {
            alert('不能下载文件夹哦~');
        }
        else {
            var a = d.createElement('a');
            a.setAttribute('download', '');
            a.style.display = 'none';
            d.body.appendChild(a);

            for (; ddActiveLen--;) {
                fileName = ddActive[ddActiveLen].querySelector(".file-name .text .filename").innerText;

                a.href = dlLink + path + '/' + fileName;
                a.click();
            }

            d.body.removeChild(a);
        }
    }

    // 不含文件夹
    function checkFolder(ddActive, len) {
        for (; len--;) {

            // 确认是否是文件夹
            if (ddActive[len].querySelector('.fileicon').classList.value.indexOf('dir-') !== -1) {
                return false;
            }
        }

        return true;
    }

    dlButton = addButton();
    dlButton.addEventListener('click', getUri);
})();