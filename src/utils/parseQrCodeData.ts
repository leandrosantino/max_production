// let a = 1
export function parseQrCodeData (code: string) {
  let value = code
    .replaceAll('{', '}')
    .replaceAll('^', '"')
    .replaceAll('`', '{')
    .replaceAll('Ç', ':')
    .replaceAll('â', '"a')
    .replaceAll('ê', '"e')
    .replaceAll('î', '"i')
    .replaceAll('ô', '"o')
    .replaceAll('û', '"u')
  console.log(code, ' - ', value)
  // value = `223021003${a}.01`
  // a++
  return value
}
