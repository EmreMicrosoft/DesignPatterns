namespace DesignPatterns.Catalog;

internal static class BehavioralPatterns
{
    internal static class ChainOfResponsibility
    {
        private abstract class Approver(Approver? next) { public bool Approve(decimal amount) => CanApprove(amount) || next?.Approve(amount) == true; protected abstract bool CanApprove(decimal amount); }
        private sealed class TeamLead(Approver? next) : Approver(next) { protected override bool CanApprove(decimal amount) => amount <= 100; }
        private sealed class Director() : Approver(null) { protected override bool CanApprove(decimal amount) => amount <= 1_000; }

        internal static void Verify() => CatalogAssertions.True(new TeamLead(new Director()).Approve(500), "Chain of Responsibility");
    }

    internal static class Command
    {
        private sealed class Document { public string Text { get; private set; } = string.Empty; public void Append(string text) => Text += text; }
        private interface ICommand { void Execute(); }
        private sealed class AppendCommand(Document document, string text) : ICommand { public void Execute() => document.Append(text); }
        private sealed class CommandQueue { public void Run(ICommand command) => command.Execute(); }

        internal static void Verify() { var document = new Document(); new CommandQueue().Run(new AppendCommand(document, "saved")); CatalogAssertions.Equal("saved", document.Text, "Command"); }
    }

    internal static class Interpreter
    {
        private sealed class Context(IReadOnlyDictionary<string, bool> values) { public bool Get(string key) => values.TryGetValue(key, out var value) && value; }
        private interface IExpression { bool Interpret(Context context); }
        private sealed class Variable(string name) : IExpression { public bool Interpret(Context context) => context.Get(name); }
        private sealed class And(IExpression left, IExpression right) : IExpression { public bool Interpret(Context context) => left.Interpret(context) && right.Interpret(context); }
        private sealed class Or(IExpression left, IExpression right) : IExpression { public bool Interpret(Context context) => left.Interpret(context) || right.Interpret(context); }

        internal static void Verify()
        {
            IExpression policy = new And(new Variable("active"), new Or(new Variable("admin"), new Variable("owner")));
            CatalogAssertions.True(policy.Interpret(new Context(new Dictionary<string, bool> { ["active"] = true, ["owner"] = true })), "Interpreter");
        }
    }

    internal static class Iterator
    {
        private sealed class Sprint(IEnumerable<string> tickets) : IEnumerable<string>
        {
            private readonly string[] tickets = tickets.ToArray();
            public IEnumerator<string> GetEnumerator() { foreach (var ticket in tickets) yield return ticket; }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();
        }

        internal static void Verify() => CatalogAssertions.Equal("ABC", string.Concat(new Sprint(["A", "B", "C"])), "Iterator");
    }

    internal static class Mediator
    {
        private interface ITeamMediator { void Publish(string sender, string message); }
        private sealed class TeamChat : ITeamMediator
        {
            public List<string> Messages { get; } = [];
            public void Publish(string sender, string message) => Messages.Add($"{sender}:{message}");
        }
        private sealed class Teammate(string name, ITeamMediator chat) { public void Say(string message) => chat.Publish(name, message); }

        internal static void Verify() { var chat = new TeamChat(); new Teammate("Ada", chat).Say("ready"); CatalogAssertions.Equal("Ada:ready", chat.Messages.Single(), "Mediator"); }
    }

    internal static class Memento
    {
        private sealed record Snapshot(string Value);
        private sealed class Editor
        {
            public string Value { get; private set; } = string.Empty;
            public void Write(string value) => Value = value;
            public Snapshot Save() => new(Value);
            public void Restore(Snapshot snapshot) => Value = snapshot.Value;
        }

        internal static void Verify() { var editor = new Editor(); editor.Write("first"); var snapshot = editor.Save(); editor.Write("second"); editor.Restore(snapshot); CatalogAssertions.Equal("first", editor.Value, "Memento"); }
    }

    internal static class Observer
    {
        private sealed class BuildFeed
        {
            public event Action<string>? Published;
            public void Publish(string state) => Published?.Invoke(state);
        }

        internal static void Verify() { var feed = new BuildFeed(); string? observed = null; feed.Published += state => observed = state; feed.Publish("green"); CatalogAssertions.Equal("green", observed!, "Observer"); }
    }

    internal static class State
    {
        private interface IConnectionState { string Send(); }
        private sealed class Offline : IConnectionState { public string Send() => "queued"; }
        private sealed class Online : IConnectionState { public string Send() => "sent"; }
        private sealed class Connection(IConnectionState state) { public string Send() => state.Send(); public void Change(IConnectionState value) => state = value; }

        internal static void Verify() { var connection = new Connection(new Offline()); connection.Change(new Online()); CatalogAssertions.Equal("sent", connection.Send(), "State"); }
    }

    internal static class Strategy
    {
        private interface IDiscount { decimal Apply(decimal total); }
        private sealed class PercentageDiscount(decimal rate) : IDiscount { public decimal Apply(decimal total) => total * (1 - rate); }
        private sealed class Cart(IDiscount discount) { public decimal Quote(decimal total) => discount.Apply(total); }

        internal static void Verify() => CatalogAssertions.Equal(90m, new Cart(new PercentageDiscount(.10m)).Quote(100m), "Strategy");
    }

    internal static class TemplateMethod
    {
        private abstract class Importer
        {
            public string Import(string raw) => Persist(Normalize(raw));
            protected abstract string Normalize(string raw);
            private static string Persist(string value) => $"stored:{value}";
        }
        private sealed class TrimImporter : Importer { protected override string Normalize(string raw) => raw.Trim().ToLowerInvariant(); }

        internal static void Verify() => CatalogAssertions.Equal("stored:hello", new TrimImporter().Import(" HELLO "), "Template Method");
    }

    internal static class Visitor
    {
        private interface IShape { decimal Accept(IAreaVisitor visitor); }
        private interface IAreaVisitor { decimal Visit(Circle circle); decimal Visit(Rectangle rectangle); }
        private sealed record Circle(decimal Radius) : IShape { public decimal Accept(IAreaVisitor visitor) => visitor.Visit(this); }
        private sealed record Rectangle(decimal Width, decimal Height) : IShape { public decimal Accept(IAreaVisitor visitor) => visitor.Visit(this); }
        private sealed class AreaVisitor : IAreaVisitor
        {
            public decimal Visit(Circle circle) => decimal.Round(3.14159m * circle.Radius * circle.Radius, 2);
            public decimal Visit(Rectangle rectangle) => rectangle.Width * rectangle.Height;
        }

        internal static void Verify() => CatalogAssertions.Equal(6m, new Rectangle(2, 3).Accept(new AreaVisitor()), "Visitor");
    }
}
