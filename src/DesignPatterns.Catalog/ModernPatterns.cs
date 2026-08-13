namespace DesignPatterns.Catalog;

internal static class ModernPatterns
{
    internal static class Repository
    {
        private sealed record Product(string Id, string Name);
        private sealed class Products { private readonly Dictionary<string, Product> items = []; public void Add(Product item) => items[item.Id] = item; public Product? Find(string id) => items.GetValueOrDefault(id); }
        internal static void Verify() { var products = new Products(); products.Add(new("p1", "Book")); CatalogAssertions.Equal("Book", products.Find("p1")!.Name, "Repository"); }
    }

    internal static class UnitOfWork
    {
        private sealed class Unit { private readonly List<Action> changes = []; public void Track(Action change) => changes.Add(change); public void Commit() { foreach (var change in changes) change(); changes.Clear(); } }
        internal static void Verify() { var value = 0; var unit = new Unit(); unit.Track(() => value = 2); unit.Commit(); CatalogAssertions.Equal(2, value, "Unit of Work"); }
    }

    internal static class Specification
    {
        private interface ISpecification<in T> { bool IsSatisfiedBy(T candidate); }
        private sealed class MinimumBalance(decimal minimum) : ISpecification<decimal> { public bool IsSatisfiedBy(decimal candidate) => candidate >= minimum; }
        internal static void Verify() => CatalogAssertions.True(new MinimumBalance(50).IsSatisfiedBy(75), "Specification");
    }

    internal static class Cqrs
    {
        private sealed class Counter { private int value; public void Increment() => value++; public int Read() => value; }
        internal static void Verify() { var counter = new Counter(); counter.Increment(); CatalogAssertions.Equal(1, counter.Read(), "CQRS"); }
    }

    internal static class EventSourcing
    {
        private sealed class Score { private readonly List<int> events = []; public void Add(int points) => events.Add(points); public int Current => events.Sum(); }
        internal static void Verify() { var score = new Score(); score.Add(3); score.Add(2); CatalogAssertions.Equal(5, score.Current, "Event Sourcing"); }
    }

    internal static class Saga
    {
        private sealed class Reservation { public bool Held { get; private set; } public void Hold() => Held = true; public void Release() => Held = false; }
        internal static void Verify() { var reservation = new Reservation(); reservation.Hold(); reservation.Release(); CatalogAssertions.True(!reservation.Held, "Saga"); }
    }

    internal static class Retry
    {
        private static T Execute<T>(Func<T> operation, int attempts) { Exception? failure = null; for (var index = 0; index < attempts; index++) try { return operation(); } catch (Exception error) { failure = error; } throw failure!; }
        internal static void Verify() { var calls = 0; CatalogAssertions.Equal("ok", Execute(() => ++calls == 2 ? "ok" : throw new InvalidOperationException(), 2), "Retry"); }
    }

    internal static class CircuitBreaker
    {
        private sealed class Breaker { private int failures; public bool CanExecute => failures < 2; public void RecordFailure() => failures++; }
        internal static void Verify() { var breaker = new Breaker(); breaker.RecordFailure(); breaker.RecordFailure(); CatalogAssertions.True(!breaker.CanExecute, "Circuit Breaker"); }
    }

    internal static class CacheAside
    {
        private sealed class Cache { private readonly Dictionary<string, string> values = []; public string Get(string key, Func<string> load) => values.TryGetValue(key, out var value) ? value : values[key] = load(); }
        internal static void Verify() { var calls = 0; var cache = new Cache(); _ = cache.Get("x", () => (++calls).ToString()); _ = cache.Get("x", () => (++calls).ToString()); CatalogAssertions.Equal(1, calls, "Cache-Aside"); }
    }

    internal static class TransactionalOutbox
    {
        private sealed class Outbox { public List<string> Pending { get; } = []; public void SaveWithEvent(string entity, string @event) { _ = entity; Pending.Add(@event); } }
        internal static void Verify() { var outbox = new Outbox(); outbox.SaveWithEvent("order-1", "OrderPlaced"); CatalogAssertions.Equal("OrderPlaced", outbox.Pending.Single(), "Transactional Outbox"); }
    }

    internal static class IdempotentConsumer
    {
        private sealed class Consumer { private readonly HashSet<string> processed = []; public bool Handle(string id) => processed.Add(id); }
        internal static void Verify() { var consumer = new Consumer(); _ = consumer.Handle("m1"); CatalogAssertions.True(!consumer.Handle("m1"), "Idempotent Consumer"); }
    }

    internal static class PipesAndFilters
    {
        private static string Run(string value, params Func<string, string>[] filters) => filters.Aggregate(value, (current, filter) => filter(current));
        internal static void Verify() => CatalogAssertions.Equal("HELLO!", Run(" hello ", value => value.Trim(), value => value.ToUpperInvariant(), value => value + "!"), "Pipes and Filters");
    }

    internal static class ContentBasedRouter
    {
        private static string Route(string message) => message.StartsWith("invoice", StringComparison.Ordinal) ? "billing" : "support";
        internal static void Verify() => CatalogAssertions.Equal("billing", Route("invoice:42"), "Content-Based Router");
    }

    internal static class DeadLetterChannel
    {
        private sealed class Channel { public List<string> DeadLetters { get; } = []; public void Deliver(string message, bool accepted) { if (!accepted) DeadLetters.Add(message); } }
        internal static void Verify() { var channel = new Channel(); channel.Deliver("bad", false); CatalogAssertions.Equal("bad", channel.DeadLetters.Single(), "Dead Letter Channel"); }
    }

    internal static class HealthCheck
    {
        private interface IHealthProbe { bool IsHealthy(); }
        private sealed class DependencyProbe(bool available) : IHealthProbe { public bool IsHealthy() => available; }
        internal static void Verify() => CatalogAssertions.True(new DependencyProbe(true).IsHealthy(), "Health Check");
    }
}
