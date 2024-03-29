// ==UserScript==
// @name         ServiceNow Share Project Linker
// @namespace    https://github.com/codaroma/userscripts
// @copyright    2024+, codaroma (https://github.com/codaroma)
// @version      0.1.2
// @description  Convert ServiceNow Share project links from AngularJS script to regular href links
// @icon         https://developer.servicenow.com/favicon.ico
// @grant        none
// @author       codaroma
// @homepage     https://github.com/codaroma/userscripts/tree/main/ServiceNow_Share_Project_Linker
// @match        https://developer.servicenow.com/connect.do
// @updateURL    https://github.com/codaroma/userscripts/raw/main/ServiceNow_Share_Project_Linker/ServiceNow_Share_Project_Linker.user.js
// @downloadURL  https://github.com/codaroma/userscripts/raw/main/ServiceNow_Share_Project_Linker/ServiceNow_Share_Project_Linker.user.js
// @supportURL   https://github.com/codaroma/userscripts/issues
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const definitions = [
        {
            paths: ["#!/share"],
            actions: [
                {
                    selector:
                        "div.dp-sh-bottom-box-row ul.card-view-list a.dp-sh-bottom-item-header[data-ng-click='takeToLink(listItem.link,{}, $event)'][href='javascript: void(0)']",
                    getUrl: (scope) => scope.listItem.link,
                },
                {
                    selector:
                        "div.dp-sh-bottom-box-row a.dp-sh-brb-link[data-ng-click='takeToLink(viewMoreUrl,{}, $event)'][href='javascript: void(0)']",
                    getUrl: (scope) => scope.viewMoreUrl,
                },
            ],
        },
        {
            paths: ["#!/share/user/content"],
            actions: [
                {
                    selector:
                        "div.dp-suc-bottom-box-row ul.card-view-list a.dp-sh-bottom-item-header[data-ng-click='takeToLink(listItem.link,{}, $event)'][href='javascript: void(0)']",
                    getUrl: (scope) => scope.listItem.link,
                },
                {
                    selector:
                        "div.dp-suc-bottom-box-row a.dp-sh-brb-link[data-ng-click='takeToLink(viewMoreUrl,{}, $event)'][href='javascript: void(0)']",
                    getUrl: (scope) => scope.viewMoreUrl,
                },
            ],
        },
        {
            paths: ["#!/share/contents"],
            actions: [
                {
                    selector:
                        "table.dp-scc-table tbody a.app-title[data-ng-click='shareContentsVM.takeToLink(row.url,{}, $event)'][href='javascript: void(0)']",
                    getUrl: (scope) => scope.row.url,
                },
            ],
        },
    ];

    const pathActions = new Map();

    definitions.forEach((definition) =>
        definition.paths.forEach((path) =>
            pathActions.set(path, definition.actions)
        )
    );

    new MutationObserver(() => {
        const hashPath = location.hash.split("?", 1)[0];
        const actions = pathActions.get(hashPath);
        if (actions) {
            actions.forEach((action) => {
                const elements = document.body.querySelectorAll(
                    action.selector
                );
                elements.forEach((elem) => {
                    const angElem = angular.element(elem);
                    const url = action.getUrl(angElem.scope());
                    if (url) {
                        angElem.off("click").attr("href", url);
                    }
                });
            });
        }
    }).observe(document.body, {
        subtree: true,
        childList: true,
    });
})();
