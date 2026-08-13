# DesignPatterns

An independently authored, executable catalogue of 242 design-pattern records.
It covers the complete GoF, PoEAA, Enterprise Integration Patterns,
Microservices.io and Azure Cloud Design Patterns catalogues, plus a documented
set of common DDD, architecture and concurrency patterns. The examples are
small learning references, not copy-paste production templates.

## Coverage boundary

| Catalogue | Coverage |
| --- | --- |
| Gang of Four | All 23 creational, structural and behavioral patterns |
| PoEAA | Complete enterprise application pattern catalogue |
| Enterprise Integration Patterns | 65 messaging and integration-style patterns |
| Microservices.io | Complete listed microservice pattern language |
| Azure Cloud Design Patterns | Complete listed cloud pattern catalogue |
| Supplemental | 19 common DDD, architecture and concurrency patterns |

## Languages

| Language | Location | Form |
| --- | --- | --- |
| C# | `src/DesignPatterns.Catalog/` | Detailed .NET 10 examples for the foundational 38 patterns |
| Python | `src/python/catalog.py` | Standard-library contracts for all 242 records |
| JavaScript | `src/javascript/catalog.js` | Node.js contracts for all 242 records |
| TypeScript | `src/typescript/catalog.ts` | Strictly typed contracts for all 242 records |
| C++ | `src/cpp/catalog.cpp` | C++20 contracts for all 242 records |

The single source of truth is
[`src/shared/pattern-catalog.tsv`](src/shared/pattern-catalog.tsv). Every record
declares its source catalogues, family and an executable concern contract. The
C# catalogue holds detailed object-oriented examples for the original 38; the
other four language catalogues parse and exercise every manifest record in
their native idiom.

There is no universal closed list of every design pattern. The research scope
and extension rule are documented in
[PATTERN_CATALOG_SCOPE.md](docs/PATTERN_CATALOG_SCOPE.md).

## Verification

Prerequisites: .NET SDK 10, Python 3 and Node.js 24 or later. For C++ coverage
also install a C++20 compiler (`g++` or `clang++`). The TypeScript catalogue is
executed by Node's native type stripping; install `tsc` additionally when a
static type check is required.

```powershell
./scripts/verify-all.ps1
```

The script validates the 38 C# examples and all 242 Python, JavaScript and
TypeScript contracts. It compiles and runs C++ when a compiler is available;
otherwise it emits an explicit warning. If `tsc` is available, the script also
runs a strict static type check. To validate only the C# catalogue, run
`./scripts/verify-dotnet.ps1`.

## Source and license boundary

Third-party educational source trees that may remain in the local folder are
not part of this publication set. Every file under `src/` is independently
authored for this project.
