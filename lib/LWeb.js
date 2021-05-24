"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmldom_1 = require("xmldom");
var XPath = require("xpath");
var cssXPath = require("css-xpath");
var format = require("xml-formatter");
var LWeb = /** @class */ (function () {
    function LWeb() {
    }
    LWeb.compileTemplate = function (parentId, templateList) {
        var domParser = new xmldom_1.DOMParser();
        var parentTemplate = templateList.find(function (e) { return e.id === parentId && e.type === "primary"; });
        if (!parentTemplate) {
            throw new Error("No se encontró la template padre");
        }
        var parentDoc = domParser.parseFromString(parentTemplate.xml);
        var childrenTemplates = templateList.filter(function (e) { return e.id != parentId; });
        for (var i = 0; i < childrenTemplates.length; i++) {
            var childTemplate = childrenTemplates[i];
            var childDoc = domParser.parseFromString(childTemplate.xml);
            //TODO: add support for all tags with "position" attribute
            var queries = XPath.select("//Query", childDoc);
            for (var j = 0; j < queries.length; j++) {
                var query = queries[j];
                var position = query.getAttribute("position") || "";
                var selector = query.getAttribute("selector") || "";
                var selectedElement = XPath.select(cssXPath(selector), parentDoc)[0];
                if (["before", "replace"].includes(position)) {
                    while (query.childNodes.length > 0) {
                        parentDoc.insertBefore(query.childNodes[0], selectedElement);
                    }
                    if (position === "replace") {
                        parentDoc.removeChild(selectedElement);
                    }
                }
                else if (position === "after") {
                    while (query.childNodes.length > 0) {
                        selectedElement.parentNode.insertBefore(query.childNodes[0], selectedElement.nextSibling);
                    }
                }
            }
        }
        return format(new xmldom_1.XMLSerializer().serializeToString(parentDoc));
    };
    return LWeb;
}());
exports.default = LWeb;
