// 模块一

/* var set = new Set([]);
console.log(typeof(set));
var map = new Map([]);
console.log(map) */


// 模块二
/* var set = new Set([1, 2, 3, {"t": "2"}, ["3","4"]])
set.forEach((value, key) => console.log(key + ': ' + value)); */

// 模块三
/* var set = new Set();
set.add(2018)
set.add({'year': '2019'})
set.forEach(item => item.year ? item.year = 2020 : '');
console.log(...set);
var b = Array.from(set);
console.log(b); */

// 模块四
/* var map = new Map([{'year':'2018'}, {'where':'shanghai'}, ['name', 'virgo']]);
map.set('year', '2019'); */
// for(var a of map){
//   console.log(a);
// }
// map.forEach((value, key) => console.log(key + '-> ' + value));
// console.log(...map);
// console.log(map);
// var c = Array.from(map);
// console.log(c);

// 模块五
/* var map = new Map([['year','2018'], ['where','shanghai'], ['name', 'virgo']]);
map.set('year', '2019');
map.set('where', 'beijing');
// 一
for(var a of map){
  console.log(a);
}
// 二
console.log(...map);
// 三
map.forEach((value, key) => console.log(key + '-> ' + value));
console.log(map);
var c = Array.from(map);
console.log(c); */

// 模块六
var a = [{'year':'2018'}, {'where':'shanghai'}, ['name', 'virgo']]
var b = Array.from(a);
console.log(b);