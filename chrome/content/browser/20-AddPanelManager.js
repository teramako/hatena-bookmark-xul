const EXPORT = ["AddPanelManager"];

var AddPanelManager = {
    init: function APM_init() {
        gBrowser.browsers.forEach(AddPanelManager.setupPanel);
        gBrowser.addEventListener("TabOpen", AddPanelManager.onTabOpen, false);
    },

    onTabOpen: function APM_onTabOpen(event) {
        AddPanelManager.setupPanel(event.originalTarget.linkedBrowser);
    },

    setupPanel: function APM_setupPanel(browser) {
        let panel = document.createElementNS(XUL_NS, "vbox");
        panel.setAttribute("class", "hBookmarkAddPanel");
        panel.setAttribute("collapsed", "true");
        browser.parentNode.appendChild(panel);
    },

    get currentPanel APM_get_currentPanel() {
        return this.getPanelForBrowser(gBrowser.selectedBrowser);
    },

    getPanelForBrowser: function APM_getPanelForBrowser(browser) {
        let panel = browser.nextSibling;
        while (panel && !/\bhBookmarkAddPanel\b/.test(panel.className))
            panel = panel.nextSibling;
        return panel;
    },

    getBookmarkForBrowser: function APM_getBookmarkForBrowser(browser) {
        let win = browser.contentWindow;
        let url = win.location.href;
        return Model.Bookmark.findByUrl(url)[0] || {
            title:   (win.document && win.document.title) || url,
            url:     url,
            comment: "",
            isNew:   true
        };
    },

    toggle: function APM_toggle() {
        let panel = this.currentPanel;
        let bookmark = this.getBookmarkForBrowser(gBrowser.selectedBrowser);
        if (panel.isOpen && panel.bookmark.url === bookmark.url)
            panel.hide();
        else
            panel.show(bookmark);
    }
};

window.addEventListener("load", AddPanelManager.init, false);
