/* Lê os dados enviados via GET (query string) e os exibe na página. */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var area = document.getElementById("area-dados");
  var vazio = document.getElementById("sem-dados");
  var titulo = document.getElementById("titulo-confirmacao");
  var corpo = document.getElementById("corpo-tabela");
  if (!area) { return; }

  var rotulos = [
    ["nome", "Nome completo"],
    ["email", "E-mail"],
    ["nascimento", "Data de nascimento"],
    ["telefone", "Telefone"],
    ["estado", "Estado"],
    ["nivel", "Nível de experiência"],
    ["interesses", "Interesses"],
    ["mensagem", "Motivo da inscrição"],
    ["termos", "Regras do clube"]
  ];

  var niveis = { iniciante: "Iniciante", intermediario: "Intermediário", avancado: "Avançado" };
  var interesses = { canto: "Cantos e sons", fotografia: "Fotografia", trilhas: "Trilhas", ciencia: "Ciência cidadã" };

  function formatarData(iso) {
    var p = iso.split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  function formatar(chave) {
    var valores = params.getAll(chave);
    if (valores.length === 0) { return null; }
    switch (chave) {
      case "nascimento": return formatarData(valores[0]);
      case "nivel": return niveis[valores[0]] || valores[0];
      case "interesses": return valores.map(function (v) { return interesses[v] || v; }).join(", ");
      case "termos": return "Aceitas";
      default: return valores[0];
    }
  }

  var encontrados = 0;
  rotulos.forEach(function (par) {
    var valor = formatar(par[0]);
    if (valor === null) { return; }
    encontrados++;
    var linha = document.createElement("tr");
    var th = document.createElement("th");
    th.scope = "row";
    th.textContent = par[1];
    var td = document.createElement("td");
    td.textContent = valor; /* textContent evita injeção de HTML */
    linha.appendChild(th);
    linha.appendChild(td);
    corpo.appendChild(linha);
  });

  if (encontrados === 0) {
    area.hidden = true;
    vazio.hidden = false;
  } else {
    var nome = (params.get("nome") || "").trim().split(/\s+/)[0];
    titulo.textContent = nome ? "Inscrição recebida, " + nome + "!" : "Inscrição recebida!";
    area.hidden = false;
    vazio.hidden = true;
  }
})();
