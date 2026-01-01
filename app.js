(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');

  let current = '';

  function updateDisplay(v){
    display.textContent = v || '0';
  }

  function safeEval(expr){
    const cleaned = expr.replace(/×/g,'*').replace(/÷/g,'/');
    if(!/^[0-9+\-*/(). %]+$/.test(cleaned)) throw new Error('Invalid input');
    // Evaluate using Function to keep it simple
    // Percentage handling: replace 'number %' with '(number/100)'
    const pctHandled = cleaned.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
    // eslint-disable-next-line no-new-func
    return Function(`return ${pctHandled}`)();
  }

  function onButtonClick(e){
    const btn = e.currentTarget;
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if(action === 'clear'){
      current = '';
      updateDisplay(current);
      return;
    }
    if(action === 'back'){
      current = current.slice(0,-1);
      updateDisplay(current);
      return;
    }
    if(action === 'neg'){
      if(!current) return;
      // try toggle sign of last number
      current = current.replace(/(\d+\.?\d*)$/,(m)=>`(${ -Number(m) })`);
      updateDisplay(current);
      return;
    }
    if(action === 'percent'){
      current += '%';
      updateDisplay(current);
      return;
    }
    if(action === 'equals'){
      try{
        const result = safeEval(current);
        current = String(result);
        updateDisplay(current);
      }catch(err){
        updateDisplay('Error');
        current = '';
      }
      return;
    }

    // regular value button
    current += val;
    updateDisplay(current);
  }

  buttons.forEach(b=>b.addEventListener('click', onButtonClick));

  // Keyboard support
  window.addEventListener('keydown', (ev) => {
    if(ev.key === 'Enter'){
      ev.preventDefault();
      document.querySelector('[data-action="equals"]').click();
      return;
    }
    if(ev.key === 'Backspace'){
      document.querySelector('[data-action="back"]').click();
      return;
    }
    if(ev.key === 'Escape'){
      document.querySelector('[data-action="clear"]').click();
      return;
    }
    const key = ev.key;
    if(/^[0-9.+\-*/%()]$/.test(key)){
      // map / to ÷ etc not necessary
      current += key;
      updateDisplay(current);
    }
  });

})();
