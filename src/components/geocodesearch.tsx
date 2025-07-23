import { useState } from "react";

export default function GeocodeSearch() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);

  const search = async () => {
    const res = await fetch(`/functions/v1/geocode?query=${address}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소를 입력하세요"
          className="border p-2 rounded w-full"
        />
        <button onClick={search} className="bg-blue-500 text-white p-2 rounded">
          검색
        </button>
      </div>
      {result && (
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
