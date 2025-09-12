import { useEffect, useState } from 'react';

/**
 * Botão de instalação do PWA:
 * - Mostra "Instalar app" quando o navegador dispara beforeinstallprompt (Chromium/Android).
 * - Mostra "Como instalar" como fallback (guia para Chrome desktop e iOS).
 */
export default function InstallButton() {
  const [deferred, setDeferred] = useState(null);
  const [supported, setSupported] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
      setSupported(true);
      setShowHelp(false);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const doInstall = async () => {
    try {
      if (!deferred) {
        setShowHelp(true);
        return;
      }
      deferred.prompt();
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setSupported(false);
    }
  };

  // Se não suportado, oferecemos um guia rápido
  if (!supported) {
    return (
      <div className="flex items-center gap-2">
        <button className="btn" onClick={doInstall}>Instalar app</button>
        {showHelp && (
          <div className="text-xs text-gray-700">
            <b>Como instalar:</b> <br />
            <u>Chrome Desktop</u>: clique no ícone de instalar na barra de endereço (ícone de seta/mais).<br />
            <u>Android (Chrome)</u>: menu ⋮ → <i>Instalar app</i> / <i>Adicionar à tela inicial</i>.<br />
            <u>iPhone/iPad (Safari)</u>: Compartilhar → <i>Adicionar à Tela de Início</i>.
          </div>
        )}
      </div>
    );
  }

  // Suportado: o evento foi disparado e podemos chamar prompt()
  return (
    <button className="btn" onClick={doInstall} title="Instalar o app na tela inicial">
      Instalar app
    </button>
  );
}
