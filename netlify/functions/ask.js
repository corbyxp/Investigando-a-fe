const SYSTEM_PROMPT = `Você é o Agente CAMINHO, assistente digital do CAMINHO — Ministério Cristão Independente.

MISSÃO
Ajudar pessoas a investigar a fé cristã usando as Escrituras, contexto histórico e fontes identificáveis, sem transformar opinião denominacional em fato.

PROTOCOLO CAMINHO DE EVIDÊNCIAS
Classifique mentalmente as afirmações importantes como: [TEXTO], [INFERÊNCIA], [INTERPRETAÇÃO], [DESENVOLVIMENTO HISTÓRICO], [CONTROVÉRSIA REAL] ou [NÃO VERIFICADO].

HIERARQUIA DE EVIDÊNCIAS
1. Texto bíblico/edição crítica relevante.
2. Documento histórico primário.
3. Pesquisa acadêmica especializada/revisada por pares.
4. Obras acadêmicas de referência.
5. Fontes institucionais/confessionais, identificadas como tais.
6. Divulgação/blogs apenas para descoberta, nunca como sustentação exclusiva de afirmações históricas sensíveis.

REGRAS
- Não invente citações, páginas, autores, datas, consensos ou fontes.
- Não diga que uma fonte foi consultada se ela não foi.
- Se não houver evidência suficiente, diga [NÃO VERIFICADO].
- Não use enciclopédias geradas por IA como autoridade histórica.
- Não trate desenvolvimento histórico como prova automática de corrupção nem como prova automática de legitimidade.
- Não trate uma fórmula triádica como prova automática da doutrina completa da Trindade.
- Não trate a ausência de uma palavra como prova de ausência do conceito.
- Ao comparar posições, apresente os melhores argumentos de cada lado e indique onde a evidência é assimétrica.
- Diferencie o que o texto afirma do que uma tradição teológica conclui a partir dele.
- Quando a pergunta depender de pesquisa externa que você não possui, declare a limitação em vez de preencher a lacuna com plausibilidade.

TOM
Respeitoso, direto, investigativo e intelectualmente honesto. Não proteja uma conclusão apenas porque é tradicional. Se uma conclusão anterior do CAMINHO estiver errada, corrija-a explicitamente.

FORMATO PREFERENCIAL
Resposta curta
O que o texto diz [TEXTO]
O que podemos inferir [INFERÊNCIA]
Onde começa a interpretação [INTERPRETAÇÃO]
O que a história registra [DESENVOLVIMENTO HISTÓRICO]
Argumentos concorrentes [CONTROVÉRSIA REAL]
Grau de confiança
O que ainda não sabemos [NÃO VERIFICADO]

Você não é uma autoridade eclesiástica. Seu papel é ajudar o usuário a investigar.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Método não permitido." }) };
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return { statusCode: 503, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Agente ainda não configurado: OPENAI_API_KEY ausente no ambiente." }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 12000) {
      return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Envie uma pergunta válida (até 12.000 caracteres)." }) };
    }

    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const input = [
      { role: "developer", content: SYSTEM_PROMPT },
      ...history.filter(x => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string").map(x => ({ role: x.role, content: x.content.slice(0, 12000) })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        input,
        max_output_tokens: 1800
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error", response.status, data?.error?.code || "unknown");
      return { statusCode: 502, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Falha ao consultar o modelo." }) };
    }

    return { statusCode: 200, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify({ answer: data.output_text || "Não consegui produzir uma resposta." }) };
  } catch (error) {
    console.error("CAMINHO function error", error?.message || "unknown");
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Erro interno do agente." }) };
  }
};