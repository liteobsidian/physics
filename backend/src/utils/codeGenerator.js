// генерирует 5ти значный код
export function generate_code() {
    const min = 10000;
    const max = 99999;
    const code = Math.abs(Math.floor(Math.random() * (max - min) + min));
    return String(code);
}
