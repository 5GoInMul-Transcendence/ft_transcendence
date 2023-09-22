export function generateRandomCode(): string {
    let code = Math.floor(Math.random() * 10000); // 0 ~ 9999
    return code.toString().padStart(4, '0'); // 4자리를 맞추기 위해 앞에 '0'을 추가
}