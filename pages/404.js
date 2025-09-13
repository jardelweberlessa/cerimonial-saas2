export default function FourOhFour() {
  return (
    <div style={{padding:24,fontFamily:'system-ui,-apple-system,Segoe UI,Roboto'}}>
      <h1 style={{fontSize:20,marginBottom:8}}>Página não encontrada</h1>
      <p style={{marginBottom:16}}>Atalhos úteis:</p>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <a href="/app" style={{padding:'8px 12px',border:'1px solid #ccc',borderRadius:8,textDecoration:'none'}}>Ir para /app</a>
        <a href="/login" style={{padding:'8px 12px',border:'1px solid #ccc',borderRadius:8,textDecoration:'none'}}>Ir para /login</a>
      </div>
    </div>
  );
}
