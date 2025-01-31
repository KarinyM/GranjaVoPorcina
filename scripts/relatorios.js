document.addEventListener('DOMContentLoaded', () => {
  const galpaoSelect = document.getElementById('galpaoSelect');
  const periodoRelatorio = document.getElementById('periodoRelatorio');
  const gerarRelatorioBtn = document.getElementById('gerarRelatorio');
  const exportarRelatorioBtn = document.getElementById('exportarRelatorio');

  let ovosChart, racaoChart, galinhasChart;

  // Initialize Select2
  $(galpaoSelect).select2();

  function carregarRegistrosDiarios() {
    return JSON.parse(localStorage.getItem('registrosDiarios')) || [];
  }

  function filtrarRegistros(registros, galpoes, periodo) {
    const dataAtual = new Date();
    const hoje = dataAtual.getTime();
    const umaSemana = 7 * 24 * 60 * 60 * 1000;
    const umMes = 30 * 24 * 60 * 60 * 1000;
    const trimestre = 90 * 24 * 60 * 60 * 1000;
    const umAno = 365 * 24 * 60 * 60 * 1000;

    return registros.filter(registro => {
      const registroData = new Date(registro.data).getTime();
      const galpaoValido = galpoes.includes('Todos') || galpoes.includes(registro.galpao);
      
      let periodoValido = false;
      switch(periodo) {
        case 'semanal':
          periodoValido = hoje - registroData <= umaSemana;
          break;
        case 'mensal':
          periodoValido = hoje - registroData <= umMes;
          break;
        case 'trimestral':
          periodoValido = hoje - registroData <= trimestre;
          break;
        case 'anual':
          periodoValido = hoje - registroData <= umAno;
          break;
      }

      return galpaoValido && periodoValido;
    });
  }

  function criarGraficos(registrosFiltrados) {
    const ctx1 = document.getElementById('ovosChart').getContext('2d');
    const ctx2 = document.getElementById('racaoChart').getContext('2d');
    const ctx3 = document.getElementById('galinhasChart').getContext('2d');

    // Destruir gráficos anteriores, se existirem
    if (ovosChart) ovosChart.destroy();
    if (racaoChart) racaoChart.destroy();
    if (galinhasChart) galinhasChart.destroy();

    const labels = registrosFiltrados.map(r => r.data);
    const ovos = registrosFiltrados.map(r => r.ovosColhidos);
    const galinhasMortas = registrosFiltrados.map(r => r.galinhasMortas);

    const racoes = ['Crescimento', 'Pico', 'P1', 'P2'];
    const racaoData = racoes.map(tipoRacao => 
      registrosFiltrados.reduce((total, registro) => 
        total + (registro[`quantidade_${tipoRacao}`] || 0), 0
      )
    );

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: true }
      }
    };

    ovosChart = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ovos Colhidos',
          data: ovos,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: chartOptions
    });

    racaoChart = new Chart(ctx2, {
      type: 'pie',
      data: {
        labels: racoes,
        datasets: [{
          data: racaoData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ]
        }]
      },
      options: chartOptions
    });

    galinhasChart = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Galinhas Mortas',
          data: galinhasMortas,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
        }]
      },
      options: chartOptions
    });
  }

  function exportarParaExcel(registrosFiltrados) {
    const worksheet = XLSX.utils.json_to_sheet(registrosFiltrados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    
    const fileName = `relatorio_${periodoRelatorio.value}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  gerarRelatorioBtn.addEventListener('click', () => {
    const galpoesSelecionados = $(galpaoSelect).val() || [];
    const periodo = periodoRelatorio.value;
    
    const registrosDiarios = carregarRegistrosDiarios();
    const registrosFiltrados = filtrarRegistros(registrosDiarios, galpoesSelecionados, periodo);
    
    criarGraficos(registrosFiltrados);
  });

  exportarRelatorioBtn.addEventListener('click', () => {
    const galpoesSelecionados = $(galpaoSelect).val() || [];
    const periodo = periodoRelatorio.value;
    
    const registrosDiarios = carregarRegistrosDiarios();
    const registrosFiltrados = filtrarRegistros(registrosDiarios, galpoesSelecionados, periodo);
    
    exportarParaExcel(registrosFiltrados);
  });
});