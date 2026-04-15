"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
	const [wixSiteId, setWixSiteId] = useState("test-site-id");
	const [mappings, setMappings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMapping, setNewMapping] = useState({
		wixField: "",
		hubspotProperty: "",
		direction: "both",
		transform: "",
	});

	const fetchMappings = async () => {
		try {
			const res = await fetch(`http://localhost:3001/api/mappings?wixSiteId=${wixSiteId}`);
			const data = await res.json();
			setMappings(data);
		} catch (err) {
			console.error("Failed to fetch mappings", err);
		}
	};

	useEffect(() => {
		fetchMappings();
	}, [wixSiteId]);

	const handleAddMapping = async () => {
		setLoading(true);
		try {
			await fetch(`http://localhost:3001/api/mappings`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ wixSiteId, ...newMapping }),
			});
			setNewMapping({ wixField: "", hubspotProperty: "", direction: "both", transform: "" });
			fetchMappings();
		} catch (err) {
			console.error("Failed to add mapping", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8 max-w-4xl mx-auto font-sans">
			<h1 className="text-3xl font-bold mb-8">Wix ↔ HubSpot Integration</h1>

			<section className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
				<h2 className="text-xl font-semibold mb-4">Connection Status</h2>
				<div className="flex items-center gap-4">
					<button
						onClick={() => (window.location.href = `http://localhost:3001/auth/hubspot?state=${wixSiteId}`)}
						className="bg-[#ff7a59] text-white px-6 py-2 rounded-md font-medium hover:bg-[#ff8f73] transition-colors"
					>
						Connect HubSpot
					</button>
					<p className="text-sm text-zinc-500">Connected to Portal: 12345678</p>
				</div>
			</section>

			<section className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
				<h2 className="text-xl font-semibold mb-6">Field Mappings</h2>
				
				<div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-zinc-50 rounded-md">
					<input
						type="text"
						placeholder="Wix Field (e.g. firstName)"
						className="border p-2 rounded text-sm"
						value={newMapping.wixField}
						onChange={(e) => setNewMapping({ ...newMapping, wixField: e.target.value })}
					/>
					<input
						type="text"
						placeholder="HS Property (e.g. firstname)"
						className="border p-2 rounded text-sm"
						value={newMapping.hubspotProperty}
						onChange={(e) => setNewMapping({ ...newMapping, hubspotProperty: e.target.value })}
					/>
					<select
						className="border p-2 rounded text-sm"
						value={newMapping.direction}
						onChange={(e) => setNewMapping({ ...newMapping, direction: e.target.value })}
					>
						<option value="both">⇄ Bi-directional</option>
						<option value="wix_to_hs">→ Wix to HS</option>
						<option value="hs_to_wix">← HS to Wix</option>
					</select>
					<button
						onClick={handleAddMapping}
						disabled={loading}
						className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-zinc-800 disabled:opacity-50"
					>
						{loading ? "Adding..." : "Add Mapping"}
					</button>
				</div>

				<table className="w-full text-left">
					<thead className="text-sm text-zinc-500 border-b">
						<tr>
							<th className="py-2">Wix Field</th>
							<th className="py-2">HubSpot Property</th>
							<th className="py-2">Direction</th>
							<th className="py-2">Transform</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{mappings.map((m: any) => (
							<tr key={m.id} className="text-sm">
								<td className="py-3 font-medium">{m.wixField}</td>
								<td className="py-3">{m.hubspotProperty}</td>
								<td className="py-3 capitalize">{m.direction.replace(/_/g, " ")}</td>
								<td className="py-3 text-zinc-500">{m.transform || "None"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
}
