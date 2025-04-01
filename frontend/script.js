//Função para listar os moradores e veículos cadastrados cadastrados
async function listarCarros() {
    const response = await fetch ('http://localhost:3020/lista')
    const tabela = document.getElementById('tabelaPortaria')
    const results = await response.json() 
    results.data.forEach(element => {
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>${element.nome}</td> 
        <td>${element.bloco}</td> 
        <td>${element.apartamento}</td> 
        <td>${element.telefone}</td> 
        <td>${element.email}</td> 
        <td>${element.placa}</td> 
        <td>${element.modelo}</td> 
        <td>${element.cor}</td> 
        <td>${element.box}</td> 

        <td>
            <button onclick="excluirCarro('${element.id}')" class='deletarBtn'>Excluir</button>
            <button onclick="editarCarro('${element.id}')" class='editarBtn'>Editar</button>
        </td>
        `
        tabela.appendChild(row)    
    });
}