function desc(target, name) {
  console.log('---------------类属性装饰器的参数 start------------------');
  console.log('target', target, target?.constructor); // 表示类的原型
  console.log('name', name); // 表示被装饰属性名
  console.log('---------------类属性装饰器的参数 end------------------');
}

class Person {
  public name: string | undefined;
  public age: number | 0;

  @desc
  private gender: string | undefined;

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

let p = new Person('哈哈', 20);
console.log(p);
