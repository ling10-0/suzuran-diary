export function guidedMapLabelTransform() {
  return {
    name: 'suzuran-guided-map-label-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/main.jsx')) return null;
      let next = code;

      if (!next.includes("import './guided-map-labels.css';")) {
        next = next.replace(
          "import './reading-gate.css';",
          "import './reading-gate.css';\nimport './guided-map-labels.css';",
        );
      }

      next = next.replace(
        "   if(point.kind==='day')marker.bindTooltip(point.historic||point.name,{permanent:true,direction:'top',offset:[0,-35],className:'historic-tooltip'});",
        "   marker.bindTooltip(point.kind==='guide'?point.name:(point.historic||point.name),{permanent:true,direction:point.kind==='guide'?'right':'top',offset:point.kind==='guide'?[22,-18]:[0,-35],className:point.kind==='guide'?'guided-tour-tooltip':'historic-tooltip'});",
      );

      return next === code ? null : {code: next, map: null};
    },
  };
}
