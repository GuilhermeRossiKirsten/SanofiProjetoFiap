


const user = JSON.parse(localStorage.getItem("currentUser"));

const nome = user.name.split(" ");

const elements = document.querySelectorAll(".user1");
elements.forEach(element => {
    element.innerText = nome[0]
});
