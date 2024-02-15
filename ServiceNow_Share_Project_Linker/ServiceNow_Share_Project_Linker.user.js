// ==UserScript==
// @name         ServiceNow Share Project Linker
// @namespace    https://github.com/codaroma/userscripts
// @copyright    2024+, codaroma (https://github.com/codaroma)
// @version      0.0.2
// @description  Convert ServiceNow Share project links from AngularJS script to regular href links
// @icon         https://developer.servicenow.com/favicon.ico
// @grant        none
// @author       codaroma
// @homepage     https://github.com/codaroma/userscripts/tree/main/ServiceNow_Share_Project_Linker
// @match        https://developer.servicenow.com/connect.do
// @updateURL    https://github.com/codaroma/userscripts/raw/main/ServiceNow_Share_Project_Linker/ServiceNow_Share_Project_Linker.user.js
// @downloadURL  https://github.com/codaroma/userscripts/raw/main/ServiceNow_Share_Project_Linker/ServiceNow_Share_Project_Linker.user.js
// @supportURL   https://github.com/codaroma/userscripts/issues
// ==/UserScript==

(function () {
    "use strict";
    new MutationObserver(() => {
        const hashPath = location.hash.split("?", 1)[0];
        const pathConfig = {
            "#!/share": {
                selector:
                    "div.dp-sh-bottom-box-row ul.card-view-list a.dp-sh-bottom-item-header[data-ng-click='takeToLink(listItem.link,{}, $event)'][href='javascript: void(0)']",
                getUrl: (scope) => scope.listItem.link,
            },
            "#!/share/contents": {
                selector:
                    "table.dp-scc-table tbody a.app-title[data-ng-click='shareContentsVM.takeToLink(row.url,{}, $event)'][href='javascript: void(0)']",
                getUrl: (scope) => scope.row.url,
            },
        }[hashPath];
        if (pathConfig) {
            $(pathConfig.selector)
                .off("click")
                .attr("href", () => pageConfig.getUrl($(this).scope()));
        }
    }).observe(document.querySelector("body"), {
        subtree: true,
        childList: true,
    });
})();
