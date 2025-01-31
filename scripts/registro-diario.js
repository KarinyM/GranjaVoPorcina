document.addEventListener('DOMContentLoaded', () => {
  const galpaoButtons = document.querySelectorAll('.galpao-buttons .btn-menu');
  const registroForm = document.getElementById('registroForm');
  const galpaoTitulo = document.getElementById('galpaoTitulo');
  const racaoCheckboxes = document.querySelectorAll('input[name="racoes"]');
  const quantidadeRacaoContainer = document.getElementById('quantidadeRacaoContainer');
  const racaoInputs = document.getElementById('racaoInputs');
  const registroDiarioForm = document.getElementById('registroDiarioForm');

  let selectedGalpao = null;

  galpaoButtons.forEach(button => {
    button.addEventListener('click', () => {
      galpaoButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedGalpao = button.dataset.galpao;
      galpaoTitulo.textContent = `Registro de Dados - Galpão ${selectedGalpao}`;
      registroForm.classList.remove('d-none');
    });
  });

  racaoCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateRacaoInputs();
    });
  });

  function updateRacaoInputs() {
    racaoInputs.innerHTML = '';
    const selectedRacoes = Array.from(document.querySelectorAll('input[name="racoes"]:checked')).map(el => el.value);

    if (selectedRacoes.length > 0) {
      quantidadeRacaoContainer.classList.remove('d-none');
      
      selectedRacoes.forEach(racao => {
        const div = document.createElement('div');
        div.className = 'form-group row mb-2';
        div.innerHTML = `
          <label class="col-sm-4 col-form-label">${racao}</label>
          <div class="col-sm-8">
            <input type="number" step="0.1" min="0" class="form-control" name="quantidade_${racao}" placeholder="Quantidade em kg" required>
          </div>
        `;
        racaoInputs.appendChild(div);
      });
    } else {
      quantidadeRacaoContainer.classList.add('d-none');
    }
  }

  registroDiarioForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(registroDiarioForm);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp and galpão to the data
    data.data = new Date().toISOString();
    data.galpao = `Galpão ${selectedGalpao}`;

    // Store data in daily records
    const registrosDiarios = JSON.parse(localStorage.getItem('registrosDiarios')) || [];
    registrosDiarios.push(data);
    localStorage.setItem('registrosDiarios', JSON.stringify(registrosDiarios));

    // Validate and reduce ração inventory
    const selectedRacoes = Array.from(document.querySelectorAll('input[name="racoes"]:checked')).map(el => el.value);
    selectedRacoes.forEach(racao => {
      const quantidade = parseFloat(data[`quantidade_${racao}`]);
      window.removerRacaoDoEstoque(racao, quantidade);
    });

    // Add eggs to inventory
    const ovosColhidos = parseInt(data.ovosColhidos);
    window.adicionarOvosAoEstoque(ovosColhidos);

    // Reset form and selections
    registroDiarioForm.reset();
    racaoCheckboxes.forEach(cb => cb.checked = false);
    updateRacaoInputs();
    registroForm.classList.add('d-none');
    galpaoButtons.forEach(btn => btn.classList.remove('active'));
  });
});