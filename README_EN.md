# DesignPatterns — English

> [Default README](README.md) | [Türkçe](README_TR.md) | [MIT License](LICENSE)

An independently authored, executable catalogue of 245 design-pattern records.
It covers GoF, PoEAA, Enterprise Integration Patterns, Microservices.io, Azure
Cloud Design Patterns, POSA Volume 1 additions, and selected DDD, architecture,
and concurrency patterns.

## Languages and architecture

- C# contains detailed .NET 10 examples for the foundational 38 patterns.
- Python, JavaScript, TypeScript, and C++20 parse the shared manifest and
  execute a concern-specific contract for every record.
- [`src/shared/pattern-catalog.tsv`](src/shared/pattern-catalog.tsv) is the
  single source of truth for pattern identity, source catalogue, family, and
  executable concern.

The latest addition is POSA Volume 1's Client-Dispatcher-Server pattern: a
client requests an operation through a dispatcher, which resolves the server.

## Verify

Requires .NET SDK 10, Python 3 and Node.js 24 or later. A C++20 compiler is
optional locally and is validated in GitHub Actions.

```powershell
./scripts/verify-all.ps1
```

## Contributing

Add one independently authored pattern at a time: update the manifest, add an
executable contract in each supported language, update both language READMEs,
run verification, and publish one focused commit.

## License

This public repository is licensed under the [MIT License](LICENSE).
