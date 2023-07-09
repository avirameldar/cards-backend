const joi = require("joi");

const schema = joi.object({
  title: joi.string().min(2).max(20),
  subtitle: joi.string(),
  phone: joi
    .string()
    .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
    .rule({ message: "The phone is not valid" })
    .required(),
});

const newCard = {
  title: "hello",
  subtitle: "something",
  phone: "052- 123 4547",
};

const { error } = schema.validate(newCard);

if (error) console.log(error.details[0].message);
else console.log("valid");