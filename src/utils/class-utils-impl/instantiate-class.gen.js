const MAX_ARGS = 100;

let caseStatements;

caseStatements = 'case 0: return new Clazz(); \n';

let argString = '';
for (let i = 0; i < 100; i++) {
  if (i !== 0) {
    argString += ','
  }

  argString += `args[${i}]`;

  caseStatements += `case ${i + 1}: return new Clazz(${argString}); \n`;
}

export default `

function instantiateClass (Clazz, args) {
  // we have to use \`new\` here to support native es6 classes
  switch (args.length) {
    ${caseStatements}
    default: throw new Error('Only classes with <= ${MAX_ARGS} are currently supported. Please file an issue on GitHub.');
  }

  return null;
}

`;
