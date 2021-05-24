declare type Template = {
  id: string;
  type: "primary" | "inherit";
  parent?: string;
  xml: string;
};
export default Template;
