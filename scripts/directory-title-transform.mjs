export function directoryTitleTransform() {
  return {
    name: 'suzuran-directory-title-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      let next = code;
      if (!next.includes("import './directory-mobile.css';")) {
        next = next.replace("import './newspaper.css';", "import './newspaper.css';\nimport './directory-mobile.css';");
      }
      const target = '<h3>{item.taskTitle}</h3>';
      if (next.includes(target)) {
        next = next.replace(target, '<h3>{item.directoryTitle||item.taskTitle}</h3>');
      }
      return next===code?null:{code:next,map:null};
    }
  };
}
