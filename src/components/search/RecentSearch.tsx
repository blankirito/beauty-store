type RecentSearchProps = {
  searches: string[];
  onSelect: (search: string) => void;
  onClear: () => void;
};

export default function RecentSearch({
  searches,
  onSelect,
  onClear,
}: RecentSearchProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 px-5">
      <div className="mb-4 flex justify-between">
        <h2 className="text-sm font-semibold tracking-widest text-primary">
          RECENT SEARCHES
        </h2>

        <button
          type="button"
          onClick={onClear}
          className="text-sm text-outline transition hover:text-primary"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {searches.map((search) => (
          <button
            key={search}
            type="button"
            onClick={() => onSelect(search)}
            className="rounded-full border border-outline/30 bg-surface px-5 py-2 text-sm text-on-surface transition hover:border-primary hover:text-primary"
          >
            {search}
          </button>
        ))}
      </div>
    </section>
  );
}