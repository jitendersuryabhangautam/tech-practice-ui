export const reactData = [
  {
    category: "React Hooks",
    topics: [
      {
        id: "usestate",
        title: "useState",
        description:
          "Manages component state in functional components. Returns current state and a function to update it.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        example: `// With object state
const [user, setUser] = useState({ name: '', age: 0 });

// Update using previous state
setCount(prevCount => prevCount + 1);

// Multiple states
const [name, setName] = useState('');
const [age, setAge] = useState(0);`,
        useCase:
          "Managing local component state, form inputs, toggles, counters",
      },
      {
        id: "useeffect",
        title: "useEffect",
        description:
          "Performs side effects in functional components. Runs after render and can cleanup on unmount.",
        code: `import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
    
    // Cleanup function
    return () => {
      console.log('Cleanup');
    };
  }, []); // Empty array = run once on mount
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}`,
        example: `// Run on every render
useEffect(() => {
  console.log('Runs after every render');
});

// Run when dependencies change
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// Cleanup subscriptions
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);`,
        useCase:
          "API calls, subscriptions, timers, DOM manipulation, event listeners",
      },
      {
        id: "usememo",
        title: "useMemo",
        description:
          "Memoizes expensive computations. Only recomputes when dependencies change.",
        code: `import { useMemo, useState } from 'react';

function ExpensiveComponent({ items }) {
  const [count, setCount] = useState(0);
  
  const expensiveCalc = useMemo(() => {
    console.log('Computing...');
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]); // Only recalc when items change
  
  return (
    <div>
      <p>Total: {expensiveCalc}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Inc</button>
    </div>
  );
}`,
        example: `const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);`,
        useCase:
          "Performance optimization, expensive calculations, filtering/sorting large arrays",
      },
      {
        id: "usecallback",
        title: "useCallback",
        description:
          "Memoizes function references. Prevents unnecessary re-renders of child components.",
        code: `import { useCallback, useState } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  
  const handleClick = useCallback(() => {
    console.log('Clicked with count:', count);
  }, [count]); // New function only when count changes
  
  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <input 
        value={text} 
        onChange={e => setText(e.target.value)} 
      />
    </div>
  );
}`,
        example: `const memoizedFetch = useCallback(async (id) => {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}, []);

const handleSubmit = useCallback((e) => {
  e.preventDefault();
  submitForm(formData);
}, [formData]);`,
        useCase:
          "Passing callbacks to optimized child components, preventing re-renders, event handlers",
      },
      {
        id: "useref",
        title: "useRef",
        description:
          "Creates a mutable reference that persists across renders. Doesn't trigger re-renders when updated.",
        code: `import { useRef, useEffect } from 'react';

function InputFocus() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}

// Store previous values
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = useRef();
  
  useEffect(() => {
    prevCount.current = count;
  });
  
  return <div>Now: {count}, Before: {prevCount.current}</div>;
}`,
        example: `// Accessing DOM elements
const videoRef = useRef(null);
videoRef.current.play();

// Storing timers
const timerRef = useRef();
timerRef.current = setTimeout(() => {}, 1000);
clearTimeout(timerRef.current);

