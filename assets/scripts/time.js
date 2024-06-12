function exibirDataHora() {
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
}

window.onload = function () {
  exibirDataHora();
};
