/* Swiss Design · 可變字體：游標附近嘅字即時由 900 變到 120（Inter Tight 可變字體 wght 軸） */
(() => {
  const D = window.DEEP; if (!D || !D.ok) return;
  const h1 = D.$('.hero h1'); if (!h1) return;
  D.font('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100..900&display=swap');
  D.css(`.hero h1{font-family:"Inter Tight",Inter,"Helvetica Neue",sans-serif!important;font-weight:900;letter-spacing:-.01em!important}`);
  const lines = D.$$('.ln', h1);
  if (!D.$$('.ch', h1).length && window.SplitText) SplitText.create(lines.length ? lines : h1, { type: 'chars', charsClass: 'ch' });
  D.proximity(h1, { near: 120, far: 900, radius: 300 });
  if (D.fine) D.hint('↔ 將滑鼠移過個大標題 —— 字重跟距離即時變化', D.$('.hero .actions'));
})();
