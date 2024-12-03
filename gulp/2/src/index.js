function myDecorator(target, propertyKey, descriptor) {
  console.log(`Decorator applied to ${propertyKey} on ${target.constructor.name}`);
  // 你可以在这里修改 descriptor 或执行其他逻辑
  return descriptor;
}

class MyClass {
  @myDecorator
  myMethod() {
    console.log('My method is called!');
  }
}

const instance = new MyClass();
instance.myMethod();