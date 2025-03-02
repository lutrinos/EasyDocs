import pc from 'picocolors';

type LogType = 'error' | 'warn' | 'success' | 'info';

const format = (n: number): string => {
  if (n < 10) {
    return '0' + n;
  }
  
  return n.toString();
};

const getDate = (): string => {
  const d = new Date();
  return pc.gray(`${format(d.getHours() % 12)}:${format(d.getMinutes())}:${format(d.getSeconds())} ${ d.getHours() < 12 ? 'AM' : 'PM'}`);
};

const colorText = (type: LogType, text: string): string => {
  switch (type) {
    case 'error':
      return pc.red(text);
    case 'warn':
      return pc.yellow(text);
    case 'info':
      return pc.blue(text);
    case 'success':
      return pc.green(text);
  }
  return text;
}


export function log (type: LogType, info: string, meta?: string, paragraph?: string) {
  console.log(
    `${getDate()} ${colorText(type, `[${pc.bold(type)}]`)} ${pc.white(info)} ${pc.gray(meta ?? '')}`
  );

  if (paragraph) {
    console.log(paragraph);
  }
}