document.addEventListener('DOMContentLoaded', () => {
  const adicionarFuncionarioForm = document.getElementById('adicionarFuncionarioForm');
  const listaFuncionarios = document.getElementById('listaFuncionarios');

  // Load existing employees from localStorage
  function carregarFuncionarios() {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    listaFuncionarios.innerHTML = '';
    funcionarios.forEach((funcionario, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${funcionario.login}</td>
        <td>${funcionario.tipo}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removerFuncionario(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      listaFuncionarios.appendChild(tr);
    });
  }

  window.removerFuncionario = function(index) {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    funcionarios.splice(index, 1);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    carregarFuncionarios();
  }

  adicionarFuncionarioForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(adicionarFuncionarioForm);
    const data = Object.fromEntries(formData.entries());
    
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    
    // Check if login already exists
    const loginExists = funcionarios.some(f => f.login === data.login);
    if (loginExists) {
      alert('Este nome de usuário já existe. Escolha outro.');
      return;
    }

    const funcionario = {
      login: data.login,
      senha: data.senha,
      tipo: data.tipo
    };

    funcionarios.push(funcionario);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    carregarFuncionarios();
    adicionarFuncionarioForm.reset();
  });

  // Initial load
  carregarFuncionarios();
});