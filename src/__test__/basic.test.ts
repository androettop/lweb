import format = require("xml-formatter");
import { LWeb, Template } from "../";

test("basic", () => {
  const templateList: Array<Template> = [
    {
      id: "parent",
      type: "primary",
      xml: `<Form>
                    <Field name="testfield" invisible="1"/>
                    <Field name="anotherfield"/>
                </Form>`,
    },
    {
      id: "child1",
      type: "primary",
      parent: "parent",
      xml: `<Form>
                    <Query selector="Field[name='testfield']" position="replace">
                        <Field name="testfield"/>
                    </Query>
                </Form>`,
    },
  ];

  const parentTemplateId = "parent";
  const parsed = LWeb.compileTemplate(parentTemplateId, templateList);
  console.log(parsed);
  expect(parsed).toBe(
    format(`<Form>
        <Field name="testfield"/>
        <Field name="anotherfield"/>
    </Form>`)
  );
});
