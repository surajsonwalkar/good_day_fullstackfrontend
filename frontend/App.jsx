
import React, { useState } from "react";

export default function App() {
  const [eventType, setEventType] = useState("marriage");
  const [selectedDate, setSelectedDate] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;

    setLoading(true);
    setResponse(null);

    const prompt = `Evaluate the following date for the event type "${eventType}" using Hindu Panchang and astrological traditions. Date: ${selectedDate}. Provide a score from 1 to 10 and reasoning.`;

    try {
      const res = await fetch("https://goodday-api.onrender.com/api/gpt-evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setResponse(data);
      } catch (jsonErr) {
        console.error("Failed to parse JSON. Raw response:", text);
        setResponse({ error: "Backend error: " + text });
      }
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to reach server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Good Day AI Evaluator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Event Type:</label>
            <select
              className="w-full p-2 border rounded"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="marriage">Marriage</option>
              <option value="buying_car">Buying a Car</option>
              <option value="new_project">Starting New Project</option>
              <option value="griha_pravesh">Griha Pravesh</option>
              <option value="baby_naming">Baby Naming</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Select Date:</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            {loading ? "Evaluating..." : "Evaluate Date"}
          </button>
        </form>

        {response && (
          <div className="mt-6 bg-gray-50 p-4 rounded">
            {response.error ? (
              <p className="text-red-600">{response.error}</p>
            ) : (
              <>
                <p><strong>Score:</strong> {response.score}/10</p>
                <p><strong>Reason:</strong> {response.reason}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
