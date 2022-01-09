import {
    and,
    combine,
    decimalDigits,
    hide,
    Match,
    namedGroupOf,
    oneOrMore,
    optional,
    or,
    Parser,
    pickFrom,
    recursive,
} from "dissector";

const whitespace = oneOrMore(pickFrom(" \t\r\n"));

const digit = pickFrom(decimalDigits);
const exponent = and(
    pickFrom("eE"),
    optional(pickFrom("+-")),
    oneOrMore(digit)
);
const number = combine(
    oneOrMore(digit),
    optional(".", oneOrMore(digit)),
    optional(exponent)
);

const expression = recursive();

const atom = or(number, and(hide("("), expression, hide(")")));

const prefix = or(
    namedGroupOf("prefix", oneOrMore(pickFrom("+-")), atom),
    atom
);

const power = recursive();
power.rule = or(namedGroupOf("power", prefix, "^", power), prefix);

const factors = or(
    namedGroupOf("factors", power, oneOrMore(pickFrom("*/%"), power)),
    power
);

const terms = or(
    namedGroupOf("terms", factors, oneOrMore(pickFrom("+-"), factors)),
    factors
);

expression.rule = terms;

function calculate(node: Match): number {
    if (typeof node === "string") return +node;
    else if (!("name" in node)) throw new Error("Unexpected group match.");
    else if (node.name === "factors") {
        let result = calculate(node[0]);
        for (let i = 1; i < node.length; i += 2) {
            let operand = calculate(node[i + 1]);
            switch (node[i]) {
                case "*":
                    result *= operand;
                    break;
                case "/":
                    result /= operand;
                    break;
                case "%":
                    result %= operand;
                    break;
            }
        }
        return result;
    } else if (node.name === "terms") {
        let result = calculate(node[0]);
        for (let i = 1; i < node.length; i += 2) {
            let operand = calculate(node[i + 1]);
            switch (node[i]) {
                case "+":
                    result += operand;
                    break;
                case "-":
                    result -= operand;
                    break;
            }
        }
        return result;
    } else if (node.name === "power") {
        return calculate(node[0]) ** calculate(node[2]);
    } else if (node.name === "prefix") {
        let result = calculate(node.at(-1)!);
        for (let i = node.length - 2; i >= 0; i--) {
            switch (node[i]) {
                case "+":
                    break;
                case "-":
                    result = -result;
                    break;
            }
        }
        return result;
    }
    throw new Error(`Unknown rule ${JSON.stringify(node.name)}`);
}

export function calc(text: string): number {
    const parser = new Parser(text);
    parser.base.skipped.push(whitespace);

    const result = parser.parse(expression);
    if ("error" in result) {
        return NaN;
    } else {
        return calculate(result[0]);
    }
}
