import { useState } from "react";
import api from "../api";

export default function UserSettings() {
  // State for Set PIN
  const [setPin, setSetPin] = useState("");
  const [setMessage, setSetMessage] = useState("");

  // State for Update PIN
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [updatePinMessage, setUpdatePinMessage] = useState("");

  // State for Update VPA
  const [newVpa, setNewVpa] = useState("");
  const [updateVpaMessage, setUpdateVpaMessage] = useState("");

  // Handlers...

  const handleSetPin = async () => {
    try {
      await api.post("/users/set-pin", { pin: setPin });
      setSetMessage("PIN set successfully");
    } catch (err) {
      setSetMessage(err.response?.data?.error || "Failed to set PIN");
    }
  };

  const handleUpdatePin = async () => {
    try {
      await api.patch("/users/update-pin", { oldPin, newPin });
      setUpdatePinMessage("PIN updated successfully");
    } catch (err) {
      setUpdatePinMessage(err.response?.data?.error || "Failed to update PIN");
    }
  };

  const handleUpdateVpa = async () => {
    try {
      await api.patch("/users/update-vpa", { newVpa });
      setUpdateVpaMessage("VPA updated successfully");
    } catch (err) {
      setUpdateVpaMessage(err.response?.data?.error || "Failed to update VPA");
    }
  };

  return (
    <div>
      <section>
        <h2>Set PIN</h2>
        <input
          type="password"
          placeholder="Set PIN"
          value={setPin}
          onChange={e => setSetPin(e.target.value)}
        />
        <button onClick={handleSetPin}>Set PIN</button>
        <p>{setMessage}</p>
      </section>

      <section>
        <h2>Update PIN</h2>
        <input
          type="password"
          placeholder="Old PIN"
          value={oldPin}
          onChange={e => setOldPin(e.target.value)}
        />
        <input
          type="password"
          placeholder="New PIN"
          value={newPin}
          onChange={e => setNewPin(e.target.value)}
        />
        <button onClick={handleUpdatePin}>Update PIN</button>
        <p>{updatePinMessage}</p>
      </section>

      <section>
        <h2>Update VPA</h2>
        <input
          placeholder="New VPA"
          value={newVpa}
          onChange={e => setNewVpa(e.target.value)}
        />
        <button onClick={handleUpdateVpa}>Update VPA</button>
        <p>{updateVpaMessage}</p>
      </section>
    </div>
  );
}
