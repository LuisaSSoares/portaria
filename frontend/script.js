//Função após clicar em "novo veículo"
function novoVeiculo(event, id) {
    event.preventDefault();
    localStorage.setItem('moradorId', id);
    window.location.href = "./veiculo.html"; 
}

const logo = document.getElementById('logo')
logo.addEventListener('click', function() {
    window.location.href = './index.html'
})

// Cadastro Morador
async function cadastrar(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const bloco = document.getElementById('bloco').value;
    const apto = document.getElementById('apartamento').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const tipo = document.querySelector('input[name="tipo"]:checked')?.value;
    const erroEmail = document.getElementById('erroEmail')
    const erroNome = document.getElementById('erroNome')
    const erroBloco = document.getElementById('erroBloco')
    const erroApto = document.getElementById('erroApto')
    const erroTel = document.getElementById('erroTel')
    let temErro = false 

    if (!nome) {
        erroNome.textContent = "⚠️ O campo de nome é obrigatório"
        erroNome.style.display = "block"
        temErro = true
    } else {
        erroNome.textContent = ""
    }

    if (!bloco) {
        erroBloco.textContent = "⚠️ O campo de bloco é obrigatório"
        erroBloco.style.display = "block"
        temErro = true
    } else {
        erroBloco.textContent = ""
    }

    if (!apto) {
        erroApto.textContent = "⚠️ O campo de apartamento é obrigatório"
        erroApto.style.display = "block"
        temErro = true
    } else {
        erroApto.textContent = ""
    }

    if (!telefone) {
        erroTel.textContent = "⚠️ O campo de telefone é obrigatório"
        erroTel.style.display = "block"
        temErro = true
    } else {
        erroTel.textContent = ""
    }
    if (!email) {
        erroEmail.textContent = "⚠️ O campo de email é obrigatório"
        erroEmail.style.display = "block"
        temErro = true
    } else {
        erroEmail.textContent = ""
    }
    
    if (temErro) return

    if (!tipo) {
        alert("Por favor, selecione o tipo de morador.");
        return;
    }

    if (!email.includes("@")) {
        erroEmail.textContent = "Por favor, insira um e-mail válido.";
        erroEmail.style.display = "block";
    }

    const data = { nome, bloco, apto, telefone, email, status: tipo };

    const response = await fetch('http://localhost:3020/user/cadastrar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if (results.success) {
        localStorage.setItem('moradorId', results.moradorId); // salva o id do morador
        window.location.href = './veiculo.html';
    } else {
        alert("Erro ao cadastrar morador.");
    }
}

// Cadastro de Veículo
async function cadastrarV(event) {
    event.preventDefault();
    
    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;
    const box = document.getElementById('vaga').value;
    const erroPlaca = document.getElementById('erroPlaca')
    const erroModelo = document.getElementById('erroModelo')
    const erroCor = document.getElementById('erroCor')
    const erroVaga = document.getElementById('erroVaga')
    let temErro = false 

    if (!placa) {
        erroPlaca.textContent = "⚠️ O campo de placa é obrigatório"
        erroPlaca.style.display = "block"
        temErro = true
    } else {
        erroPlaca.textContent = ""
    }

    if (!modelo) {
        erroModelo.textContent = "⚠️ O campo de modelo é obrigatório"
        erroModelo.style.display = "block"
        temErro = true
    } else {
        erroModelo.textContent = ""
    }

    if (!cor) {
        erroCor.textContent = "⚠️ O campo de cor é obrigatório"
        erroCor.style.display = "block"
        temErro = true
    } else {
        erroCor.textContent = ""
    }

    if (!box) {
        erroVaga.textContent = "⚠️ O campo de vaga é obrigatório"
        erroVaga.style.display = "block"
        temErro = true
    } else {
        erroVaga.textContent = ""
    }
    
    if (temErro) return

    const moradorId = localStorage.getItem('moradorId'); // pega o id do morador salvo

    if (!moradorId) {
        alert("Erro: Morador não encontrado. Cadastre um morador primeiro.");
        return;
    }

    const data = { placa, modelo, cor, box, morador_id: moradorId };

    const response = await fetch('http://localhost:3020/carro/cadastrar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if (results.success) {
        alert("Veículo cadastrado com sucesso!");
        window.location.href = './lista.html';
    }  else {
        alert(results.message); // Mostra o erro geral
    }
}

// Listar Informações
document.addEventListener("DOMContentLoaded", listarMoradoresEVeiculos);

async function listarMoradoresEVeiculos() {
    const tabela = document.getElementById("tabelaPortaria");
    tabela.innerHTML = ""; 

    const response = await fetch("http://localhost:3020/listar");
    const dados = await response.json();

    dados.forEach(item => {
        const row = document.createElement("tr");

        // Criar células com campos editáveis
        const campos = ["nome", "bloco", "apartamento", "telefone", "email", "status", "placa", "modelo", "cor", "box"];
        const inputs = {};

        campos.forEach(campo => {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.value = item[campo];
            input.disabled = true;
            input.dataset.campo = campo;
            inputs[campo] = input;
            cell.appendChild(input);
            row.appendChild(cell);
        });

        // Criar botões de editar e deletar
        const actionsCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.className = "editarBtn";
        editButton.onclick = (event) => editarLinha(event, inputs, item.id, editButton); // EVITA RECARREGAMENTO

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Deletar";
        deleteButton.className = "deletarBtn";
        deleteButton.onclick = (event) => deletarMoradorEVeiculo(event, item.id, row); // EVITA RECARREGAMENTO

        const newVehicle = document.createElement("button")
        newVehicle.textContent = "Novo veículo"
        newVehicle.className = "veiculoBtn"
        newVehicle.onclick = (event) => novoVeiculo(event, item.id);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        actionsCell.appendChild(newVehicle);
        row.appendChild(actionsCell);

        tabela.appendChild(row);
    });
}

function editarLinha(event, inputs, id, botaoEditar) {
    event.preventDefault();

    if (botaoEditar.textContent === "Editar") {
        Object.values(inputs).forEach(input => input.disabled = false);
        botaoEditar.textContent = "Salvar";
    } else {
        const dadosAtualizados = {};
        Object.keys(inputs).forEach(campo => {
            dadosAtualizados[campo] = inputs[campo].value;
        });

        fetch(`http://localhost:3020/atualizar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados)
        }).then(response => response.json()).then(data => {
            if (data.success) {
                Object.values(inputs).forEach(input => input.disabled = true);
                botaoEditar.textContent = "Editar";
            } else {
                alert("Erro ao atualizar os dados.");
            }
        }).catch(error => {
            console.error("Erro na requisição:", error);
        });
    }
}

function deletarMoradorEVeiculo(event, id, row) {
    event.preventDefault();

    if (confirm("Tem certeza que deseja excluir este morador e veículo?")) {
        fetch(`http://localhost:3020/deletar/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                row.remove();
            } else {
                alert("Erro ao excluir.");
            }
        }).catch(error => {
            console.error("Erro ao deletar:", error);
        });
    }
}