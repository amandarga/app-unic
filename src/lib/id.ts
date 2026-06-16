// Gerador de id simples e único o bastante pro uso local (sem dependência extra).
// Combina timestamp (base36) + aleatório — suficiente pra ids de instância.
export function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
