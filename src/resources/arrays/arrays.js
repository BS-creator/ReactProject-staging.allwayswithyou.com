export const yearOptions = () => {
  const ret = [];
  const currentYear = new Date().getFullYear();

  for(var i = 1900; i < currentYear; i++){
    ret.push({ key: i, value: i, text: `${i}`})
  }

  return ret;
}