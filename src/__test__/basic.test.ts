import format = require("xml-formatter");
import { LWeb, Template } from "../";

test("Replace field", () => {
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

test("Insert after", () => {
  const templateList: Array<Template> = [
    {
      id: "parent",
      type: "primary",
      xml: `<Form>
                    <Field name="first"/>
                    <Field name="second"/>
                </Form>`,
    },
    {
      id: "child1",
      type: "primary",
      parent: "parent",
      xml: `<Form>
                    <Query selector="Field[name='second']" position="after">
                        <Field name="third"/>
                    </Query>
                </Form>`,
    },
  ];

  const parentTemplateId = "parent";
  const parsed = LWeb.compileTemplate(parentTemplateId, templateList);
  console.log(parsed);
  expect(parsed).toBe(
    format(`<Form>
        <Field name="first"/>
        <Field name="second"/>
        <Field name="third"/>
    </Form>`)
  );
});
