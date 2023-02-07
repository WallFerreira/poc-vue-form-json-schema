export const jsonSchema = {
  type: "object",
  properties: {
    interested: {
      type: "string",
      enum: ["no", "yes"]
    }
  },
  allOf: [
    {
      if: {
        properties: {
          interested: {
            enum: ["yes"]
          }
        }
      },
      then: {
        type: "object",
        properties: {
          name: {
            type: "string"
          }
        }
      }
    },
    {
      if: {
        properties: {
          interested: {
            enum: ["yes"]
          }
        }
      },
      then: {
        type: "object",
        properties: {
          age: {
            type: "number"
          },
          gender: {
            type: "string",
            enum: ["female", "male", "diverse", "slider-gender"]
          }
        },
        allOf: [
          {
            if: {
              properties: {
                gender: {
                  enum: ["slider-gender"]
                },
                age: {
                  conditionFn: val => val > 18
                }
              }
            },
            then: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  const: "Description (what is a slider-gender?)"
                },
                awesomeness: {
                  type: "integer",
                  minimum: 0,
                  maximum: 100
                }
              }
            }
          }
        ]
      }
    }
  ]
};
