"use client";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState("");
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");
  async function upload() {
    if (!data) return;
    try {
      setData("");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  async function uploadFile() {
    if (!file) return;
    setData("");
    const buffer = await file.arrayBuffer();
    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      });

      const json = await response.json();
      console.log("json:", json);
      setTransaction(json.txId);
    } catch (err) {
      console.log({ err });
    }
  }

  function handleFileChange(e: any) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <main className="flex flex-col items-center justify-between">
      <input
        placeholder="Create a post"
        onChange={(e) => setData(e.target.value)}
        className="px-2 py-1 text-black"
      />
      <button onClick={upload} className="px-12 mt-2 text-black bg-white">
        Upload text
      </button>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} className="px-12 mt-2 text-black bg-white">
        Upload file
      </button>
      {transaction && (
        <a target="_blank" rel="no-opener" href={transaction}>
          View Arweave Data
        </a>
      )}
    </main>
  );
}
