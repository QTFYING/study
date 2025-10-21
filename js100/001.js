/**
 * 给定一个数组和一个目标值，找出两个数之和等于该目标的下标对
 * 算法（时间复杂度和空间复杂度）
 * 期望输出 [0, 1]，即2和7的下标
 */

const arr = [2, 7, 6, 11, 8, 13, 29, 20, 2]
const target = 9;

// method-1： 直接for循环中return
const findTwoSumIndex1 = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    const idx = arr.findIndex(item => item + arr[i] === target)
    if(idx > -1 && idx !== i) return [i, idx]
  }
}

// method-2: 采用break跳出循环
const findTwoSumIndex2 = (arr, target) => {
  const idxArr = [];
  for (let i = 0; i < arr.length; i++) {
    const idx = arr.findIndex(item => item + arr[i] === target)
    if (idx > -1 && idx !== i) {
      idxArr.push(i, idx); // 直接pish两个值，然后break跳出循环
      break;
    }
  }
  return idxArr;
}

// method-3: for循环 + Map数据结构
const findTwoSumIndex3 = (arr, target) => {
  const numMap = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (numMap.has(complement) && numMap.get(complement) !== i) {
      return [numMap.get(complement), i];
    }
    numMap.set(arr[i], i);
  }
}

// method-4: while循环 + Map数据结构
const findTwoSumIndex4 = (arr, target) => {
  const numMap = new Map();
 let i = 0;
while (i < arr.length) {
  const complement = target - arr[i];
  if (numMap.has(complement) && numMap.get(complement) !== i) {
    return [numMap.get(complement), i];
  } else {
    numMap.set(arr[i], i);
    i++;   // while不能自增，要自己写
  }
}
}

// result
console.log('RESULT:', findTwoSumIndex4(arr, target))
