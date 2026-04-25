/* ============================================================
   Sócio — JavaScript
   socio.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Estado global ────────────────────────────────────────── */
  let planoSelecionado = null;

  const PLANOS = {
    torcedor:    { nome: 'Sócio-Torcedor',  valor: '50,00' },
    contribuinte:{ nome: 'Contribuinte',    valor: '150,00' },
    patrimonial: { nome: 'Patrimonial',     valor: '500,00' },
  };

  /* ── Elementos ────────────────────────────────────────────── */
  const secaoPlanos      = document.getElementById('secao-planos');
  const secaoForm        = document.getElementById('secao-form');
  const secaoConfirmacao = document.getElementById('secao-confirmacao');
  const formSocio        = document.getElementById('form-socio');
  const planoBadge       = document.getElementById('plano-badge-nome');
  const btnVoltar        = document.getElementById('btn-voltar');

  /* ── Accordion dos cards ──────────────────────────────────── */
  document.querySelectorAll('.plano-accordion__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = body.classList.contains('open');

      body.classList.toggle('open', !isOpen);
      btn.classList.toggle('open', !isOpen);
      btn.querySelector('.toggle-label').textContent = isOpen
        ? 'Ver todos os benefícios'
        : 'Ocultar benefícios';
    });
  });

  /* ── Selecionar plano ─────────────────────────────────────── */
  document.querySelectorAll('.btn-plano').forEach(btn => {
    btn.addEventListener('click', () => {
      planoSelecionado = btn.dataset.plano;
      abrirFormulario(planoSelecionado);
    });
  });

  function abrirFormulario(planoKey) {
    const plano = PLANOS[planoKey];
    planoBadge.textContent = `Plano: ${plano.nome} — R$ ${plano.valor}/mês`;

    secaoPlanos.style.display = 'none';
    secaoForm.classList.add('visible');
    secaoForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Voltar para planos ───────────────────────────────────── */
  btnVoltar.addEventListener('click', () => {
    secaoForm.classList.remove('visible');
    secaoPlanos.style.display = 'block';
    secaoPlanos.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ── Máscara CPF ──────────────────────────────────────────── */
  const inputCPF = document.getElementById('cpf');
  inputCPF.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    e.target.value = v;
  });

  /* ── Máscara Telefone ─────────────────────────────────────── */
  const inputTel = document.getElementById('telefone');
  inputTel.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10)     v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
    e.target.value = v;
  });

  /* ── Busca CEP ────────────────────────────────────────────── */
  const inputCEP = document.getElementById('cep');
  inputCEP.addEventListener('blur', async () => {
    const cep = inputCEP.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        document.getElementById('rua').value    = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro     || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf         || '';
        document.getElementById('numero').focus();
      }
    } catch (_) {}
  });

  /* ── Máscara CEP ──────────────────────────────────────────── */
  inputCEP.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    e.target.value = v;
  });

  /* ── Gera número de sócio único ───────────────────────────── */
  function gerarNumeroSocio() {
    const chars     = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const timestamp = Date.now().toString(36).toUpperCase().slice(-3);
    let parte = '';
    for (let i = 0; i < 4; i++) {
      parte += chars[Math.floor(Math.random() * chars.length)];
    }
    return `UDS-${timestamp}${parte}`;
  }

  /* ── Validação simples ────────────────────────────────────── */
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(cpf[10]);
  }

  function camposObrigatorios() {
    return [
      'nome', 'nascimento', 'cpf', 'rg',
      'telefone', 'email',
      'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado',
      'camisa', 'calcado'
    ];
  }

  /* ── Submit do formulário ─────────────────────────────────── */
  formSocio.addEventListener('submit', e => {
    e.preventDefault();

    let valido = true;

    /* limpa erros anteriores */
    formSocio.querySelectorAll('input, select').forEach(el => {
      el.classList.remove('error');
    });

    /* valida campos obrigatórios */
    camposObrigatorios().forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        if (el) el.classList.add('error');
        valido = false;
      }
    });

    /* valida CPF */
    const cpfEl = document.getElementById('cpf');
    if (cpfEl.value && !validarCPF(cpfEl.value)) {
      cpfEl.classList.add('error');
      valido = false;
    }

    /* valida email */
    const emailEl = document.getElementById('email');
    if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error');
      valido = false;
    }

    if (!valido) {
      const primeiro = formSocio.querySelector('.error');
      if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* tudo ok — gera número e mostra confirmação */
    const numero = gerarNumeroSocio();
    const plano  = PLANOS[planoSelecionado];

    document.getElementById('confirmacao-numero').textContent = numero;
    document.getElementById('confirmacao-plano').textContent  =
      `${plano.nome} — R$ ${plano.valor}/mês`;
    document.getElementById('confirmacao-nome').textContent   =
      document.getElementById('nome').value.split(' ')[0];

    secaoForm.classList.remove('visible');
    secaoConfirmacao.classList.add('visible');
    secaoConfirmacao.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ── Imprimir / Salvar ────────────────────────────────────── */
  document.getElementById('btn-imprimir').addEventListener('click', () => {
    window.print();
  });

})();
