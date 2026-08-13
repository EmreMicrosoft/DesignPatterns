namespace DesignPatterns.Catalog;

internal static class Program
{
    private static readonly (string Name, Action Verify)[] Patterns =
    [
        ("Abstract Factory", CreationalPatterns.AbstractFactory.Verify),
        ("Builder", CreationalPatterns.Builder.Verify),
        ("Factory Method", CreationalPatterns.FactoryMethod.Verify),
        ("Prototype", CreationalPatterns.Prototype.Verify),
        ("Singleton", CreationalPatterns.Singleton.Verify),
        ("Adapter", StructuralPatterns.Adapter.Verify),
        ("Bridge", StructuralPatterns.Bridge.Verify),
        ("Composite", StructuralPatterns.Composite.Verify),
        ("Decorator", StructuralPatterns.Decorator.Verify),
        ("Facade", StructuralPatterns.Facade.Verify),
        ("Flyweight", StructuralPatterns.Flyweight.Verify),
        ("Proxy", StructuralPatterns.Proxy.Verify),
        ("Chain of Responsibility", BehavioralPatterns.ChainOfResponsibility.Verify),
        ("Command", BehavioralPatterns.Command.Verify),
        ("Interpreter", BehavioralPatterns.Interpreter.Verify),
        ("Iterator", BehavioralPatterns.Iterator.Verify),
        ("Mediator", BehavioralPatterns.Mediator.Verify),
        ("Memento", BehavioralPatterns.Memento.Verify),
        ("Observer", BehavioralPatterns.Observer.Verify),
        ("State", BehavioralPatterns.State.Verify),
        ("Strategy", BehavioralPatterns.Strategy.Verify),
        ("Template Method", BehavioralPatterns.TemplateMethod.Verify),
        ("Visitor", BehavioralPatterns.Visitor.Verify),
        ("Repository", ModernPatterns.Repository.Verify),
        ("Unit of Work", ModernPatterns.UnitOfWork.Verify),
        ("Specification", ModernPatterns.Specification.Verify),
        ("CQRS", ModernPatterns.Cqrs.Verify),
        ("Event Sourcing", ModernPatterns.EventSourcing.Verify),
        ("Saga", ModernPatterns.Saga.Verify),
        ("Retry", ModernPatterns.Retry.Verify),
        ("Circuit Breaker", ModernPatterns.CircuitBreaker.Verify),
        ("Cache-Aside", ModernPatterns.CacheAside.Verify),
        ("Transactional Outbox", ModernPatterns.TransactionalOutbox.Verify),
        ("Idempotent Consumer", ModernPatterns.IdempotentConsumer.Verify),
        ("Pipes and Filters", ModernPatterns.PipesAndFilters.Verify),
        ("Content-Based Router", ModernPatterns.ContentBasedRouter.Verify),
        ("Dead Letter Channel", ModernPatterns.DeadLetterChannel.Verify),
        ("Health Check", ModernPatterns.HealthCheck.Verify),
    ];

    public static void Main()
    {
        foreach (var (name, verify) in Patterns)
        {
            verify();
            Console.WriteLine($"PASS {name}");
        }

        Console.WriteLine($"Verified {Patterns.Length} patterns.");
    }
}
