# DesignPatterns — Türkçe

> [Varsayılan README](README.md) | [English](README_EN.md) | [MIT Lisansı](LICENSE)

GoF, PoEAA, Enterprise Integration Patterns, Microservices.io, Azure Cloud
Design Patterns, POSA Volume 1 ekleri ve seçilmiş DDD, mimari ve eşzamanlılık
desenlerini kapsayan; özgün olarak yazılmış, çalıştırılabilir 245 kayıtlı
katalogdur.

## Diller ve mimari

- C#, temel 38 desen için ayrıntılı .NET 10 örneklerini içerir.
- Python, JavaScript, TypeScript ve C++20; ortak manifesti ayrıştırır ve her
  kayıt için concern-odaklı bir sözleşme çalıştırır.
- [`src/shared/pattern-catalog.tsv`](src/shared/pattern-catalog.tsv), desen
  kimliği, kaynak kataloğu, ailesi ve çalıştırılabilir concern için tek doğruluk
  kaynağıdır.

En son eklenen POSA Volume 1 Client-Dispatcher-Server desenidir: istemci bir
işlemi dispatcher üzerinden ister, dispatcher uygun sunucuyu çözer.

## Doğrulama

.NET SDK 10, Python 3 ve Node.js 24 veya sonrası gerekir. C++20 derleyicisi
yerelde isteğe bağlıdır; GitHub Actions üzerinde doğrulanır.

```powershell
./scripts/verify-all.ps1
```

## Katkı

Her seferinde tek özgün desen eklenir: manifest güncellenir, desteklenen her
dilde çalıştırılabilir sözleşme eklenir, iki dilde README birlikte güncellenir,
doğrulama çalıştırılır ve tek odaklı commit yayınlanır.

## Lisans

Bu public depo [MIT Lisansı](LICENSE) ile lisanslanmıştır.
