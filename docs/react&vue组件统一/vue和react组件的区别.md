# vue和react组件的区别

## 组件定义对比

``` vue

<template>
  <button @click="count++">{{count}}</button>
</template>

<script>
  export default {
    data() {
      return {
        count: 0
      }
    },
  }
</script>
```

``` javascript
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## 状态对比

``` vue
data() {
  return {
    user: {name: 'Alice'}
  }
}
this.user.name = 'Bob'
```

```javascript
const [user, setUser] = useState({name: 'Alice'})
setUser({...user, name: 'Bob'})
```

## 生命周期对比

``` vue
crated, mounted, updated, destroyed
```

```javascript
useEffect(() => { // 相当于mounted
  return () => {} // 相当于unmount
}, []]
```

## 样式处理对比

``` vue
<style scoped></style>
```

```javascript
import styles from './App.module.css'
<div className={styles.container}></div>
```

## 路由实现对比

```javascript
// Vue (Vue Router)
const routes = [{ path: '/', component: Home }]
const router = createRouter({ routes })
app.use(router)

// React (React Router v6)
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</BrowserRouter>
```

## 状态管理对比

```javascript
// Vue (Pinia)
export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  actions: { increment() { this.count++ } }
})

// React (Redux Toolkit)
const slice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { increment: state => { state.value++ } }
})
```

## 指令系统对比

```javascript
// Vue特有指令
v-if="show"
v-for="item in list"
v-model="inputValue"

// React等价实现
{show && <div>}
{list.map(item => <div key={item.id}>)}
<input value={inputValue} onChange={e => setInputValue(e.target.value)}/>
```

## 组合式API对比

```javascript
// Vue 3组合式
setup() {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  return { count, double }
}

// React Hooks
function Example() {
  const [count, setCount] = useState(0);
  const double = useMemo(() => count * 2, [count]);
  return [count, double];
}
```

## 性能优化策略对比

```javascript
// Vue 3组合式
computed: { // 自动缓存
  filteredList() { return this.list.filter(...) }
}

// React手动优化
const filteredList = useMemo(() => list.filter(...), [list]);
```

## TypeScript支持对比

```javascript
// Vue 3 + TS
defineComponent({ props: { msg: { type: String, required: true } } })

// React + TS
interface Props { msg: string }
const Component: React.FC<Props> = ({ msg }) => { ... }
```

## 跨端

```javascript
// Vue (Uni-app)
<template>
  <view class="container"></view>
</template>

// React Native
import { View } from 'react-native';
<View style={styles.container}></View>
```

## 事件类型

```javascript
// Vue
<template>
  <button @click.stop="handleClick">Click</button>
</template>

<script>
export default {
  methods: {
    handleClick(e) {
      console.log(e); // 原生DOM事件
    }
  }
}
</script>

// React
function ReactExample() {
  const handleClick = (e) => {
    e.preventDefault(); // 合成事件方法
    console.log(e.nativeEvent); // 访问原生事件
  };
  return <button onClick={handleClick}>Click</button>;
}
```

React的事件特点：

* 跨浏览器兼容的包装器
* 自动事件委托到document，react17以后改为根元素上

Vue的事件特点：

* 直接使用原生DOM事件
* 事件修饰符
* 更接近原生javascript的事件处理方式
