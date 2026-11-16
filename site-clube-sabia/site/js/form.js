/* Validação de todos os campos do formulário de inscrição. */
(function () {
  "use strict";

  var form = document.getElementById("form-inscricao");
  if (!form) { return; }

  var resumo = document.getElementById("resumo-erros");
  var mensagem = form.elements["mensagem"];
  var contador = document.getElementById("contador-mensagem");
  var MAX_MENSAGEM = 300;

  /* Cada regra devolve um texto de erro, ou "" quando o campo é válido. */
  var regras = {
    nome: function () {
      var v = form.elements["nome"].value.trim();
      if (!v) { return "Informe seu nome completo."; }
      if (!/^[A-Za-zÀ-ÿ' ]+$/.test(v)) { return "Use apenas letras e espaços no nome."; }
      if (v.split(/\s+/).length < 2) { return "Digite nome e sobrenome."; }
      if (v.length < 5) { return "O nome está curto demais."; }
      return "";
    },
    email: function () {
      var v = form.elements["email"].value.trim();
      if (!v) { return "Informe seu e-mail."; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return "Digite um e-mail válido, como nome@exemplo.com."; }
      return "";
    },
    nascimento: function () {
      var v = form.elements["nascimento"].value;
      if (!v) { return "Informe sua data de nascimento."; }
      var data = new Date(v + "T00:00:00");
      var hoje = new Date();
      if (isNaN(data.getTime()) || data.getFullYear() < 1900) { return "Data inválida."; }
      if (data > hoje) { return "A data de nascimento não pode estar no futuro."; }
      var idade = hoje.getFullYear() - data.getFullYear();
      var antes = hoje.getMonth() < data.getMonth() ||
        (hoje.getMonth() === data.getMonth() && hoje.getDate() < data.getDate());
      if (antes) { idade--; }
      if (idade < 12) { return "A idade mínima para se inscrever é 12 anos."; }
      return "";
    },
    telefone: function () {
      var digitos = form.elements["telefone"].value.replace(/\D/g, "");
      if (!digitos) { return "Informe seu telefone com DDD."; }
      if (digitos.length < 10 || digitos.length > 11) { return "Digite o DDD e o número (10 ou 11 dígitos)."; }
      return "";
    },
    estado: function () {
      return form.elements["estado"].value ? "" : "Escolha o seu estado.";
    },
    nivel: function () {
      return form.querySelector('input[name="nivel"]:checked') ? "" : "Escolha o seu nível de experiência.";
    },
    interesses: function () {
      return form.querySelector('input[name="interesses"]:checked') ? "" : "Marque pelo menos um interesse.";
    },
    mensagem: function () {
      var v = mensagem.value.trim();
      if (!v) { return "Conte por que você quer participar."; }
      if (v.length < 10) { return "Escreva pelo menos 10 caracteres."; }
      if (v.length > MAX_MENSAGEM) { return "Use no máximo " + MAX_MENSAGEM + " caracteres."; }
      return "";
    },
    termos: function () {
      return form.elements["termos"].checked ? "" : "Aceite as regras do clube para continuar.";
    }
  };

  function campoDe(nome) { return form.querySelector('[data-campo="' + nome + '"]'); }

  function mostrar(nome, erro) {
    var campo = campoDe(nome);
    var saida = campo.querySelector(".campo__erro");
    saida.textContent = erro;
    campo.classList.toggle("campo--erro", erro !== "");
    campo.classList.toggle("campo--ok", erro === "");
    var controles = campo.querySelectorAll("input, select, textarea");
    for (var i = 0; i < controles.length; i++) {
      controles[i].setAttribute("aria-invalid", erro !== "" ? "true" : "false");
    }
    return erro === "";
  }

  function validar(nome) { return mostrar(nome, regras[nome]()); }

  /* Validação em tempo real: ao sair do campo e a cada alteração, depois do primeiro erro. */
  Object.keys(regras).forEach(function (nome) {
    var campo = campoDe(nome);
    var controles = campo.querySelectorAll("input, select, textarea");
    for (var i = 0; i < controles.length; i++) {
      controles[i].addEventListener("blur", function () { validar(nome); });
      var evento = controles[i].type === "checkbox" || controles[i].type === "radio" || controles[i].tagName === "SELECT" ? "change" : "input";
      controles[i].addEventListener(evento, function () {
        if (campo.classList.contains("campo--erro")) { validar(nome); }
      });
    }
  });

  /* Máscara do telefone: (41) 99999-9999 */
  var tel = form.elements["telefone"];
  tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "").slice(0, 11);
    var t = d;
    if (d.length > 10) { t = "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7); }
    else if (d.length > 6) { t = "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6); }
    else if (d.length > 2) { t = "(" + d.slice(0, 2) + ") " + d.slice(2); }
    else if (d.length > 0) { t = "(" + d; }
    tel.value = t;
  });

  /* Contador de caracteres da mensagem */
  function atualizarContador() {
    var n = mensagem.value.length;
    contador.textContent = n + " de " + MAX_MENSAGEM + " caracteres";
    contador.style.color = n > MAX_MENSAGEM ? "var(--cor-erro)" : "";
  }
  mensagem.addEventListener("input", atualizarContador);
  atualizarContador();

  /* Data máxima = hoje */
  var hojeISO = new Date().toISOString().slice(0, 10);
  form.elements["nascimento"].setAttribute("max", hojeISO);

  /* Envio: só segue (método GET para formAction.html) se tudo estiver válido. */
  form.addEventListener("submit", function (evento) {
    var primeiroInvalido = null;
    var qtd = 0;
    Object.keys(regras).forEach(function (nome) {
      if (!validar(nome)) {
        qtd++;
        if (!primeiroInvalido) { primeiroInvalido = nome; }
      }
    });

    if (qtd > 0) {
      evento.preventDefault();
      resumo.hidden = false;
      resumo.textContent = qtd === 1
        ? "Corrija 1 campo antes de enviar."
        : "Corrija " + qtd + " campos antes de enviar.";
      var alvo = campoDe(primeiroInvalido).querySelector("input, select, textarea");
      alvo.focus();
    } else {
      resumo.hidden = true;
    }
  });

  form.addEventListener("reset", function () {
    resumo.hidden = true;
    Object.keys(regras).forEach(function (nome) {
      var campo = campoDe(nome);
      campo.classList.remove("campo--erro", "campo--ok");
      campo.querySelector(".campo__erro").textContent = "";
    });
    setTimeout(atualizarContador, 0);
  });
})();
