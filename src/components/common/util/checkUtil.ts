/*
首尾不能有空字符(空格、制表符、换页符等空白字符的其中任意一个),文件名尾不能为.号
文件名和扩展名不能同时为空
文件名中不能包含\/:*?”<>|中的任意字符
文件名(包括扩展名)的长度不得大于255个字符

首字符: [^\s\\/:\*\?\"<>\|]
尾字符: [^\s\\/:\*\?\"<>\|\.]
其它字符: (\x20|[^\s\\/:\*\?\"<>\|])*

*/



export function isValidFileName (fileName: string) {
  if (!fileName && fileName.length <= 255) {
    return false
  } else {
    const regExp = /[^\s\\/:*?"<>|]?(\x20|[^\s\\/:*?"<>|])*[^\s\\/:*?"<>|.]$/;
    return fileName.match(regExp)
  }
}