type SavePreferenceButtonProps = {
  selectedLabel: string;
  onSave: () => void;
};

export default function SavePreferenceButton({
  selectedLabel,
  onSave,
}: SavePreferenceButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-outline/30 bg-surface-container-lowest p-5">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onSave}
          className="w-full rounded-lg bg-primary py-4 font-semibold text-white transition hover:opacity-90 active:scale-[0.98] md:w-auto md:px-12"
        >
          Save Preference · {selectedLabel}
        </button>
      </div>
    </div>
  );
}