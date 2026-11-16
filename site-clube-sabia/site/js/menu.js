/* Menu único: montado a partir de uma só definição e inserido em todas as páginas. */
(function () {
  "use strict";

  var itens = [
    { texto: "Início", arquivo: "index.html" },
    { texto: "Inscrição", arquivo: "form.html" },
    { texto: "Dados recebidos", arquivo: "formAction.html" },
    { texto: "Sobre", arquivo: "about.html" }
  ];

  var paginaAtual = window.location.pathname.split("/").pop() || "index.html";

  var lista = itens.map(function (item) {
    var ativo = item.arquivo === paginaAtual;
    return '<li><a class="menu__link' + (ativo ? " menu__link--ativo" : "") + '" href="' +
      item.arquivo + '"' + (ativo ? ' aria-current="page"' : "") + ">" + item.texto + "</a></li>";
  }).join("");

  var cabecalho = document.getElementById("site-header");
  if (cabecalho) {
    cabecalho.className = "cabecalho";
    cabecalho.innerHTML =
      '<div class="container cabecalho__barra">' +
        '<a class="marca" href="index.html"><img src="img/logo.svg" alt="" width="40" height="40">Clube Sabiá</a>' +
        '<button class="menu__botao" type="button" aria-expanded="false" aria-controls="menu-principal">Menu</button>' +
        '<nav class="menu" id="menu-principal" aria-label="Navegação principal"><ul class="menu__lista">' + lista + "</ul></nav>" +
      "</div>";

    var botao = cabecalho.querySelector(".menu__botao");
    var menu = cabecalho.querySelector(".menu");
    botao.addEventListener("click", function () {
      var aberto = menu.classList.toggle("menu--aberto");
      botao.setAttribute("aria-expanded", String(aberto));
    });
  }

  var ano = document.getElementById("ano-atual");
  if (ano) { ano.textContent = new Date().getFullYear(); }
})();
