function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)

  return dom
}

const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

// reconciliation update and delete node
function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  // So we need to save a reference to that “last fiber tree we committed to the DOM” 
  // after we finish the commit. We call it currentRoot.
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom

  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function render(element, container) {
  // Instead, we’ll keep track of the root of the fiber tree. 
  // We call it the work in progress root or wipRoot.
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // We also add the alternate property to every fiber. This property is a link to the old fiber,
    //  the fiber that we committed to the DOM in the previous commit phase.
    alternate: currentRoot,
  }
  deletions = []
  nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    // ？？？We do it in the commitRoot function. Here we recursively append all the nodes to the dom.
    // 原先是在 performUnitOfWork 中执行的节点添加操作
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  const isFunctionComponent =
    fiber.type instanceof Function
  if (isFunctionComponent) {
    // 打 tag
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }
  if (fiber.child) {
    return fiber.child
  }
  // 确定下一个 work 的 fiber 树
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

// We call it the work in progress root or wipRoot.
let wipFiber = null
// wipRoot 是 wipFiber 的 root
let hookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  // 关于下一行的代码，在 function components 那里有解释
  // 不过没太懂
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    // 一个 index 保证 state 与 setState 一致的原因
    wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

  const actions = oldHook ? oldHook.queue : []
  // action 来自 hook.queue
  // action: c => c+1
  actions.forEach(action => {
    // 此处说明了上一次 c 状态的来源
    hook.state = action(hook.state)
  })

  const setState = action => {
    hook.queue.push(action)
    // root 与 fiber ？？
    console.log(currentRoot)
    wipRoot = {
      // 根本不知道这时候 current 指向了哪
      // 让我 console 一下
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    // 通过这样触发下一轮的 update
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}

// ???? 逻辑是怎样的???
// 最关键的结合是 onClick -》 state -》 update 跑下代码，等下，先溜
function reconcileChildren(wipFiber, elements) {
  let index = 0
  // 各个时候 alternate 的值？？
  // alternate.child 决定 oldFiber ，oldFiber 决定做什么操作
  // 此阶段打 tag 之后在 commit 阶段做 node 操作
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    const sameType =
      oldFiber &&
      element &&
      element.type === oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        // 更新 Fiber
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }
    // 在这里建立 fiber 与 fiber 的关系
    // child parent or sibling
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

const Didact = {
  createElement,
  render,
  useState,
}

/** @jsx Didact.createElement */
// 跑一下代码看看 function com jsx 的与 createElement 的连续
// function Counter() {
//   const [state, setState] = Didact.useState(1)
//   return (
//     <h1 onClick={() => setState(c => c + 1)}>
//       Count: {state}
//     </h1>
//   )
// }
// const element = <Counter />

/** @jsx Didact.createElement */
// 跑一下代码看看 function com jsx 的与 createElement 的连续
// function Counter() {
//   const [state, setState] = Didact.useState(1);
//   return Didact.createElement("h1", {
//     onClick: () => setState(c => c + 1)
//   }, "Count: ", state);
// }

const Child = ({
  count
}) => {
  (function test() {
    console.log(1);
  })();
  // 找调用栈 看 Child 是如何被调用的
  // const children = [fiber.type(fiber.props)]
  const [num, setNum] = Didact.useState(count);
  console.log(2);
  return Didact.createElement("div", {
    onClick: () => setNum(num => num + 1)
  }, 'child  ' + count + num);
};

function App() {
  const [count, setCount] = Didact.useState(2);
  return Didact.createElement("div", null, Didact.createElement("div", {
    onClick: () => setCount(count => count + 1)
  }, "\"click\""), Didact.createElement(Child, {
    count: count
  }));
}

const element = Didact.createElement(App, null);


const container = document.getElementById("root")
Didact.render(element, container)