// Tracking values without re-rendering
const renderCount = useRef(0);
renderCount.current++;`,
        useCase:
          "DOM access, storing mutable values, previous state, timers, animation frames",
      },
      {
        id: "usecontext",
        title: "useContext",
        description:
          "Consumes context values without prop drilling. Accesses data from React Context.",
        code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}`,
        example: `// User context
const { user, logout } = useContext(UserContext);

// Multiple contexts
const theme = useContext(ThemeContext);
const auth = useContext(AuthContext);
const language = useContext(LanguageContext);`,
        useCase: "Theme management, authentication, global state, localization",
      },
    ],
  },
  {
    category: "Component Patterns",
    topics: [
      {
        id: "controlled-components",
        title: "Controlled Components",
        description:
          "Form elements controlled by React state. Single source of truth for input values.",
        code: `function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}`,
        example: `// Checkbox
const [checked, setChecked] = useState(false);
<input 
  type="checkbox" 
  checked={checked}
  onChange={e => setChecked(e.target.checked)}
/>

// Select dropdown
const [option, setOption] = useState('');
<select value={option} onChange={e => setOption(e.target.value)}>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
</select>`,
        useCase:
          "Form validation, input formatting, real-time updates, conditional rendering",
      },
      {
        id: "higher-order-components",
        title: "Higher-Order Components (HOC)",
        description:
          "Functions that take a component and return an enhanced component with additional props or behavior.",
        code: `function withAuth(Component) {
  return function AuthComponent(props) {
    const { user } = useContext(AuthContext);
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} user={user} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);

function withLoading(Component) {
  return function LoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <Spinner />;
    }
    return <Component {...props} />;
  };
}`,
        example: `// Multiple HOCs
const Enhanced = withAuth(withLoading(withTheme(MyComponent)));

// HOC with parameters
function withFetch(url) {
  return function(Component) {
    return function FetchComponent(props) {
      const [data, setData] = useState(null);
      
      useEffect(() => {
        fetch(url).then(r => r.json()).then(setData);
      }, []);
      
      return <Component data={data} {...props} />;
    };
  };
}`,
        useCase:
          "Authentication, authorization, data fetching, adding common behavior",
      },
      {
        id: "render-props",
        title: "Render Props",
        description:
          "Technique for sharing code between components using a prop whose value is a function.",
        code: `function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  
  return render(position);
}

// Usage
<MouseTracker 
  render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
/>`,
        example: `// Data fetcher with render prop
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>

// Toggle component
<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>
      {on ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>`,
        useCase: "Code reuse, flexible rendering, sharing stateful logic",
      },
      {
        id: "compound-components",
        title: "Compound Components",
        description:
          "Components that work together to form a complete UI pattern, sharing implicit state.",
        code: `const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button 
      className={activeTab === id ? 'active' : ''}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
}

// Usage
<Tabs defaultTab="home">
  <TabList>
    <Tab id="home">Home</Tab>
    <Tab id="profile">Profile</Tab>
  </TabList>
  <TabPanel id="home">Home Content</TabPanel>
  <TabPanel id="profile">Profile Content</TabPanel>
</Tabs>`,
        example: `// Accordion
<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2">Content 2</AccordionItem>
</Accordion>

// Dropdown
<Dropdown>
  <DropdownTrigger>Click me</DropdownTrigger>
  <DropdownMenu>
    <DropdownItem>Option 1</DropdownItem>
    <DropdownItem>Option 2</DropdownItem>
  </DropdownMenu>
</Dropdown>`,
        useCase:
          "Complex UI components, flexible component APIs, encapsulating related functionality",
      },
    ],
  },
  {
    category: "Performance Optimization",
    topics: [
      {
        id: "react-memo",
        title: "React.memo",
        description:
          "Higher-order component that memoizes the result. Prevents re-renders when props haven't changed.",
        code: `import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  
  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
});

// With custom comparison
const MyComponent = memo(
  function MyComponent({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);`,
        example: `// List item optimization
const ListItem = memo(({ item }) => (
  <li>{item.name}</li>
));

// With complex props
const UserCard = memo(
  ({ user, onEdit }) => <div>{user.name}</div>,
  (prev, next) => prev.user.id === next.user.id
);`,
        useCase:
          "Optimizing list renders, preventing unnecessary updates, expensive render logic",
      },
      {
        id: "code-splitting",
        title: "Code Splitting & Lazy Loading",
        description:
          "Dynamically import components to reduce initial bundle size and improve load time.",
        code: `import { lazy, Suspense } from 'react';

// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Routes>
  <Route path="/" element={
    <Suspense fallback={<Spinner />}>
      <Home />
    </Suspense>
  } />
</Routes>`,
        example: `// Conditional loading
const AdminPanel = lazy(() => import('./AdminPanel'));

{isAdmin && (
  <Suspense fallback={<Loading />}>
    <AdminPanel />
  </Suspense>
)}

// Multiple lazy components
const [Chart, DataTable] = [
  lazy(() => import('./Chart')),
  lazy(() => import('./DataTable'))
];`,
        useCase:
          "Large applications, route-based splitting, conditional features, modal dialogs",
      },
      {
        id: "virtualization",
        title: "List Virtualization",
        description:
          "Renders only visible items in long lists to improve performance. Uses libraries like react-window or react-virtualized.",
        code: `import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      Item {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}`,
        example: `// Variable size list
<VariableSizeList
  height={600}
  itemCount={1000}
  itemSize={(index) => index % 2 === 0 ? 50 : 75}
>
  {Row}
</VariableSizeList>

// Grid virtualization
<FixedSizeGrid
  columnCount={10}
  columnWidth={100}
  height={600}
  rowCount={1000}
  rowHeight={50}
  width={1000}
>
  {Cell}
</FixedSizeGrid>`,
        useCase:
          "Long lists, infinite scroll, large datasets, tables with thousands of rows",
      },
    ],
  },
];

