const ts = require("typescript");

class FunctionSchemaPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("FunctionSchemaPlugin", (compilation) => {
      compilation.hooks.succeedModule.tap("FunctionSchemaPlugin", (module) => {
        if (
          module.resource &&
          module.resource.startsWith(this.options.directory)
        ) {
          const sourceCode = module._source._value;
          const sourceFile = ts.createSourceFile(
            "temp.ts",
            sourceCode,
            ts.ScriptTarget.Latest
          );

          const program = ts.createProgram([module.resource], {});
          const checker = program.getTypeChecker();

          ts.forEachChild(sourceFile, (node) => {
            if (ts.isClassDeclaration(node)) {
              const className = node.name.escapedText;
              node.members.forEach((member) => {
                if (ts.isMethodDeclaration(member)) {
                  const symbol = checker.getSymbolAtLocation(member.name);
                  const jsDocComments = ts.displayPartsToString(
                    symbol.getDocumentationComment(checker)
                  );
                  const parameterSymbol = checker.getSymbolAtLocation(
                    member.parameters[0].name
                  );
                  const parameterType = checker.typeToString(
                    checker.getTypeOfSymbolAtLocation(
                      parameterSymbol,
                      parameterSymbol.valueDeclaration
                    )
                  );

                  // Create schema
                  const schema = {
                    name: symbol.name,
                    description: jsDocComments,
                    parameters: {
                      type: "object",
                      properties: {
                        expression: {
                          type: parameterType,
                          description: "The expression to be evaluated",
                        },
                      },
                    },
                  };

                  // Inject schema into source code
                  const schemaCode = `${className}.schema = ${JSON.stringify(
                    schema
                  )};`;
                  module._source._value += schemaCode;
                }
              });
            }
          });
        }
      });
    });
  }
}

module.exports = FunctionSchemaPlugin;
