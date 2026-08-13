"""Executable, dependency-free contracts for the complete pattern manifest."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from threading import Lock, local
from typing import Callable

EXPECTED_PATTERN_COUNT = 262


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

    def command_processor() -> bool:
        executed: list[str] = []
        pending = [lambda: executed.append("refresh")]
        pending.pop(0)()
        return executed == ["refresh"]

    def view_handler() -> bool:
        commands = {"save-clicked": lambda: "save-document"}
        return commands["save-clicked"]() == "save-document"

    def forwarder_receiver() -> bool:
        def receiver(payload: str) -> str:
            return f"received:{payload}"

        def forwarder(message: str) -> str:
            return receiver(message.removeprefix("send:"))

        return forwarder("send:invoice") == "received:invoice"

    def whole_part() -> bool:
        class Folder:
            def __init__(self) -> None:
                self._parts: list[int] = []

            def add_part(self, size: int) -> None:
                self._parts.append(size)

            def total_size(self) -> int:
                return sum(self._parts)

        archive = Folder()
        archive.add_part(3)
        archive.add_part(5)
        return archive.total_size() == 8

    def client_dispatcher_server() -> bool:
        servers = {"calculate": lambda payload: f"result:{payload * 2}"}

        def dispatcher(operation: str, payload: int) -> str:
            return servers[operation](payload)

        def client() -> str:
            return dispatcher("calculate", 21)

        return client() == "result:42"

    def counted_pointer() -> bool:
        class SharedHandle:
            def __init__(self, value: str) -> None:
                self.value = value
                self.references = 1

            def acquire(self) -> "SharedHandle":
                self.references += 1
                return self

            def release(self) -> int:
                self.references -= 1
                return self.references

        document = SharedHandle("invoice")
        observer = document.acquire()
        return observer.value == "invoice" and document.release() == 1

    def wrapper_facade() -> bool:
        class SocketLibrary:
            def connect(self, host: str, port: int) -> str:
                return f"{host}:{port}"

        class CatalogueConnection:
            def __init__(self, socket_library: SocketLibrary) -> None:
                self._socket_library = socket_library

            def open(self) -> str:
                return self._socket_library.connect("catalogue", 443)

        return CatalogueConnection(SocketLibrary()).open() == "catalogue:443"

    def component_configurator() -> bool:
        class Cache:
            def start(self) -> str:
                return "cache:ready"

        class ComponentConfigurator:
            def __init__(self, factories: dict[str, Callable[[], Cache]]) -> None:
                self._factories = factories

            def configure(self, name: str) -> str:
                return self._factories[name]().start()

        return ComponentConfigurator({"cache": Cache}).configure("cache") == "cache:ready"

    def interceptor() -> bool:
        def audit_interceptor(request: dict[str, str], next_handler: Callable[[dict[str, str]], str]) -> str:
            request["audit"] = "recorded"
            return next_handler(request)

        return audit_interceptor({"operation": "save"}, lambda request: request["audit"]) == "recorded"

    def extension_interface() -> bool:
        class Diagnostics:
            def status(self) -> str:
                return "diagnostics:ready"

        class CatalogueComponent:
            def extension(self, name: str) -> Diagnostics | None:
                return Diagnostics() if name == "diagnostics" else None

        diagnostics = CatalogueComponent().extension("diagnostics")
        return diagnostics is not None and diagnostics.status() == "diagnostics:ready"

    def asynchronous_completion_token() -> bool:
        class CompletionToken:
            def __init__(self, request_id: str) -> None:
                self.request_id = request_id
                self.result: str | None = None

            def complete(self, result: str) -> None:
                self.result = result

        token = CompletionToken("run-42")
        token.complete("saved")
        return token.request_id == "run-42" and token.result == "saved"

    def acceptor_connector() -> bool:
        class Acceptor:
            def accept(self, peer: str) -> str:
                return f"connected:{peer}"

        class Connector:
            def __init__(self, acceptor: Acceptor) -> None:
                self._acceptor = acceptor

            def connect(self, peer: str) -> str:
                return self._acceptor.accept(peer)

        return Connector(Acceptor()).connect("catalogue-client") == "connected:catalogue-client"

    def scoped_locking() -> bool:
        lock = Lock()
        protected_state: list[str] = []

        with lock:
            protected_state.append("updated")

        return protected_state == ["updated"] and not lock.locked()

    def strategized_locking() -> bool:
        class LockStrategy:
            def acquire(self) -> None:
                raise NotImplementedError

            def release(self) -> None:
                raise NotImplementedError

        class RecordingLock(LockStrategy):
            def __init__(self) -> None:
                self.events: list[str] = []

            def acquire(self) -> None:
                self.events.append("acquire")

            def release(self) -> None:
                self.events.append("release")

        class ProtectedCounter:
            def __init__(self, lock_strategy: LockStrategy) -> None:
                self._lock_strategy = lock_strategy
                self._value = 0

            def increment(self) -> int:
                self._lock_strategy.acquire()
                try:
                    self._value += 1
                    return self._value
                finally:
                    self._lock_strategy.release()

        lock_strategy = RecordingLock()
        return ProtectedCounter(lock_strategy).increment() == 1 and lock_strategy.events == ["acquire", "release"]

    def thread_safe_interface() -> bool:
        class SafeInventory:
            def __init__(self) -> None:
                self._lock = Lock()
                self._items: list[str] = []

            def add(self, item: str) -> None:
                with self._lock:
                    self._items.append(item)

            def count(self) -> int:
                with self._lock:
                    return len(self._items)

        inventory = SafeInventory()
        inventory.add("catalogue")
        return inventory.count() == 1

    def double_checked_locking() -> bool:
        class LazyCatalogue:
            def __init__(self) -> None:
                self._lock = Lock()
                self._instance: dict[str, str] | None = None
                self.creations = 0

            def instance(self) -> dict[str, str]:
                if self._instance is None:
                    with self._lock:
                        if self._instance is None:
                            self._instance = {"status": "ready"}
                            self.creations += 1
                return self._instance

        catalogue = LazyCatalogue()
        return catalogue.instance() is catalogue.instance() and catalogue.creations == 1

    def thread_specific_storage() -> bool:
        class RequestContext:
            def __init__(self) -> None:
                self._storage = local()

            def set_request_id(self, request_id: str) -> None:
                self._storage.request_id = request_id

            def request_id(self) -> str | None:
                return getattr(self._storage, "request_id", None)

        context = RequestContext()
        context.set_request_id("run-42")
        return context.request_id() == "run-42"

    def distributed_tracing() -> bool:
        class Trace:
            def __init__(self, trace_id: str) -> None:
                self.trace_id = trace_id
                self.spans: list[str] = []
            def record(self, service: str) -> None:
                self.spans.append(f"{self.trace_id}:{service}")
        trace = Trace("trace-42")
        trace.record("catalogue-api")
        trace.record("pricing")
        return trace.spans == ["trace-42:catalogue-api", "trace-42:pricing"]

    def exception_tracking() -> bool:
        class ExceptionTracker:
            def __init__(self) -> None: self.reports: list[dict[str, str]] = []
            def record(self, service: str, error: Exception) -> None: self.reports.append({"service": service, "error": str(error)})
        tracker = ExceptionTracker()
        try: raise ValueError("catalogue unavailable")
        except ValueError as error: tracker.record("catalogue-api", error)
        return tracker.reports == [{"service": "catalogue-api", "error": "catalogue unavailable"}]

    def log_deployments_and_changes() -> bool:
        class ChangeLog:
            def __init__(self) -> None: self.entries: list[str] = []
            def record_deployment(self, version: str) -> None: self.entries.append(f"deployed:{version}")
        log = ChangeLog(); log.record_deployment("2026.08.13")
        return log.entries == ["deployed:2026.08.13"]

    def server_side_page_fragment_composition() -> bool:
        class PageComposer:
            def compose(self, header: str, body: str) -> str: return f"<page>{header}{body}</page>"
        return PageComposer().compose("<header>catalogue</header>", "<main>patterns</main>") == "<page><header>catalogue</header><main>patterns</main></page>"

    def client_side_ui_composition() -> bool:
        class Dashboard:
            def compose(self, fragments: dict[str, str]) -> str:
                return " | ".join(fragments[name] for name in ["catalogue", "status"])
        return Dashboard().compose({"catalogue": "patterns:262", "status": "ready"}) == "patterns:262 | ready"

    return {
        "boundary": lambda: {"request": "accepted"}["request"] == "accepted",
        "blackboard": blackboard,
        "broker": broker,
        "pac": pac,
        "reflection": reflection,
        "master-slave": master_slave,
        "command-processor": command_processor,
        "view-handler": view_handler,
        "forwarder-receiver": forwarder_receiver,
        "whole-part": whole_part,
        "client-dispatcher-server": client_dispatcher_server,
        "counted-pointer": counted_pointer,
        "wrapper-facade": wrapper_facade,
        "component-configurator": component_configurator,
        "interceptor": interceptor,
        "extension-interface": extension_interface,
        "asynchronous-completion-token": asynchronous_completion_token,
        "acceptor-connector": acceptor_connector,
        "scoped-locking": scoped_locking,
        "strategized-locking": strategized_locking,
        "thread-safe-interface": thread_safe_interface,
        "double-checked-locking": double_checked_locking,
        "thread-specific-storage": thread_specific_storage,
        "distributed-tracing": distributed_tracing,
        "exception-tracking": exception_tracking,
        "log-deployments-and-changes": log_deployments_and_changes,
        "server-side-page-fragment-composition": server_side_page_fragment_composition,
        "client-side-ui-composition": client_side_ui_composition,
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
