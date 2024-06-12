

const user = {
    name: "Guilherme Rossi Kirsten",
    id: new Date(),
    email: "teste@teste",
    senha: "teste"
}

const nome = user.name.split(" ");

const elements = document.querySelectorAll(".user");
elements.forEach(element => {
    element.innerText = nome[0]
});