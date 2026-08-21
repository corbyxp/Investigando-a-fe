# CAMINHO — Investigando a Fé

> Não queremos construir uma nova placa. Queremos seguir o Caminho e convidar outros a caminhar com Jesus.

Projeto do **CAMINHO — Ministério Cristão Independente** para publicar a série **Investigando a Fé** e, progressivamente, transformar o material em uma experiência digital de investigação bíblica.

## Estado atual

- Site estático inicial: `index.html`
- Estudo 01 publicado no repositório: `estudos/estudo-01.html`
- Protocolo editorial: `CAMINHO.md`
- Especificação inicial do agente: `AGENTE-CAMINHO.md`

## Arquitetura planejada

```text
Conteúdo → Evidências → Auditoria → Agente → Interface web → Publicação
```

A camada de conteúdo não deve depender do modelo de IA. O agente deve consultar material versionado e respeitar o protocolo de evidências. Assim, uma resposta gerada pode ser revisada, reproduzida e corrigida.

## Próximas etapas

1. Estruturar os estudos em dados versionáveis.
2. Criar uma biblioteca de fontes e níveis de evidência.
3. Implementar o agente CAMINHO em ambiente seguro, sem segredo no repositório.
4. Criar API para perguntas e respostas.
5. Integrar a interface pública.
6. Executar testes adversariais de alucinação, viés e citação.
7. Publicar uma versão beta.

## Segurança

**Nunca coloque uma chave de API neste repositório.** Use variáveis de ambiente/segredos do ambiente de execução. Chaves que tenham sido expostas em conversa, código, logs ou commits devem ser revogadas e substituídas.
