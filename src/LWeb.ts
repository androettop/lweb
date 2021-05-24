import Template from "./types/Template";
import { DOMParser, XMLSerializer } from "xmldom";
import * as XPath from "xpath";
import cssXPath = require("css-xpath");
import format = require("xml-formatter");

class LWeb {
  static compileTemplate(
    parentId: string,
    templateList: Array<Template>
  ): string {
    const domParser = new DOMParser();
    const parentTemplate = templateList.find(
      (e) => e.id === parentId && e.type === "primary"
    );

    if (!parentTemplate) {
      throw new Error("No se encontró la template padre");
    }

    const parentDoc = domParser.parseFromString(parentTemplate.xml);

    const childrenTemplates = templateList.filter((e) => e.id != parentId);

    for (let i = 0; i < childrenTemplates.length; i++) {
      const childTemplate = childrenTemplates[i];
      const childDoc = domParser.parseFromString(childTemplate.xml);
      //TODO: add support for all tags with "position" attribute
      const queries = XPath.select("//Query", childDoc);
      for (let j = 0; j < queries.length; j++) {
        const query = queries[j] as Element;
        const position = query.getAttribute("position") || "";
        const selector = query.getAttribute("selector") || "";
        const selectedElement = XPath.select(
          cssXPath(selector),
          parentDoc
        )[0] as any;
        if (["before", "replace"].includes(position)) {
          while (query.childNodes.length > 0) {
            parentDoc.insertBefore(query.childNodes[0], selectedElement);
          }
          if (position === "replace") {
            parentDoc.removeChild(selectedElement);
          }
        } else if (position === "after") {
          while (query.childNodes.length > 0) {
            selectedElement.parentNode.insertBefore(
              query.childNodes[0],
              selectedElement.nextSibling
            );
          }
        }
      }
    }
    return format(new XMLSerializer().serializeToString(parentDoc));
  }
}

export default LWeb;
