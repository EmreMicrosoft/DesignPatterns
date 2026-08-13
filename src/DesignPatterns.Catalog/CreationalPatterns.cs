namespace DesignPatterns.Catalog;

internal static class CreationalPatterns
{
    internal static class AbstractFactory
    {
        private interface IThemeFactory { IButton CreateButton(); ICheckbox CreateCheckbox(); }
        private interface IButton { string Render(); }
        private interface ICheckbox { string Render(); }
        private sealed class LightTheme : IThemeFactory
        {
            public IButton CreateButton() => new LightButton();
            public ICheckbox CreateCheckbox() => new LightCheckbox();
        }
        private sealed class LightButton : IButton { public string Render() => "light-button"; }
        private sealed class LightCheckbox : ICheckbox { public string Render() => "light-checkbox"; }

        internal static void Verify()
        {
            IThemeFactory theme = new LightTheme();
            CatalogAssertions.Equal("light-button/light-checkbox", $"{theme.CreateButton().Render()}/{theme.CreateCheckbox().Render()}", "Abstract Factory");
        }
    }

    internal static class Builder
    {
        private sealed record DeploymentPlan(string Region, int Replicas, bool HealthChecks);
        private sealed class DeploymentPlanBuilder
        {
            private string region = "local";
            private int replicas = 1;
            private bool healthChecks;
            public DeploymentPlanBuilder InRegion(string value) { region = value; return this; }
            public DeploymentPlanBuilder WithReplicas(int value) { replicas = value; return this; }
            public DeploymentPlanBuilder WithHealthChecks() { healthChecks = true; return this; }
            public DeploymentPlan Build() => new(region, replicas, healthChecks);
        }

        internal static void Verify()
        {
            var plan = new DeploymentPlanBuilder().InRegion("eu").WithReplicas(3).WithHealthChecks().Build();
            CatalogAssertions.True(plan is { Region: "eu", Replicas: 3, HealthChecks: true }, "Builder");
        }
    }

    internal static class FactoryMethod
    {
        private interface IExporter { string Export(string value); }
        private sealed class CsvExporter : IExporter { public string Export(string value) => $"csv:{value}"; }
        private abstract class ExportScreen { public string Save(string value) => CreateExporter().Export(value); protected abstract IExporter CreateExporter(); }
        private sealed class CsvExportScreen : ExportScreen { protected override IExporter CreateExporter() => new CsvExporter(); }

        internal static void Verify() => CatalogAssertions.Equal("csv:report", new CsvExportScreen().Save("report"), "Factory Method");
    }

    internal static class Prototype
    {
        private sealed class Dashboard
        {
            public Dashboard(string name, IReadOnlyList<string> widgets) => (Name, Widgets) = (name, widgets);
            public string Name { get; }
            public IReadOnlyList<string> Widgets { get; }
            public Dashboard CopyWithName(string name) => new(name, Widgets.ToArray());
        }

        internal static void Verify()
        {
            var original = new Dashboard("Operations", ["alerts"]);
            var clone = original.CopyWithName("Sandbox");
            CatalogAssertions.True(clone.Name == "Sandbox" && !ReferenceEquals(original.Widgets, clone.Widgets), "Prototype");
        }
    }

    internal static class Singleton
    {
        private sealed class ApplicationClock
        {
            private ApplicationClock() { }
            public static ApplicationClock Instance { get; } = new();
            public DateOnly Today() => DateOnly.FromDateTime(DateTime.UtcNow);
        }

        internal static void Verify() => CatalogAssertions.True(ReferenceEquals(ApplicationClock.Instance, ApplicationClock.Instance), "Singleton");
    }
}
