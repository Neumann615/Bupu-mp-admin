import {Flex} from "antd"
import React, {useState} from 'react'
import MonacoEditor from 'react-monaco-editor'
import "monaco-editor/esm/vs/basic-languages/monaco.contribution"
import {Markdown} from "@/components"
import {useThemeStore} from "@/store";
import {createStyles} from "antd-style"

const useStyles = createStyles(({token, css}) => ({
    markdown: css`
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: ${token.paddingMD}px;
      gap: ${token.paddingMD}px;
    `
}))

export default () => {
    const {styles, theme} = useStyles()
    const themeStore = useThemeStore()
    const [code, setCode] = useState("# react\n" +
        "\n" +
        "## 请说一下对 react 的理解\n" +
        "\n" +
        "- react 是什么？react 是一个用来构建界面的 js 库\n" +
        "- 能干什么？通过组件化的方式 构建快速响应的大型 web 应用程序\n" +
        "\n" +
        "- 如何干的？声明式渲染\n" +
        "\n" +
        "  声明式：告诉程序我们想要什么效果，其他交给程序来做\n" +
        "\n" +
        "  命令式：命令我们程序去做什么，程序就会跟着你的命令一步一步执行\n" +
        "\n" +
        "```js\n" +
        "// 声明式\n" +
        "let root = document.getElementById(\"root\");\n" +
        "ReactDom.render(\n" +
        "  <h1\n" +
        "    onClick={() => {\n" +
        "      console.log(\"hello\");\n" +
        "    }}\n" +
        "  >\n" +
        "    hello\n" +
        "  </h1>\n" +
        ");\n" +
        "\n" +
        "//命令式\n" +
        "let h1 = document.createElement(\"h1\");\n" +
        "h1.innerHTML = \"hello\";\n" +
        "h1.addEventListener(\"click\", () => {\n" +
        "  console.log(\"hello\");\n" +
        "});\n" +
        "```\n" +
        "\n" +
        "组件化：把页面拆分成一个个组件，方便拆分和复用，做到高内聚和低耦合\n" +
        "\n" +
        "一次学习随处编写\n" +
        "\n" +
        "可以用 react 开发 web，android，ISO，vr 和命令程序\n" +
        "\n" +
        "reactNative 使用 react 来创建 Android 和 ios 的原生应用\n" +
        "\n" +
        "react360 创建 3d 和 vr 用户交互的框架\n" +
        "\n" +
        "优缺点\n" +
        "优点：开发团队强大，一次学习随处编写，api 简洁\n" +
        "缺点：过于灵活，没有系统的解决方案，选型成本高\n" +
        "\n" +
        "其他扩展\n" +
        "JSX 实现声明式\n" +
        "虚拟 dom 实现跨平台\n" +
        "react 使用的设计模式，数据结构\n" +
        "\n" +
        "## 为什么 react 会引入 jsx\n" +
        "\n" +
        "- jsx是React.createElement的语法糖，只要是为了实现声明式，提升可读性。\n" +
        "不想引入新的概念\n" +
        "\n" +
        "- 工作原理：抽象语法树，以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构，比如\n" +
        "var ast = \"is tree\";通过树形结构表示出来，先分词，进行分类\n" +
        "\n" +
        "- babel的工作流程\n" +
        "源代码先经过词法分析变成一个token流，经过语法分析变成一个AST语法树，经过转化转成新的语法树重新生成源代码\n" +
        "\n" +
        "## react ref的理解，应用场景\n" +
        "- 理解：refs，允许我们访问dom节点或者组件实例\n" +
        "\n" +
        "- 使用：1.传入对象，react.createRef()方法创建对象，通过current属性获取对应元素\n" +
        "       2.回调函数，这个函数会传入一个元素电箱，使用时，直接拿到之前保存的元素对象\n" +
        "       3.传入hook，通过useRef的方式船舰，通过current属性获取对应元素\n" +
        "\n" +
        "- 场景：一把不推荐用refs来更新组件，会使dom结构暴露，违反组件封装的原则。一般用来对dom元素的焦点控制，内容选择，内容设置，媒体播放\n" +
        "```js\n" +
        "class RefExample extends React.Component{\n" +
        "  constructor(props){\n" +
        "    super(props);\n" +
        "    this.func = this.func.bind(this)\n" +
        "  }\n" +
        "  func(){\n" +
        "    this.dom.style.color = 'green'\n" +
        "  }\n" +
        "  render(){\n" +
        "    return (\n" +
        "      /* 回调函数中的参数为当前绑定的DOM对象，点击触发事件将按键字体颜色改为绿色，就是你头上的那个绿色 */\n" +
        "      <button ref={(dom)=>{this.dom = dom}} onClick={this.func}>Click me!</button>\n" +
        "    )\n" +
        "  }\n" +
        "}\n" +
        "ReactDOM.render(<RefExample/>,document.getElementById('root'))\n" +
        "\n" +
        "\n" +
        "class RefExample extends React.Component{\n" +
        "  constructor(props){\n" +
        "    super(props);\n" +
        "    this.func = this.func.bind(this)\n" +
        "    // 1、创建ref对象\n" +
        "    this.myRef = React.createRef();\n" +
        "  }\n" +
        "  func(){\n" +
        "    // 3、获取元素并修改属性\n" +
        "    this.myRef.style.color = 'green'\n" +
        "  }\n" +
        "  render(){\n" +
        "    return (\n" +
        "      // 2、将ref对象挂载到dom元素上\n" +
        "      <button ref={this.myRef} onClick={this.func}>Click me!</button>\n" +
        "    )\n" +
        "  }\n" +
        "}\n" +
        "ReactDOM.render(<RefExample/>,document.getElementById('root'))\n" +
        "```\n" +
        "\n" +
        "## 受控组件和非受控组件\n" +
        "- 受控组件：由react空值输入表单元素而改变其值的方式，例如input,textarea,select\n" +
        "\n" +
        "- 非受控组件：表单数据由DOM本身处理，不受setState()的控制，例如input输入即显示最新值（使用ref从DOM获取表单值）\n" +
        "\n" +
        "\n" +
        "## React中常用的hooks的用法\n" +
        "解决的问题：\n" +
        "- this指向的问题，每次生命函数需要手动的去绑定this，代码不够简洁\n" +
        "- 代码复杂，难以组织，例如componentDidMount和componentWillUnmount写法分散，容易遗漏忘记卸载事件\n" +
        "- 组件之间状态复用困难，类组件中的状态都是通过state定义在组件内部没办法抽离\n" +
        "\n" +
        "1. useState：用来解决函数组件中不能定义自己状态的问题,和useState一样是异步执行的，不是立马生效的，若想每次拿到最新的数据使用useEffect\n" +
        "2. useEffect：\n" +
        "若一个函数中定义了多个useEffect，他们的执行顺序是按照代码中的先后顺序来的\n" +
        "```js\n" +
        "useEffect(()=>{\n" +
        "  //组件挂载和更新之后执行的代码\n" +
        " return () => {} //组件即将被卸载前使用的代码\n" +
        "},[dep1,dep2]);// 依赖数组，若不穿每次渲染都会执行，若传空数组只有第一次会执行\n" +
        "```\n" +
        "\n" +
        "3. useLayoutEffect\n" +
        "传递的参数和useEffect完全相同，唯一的区别在于使用useEffect时页面会出现闪烁，应为useEffect是在页面渲染完成之后再去更新数据的，useLayoutEffect没有闪烁，是在页面还没有渲染时就把数据更新了，useLayoutEffect可能会阻塞渲染\n" +
        "4. useMemo:是为了减少组件重新渲染时不必要的函数计算，用作性能优化\n" +
        "传入两个参数，第一个参数为函数，用来进行一些计算，第二个参数是依赖关系，只有在第一个参数发生变化时，才会重新执行计算函数进行计算，如果不穿依赖项，每次组件渲染都会重新进行计算\n" +
        "```js\n" +
        "const memoizedValue = useMemo(() => {return res},[a,b]) //计算逻辑\n" +
        "```\n" +
        "5. useCallback和useMemo相似，useMemo是把值返回，useCallback是把计算函数返回\n" +
        "```js\n" +
        "const memoizedValue = useCallback(() => {desomething(a,b)},[a,b]) //计算逻辑\n" +
        "```\n" +
        "\n" +
        "6. React.memo():当父组件发生改变时，默认状态下，他的子组件也会重新渲染，当某些子组件不需要更新时也会强制更新，为了避免这种情况可以使用React.memo()\n" +
        "和类组件中的shouldCompoonentUpdate和PureComponent来避免子组件做不必要的渲染\n" +
        "React.memo和PureComponent类似，但是只适用于函数组件，默认情况下仅对props进行一个浅比较来决定要不要更新，复杂情况下支持自己手写对比的逻辑（如果props的传参是基本数据类型他会自动比较，如果是对象需要手写对比逻辑）\n" +
        "```js\n" +
        "function Demo(props){\n" +
        "\n" +
        "}\n" +
        "function compare(preProps,nextProps) {\n" +
        "  //自己手写对比逻辑，返回true更新，false跳过更新\n" +
        "}\n" +
        "export default React.memo(Demo,compare)\n" +
        "```\n" +
        "\n" +
        "7. useRef:可以帮助我们获取dom和react组件实例，和类组件中的React.createRef()相似，修改.current的值不会触发组件的重新渲染\n" +
        "\n" +
        "8. forwardRef用法，可以在父组件中操作子组件的ref对象，并且将ref对象作为一个参数传递，可以在父组件中去操作子组件的dom元素\n" +
        "\n" +
        "```js\n" +
        "// 代码示例\n" +
        "import { useRef, forwardRef } from 'react';\n" +
        "\n" +
        "function Child(props, ref) {\n" +
        "    return (\n" +
        "        <input ref={ref} />\n" +
        "    );\n" +
        "}\n" +
        "\n" +
        "function Demo() {\n" +
        "    const childRef = useRef();\n" +
        "\n" +
        "    const onFocus = () => {\n" +
        "        childRef.current.focus();\n" +
        "    }\n" +
        "\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <Child ref={childRef} />\n" +
        "            <button onClick={onFocus}>focus</button>\n" +
        "        </div>\n" +
        "    );\n" +
        "}\n" +
        "\n" +
        "Child = forwardRef(Child);\n" +
        "\n" +
        "export default Demo;\n" +
        "```\n" +
        "9. useImperativeHandle：在父组件中去使用子组件定义的函数和状态\n" +
        "- 在父组件中使用useRef创建Ref引用变量\n" +
        "- 使用forwardRef将创建的ref引用传递子组件中去\n" +
        "- 将子组件中的函数和状态通过useImperativeHandle挂在到传递的ref对象上\n" +
        "代码示例\n" +
        "```js\n" +
        "// 代码示例\n" +
        "import { forwardRef, useState, useImperativeHandle, useRef } from 'react';\n" +
        "\n" +
        "function Child(props, ref) {\n" +
        "    const [count, setCount] = useState(0);\n" +
        "\n" +
        "    useImperativeHandle(ref, () => {\n" +
        "        return {\n" +
        "            addCount: () => {\n" +
        "                setCount(count + 1);\n" +
        "            },\n" +
        "            value: 2\n" +
        "        }\n" +
        "    });\n" +
        "\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <p>{`count: ${count}`}</p>\n" +
        "        </div>\n" +
        "    );\n" +
        "}\n" +
        "\n" +
        "Child = forwardRef(Child);\n" +
        "\n" +
        "function Demo() {\n" +
        "    const childRef = useRef();\n" +
        "\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <Child ref={childRef} />\n" +
        "            <button onClick={() => {\n" +
        "             \t// 调用子组件的addCount方法和获取子组件的value值\n" +
        "                childRef.current.addCount();\n" +
        "                console.log(childRef.current.value);\n" +
        "            }}>add</button>\n" +
        "\n" +
        "        </div>\n" +
        "    );\n" +
        "}\n" +
        "\n" +
        "\n" +
        "export default Demo;\n" +
        "```\n" +
        "10. useContext\n" +
        "全局状态共享\n" +
        "代码示例\n" +
        "```js\n" +
        "import React, { useContext } from 'react'\n" +
        "import UserContext from './context';\n" +
        "\n" +
        "// const UserContext = React.createContext();\n" +
        "\n" +
        "function Demo() {\n" +
        "\t// 如果React.createContext没有指定默认值，也可以在对应子组件上套上UserContext.Provider来指定值\n" +
        "    return (\n" +
        "        // <UserContext.Provider value={{ name: '张三' }}>\n" +
        "            <Child />\n" +
        "        // </UserContext.Provider>\n" +
        "    )\n" +
        "}\n" +
        "\n" +
        "\n" +
        "\n" +
        "function Child() {\n" +
        "\n" +
        "    const user = useContext(UserContext);\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <p>{`name: ${user.name}`}</p>\n" +
        "        </div>\n" +
        "    )\n" +
        "}\n" +
        "\n" +
        "export default Demo;\n" +
        "```\n" +
        "11. useReducer：实现更复杂的状态管理逻辑\n" +
        "```js\n" +
        "// 代码示例\n" +
        "import React, { useReducer } from 'react'\n" +
        "\n" +
        "// 1.需要有一个 reducer 函数，第一个参数为之前的状态，第二个参数为行为信息\n" +
        "function reducer(state, action) {\n" +
        "    switch (action) {\n" +
        "        case 'add':\n" +
        "            return state + 1;\n" +
        "        case 'minus':\n" +
        "            return state - 1;\n" +
        "        default:\n" +
        "            return 0;\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "\n" +
        "\n" +
        "function Demo() {\n" +
        "\n" +
        "    // 2.引入useReducer，第一个参数时上面定义的reducer，第二个参数时初始值\n" +
        "    // 3.返回为一个数组，第一项为状态值，第二项为一个 dispatch 函数，用来修改状态值\n" +
        "    const [count, dispatch] = useReducer(reducer, 0);\n" +
        "    return (\n" +
        "        <div>\n" +
        "            <button onClick={() => { dispatch('add') }} >add</button>\n" +
        "            <button onClick={() => { dispatch('minus') }} >minus</button>\n" +
        "            <button onClick={() => { dispatch('unknown') }} >unknown</button>\n" +
        "            <p>{`count: ${count}`}</p>\n" +
        "        </div>\n" +
        "    );\n" +
        "}\n")

    return <Flex className={styles["markdown"]}>
        <MonacoEditor
            width="50%"
            height="100%"
            language={"markdown"}
            value={code}
            theme={themeStore.darkMode ? "vs-dark" : ""}
            onChange={setCode}
            options={{}}
        />
        <div style={{width: "50%", height: "100%", backgroundColor: theme.colorBgBase}}>
            <Markdown text={code}></Markdown>
        </div>

    </Flex>
}
