import { GraphQLScalarType, Kind } from 'graphql';

const regex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

function validate(url: unknown): string | never {
  if (typeof url !== 'string' || !regex.test(url)) {
    throw new TypeError('URL is not valid');
  }

  return url;
}

export const URL = new GraphQLScalarType({
  name: 'URL',
  description: 'URL custom scalar type, validates input as a valid URL.',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) =>
    ast.kind === Kind.STRING ? validate(ast.value) : null,
});
