// Recebe a hora como parâmetro para ser fácil de testar: obterSaudacao(20) => 'Boa noite'
export function obterSaudacao(hora = new Date().getHours()) {
  if (hora >= 5 && hora < 12) return 'Bom dia';
  if (hora >= 12 && hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

// 'João Ferreira' => 'João'
export function primeiroNome(nomeCompleto: string) {
  return nomeCompleto.trim().split(/\s+/)[0];
}

// 'João Ferreira' => 'JO'
export function duasPrimeirasLetras(nomeCompleto: string) {
  return nomeCompleto.trim().slice(0, 2).toUpperCase();
}
