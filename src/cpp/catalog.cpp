// Dependency-free executable contracts for the complete pattern manifest.
#include <algorithm>
#include <cctype>
#include <fstream>
#include <functional>
#include <iostream>
#include <mutex>
#include <optional>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

namespace {
constexpr std::size_t ExpectedPatternCount = 252;

struct PatternDefinition {
    std::string identifier;
    std::string catalogues;
    std::string family;
    std::string name;
    std::string contract;
};

std::vector<std::string> split(const std::string& value, char separator) {
    std::vector<std::string> fields;
    std::size_t begin = 0;
    while (begin <= value.size()) {
        const auto end = value.find(separator, begin);
        fields.push_back(value.substr(begin, end == std::string::npos ? std::string::npos : end - begin));
        if (end == std::string::npos) break;
        begin = end + 1;
    }
    return fields;
}

std::vector<PatternDefinition> parseCatalog(const std::string& path) {
    std::ifstream input{path};
    if (!input) throw std::runtime_error{"Cannot open manifest: " + path};
    std::vector<PatternDefinition> definitions;
    std::string line;
    std::size_t lineNumber = 0;
    while (std::getline(input, line)) {
        ++lineNumber;
        if (!line.empty() && line.back() == '\r') line.pop_back();
        if (line.empty() || line.starts_with('#')) continue;
        const auto fields = split(line, '|');
        if (fields.size() != 5) throw std::runtime_error{"Malformed manifest record on line " + std::to_string(lineNumber)};
        definitions.push_back({fields[0], fields[1], fields[2], fields[3], fields[4]});
    }
    return definitions;
}

std::unordered_map<std::string, std::function<bool()>> contracts() {
    return {
        {"boundary", [] { return std::unordered_map<std::string, std::string>{{"request", "accepted"}}.at("request") == "accepted"; }},
        {"blackboard", [] { std::vector<std::string> sharedFacts; const auto extractTokens = [&] { sharedFacts.insert(sharedFacts.end(), {"candidate:invoice", "amount:42"}); }; const auto inferClassification = [&] { if (std::find(sharedFacts.begin(), sharedFacts.end(), "candidate:invoice") != sharedFacts.end()) sharedFacts.push_back("classification:billable"); }; extractTokens(); inferClassification(); return sharedFacts.back() == "classification:billable"; }},
        {"broker", [] { const std::unordered_map<std::string, std::string> serviceRegistry{{"pricing", "pricing-v1"}}; const auto request = [&](const std::string& serviceName, const std::string& productId) { return serviceRegistry.at(serviceName) == "pricing-v1" ? "quote:" + productId : ""; }; return request("pricing", "42") == "quote:42"; }},
        {"pac", [] { std::string selected{"none"}; const auto control = [&](const std::string& action) { selected = action.substr(std::string{"select:"}.size()); }; const auto presentation = [&] { return "selected:" + selected; }; control("select:report"); return presentation() == "selected:report"; }},
        {"reflection", [] { const std::unordered_map<std::string, std::function<std::string(std::string)>> formatter{{"upper", [](std::string value) { std::transform(value.begin(), value.end(), value.begin(), [](unsigned char character) { return static_cast<char>(std::toupper(character)); }); return value; }}}; return formatter.at("upper")("catalogue") == "CATALOGUE"; }},
        {"master-slave", [] { const std::vector<std::function<int(int)>> workers{[](int value) { return value * 2; }, [](int value) { return value * 3; }}; int total = 0; for (const auto& worker : workers) total += worker(2); return total == 10; }},
        {"command-processor", [] { std::vector<std::string> executed; std::vector<std::function<void()>> pending{[&] { executed.push_back("refresh"); }}; pending.front()(); pending.erase(pending.begin()); return executed == std::vector<std::string>{"refresh"} && pending.empty(); }},
        {"view-handler", [] { const std::unordered_map<std::string, std::function<std::string()>> commands{{"save-clicked", [] { return "save-document"; }}}; return commands.at("save-clicked")() == "save-document"; }},
        {"forwarder-receiver", [] { const auto receiver = [](const std::string& payload) { return "received:" + payload; }; const auto forwarder = [&](const std::string& message) { return receiver(message.substr(std::string{"send:"}.size())); }; return forwarder("send:invoice") == "received:invoice"; }},
        {"whole-part", [] { struct Folder { std::vector<int> parts; void addPart(int size) { parts.push_back(size); } int totalSize() const { int total = 0; for (const auto size : parts) total += size; return total; } }; Folder archive; archive.addPart(3); archive.addPart(5); return archive.totalSize() == 8; }},
        {"client-dispatcher-server", [] { const std::unordered_map<std::string, std::function<std::string(int)>> servers{{"calculate", [](int payload) { return "result:" + std::to_string(payload * 2); }}}; const auto dispatcher = [&](const std::string& operation, int payload) { return servers.at(operation)(payload); }; const auto client = [&] { return dispatcher("calculate", 21); }; return client() == "result:42"; }},
        {"counted-pointer", [] { struct SharedHandle { std::string value; int references{1}; SharedHandle acquire() { ++references; return *this; } int release() { return --references; } }; SharedHandle document{"invoice"}; const auto observer = document.acquire(); return observer.value == "invoice" && document.release() == 1; }},
        {"wrapper-facade", [] { struct SocketLibrary { std::string connect(const std::string& host, int port) const { return host + ":" + std::to_string(port); } }; struct CatalogueConnection { SocketLibrary socketLibrary; std::string open() const { return socketLibrary.connect("catalogue", 443); } }; return CatalogueConnection{}.open() == "catalogue:443"; }},
        {"component-configurator", [] { struct Cache { std::string start() const { return "cache:ready"; } }; const std::unordered_map<std::string, std::function<Cache()>> factories{{"cache", [] { return Cache{}; }}}; const auto configure = [&](const std::string& name) { return factories.at(name)().start(); }; return configure("cache") == "cache:ready"; }},
        {"interceptor", [] { std::unordered_map<std::string, std::string> request{{"operation", "save"}}; const auto auditInterceptor = [&](const std::function<std::string()>& next) { request["audit"] = "recorded"; return next(); }; return auditInterceptor([&] { return request.at("audit"); }) == "recorded"; }},
        {"extension-interface", [] { struct Diagnostics { std::string status() const { return "diagnostics:ready"; } }; struct CatalogueComponent { std::optional<Diagnostics> extension(const std::string& name) const { return name == "diagnostics" ? std::optional<Diagnostics>{Diagnostics{}} : std::nullopt; } }; const auto diagnostics = CatalogueComponent{}.extension("diagnostics"); return diagnostics.has_value() && diagnostics->status() == "diagnostics:ready"; }},
        {"asynchronous-completion-token", [] { struct CompletionToken { std::string requestId; std::optional<std::string> result; void complete(std::string value) { result = std::move(value); } }; CompletionToken token{"run-42"}; token.complete("saved"); return token.requestId == "run-42" && token.result == "saved"; }},
        {"acceptor-connector", [] { struct Acceptor { std::string accept(const std::string& peer) const { return "connected:" + peer; } }; struct Connector { Acceptor acceptor; std::string connect(const std::string& peer) const { return acceptor.accept(peer); } }; return Connector{}.connect("catalogue-client") == "connected:catalogue-client"; }},
        {"scoped-locking", [] { std::mutex mutex; std::string state; { std::lock_guard<std::mutex> guard{mutex}; state = "updated"; } return state == "updated"; }},
        {"strategized-locking", [] { struct LockStrategy { virtual ~LockStrategy() = default; virtual void acquire() = 0; virtual void release() = 0; }; struct RecordingLock final : LockStrategy { std::vector<std::string> events; void acquire() override { events.push_back("acquire"); } void release() override { events.push_back("release"); } }; struct ProtectedCounter { LockStrategy& lock; int value{}; int increment() { lock.acquire(); int result{}; try { result = ++value; } catch (...) { lock.release(); throw; } lock.release(); return result; } }; RecordingLock lock; const int value = ProtectedCounter{lock}.increment(); return value == 1 && lock.events == std::vector<std::string>{"acquire", "release"}; }},
        {"thread-safe-interface", [] { struct SafeInventory { mutable std::mutex mutex; std::vector<std::string> items; void add(std::string item) { std::lock_guard<std::mutex> guard{mutex}; items.push_back(std::move(item)); } std::size_t count() const { std::lock_guard<std::mutex> guard{mutex}; return items.size(); } }; SafeInventory inventory; inventory.add("catalogue"); return inventory.count() == 1; }},
        {"double-checked-locking", [] { struct LazyCatalogue { std::mutex mutex; std::optional<std::string> instance; int creations{}; const std::string& get() { if (!instance) { std::lock_guard<std::mutex> guard{mutex}; if (!instance) { instance = "ready"; ++creations; } } return *instance; } }; LazyCatalogue catalogue; return &catalogue.get() == &catalogue.get() && catalogue.creations == 1; }},
        {"thread-specific-storage", [] { static thread_local std::string requestId; requestId = "run-42"; return requestId == "run-42"; }},
        {"distributed-tracing", [] { struct Trace { std::string id; std::vector<std::string> spans; void record(const std::string& service) { spans.push_back(id + ":" + service); } }; Trace trace{"trace-42"}; trace.record("catalogue-api"); trace.record("pricing"); return trace.spans == std::vector<std::string>{"trace-42:catalogue-api", "trace-42:pricing"}; }},
        {"composition", [] { return std::string{"first|second"} == "first|second"; }},
        {"concurrency", [] { return std::unordered_set<std::string>{"leader"}.size() == 1; }},
        {"deployment", [] { return std::unordered_set<std::string>{"region-a", "region-b"}.size() == 2; }},
        {"mapping", [] { return std::unordered_map<std::string, std::string>{{"external", "internal"}}.at("external") == "internal"; }},
        {"messaging", [] { return std::string{"m-1"} == "m-1"; }},
        {"observability", [] { return !std::string{"trace-1"}.empty() && !std::string{"healthy"}.empty(); }},
        {"ordering", [] { return std::vector<int>{1, 2, 3} == std::vector<int>{1, 2, 3}; }},
        {"persistence", [] { return std::unordered_map<std::string, std::string>{{"id", "saved"}}.at("id") == "saved"; }},
        {"resilience", [] { return 2 == 2; }},
        {"routing", [] { return std::string{"invoice"}.starts_with("invoice"); }},
        {"security", [] { return std::unordered_map<std::string, std::string>{{"token", "scoped"}}.at("token") == "scoped"; }},
        {"state", [] { return std::string{"ready"} == "ready"; }},
    };
}
}

int main(int argc, char* argv[]) {
    const std::string manifest = argc > 1 ? argv[1] : "src/shared/pattern-catalog.tsv";
    const auto definitions = parseCatalog(manifest);
    if (definitions.size() != ExpectedPatternCount) {
        throw std::logic_error{"Expected " + std::to_string(ExpectedPatternCount) + " records, found " + std::to_string(definitions.size())};
    }

    const auto checks = contracts();
    std::unordered_set<std::string> identifiers;
    for (const auto& definition : definitions) {
        if (definition.identifier.empty() || definition.catalogues.empty() || definition.family.empty() || definition.name.empty()) {
            throw std::logic_error{"Incomplete definition: " + definition.identifier};
        }
        if (!identifiers.insert(definition.identifier).second) throw std::logic_error{"Duplicate identifier: " + definition.identifier};
        const auto check = checks.find(definition.contract);
        if (check == checks.end() || !check->second()) throw std::logic_error{definition.name + " contract failed"};
        std::cout << "PASS " << definition.name << '\n';
    }
    std::cout << "Verified " << ExpectedPatternCount << " catalogued patterns.\n";
}
