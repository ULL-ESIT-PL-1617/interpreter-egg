// A simple language named Egg
// parseExpression(program)
// {
//  expr: expr,
//  rest: program
// }
// parseApply(expr, program)
// (a,b,c)

function parseExpression(program) {
  //console.log("parseExpression: " + program);
  program = skipSpace(program);
  var match, expr, rest;
  if (match = /^\d+/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^[^\s"(),]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
    var afterword = skipSpace(program.slice(match[0].length));
    if (afterword.slice(0, 1) == "(") {
      return parseApply(expr, afterword.slice(1));
    } 
  } else {
    throw new SyntaxError("Not valid Egg expression!")
  } 
  return {expr: expr, rest: program.slice(match[0].length)}; 
}

function parseApply(expr, program) {
  //console.log("parseApply: " + program);
  program = skipSpace(program);  
  expr = {type: "apply", operator: expr, args: []};
  while (program.slice(0, 1) != ")") { 
    //console.log("apply argument: " + program);
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program.slice(0, 1) == ",") {
      program = skipSpace(program.slice(1));
      
      if (program.slice(0, 1) == ")") {
        throw new SyntaxError("Not valid Egg expression!")
      }
    } else if (program.slice(0, 1) != ')'){
      throw new SyntaxError("Egg expect ',' or ')'"); 
    }
  }
  program = program.slice(1); 
  program = skipSpace(program);
  if (program.slice(0, 1) == '(') {
    return parseApply(expr, program.slice(1));
  } else {
    return {expr: expr, rest: program};
  }
}
function skipSpace(s) {
  var space = /^(\s|#.*)*/;
  if (match = space.exec(s)) {
    s = s.slice(match[0].length);
  }
  return s;
}

function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length != 0) {
    throw new SyntaxError("Egg unexpected text after program!")
  }
  return result.expr;
}

exports.skipSpace = skipSpace;
exports.parseExpression = parseExpression;
exports.parseApply = parseApply;
exports.parse = parse;