export const reactQuiz = [
  {
    question: "What is the primary purpose of the useState hook?",
    options: [
      "To fetch data from an API",
      "To manage state in functional components",
      "To create side effects",
      "To optimize performance",
    ],
    correctAnswer: 1,
    explanation:
      "useState is used to add state management to functional components. It returns an array with the current state value and a function to update it.",
  },
  {
    question: "When does useEffect run by default?",
    options: [
      "Only on component mount",
      "Only when dependencies change",
      "After every render (mount and updates)",
      "Before every render",
    ],
    correctAnswer: 2,
    explanation:
      "By default, useEffect runs after every render (both mount and updates). You can control this behavior using the dependency array.",
  },
  {
    question: "What's the main benefit of useMemo?",
    options: [
      "It prevents re-renders",
      "It caches expensive calculation results",
      "It manages component state",
      "It handles side effects",
    ],
    correctAnswer: 1,
    explanation:
      "useMemo memoizes (caches) the result of expensive calculations and only recalculates when dependencies change, improving performance.",
  },
  {
    question: "When should you use useCallback?",
    options: [
      "To cache component state",
      "To prevent child re-renders when passing callbacks as props",
      "To handle API calls",
      "To manage form inputs",
    ],
    correctAnswer: 1,
    explanation:
      "useCallback returns a memoized callback function, preventing unnecessary re-renders of child components that receive the callback as a prop.",
  },
  {
    question: "What does useRef NOT cause when its value changes?",
    options: [
      "Component re-render",
      "Memory leak",
      "Side effects",
      "DOM updates",
    ],
    correctAnswer: 0,
    explanation:
      "Unlike useState, changing useRef.current does NOT trigger a component re-render. It's perfect for storing mutable values that don't need to cause updates.",
  },
  {
    question: "What is the main purpose of React.memo?",
    options: [
      "To cache API responses",
      "To prevent component re-renders when props haven't changed",
      "To manage global state",
      "To handle routing",
    ],
    correctAnswer: 1,
    explanation:
      "React.memo is a higher-order component that memoizes a component and prevents re-renders if props haven't changed, improving performance.",
  },
  {
    question: "What pattern does a Higher-Order Component (HOC) follow?",
    options: [
      "A component that returns JSX",
      "A function that takes a component and returns a new enhanced component",
      "A component that uses hooks",
      "A component that manages global state",
    ],
    correctAnswer: 1,
    explanation:
      "An HOC is a function that takes a component as an argument and returns a new component with additional props or behavior. It's a pattern for reusing component logic.",
  },
  {
    question: "What's the purpose of Code Splitting in React?",
    options: [
      "To split code across multiple files",
      "To lazy load components and reduce initial bundle size",
      "To separate CSS from JavaScript",
      "To create multiple entry points",
    ],
    correctAnswer: 1,
    explanation:
      "Code Splitting with React.lazy and Suspense allows you to load components only when needed, reducing the initial bundle size and improving load times.",
  },
];
