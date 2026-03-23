/* ===== ESTADO DA CALCULADORA ===== */
let display = document.getElementById('display');
let expressao = '';
let temaAtual = localStorage.getItem('tema') || 'light';

/* ===== INICIALIZAÇÃO ===== */
document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  criarBotaoTema();
  atualizarDisplay();
});

/* ===== GERENCIAMENTO DE TEMA ===== */
function inicializarTema() {
  const html = document.documentElement;

  // Se preferência está em localStorage, usar; senão verificar preferência do sistema
  if (temaAtual === 'dark') {
    html.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark');
  } else {
    html.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark');
  }
}

function alternarTema() {
  temaAtual = temaAtual === 'light' ? 'dark' : 'light';
  localStorage.setItem('tema', temaAtual);
  inicializarTema();
}

function criarBotaoTema() {
  const container = document.querySelector('.container');

  // Verificar se botão já existe
  if (document.querySelector('.theme-toggle')) return;

  const botaoTema = document.createElement('button');
  botaoTema.className = 'theme-toggle';
  botaoTema.innerHTML = temaAtual === 'dark'
    ? '☀️ Light Mode'
    : '🌙 Dark Mode';

  botaoTema.addEventListener('click', () => {
    alternarTema();
    botaoTema.innerHTML = temaAtual === 'dark'
      ? '☀️ Light Mode'
      : '🌙 Dark Mode';
  });

  container.insertBefore(botaoTema, container.firstChild);
}

function adicionarNumero(numero) {
    expressao += numero;
    atualizarDisplay();
}

function adicionarOperador(operador) {
    if (expressao && !['/', '*', '-', '+'].includes(expressao[expressao.length - 1])) {
        expressao += operador;
        atualizarDisplay();
    }
}

function adicionarPonto() {
    const ultimoOperador = Math.max(
        expressao.lastIndexOf('+'),
        expressao.lastIndexOf('-'),
        expressao.lastIndexOf('*'),
        expressao.lastIndexOf('/')
    );
    
    const numeroAtual = expressao.substring(ultimoOperador + 1);
    
    if (numeroAtual && !numeroAtual.includes('.')) {
        expressao += '.';
        atualizarDisplay();
    }
}

function removerUltimo() {
    expressao = expressao.slice(0, -1);
    atualizarDisplay();
}

function limpar() {
    expressao = '';
    atualizarDisplay();
}

function calcular() {
    try {
        // Substitui os símbolos para cálculo
        let expressaoCalculo = expressao.replace(/−/g, '-');
        let resultado = eval(expressaoCalculo);
        
        // Formata o resultado com até 10 casas decimais
        resultado = Math.round(resultado * 10000000000) / 10000000000;
        
        expressao = resultado.toString();
        atualizarDisplay();
    } catch (erro) {
        display.value = 'Erro';
        expressao = '';
    }
}

function atualizarDisplay() {
    display.value = expressao || '0';
}

// Inicializa o display
atualizarDisplay();

// Adiciona suporte ao teclado
document.addEventListener('keydown', (evento) => {
    const tecla = evento.key;

    if (tecla >= '0' && tecla <= '9') {
        adicionarNumero(tecla);
    } else if (tecla === '.' || tecla === ',') {
        adicionarPonto();
    } else if (tecla === '+' || tecla === '-' || tecla === '*' || tecla === '/') {
        adicionarOperador(tecla);
    } else if (tecla === 'Enter' || tecla === '=') {
        evento.preventDefault();
        calcular();
    } else if (tecla === 'Backspace') {
        evento.preventDefault();
        removerUltimo();
    } else if (tecla.toLowerCase() === 'c') {
        limpar();
    }
});

// ===== SUPORTE A TOUCH =====
// Touch feedback para melhor UX em mobile
document.addEventListener('touchend', (evento) => {
    if (evento.target.classList.contains('btn')) {
        evento.target.blur();
    }
});