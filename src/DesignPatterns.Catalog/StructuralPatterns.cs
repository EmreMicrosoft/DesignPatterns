namespace DesignPatterns.Catalog;

internal static class StructuralPatterns
{
    internal static class Adapter
    {
        private sealed class LegacyThermometer { public double ReadFahrenheit() => 68; }
        private interface ICelsiusSensor { double ReadCelsius(); }
        private sealed class ThermometerAdapter(LegacyThermometer legacy) : ICelsiusSensor
        {
            public double ReadCelsius() => Math.Round((legacy.ReadFahrenheit() - 32) * 5 / 9, 1);
        }

        internal static void Verify() => CatalogAssertions.Equal(20d, new ThermometerAdapter(new LegacyThermometer()).ReadCelsius(), "Adapter");
    }

    internal static class Bridge
    {
        private interface ITransport { string Deliver(string message); }
        private sealed class EmailTransport : ITransport { public string Deliver(string message) => $"email:{message}"; }
        private abstract class Alert(ITransport transport) { public string Send(string message) => transport.Deliver(Format(message)); protected abstract string Format(string message); }
        private sealed class SecurityAlert(ITransport transport) : Alert(transport) { protected override string Format(string message) => $"security:{message}"; }

        internal static void Verify() => CatalogAssertions.Equal("email:security:door", new SecurityAlert(new EmailTransport()).Send("door"), "Bridge");
    }

    internal static class Composite
    {
        private interface IPriceNode { decimal Total(); }
        private sealed class Line(decimal amount) : IPriceNode { public decimal Total() => amount; }
        private sealed class Bundle(params IPriceNode[] children) : IPriceNode { public decimal Total() => children.Sum(child => child.Total()); }

        internal static void Verify() => CatalogAssertions.Equal(15m, new Bundle(new Line(10), new Bundle(new Line(5))).Total(), "Composite");
    }

    internal static class Decorator
    {
        private interface INotifier { string Send(string message); }
        private sealed class EmailNotifier : INotifier { public string Send(string message) => $"email:{message}"; }
        private sealed class AuditNotifier(INotifier inner) : INotifier { public string Send(string message) => $"audit|{inner.Send(message)}"; }

        internal static void Verify() => CatalogAssertions.Equal("audit|email:ready", new AuditNotifier(new EmailNotifier()).Send("ready"), "Decorator");
    }

    internal static class Facade
    {
        private sealed class Inventory { public bool Reserve(string sku) => sku == "book"; }
        private sealed class Billing { public bool Charge(decimal amount) => amount > 0; }
        private sealed class Checkout(Inventory inventory, Billing billing)
        {
            public bool Complete(string sku, decimal amount) => inventory.Reserve(sku) && billing.Charge(amount);
        }

        internal static void Verify() => CatalogAssertions.True(new Checkout(new Inventory(), new Billing()).Complete("book", 12), "Facade");
    }

    internal static class Flyweight
    {
        private sealed record TextStyle(string Font, int Size);
        private sealed class StylePool
        {
            private readonly Dictionary<(string, int), TextStyle> styles = [];
            public TextStyle Get(string font, int size) => styles.TryGetValue((font, size), out var style) ? style : styles[(font, size)] = new(font, size);
        }

        internal static void Verify()
        {
            var pool = new StylePool();
            CatalogAssertions.True(ReferenceEquals(pool.Get("Inter", 12), pool.Get("Inter", 12)), "Flyweight");
        }
    }

    internal static class Proxy
    {
        private interface IProfileDirectory { string Find(string id); }
        private sealed class RemoteDirectory : IProfileDirectory { public int Calls { get; private set; } public string Find(string id) { Calls++; return $"user:{id}"; } }
        private sealed class CachedDirectory(IProfileDirectory remote) : IProfileDirectory
        {
            private readonly Dictionary<string, string> cache = [];
            public string Find(string id) => cache.TryGetValue(id, out var value) ? value : cache[id] = remote.Find(id);
        }

        internal static void Verify()
        {
            var remote = new RemoteDirectory(); var proxy = new CachedDirectory(remote);
            _ = proxy.Find("7"); _ = proxy.Find("7");
            CatalogAssertions.Equal(1, remote.Calls, "Proxy");
        }
    }
}
