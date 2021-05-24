import Template from "./types/Template";
declare class LWeb {
  static compileTemplate(
    parentId: string,
    templateList: Array<Template>
  ): string;
}
export default LWeb;
