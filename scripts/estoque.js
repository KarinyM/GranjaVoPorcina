document.addEventListener('DOMContentLoaded', () => {
  const adicionarRacaoForm = document.getElementById('adicionarRacaoForm');
  const listaEstoqueRacao = document.getElementById('listaEstoqueRacao');
  const totalOvosEstoque = document.getElementById('totalOvosEstoque');

  // Initialize or load inventory from localStorage
  function initializeInventory() {
    const estoqueRacao = JSON.parse(localStorage.getItem('estoqueRacao')) || {
      'Crescimento': 0,
      'Pico': 0,
      'P1': 0,
      'P2': 0
    };
    const totalOvos = parseInt(localStorage.getItem('totalOvos') || '0');

    localStorage.setItem('estoqueRacao', JSON.stringify(estoqueRacao));
    localStorage.setItem('totalOvos', totalOvos.toString());

    atualizarEstoqueRacao();
    atualizarEstoqueOvos();
  }

  function atualizarEstoqueRacao() {
    const estoqueRacao = JSON.parse(localStorage.getItem('estoqueRacao'));
    listaEstoqueRacao.innerHTML = '';

    Object.entries(estoqueRacao).forEach(([tipo, quantidade]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${tipo}</td>
        <td>${quantidade.toFixed(1)}</td>
      `;
      listaEstoqueRacao.appendChild(tr);
    });
  }

  function atualizarEstoqueOvos() {
    const totalOvos = localStorage.getItem('totalOvos');
    totalOvosEstoque.textContent = totalOvos;
  }

  adicionarRacaoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(adicionarRacaoForm);
    const tipoRacao = formData.get('tipoRacao');
    const quantidadeRacao = parseFloat(formData.get('quantidadeRacao'));

    const estoqueRacao = JSON.parse(localStorage.getItem('estoqueRacao'));
    estoqueRacao[tipoRacao] += quantidadeRacao;

    localStorage.setItem('estoqueRacao', JSON.stringify(estoqueRacao));
    atualizarEstoqueRacao();
    adicionarRacaoForm.reset();
  });

  // Expose methods to be used by registro-diario.js
  window.removerRacaoDoEstoque = (tipoRacao, quantidade) => {
    const estoqueRacao = JSON.parse(localStorage.getItem('estoqueRacao'));
    estoqueRacao[tipoRacao] -= quantidade;
    localStorage.setItem('estoqueRacao', JSON.stringify(estoqueRacao));
    atualizarEstoqueRacao();
  };

  window.adicionarOvosAoEstoque = (quantidade) => {
    const totalOvos = parseInt(localStorage.getItem('totalOvos') || '0');
    localStorage.setItem('totalOvos', (totalOvos + quantidade).toString());
    atualizarEstoqueOvos();
  };

  // Initialize inventory on page load
  initializeInventory();
});