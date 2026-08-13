# DesignPatterns — English

> [Default README](README.md) | [Türkçe](README_TR.md) | [MIT License](LICENSE)

An independently authored, executable catalogue of 247 design-pattern records.
It covers GoF, PoEAA, Enterprise Integration Patterns, Microservices.io, Azure
Cloud Design Patterns, the complete POSA Volume 1 catalogue, and selected DDD, architecture,
and concurrency patterns.

## Languages and architecture

- C# contains detailed .NET 10 examples for the foundational 38 patterns.
- Python, JavaScript, TypeScript, and C++20 parse the shared manifest and
  execute a concern-specific contract for every record.
- [`src/shared/pattern-catalog.tsv`](src/shared/pattern-catalog.tsv) is the
  single source of truth for pattern identity, source catalogue, family, and
  executable concern.

The latest addition is POSA Volume 2's Wrapper Facade pattern: a focused
connection API hides low-level socket setup from its caller.

## Verify

Requires .NET SDK 10, Python 3 and Node.js 24 or later. A C++20 compiler is
optional locally and is validated in GitHub Actions.

```powershell
./scripts/verify-all.ps1
```

## Interactive web explorer

[`web/index.html`](web/index.html) is a dependency-free, bilingual explorer for
all 247 records. Search or filter the cards, switch between English and
Turkish, then select **Run learning scenario** to display the input, computed
result, and a short three-step data-flow explanation. The browser model is a
small teaching simulation of each record's executable concern, not a production
runtime.

```powershell
./scripts/serve-web.ps1
```

Open <http://localhost:8080/web/> while the server is running.

## Contributing

Add one independently authored pattern at a time: update the manifest, add an
executable contract in each supported language, update both language READMEs,
run verification, and publish one focused commit.

## License

This public repository is licensed under the [MIT License](LICENSE).
