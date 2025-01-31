document.addEventListener('DOMContentLoaded', () => {
  const vendasOvosForm = document.getElementById('vendasOvosForm');
  const quantidadeOvos = document.getElementById('quantidadeOvos');
  const valorUnitario = document.getElementById('valorUnitario');
  const valorTotal = document.getElementById('valorTotal');
  const listaVendas = document.getElementById('listaVendas');

  // Calculate total value when quantity or unit price changes
  function calcularValorTotal() {
    const quantidade = parseFloat(quantidadeOvos.value) || 0;
    const unitario = parseFloat(valorUnitario.value) || 0;
    valorTotal.value = (quantidade * unitario).toFixed(2);
  }

  quantidadeOvos.addEventListener('input', calcularValorTotal);
  valorUnitario.addEventListener('input', calcularValorTotal);

  // Load and display sales history
  function carregarVendas() {
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    listaVendas.innerHTML = '';
    vendas.forEach(venda => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${venda.dataVenda}</td>
        <td>${venda.localVenda}</td>
        <td>${venda.quantidadeOvos}</td>
        <td>R$ ${parseFloat(venda.valorTotal).toFixed(2)}</td>
      `;
      listaVendas.appendChild(tr);
    });
  }

  // Handle form submission
  vendasOvosForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(vendasOvosForm);
    const venda = Object.fromEntries(formData.entries());

    // Validate egg inventory
    const totalOvos = parseInt(localStorage.getItem('totalOvos') || '0');
    const ovosVendidos = parseInt(venda.quantidadeOvos);

    if (ovosVendidos > totalOvos) {
      alert(`Erro: Não há ${ovosVendidos} ovos em estoque. Total disponível: ${totalOvos}`);
      return;
    }

    // Subtract eggs from inventory
    const novoTotalOvos = totalOvos - ovosVendidos;
    localStorage.setItem('totalOvos', novoTotalOvos.toString());

    // Save sale
    const vendas = JSON.parse(localStorage.getItem('vendas')) || [];
    vendas.push(venda);
    localStorage.setItem('vendas', JSON.stringify(vendas));

    // Refresh sales list and reset form
    carregarVendas();
    vendasOvosForm.reset();
    valorTotal.value = '';
  });

  // Initial load of sales history
  carregarVendas();
});