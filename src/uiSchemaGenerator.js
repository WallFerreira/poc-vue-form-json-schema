// for input type text/string no type is specified
const UI_INPUT_TYPES = {
  RANGE: "range",
  NUMBER: "number"
};

const SCHEMA_INPUT_TYPES = {
  RANGE: "integer",
  NUMBER: "number",
  TEXT: "string"
};

export function generateUISchema(schema, model) {
  const uiSchema = [];
  if (schema.properties) {
    const { properties } = schema;

    Object.entries(properties).forEach(([propertyKey, propertyValue]) => {
      const conditionalFields = getConditionalFieldsForKey(
        schema,
        model,
        propertyKey
      );
      switch (propertyValue.type) {
        case SCHEMA_INPUT_TYPES.RANGE:
          uiSchema.push({
            component: "range-slider",
            model: propertyKey,
            fieldOptions: {
              on: ["input"]
            }
          });
          break;
        case SCHEMA_INPUT_TYPES.NUMBER:
          uiSchema.push(
            createFormInputUISchema(
              propertyKey,
              propertyKey,
              UI_INPUT_TYPES.NUMBER
            )
          );
          break;
        case SCHEMA_INPUT_TYPES.TEXT:
          const form = propertyValue.enum
            ? createFormInputSelectUISchema(
                propertyKey,
                propertyKey,
                propertyValue.enum
              )
            : createFormInputUISchema(propertyKey, propertyKey);

          const label = {
            component: "label",
            fieldOptions: {
              attrs: {
                for: propertyKey
              },
              class: ["font-weight-bold"],

              domProps: {
                innerHTML: propertyValue.const || propertyKey
              }
            }
          };

          const formGroup = {
            component: "div",
            fieldOptions: {
              class: ["form-group"]
            },
            children: [label, form]
          };

          uiSchema.push(formGroup);
          break;
        default:
          break;
      }
      if (conditionalFields.flat().length) {
        uiSchema.push(...conditionalFields.flat());
      }
    });
  }
  return uiSchema;
}

function createFormInputSelectUISchema(model, id, options) {
  return {
    component: "b-form-select",
    model,
    fieldOptions: {
      attrs: {
        id
      },
      on: ["change"],
      class: ["mb-2"],
      props: {
        options,
        value: options[0]
      }
    }
  };
}

function createFormInputUISchema(model, id, type = undefined) {
  return {
    component: "b-form-input",
    model,
    fieldOptions: {
      attrs: {
        id
      },
      on: ["input"],
      class: ["mb-2"],
      props: {
        type
      }
    }
  };
}

// TODO: take a look at dynamic options: https://jarvelov.gitbook.io/vue-form-json-schema/api/vue-form-json-schema/ui-schema/field/dynamic-options
// TODO: several conditions from separate properties will trigger multiple rendering.
// Would this be a possible use case in the future to handle?
// one possible solution would be to check for existing id or ref
function getConditionalFieldsForKey(schema, model, propertyKey) {
  // do not create any ui schema if "allOf" is not defined for the schema
  if (!schema.allOf) {
    return [];
  }

  // check if "if-condition" in schema applies to relevant model (value)
  const matchesValue = (property, value) => {
    // "enum" is of type Array and is checked against model value
    if (property.enum) {
      return property.enum.includes(value);
    }
    // "conditionFn" can be a more complex expression evaluating "value" true 6or false
    if (property.conditionFn) {
      return property.conditionFn(value);
    }
  };

  // "allOf" contains a list of "if - then" definitions
  return schema.allOf.map(field => {
    if (
      // an "if" property can contain more than one condition.
      // the "some" operator allows to evaluate all conditions until the first is evaluated as true
      // in this implementation multiple conditions are OR-related
      // if all of the conditions have to apply (AND) the "every" operator could be used (definition (OR | AND) would have to be in json schema though)
      Object.entries(field.if.properties).some(([_, value]) =>
        matchesValue(value, model[propertyKey])
      )
    ) {
      if (!field.then) {
        return [];
      }
      // generate UI Schema for "then" schema (can contain nested allOf definitions)
      return generateUISchema(field.then, model);
    }
    return [];
  });
}
