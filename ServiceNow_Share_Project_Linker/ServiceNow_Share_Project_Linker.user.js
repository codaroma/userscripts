// ==UserScript==
// @name         ServiceNow Share Project Linker
// @namespace    https://greasyfork.org/en/users/1260574
// @version      2024-02-13
// @description  Convert ServiceNow Share project links from AngularJS script to regular href links
// @author       codaroma
// @match        https://developer.servicenow.com/connect.do
// @icon         https://developer.servicenow.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    new MutationObserver(observe).observe(document.querySelector("body"), {
        subtree: true,
        childList: true,
    });

    function observe() {
        fixLinks({
            "#!/share": {
                sel: "a.dp-sh-bottom-item-header[data-ng-click='takeToLink(listItem.link,{}, $event)'][href='javascript: void(0)']",
                ref: "listItem.link",
            },
            "#!/share/contents": {
                sel: "a.app-title[data-ng-click='shareContentsVM.takeToLink(row.url,{}, $event)'][href='javascript: void(0)']",
                ref: "row.url",
            },
        });
    }

    function fixLinks(config) {
        const hashPage = location.hash.split("?", 1)[0];
        const pageConfig = config[hashPage];
        if (pageConfig) {
            document.querySelectorAll(pageConfig.sel).forEach(function (elem) {
                const angElem = angular.element(elem);
                angElem.off("click");
                angElem.attr(
                    "href",
                    pageConfig.ref
                        .split(".")
                        .reduce((p, c) => (p && p[c]) || null, angElem.scope())
                );
            });
        }
    }
})();