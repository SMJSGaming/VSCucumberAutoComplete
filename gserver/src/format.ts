import { Range } from 'vscode-languageserver';
import { escapeRegExp } from './util';

interface FormatConf {
    text: string,
    type: string,
    indents?: number
}

const FORMAT_CONF: FormatConf[] = [
    { text: 'Feature:', type: 'num', indents: 0 },
    { text: 'Scenario:', type: 'num', indents: 1 },
    { text: 'Background:', type: 'num', indents: 1 },
    { text: 'Scenario Outline:', type: 'num', indents: 1 },
    { text: 'Examples:', type: 'num', indents: 2 },
    { text: 'Given', type: 'num', indents: 2 },
    { text: 'When', type: 'num', indents: 2 },
    { text: 'Then', type: 'num', indents: 2 },
    { text: 'And', type: 'num', indents: 2 },
    { text: 'But', type: 'num', indents: 2 },
    { text: '\\|', type: 'num', indents: 3 },
    { text: '"""', type: 'num', indents: 3 },
    { text: '#', type: 'relative' },
    { text: '@', type: 'relative' },
];

function findFormat(line: string): FormatConf {
    return FORMAT_CONF.find(conf => line.search(new RegExp(escapeRegExp('^\\s*' + conf.text))) > -1);
}

function correctIndents(text, indent) {
    let defaultIndent = 0;
    return text
        .split(/\r?\n/g)
        .map((line, i, textArr) => {
            let format = findFormat(line);
            let indentCount = defaultIndent;
            if (format && format.type === 'num') {
                indentCount = format.indents;
            } else if (format && format.type === 'relative') {
                let nextLine = textArr.slice(i + 1).find(l => findFormat(l) && findFormat(l).type === 'num');
                indentCount = nextLine ? findFormat(nextLine).indents : defaultIndent;
            }
            return line.replace(/^\s*/, indent.repeat(indentCount));
        })
        .join('\r\n');
}

export function format(indent: string, range: Range, text: string): string {

    //Insert correct indents for all the lined differs from string start
    text = correctIndents(text, indent);

    return text;

}
