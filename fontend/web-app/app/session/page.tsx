import React from "react";
import Heading from "../components/Heading";
import { getCurrentUser, getTokenWorkAround } from "../actions/authAction";
export default async function Session() {
  const session = await getCurrentUser();
  const token = await getTokenWorkAround();
  return (
    <div>
      <Heading title="Session dashboard" />
      <div className="bg-blue-200 border-2 border-blue-500">
        <h3 className="text-lg">Session data</h3>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
      <div className="bg-blue-200 border-2 border-blue-500 mt-4">
        <h3 className="text-lg">Token data</h3>
        <pre className="overflow-auto">{JSON.stringify(token, null, 2)}</pre>
      </div>
    </div>
  );
}
