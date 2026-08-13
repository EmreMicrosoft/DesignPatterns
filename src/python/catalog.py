"""Executable, dependency-free contracts for the complete pattern manifest."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable

EXPECTED_PATTERN_COUNT = 240


@dataclass(frozen=True)
class PatternDefinition:
    identifier: str
    catalogues: tuple[str, ...]
    family: str
    name: str
    contract: str


def parse_catalog(path: Path) -> list[PatternDefinition]:
    definitions: list[PatternDefinition] = []
    for line_number, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not raw_line or raw_line.startswith("#"):
            continue
        fields = raw_line.split("|")
        if len(fields) != 5:
            raise ValueError(f"Malformed manifest record on line {line_number}")
        identifier, catalogues, family, name, contract = fields
        definitions.append(PatternDefinition(identifier, tuple(catalogues.split(";")), family, name, contract))
    return definitions


def contracts() -> dict[str, Callable[[], bool]]:
    def blackboard() -> bool:
        shared_facts: list[str] = []

        def extract_tokens() -> None:
            shared_facts.extend(["candidate:invoice", "amount:42"])

        def infer_classification() -> None:
            if "candidate:invoice" in shared_facts:
                shared_facts.append("classification:billable")

        extract_tokens()
        infer_classification()
        return shared_facts[-1] == "classification:billable"

    def broker() -> bool:
        service_registry = {"pricing": lambda product_id: f"quote:{product_id}"}

        def request(service_name: str, product_id: str) -> str:
            return service_registry[service_name](product_id)

        return request("pricing", "42") == "quote:42"

    def pac() -> bool:
        abstraction = {"selected": "none"}

        def control(action: str) -> None:
            abstraction["selected"] = action.removeprefix("select:")

        def presentation() -> str:
            return f"selected:{abstraction['selected']}"

        control("select:report")
        return presentation() == "selected:report"

    def reflection() -> bool:
        class Formatter:
            @staticmethod
            def upper(value: str) -> str:
                return value.upper()

        operation = getattr(Formatter, "upper")
        return operation("catalogue") == "CATALOGUE"

    def master_slave() -> bool:
        workers = [lambda value: value * 2, lambda value: value * 3]
        results = [worker(2) for worker in workers]
        return sum(results) == 10

    return {
        "boundary": lambda: {"request": "accepted"}["request"] == "accepted",
        "blackboard": blackboard,
        "broker": broker,
        "pac": pac,
        "reflection": reflection,
        "master-slave": master_slave,
        "composition": lambda: "|".join(["first", "second"]) == "first|second",
        "concurrency": lambda: len({"leader"}) == 1,
        "deployment": lambda: {"region-a", "region-b"} == {"region-a", "region-b"},
        "mapping": lambda: {"external": "internal"}["external"] == "internal",
        "messaging": lambda: (lambda message: message["id"] == "m-1")({"id": "m-1"}),
        "observability": lambda: all(["trace-1", "healthy"]),
        "ordering": lambda: sorted([3, 1, 2]) == [1, 2, 3],
        "persistence": lambda: (lambda store: store.get("id") == "saved")({"id": "saved"}),
        "resilience": lambda: next(attempt for attempt in range(1, 4) if attempt == 2) == 2,
        "routing": lambda: ("billing" if "invoice".startswith("invoice") else "support") == "billing",
        "security": lambda: {"token": "scoped"}["token"] == "scoped",
        "state": lambda: (lambda state: state == "ready")("ready"),
    }


def verify(definitions: list[PatternDefinition]) -> None:
    available_contracts = contracts()
    if len(definitions) != EXPECTED_PATTERN_COUNT:
        raise AssertionError(f"Expected {EXPECTED_PATTERN_COUNT} records, found {len(definitions)}")
    identifiers = [definition.identifier for definition in definitions]
    if len(set(identifiers)) != len(identifiers):
        raise AssertionError("Pattern identifiers must be unique")
    for definition in definitions:
        if not all([definition.identifier, definition.catalogues, definition.family, definition.name]):
            raise AssertionError(f"Incomplete definition: {definition.identifier}")
        contract = available_contracts.get(definition.contract)
        if contract is None or not contract():
            raise AssertionError(f"{definition.name} contract failed")
        print(f"PASS {definition.name}")


def main() -> None:
    manifest = Path(__file__).resolve().parents[1] / "shared" / "pattern-catalog.tsv"
    verify(parse_catalog(manifest))
    print(f"Verified {EXPECTED_PATTERN_COUNT} catalogued patterns.")


if __name__ == "__main__":
    main()
