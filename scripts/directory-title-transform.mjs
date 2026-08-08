export function directoryTitleTransform() {
  return {
    name: 'suzuran-directory-title-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      const target = '<h3>{item.taskTitle}</h3>';
      if (!code.includes(target)) return null;
      const next = code.replace(target, '<h3>{item.directoryTitle||item.taskTitle}</h3>');
      return {code: next, map:null};
    }
  };
}
