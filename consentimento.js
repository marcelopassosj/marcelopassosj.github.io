/* Consentimento de cookies + Google Analytics 4 (Consent Mode, modo básico).
   Nada do Google é carregado antes do aceite: o gtag.js só entra na página quando a pessoa clica em "Aceitar"
   (ou já tinha aceitado antes). A escolha fica em localStorage ('consentimento-analytics' = 'aceito' | 'recusado').
   Cores: usa as variáveis de cada página (--papel-2, --tinta, --pedra, --acento, --linha) ou as sobrescritas
   --cc-fundo, --cc-tinta, --cc-apoio, --cc-acento, --cc-acento-txt, --cc-linha. Um botão/link com [data-cookies]
   reabre o aviso para a pessoa mudar a escolha. */
(function () {
  var GA_ID = 'G-WE7LX92542'; // ← código de medição da propriedade GA4 do portfólio
  var CHAVE = 'consentimento-analytics';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  var carregado = false;
  function ativar() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (carregado || !/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
    carregado = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  function desativar() {
    gtag('consent', 'update', { analytics_storage: 'denied' });
    // apaga os cookies _ga* que o Analytics tenha criado neste domínio
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (/^_ga/.test(nome)) {
        var h = location.hostname;
        document.cookie = nome + '=; Max-Age=0; path=/';
        document.cookie = nome + '=; Max-Age=0; path=/; domain=' + h;
        document.cookie = nome + '=; Max-Age=0; path=/; domain=.' + h.replace(/^www\./, '');
      }
    });
  }

  var css = '' +
    '.cc{position:fixed;z-index:2147483000;left:max(16px,env(safe-area-inset-left));bottom:max(16px,env(safe-area-inset-bottom));' +
    'width:min(400px,calc(100vw - 32px));padding:18px 18px 16px;border-radius:14px;' +
    'background:var(--cc-fundo,var(--papel-2,#191917));color:var(--cc-tinta,var(--tinta,#F4F4F0));' +
    'border:1px solid var(--cc-linha,var(--linha,rgba(244,244,240,.14)));box-shadow:0 24px 48px -20px rgba(0,0,0,.55);' +
    'font-family:inherit;font-size:14px;line-height:1.5;animation:cc-entra .35s cubic-bezier(.2,.8,.2,1)}' +
    '.cc[hidden]{display:none}@keyframes cc-entra{from{opacity:0;transform:translateY(12px)}}' +
    '.cc p{margin:0;font-size:14px;line-height:1.5}.cc p strong{display:block;font-weight:700;font-size:15px;margin-bottom:4px}' +
    '.cc p span{color:var(--cc-apoio,var(--pedra,#A8A8A0))}' +
    '.cc-botoes{display:flex;gap:8px;margin-top:14px}' +
    '.cc button{flex:1;min-height:44px;padding:10px 16px;border-radius:10px;font:inherit;font-weight:700;font-size:14px;cursor:pointer;border:1px solid transparent}' +
    '.cc .cc-sim{background:var(--cc-acento,var(--acento,#C8F54A));color:var(--cc-acento-txt,#0F0F0E)}' +
    '.cc .cc-nao{background:transparent;color:inherit;border-color:var(--cc-linha,var(--linha,rgba(244,244,240,.14)))}' +
    '.cc button:hover{filter:brightness(1.06)}.cc .cc-nao:hover{border-color:currentColor}' +
    '.cc button:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '[data-cookies]{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}' +
    '@media (prefers-reduced-motion:reduce){.cc{animation:none}}';

  var caixa;
  function montar() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    caixa = document.createElement('div');
    caixa.className = 'cc'; caixa.hidden = true;
    caixa.setAttribute('role', 'region'); caixa.setAttribute('aria-label', 'Aviso de cookies');
    caixa.innerHTML = '<p><strong>Posso medir esta visita?</strong><span>Uso cookies do Google Analytics para contar as visitas e saber de que cidade elas vêm. Nada é medido sem o seu aceite.</span></p>' +
      '<div class="cc-botoes"><button type="button" class="cc-nao">Recusar</button><button type="button" class="cc-sim">Aceitar</button></div>';
    document.body.appendChild(caixa);
    caixa.querySelector('.cc-sim').addEventListener('click', function () { gravar('aceito'); ativar(); fechar(); });
    caixa.querySelector('.cc-nao').addEventListener('click', function () { gravar('recusado'); desativar(); fechar(); });
    document.addEventListener('click', function (e) {
      var alvo = e.target.closest && e.target.closest('[data-cookies]');
      if (alvo) { e.preventDefault(); abrir(); }
    });
  }
  function abrir() {
    caixa.hidden = false;
  }
  function fechar() { caixa.hidden = true; }

  var escolha = ler();
  if (escolha === 'aceito') ativar();
  function iniciar() { montar(); if (escolha !== 'aceito' && escolha !== 'recusado') setTimeout(abrir, 600); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
