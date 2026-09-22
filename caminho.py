import subprocess
import sys
from pathlib import Path

PASTA = Path(__file__).resolve().parent

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def executar(comando):
    print("> " + " ".join(comando))
    r = subprocess.run(comando, cwd=PASTA, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        print("ERRO: codigo " + str(r.returncode))
        sys.exit(r.returncode)

print("=" * 60)
print("CAMINHO - ATUALIZADOR")
print("=" * 60)

r = subprocess.run(["git", "status", "--short"], cwd=PASTA, text=True, encoding="utf-8", errors="replace", capture_output=True)

if not r.stdout.strip():
    print("Nenhuma alteracao para enviar.")
    sys.exit(0)

print(r.stdout)
print("Adicionando arquivos...")
executar(["git", "add", "."])
print("Criando commit...")
executar(["git", "commit", "-m", "Atualizar site CAMINHO"])
print("Enviando para GitHub...")
executar(["git", "push"])

print("=" * 60)
print("ATUALIZACAO CONCLUIDA.")
print("=" * 60)
