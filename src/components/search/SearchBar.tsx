import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="relative mt-6 px-5"
    >
      <Search
        size={20}
        className="absolute left-9 top-1/2 -translate-y-1/2 text-outline"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products..."
        className="h-14 w-full rounded-full bg-surface-low pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-primary-container"
      />
    </form>
  );
}