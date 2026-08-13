namespace DesignPatterns.Catalog;

internal static class CatalogAssertions
{
    public static void Equal<T>(T expected, T actual, string pattern) where T : notnull
    {
        if (!EqualityComparer<T>.Default.Equals(expected, actual))
        {
            throw new InvalidOperationException($"{pattern} verification failed. Expected '{expected}', got '{actual}'.");
        }
    }

    public static void True(bool condition, string pattern)
    {
        if (!condition)
        {
            throw new InvalidOperationException($"{pattern} verification failed.");
        }
    }
}
