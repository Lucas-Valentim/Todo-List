let todoItens = []

//--------------------
// FUNCTIONS
//--------------------
//Metodo para adicionar o item do TODO no array acima
function addTodo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now()
    };

    todoItens.push(todo);
    renderTodo(todo);
    console.log('Lista de tarefas', todo)
}

//Marca a tarefa como concluída
function toggleDone(key) {
    //Buscando o índice da tarefa dentro do array de tarefas de acordo como key recebido
    const index = todoItens.findIndex(function (item) {
        return item.id === Number(key)
    })

    todoItens[index].checked = !todoItens[index].checked;
    renderTodo(todoItens[index])
}

function deleteTodo(key) {
    //Buscando o índice da tarefa dentro do array de tarefas de acordo como key recebido
    const index = todoItens.findIndex(function (item) {
        return item.id === Number(key)
    })

    const todo = {
        deleted: true,
        ...todoItens[index]
    }

    todoItens = todoItens.filter(item => item.id != Number(key))

    renderTodo(todo)
}

//FUNÇÃO QUE RENDERIZA OS TODO'S NA TELA
function renderTodo(todo) {
    //Salva a lista no localStorage
    localStorage.setItem('todoItens', JSON.stringify(todoItens))

    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key='${todo.id}']`) //Valida se já existe esse campo renderizado. Se existir vai tirar da tela para ficar somente uma tarefa renderizada

    const listIten = document.createElement('li');

    const isChecked = todo.checked ? 'done' : '';

    if (todo.deleted) {
        item.remove();
        return;
    }

    listIten.setAttribute('class', `todo-item ${isChecked}`)
    listIten.setAttribute('data-key', `${todo.id}`)

    listIten.innerHTML = `
        <input id="${todo.id}" type="checkbox" />
        <label for="${todo.id}" class="tick js-tick"></label>
        <span>${todo.text}</span>
        <button class="delete-todo js-delete-todo">
            <svg><use href="#delete-icon"></use></svg>
        </button>
    `;

    if (item) { //Valida se existe um item já renderizado com o mesmo id
        list.replaceChild(listIten, item)
    } else {
        list.append(listIten);
    }
}


//--------------------
// DEFININDO EVENTOS
//--------------------

//Buscar elemento form do DOM
const form = document.querySelector('.js-form');

form.addEventListener('submit', e => {
    e.preventDefault();

    const input = document.querySelector('.js-todo-input');

    const text = input.value.trim();

    if (text !== '') {
        addTodo(text);
        input.value = '';
        input.focus();
    }
})

//MARCAR TAREFA COMO CONCLUÍDA
//Selecionar lista de tarefas
const list = document.querySelector('.js-todo-list');

list.addEventListener('click', e => {
    //Pegar o click no checkbox (label)
    if (e.target.classList.contains('js-tick')) {
        //todo: buscar o data customizavel e chamar a funcao que marca a tarefa como concluída
        const itemKey = e.target.parentElement.dataset.key; //Obter o valor do data set data-key
        toggleDone(itemKey);
    }
    //Pegar o click no botao de excluir
    else if (e.target.classList.contains('js-delete-todo')) {
        //todo: buscar o data customizavel e chamar a funcao que marca a tarefa como concluída
        const itemKey = e.target.parentElement.dataset.key; //Obter o valor do data set data-key
        deleteTodo(itemKey);
    }
})

//Carrega os itens salvos no localStorage
document.addEventListener('DOMContentLoaded', () => {
    const lista = localStorage.getItem('todoItens');

    if (lista) {
        todoItens = JSON.parse(lista);
        todoItens.forEach(todo => {
            renderTodo(todo)
        });
    }
})