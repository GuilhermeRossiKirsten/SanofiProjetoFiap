const user = JSON.parse(localStorage.getItem("currentUser"));

const nome = user.name.split(" ");

const elements = document.querySelectorAll(".user1");
elements.forEach((element) => {
  element.innerText = nome[0];
});

const dataAtual = new Date();

let periodoDoDia;
const hora = dataAtual.getHours();
if (hora >= 6 && hora < 12) {
  periodoDoDia = "Bom dia";
} else if (hora >= 12 && hora < 18) {
  periodoDoDia = "Boa tarde";
} else {
  periodoDoDia = "Boa noite";
}

document.getElementById("tempo").innerText = periodoDoDia;