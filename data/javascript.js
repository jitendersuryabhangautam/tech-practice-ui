export const javascriptData = [
  {
    category: "Function Techniques",
    topics: [
      {
        id: "debouncing",
        title: "Debouncing",
        description:
          "Debouncing limits the rate at which a function is executed. It delays execution until after a specified time period has elapsed since the last invocation. Imagine typing in a search box - without debouncing, a search request would fire for every keystroke. With debouncing, the search only fires after you've stopped typing for a specified duration (e.g., 300ms).",
        code: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`,
        example: `const searchInput = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

// Only executes after 300ms of no typing
searchInput('hello');`,
        useCase: "Search inputs, window resize events, auto-save features",
      },
      {
        id: "throttling",
        title: "Throttling",
        description:
          "Throttling ensures a function is called at most once in a specified time period, no matter how many times it's triggered. Unlike debouncing (which delays until calm), throttling executes immediately and then enforces a cooldown. Think of it like a rate limiter - if you throttle to 1 second, the function can only run once per second maximum, even if triggered 100 times.",
        code: `function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`,
        example: `const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 1000);

window.addEventListener('scroll', handleScroll);`,
        useCase: "Scroll events, button clicks, API rate limiting",
      },
      {
        id: "currying",
        title: "Currying",
        description:
          "Currying is a functional programming technique that transforms a function with multiple arguments into a sequence of functions, each taking a single argument. It allows you to create specialized versions of functions by partially applying arguments. For example, a function add(a, b, c) becomes curriedAdd(a)(b)(c). This enables powerful function composition and reusability patterns.",
        code: `function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}`,
        example: `const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6`,
        useCase:
          "Function composition, creating specialized functions, event handlers",
      },
    ],
  },
  {
    category: "Array Methods",
    topics: [
      {
        id: "map",
        title: "Array.map()",
        description:
          "Creates a new array with the results of calling a function on every element.",
        code: `const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
// [2, 4, 6, 8]`,
        example: `const users = [{name: 'John', age: 25}, {name: 'Jane', age: 30}];
const names = users.map(user => user.name);
// ['John', 'Jane']`,
        useCase: "Transforming data, extracting properties from objects",
      },
      {
        id: "filter",
        title: "Array.filter()",
        description:
          "Creates a new array with elements that pass a test condition.",
        code: `const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(num => num % 2 === 0);
// [2, 4, 6]`,
        example: `const products = [
  {name: 'Laptop', price: 1000},
  {name: 'Mouse', price: 25}
];
const expensive = products.filter(p => p.price > 50);`,
        useCase: "Filtering lists, searching, removing unwanted items",
      },
      {
        id: "reduce",
        title: "Array.reduce()",
        description:
          "Executes a reducer function on each element, resulting in a single output value.",
        code: `const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
// 10`,
        example: `const cart = [
  {item: 'book', price: 10},
  {item: 'pen', price: 2}
];
const total = cart.reduce((sum, item) => sum + item.price, 0);
// 12`,
        useCase: "Calculating totals, flattening arrays, grouping data",
      },
      {
        id: "find-findindex",
        title: "Array.find() & findIndex()",
        description:
          "find() returns the first element that satisfies the condition. findIndex() returns its index.",
        code: `const users = [
  {id: 1, name: 'John'},
  {id: 2, name: 'Jane'}
];
const user = users.find(u => u.id === 2);
const index = users.findIndex(u => u.id === 2);`,
        example: `const numbers = [5, 12, 8, 130, 44];
const found = numbers.find(n => n > 10); // 12
const foundIndex = numbers.findIndex(n => n > 10); // 1`,
        useCase: "Searching specific items, locating array positions",
      },
    ],
  },
  {
    category: "Object Operations",
    topics: [
      {
        id: "destructuring",
        title: "Object Destructuring",
        description:
          "Extracts properties from objects into distinct variables.",
        code: `const user = {name: 'John', age: 30, email: 'john@example.com'};
const {name, age} = user;

// With renaming
const {name: userName, age: userAge} = user;

// With default values
const {name, country = 'USA'} = user;`,
        example: `function greet({name, age}) {
  console.log(\`Hello \${name}, you are \${age} years old\`);
}
greet({name: 'John', age: 30});`,
        useCase:
          "Function parameters, importing specific exports, extracting API response data",
      },
      {
        id: "spread-rest",
        title: "Spread & Rest Operators",
        description:
          "Spread (...) expands arrays/objects. Rest (...) collects multiple elements.",
        code: `// Spread
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]

const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3}; // {a:1, b:2, c:3}

// Rest
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}`,
        example: `// Merging arrays
const combined = [...array1, ...array2];

// Copying objects
const copy = {...original};

// Function with any number of args
const max = Math.max(...numbers);`,
        useCase: "Cloning objects/arrays, merging data, function arguments",
      },
      {
        id: "object-methods",
        title: "Object.keys/values/entries",
        description: "Methods to iterate over object properties.",
        code: `const user = {name: 'John', age: 30, city: 'NYC'};

Object.keys(user);    // ['name', 'age', 'city']
Object.values(user);  // ['John', 30, 'NYC']
Object.entries(user); // [['name','John'], ['age',30], ['city','NYC']]`,
        example: `const scores = {math: 90, science: 85, history: 88};

Object.entries(scores).forEach(([subject, score]) => {
  console.log(\`\${subject}: \${score}\`);
});

const total = Object.values(scores).reduce((a, b) => a + b);`,
        useCase:
          "Iterating objects, converting to arrays, filtering object properties",
      },
    ],
  },
  {
    category: "Async Programming",
    topics: [
      {
        id: "promises",
        title: "Promises",
        description:
          "Objects representing the eventual completion or failure of an asynchronous operation.",
        code: `const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));`,
        example: `fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
        useCase: "API calls, async operations, handling loading states",
      },
      {
        id: "async-await",
        title: "Async/Await",
        description:
          "Syntactic sugar for working with Promises, making async code look synchronous.",
        code: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
        example: `async function getUserData(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchUserPosts(userId);
  const comments = await fetchUserComments(userId);
  
  return {user, posts, comments};
}`,
        useCase:
          "Cleaner async code, sequential async operations, error handling",
      },
      {
        id: "promise-all",
        title: "Promise.all() & Promise.race()",
        description:
          "Promise.all waits for all promises. Promise.race returns the first settled promise.",
        code: `// Promise.all - waits for all
const results = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);

// Promise.race - first to complete
const fastest = await Promise.race([
  fetch('/api/server1'),
  fetch('/api/server2')
]);`,
        example: `async function loadPageData() {
  try {
    const [users, products, settings] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchSettings()
    ]);
    return {users, products, settings};
  } catch (error) {
    console.error('Failed to load:', error);
  }
}`,
        useCase:
          "Parallel API calls, loading multiple resources, timeout implementations",
      },
    ],
  },
];

export const javascriptQuiz = [
  {
    question: "What is the main difference between debouncing and throttling?",
    options: [
      "Debouncing delays execution until calm, throttling limits execution frequency",
      "Debouncing is faster than throttling",
      "Throttling only works with events, debouncing works with any function",
      "They are the same thing with different names",
    ],
    correctAnswer: 0,
    explanation:
      "Debouncing delays function execution until after a period of inactivity, while throttling ensures the function executes at most once per specified time interval, regardless of how many times it's triggered.",
  },
  {
    question: "What does Array.reduce() return?",
    options: [
      "A new array with transformed elements",
      "A single accumulated value",
      "A boolean indicating if all elements pass a test",
      "The first element that matches a condition",
    ],
    correctAnswer: 1,
    explanation:
      "Array.reduce() executes a reducer function on each array element and returns a single accumulated value. It's commonly used for summing numbers, flattening arrays, or transforming arrays into objects.",
  },
  {
    question: "What is the purpose of the spread operator (...) in JavaScript?",
    options: [
      "It only works with arrays to add elements",
      "It expands iterables (arrays/objects) into individual elements",
      "It's used exclusively for function parameters",
      "It combines multiple arrays into one",
    ],
    correctAnswer: 1,
    explanation:
      "The spread operator (...) expands iterables like arrays or objects into their individual elements. It can be used for copying, merging arrays/objects, passing array elements as function arguments, and more.",
  },
  {
    question: "What is the key advantage of async/await over Promises?",
    options: [
      "It's faster than using .then()",
      "It makes asynchronous code look and behave more like synchronous code",
      "It doesn't require error handling",
      "It can only be used with fetch API",
    ],
    correctAnswer: 1,
    explanation:
      "Async/await is syntactic sugar built on top of Promises that makes asynchronous code easier to write and read. It allows you to write async code that looks synchronous, making it more intuitive and easier to debug.",
  },
  {
    question: "What does Promise.all() do?",
    options: [
      "Executes promises one by one in sequence",
      "Returns the result of the first promise that resolves",
      "Waits for all promises to settle and returns an array of results",
      "Cancels all promises if one fails",
    ],
    correctAnswer: 2,
    explanation:
      "Promise.all() takes an array of promises and returns a single promise that resolves when all input promises have resolved, or rejects if any promise rejects. It's useful for running multiple async operations in parallel.",
  },
  {
    question: "What will Object.entries() return for an object?",
    options: [
      "An array of the object's keys only",
      "An array of the object's values only",
      "An array of [key, value] pairs",
      "A new object with the same properties",
    ],
    correctAnswer: 2,
    explanation:
      "Object.entries() returns an array of [key, value] pairs from the object. This is useful for iterating over objects or converting objects to Maps or other data structures.",
  },
  {
    question: "What is currying primarily used for?",
    options: [
      "Making functions run faster",
      "Creating specialized functions through partial application",
      "Converting synchronous functions to asynchronous",
      "Optimizing memory usage",
    ],
    correctAnswer: 1,
    explanation:
      "Currying is primarily used to create specialized functions by partially applying arguments. It enables function composition, reusability, and allows you to create more specific versions of generic functions.",
  },
  {
    question: "What's the difference between Array.find() and Array.filter()?",
    options: [
      "find() returns the first match, filter() returns all matches",
      "find() is faster than filter()",
      "filter() only works with numbers",
      "They do exactly the same thing",
    ],
    correctAnswer: 0,
    explanation:
      "Array.find() returns the first element that satisfies the condition (or undefined if none found), while Array.filter() returns a new array containing all elements that pass the test. Use find() when you only need one item, filter() when you need all matching items.",
  },
];
