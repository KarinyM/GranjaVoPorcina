document.addEventListener('DOMContentLoaded', () => {
  function atualizarDadosDashboard() {
    const estoqueRacao = JSON.parse(localStorage.getItem('estoqueRacao')) || {};
    const totalOvos = localStorage.getItem('totalOvos') || '0';

    // Update stock information
    document.getElementById('totalOvosEstoque').textContent = totalOvos;
    document.getElementById('racaoCrescimentoEstoque').textContent = estoqueRacao['Crescimento']?.toFixed(1) || '0';
    document.getElementById('racaoPicoEstoque').textContent = estoqueRacao['Pico']?.toFixed(1) || '0';
    document.getElementById('racaoP1Estoque').textContent = estoqueRacao['P1']?.toFixed(1) || '0';
    document.getElementById('racaoP2Estoque').textContent = estoqueRacao['P2']?.toFixed(1) || '0';

    // TODO: Implement daily tracking for more accurate statistics
    document.getElementById('ovosColhidosHoje').textContent = '0';
    document.getElementById('galinhasMortasHoje').textContent = '0';
    document.getElementById('racaoConsumidaHoje').textContent = '0';
  }

  // Atualiza dados iniciais
  atualizarDadosDashboard();

  // Atualiza dados periodicamente
  setInterval(atualizarDadosDashboard, 5 * 60 * 1000);
});