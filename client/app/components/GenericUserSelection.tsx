interface UserSelectionProps {
  data?: any[];
  isLoading?: boolean;
  onSelect?: (data: any) => void;
  selectedItem: any;
}

export function GenericUserSelection({
  data = [],
  isLoading,
  onSelect,
  selectedItem,
}: UserSelectionProps) {
  return (
    <div className="py-12 px-0 p-4">
      <div className="mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 px-6 pb-4">
          {/* Selection Dropdown */}
          <div className="mb-6">
            <label
              htmlFor="item-select"
              className="block text-sm font-bold dark:text-gray-200 text-gray-700 mb-4">
              Target Account
            </label>
            <div className="relative">
              <select
                id="item-select"
                value={!selectedItem ? "" : selectedItem}
                onChange={(e) => {
                  onSelect?.(e.target.value);
                }}
                disabled={isLoading || data?.length === 0}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 appearance-none bg-white">
                <option value="">
                  {isLoading
                    ? "Loading..."
                    : data.length === 0
                      ? "No items available"
                      : `-- Select Target Account --`}
                </option>
                {data.map((item) => (
                  <option key={item.accountID} value={item.accountID}>
                    {item.displayName}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading items...</p>
            </div>
          )}

          {selectedItem && (
            <button
              className="bg-red-500 text-white font-semibold text-sm cursor-pointer hover:scale-105 transition-all p-2 px-4 rounded-lg"
              onClick={() => onSelect?.(null)}>
              Clear selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
