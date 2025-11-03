import { useCallback, useEffect, useState } from "react";

type SelectionType = "wio" | "operator";

interface WIOItem {
  userId: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface OperatorItem {
  operatorOrgId: number;
  operatorOrgName: string;
  [key: string]: any;
}

type ListItem = WIOItem | OperatorItem;

interface UserSelectionProps {
  onSuccess?: (data: any) => void;
  onFail?: (error: string) => void;
  buttonName?: string;
  showSyncData?: boolean;
}

export default function UserSelection({
  onSuccess,
  onFail,
  buttonName = "Sync",
  showSyncData = true,
}: UserSelectionProps = {}) {
  const [selectionType, setSelectionType] = useState<SelectionType>("wio");
  const [items, setItems] = useState<ListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Fetch list of WIO or Operators based on selection type
  const fetchItems = useCallback(async (type: SelectionType) => {
    setLoading(true);
    setError("");
    setSyncedData(null);

    try {
      const url =
        type === "wio"
          ? "https://bison-energylink-mock-api.azurewebsites.net/api/wio/all"
          : "https://bison-energylink-mock-api.azurewebsites.net/api/operator/all";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
      }

      const data = await response.json();

      const itemsArray =
        type === "operator" && data.operators ? data.operators : data;

      setItems(Array.isArray(itemsArray) ? itemsArray : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setItems([]);

      if (onFail) {
        onFail(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch detailed information when sync button is clicked
  const handleSync = useCallback(async () => {
    if (!selectedItem) {
      setError("Please select an item first");
      return;
    }

    setSyncing(true);
    setError("");

    try {
      const url =
        selectionType === "wio"
          ? `https://bison-energylink-mock-api.azurewebsites.net/api/wio/${selectedItem}`
          : `https://bison-energylink-mock-api.azurewebsites.net/api/operator/${selectedItem}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to sync ${selectionType} data`);
      }

      const data = await response.json();
      setSyncedData(data);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred during sync";
      setError(errorMessage);
      setSyncedData(null);

      if (onFail) {
        onFail(errorMessage);
      }
    } finally {
      setSyncing(false);
    }
  }, [selectedItem, selectionType]);

  // Fetch items when selection type changes
  useEffect(() => {
    fetchItems(selectionType);
  }, [selectionType, fetchItems]);

  const handleSelectionTypeChange = (type: SelectionType) => {
    setItems([]);
    setSelectedItem("");
    setSyncedData(null);
    setError("");

    setSelectionType(type);
  };

  const getItemId = (item: ListItem): string => {
    if (selectionType === "wio") {
      return (item as WIOItem).userId || "";
    }
    const operatorItem = item as OperatorItem;
    return operatorItem.operatorOrgId
      ? operatorItem.operatorOrgId.toString()
      : "";
  };

  const getItemName = (item: ListItem): string => {
    if (selectionType === "wio") {
      const wioItem = item as WIOItem;
      return (
        `${wioItem.firstName || ""} ${wioItem.lastName || ""}`.trim() ||
        wioItem.userId ||
        "Unknown"
      );
    }
    const operatorItem = item as OperatorItem;
    return (
      operatorItem.operatorOrgName ||
      (operatorItem.operatorOrgId
        ? operatorItem.operatorOrgId.toString()
        : "Unknown")
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            User Selection
          </h1>

          {/* Selection Type Toggle */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleSelectionTypeChange("wio")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectionType === "wio"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                WIO
              </button>
              <button
                onClick={() => handleSelectionTypeChange("operator")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  selectionType === "operator"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Operator
              </button>
            </div>
          </div>

          {/* Selection Dropdown */}
          <div className="mb-6">
            <label
              htmlFor="item-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select {selectionType === "wio" ? "WIO" : "Operator"}
            </label>
            <div className="relative">
              <select
                id="item-select"
                value={selectedItem}
                onChange={(e) => {
                  setSelectedItem(e.target.value);

                  setSyncedData(null);
                  setError("");
                }}
                disabled={loading || items.length === 0}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 appearance-none bg-white"
              >
                <option value="">
                  {loading
                    ? "Loading..."
                    : items.length === 0
                      ? "No items available"
                      : `-- Select ${selectionType === "wio" ? "WIO" : "Operator"} --`}
                </option>
                {items.map((item) => (
                  <option key={getItemId(item)} value={getItemId(item)}>
                    {getItemName(item)}
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
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Sync Button */}
          <div className="mb-8">
            <button
              onClick={handleSync}
              disabled={!selectedItem || syncing || loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {syncing ? "Syncing..." : buttonName}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Synced Data Display */}
          {showSyncData && syncedData && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Synced Data
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto">
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(syncedData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading items...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
