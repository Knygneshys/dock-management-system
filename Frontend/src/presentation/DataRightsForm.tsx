
import React, { useState } from "react";
import { requestDataRectification, getMyData } from "../infrastructure/api/clients/userApi";
import { useAuth0 } from "@auth0/auth0-react";
const DataRightsForm: React.FC = () => {
  const { user } = useAuth0();
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [rectifyFields, setRectifyFields] = useState<Record<string, string | null>>({});
  const [justification, setJustification] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  React.useEffect(() => {
    getMyData().then(data => {
      let merged = { ...data };
      if (user) {
        merged = { ...merged, ...user };
      }
      setUserData(merged);
    });
  }, [user]);

  const handleRectifyChange = (field: string, value: string) => {
    setRectifyFields(prev => ({ ...prev, [field]: value }));
  };


  const handleRectifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmRectify = async () => {
    setShowConfirm(false);
    setShowRectifyModal(false);
    try {
      await requestDataRectification({ ...rectifyFields, justification: justification || "" });
      setMessage("Rectification request sent successfully.");
      setMessageType('success');
      setJustification("");
      setRectifyFields({});
    } catch {
      setMessage("Failed to send rectification request.");
      setMessageType('error');
    }
  };


  const dataFields = ["email", "name", "family_name", "email_verified"];
  const getLabel = (field: string) => {
    if (field === "family_name") return "Last Name";
    if (field === "name") return "Name";
    if (field === "email") return "Email";
    if (field === "email_verified") return "Email Status";
    return field;
  };

  return (
    <div style={{ maxWidth: 420, margin: "3em auto", padding: 32, border: "1px solid #ccc", borderRadius: 10, background: "#fff" }}>
      <h2 style={{ marginBottom: 18 }}>My Data Rights</h2>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
                  const dlAnchorElem = document.createElement('a');
                  dlAnchorElem.setAttribute("href", dataStr);
                  dlAnchorElem.setAttribute("download", "my_data.json");
                  dlAnchorElem.click();
                }}
                style={{ padding: '6px 16px', borderRadius: 5, background: '#eee', border: '1px solid #bbb', fontWeight: 500, cursor: 'pointer', fontSize: '0.95em' }}
              >
                Download JSON
              </button>
            </div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 8 }}>Your Information</h3>
        {userData.picture && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <img src={userData.picture} alt="User avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} />
          </div>
        )}
        <>
          {dataFields.map(field => (
            <div key={field} style={{ marginBottom: 12, display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: 2 }}>{getLabel(field)}:</label>
              <div style={{ padding: 7, borderRadius: 4, border: "1px solid #eee", background: "#f9f9f9", fontSize: "1em", display: field === 'email_verified' ? 'flex' : undefined, alignItems: field === 'email_verified' ? 'center' : undefined, gap: field === 'email_verified' ? 8 : undefined }}>
                {field === 'email_verified' && userData.email_verified !== undefined
                    ? (userData.email_verified
                        ? <span style={{ color: 'green', fontWeight: 600 }}>Verified &#10003;</span>
                        : <span style={{ color: 'red', fontWeight: 600 }}>Not Verified</span>)
                    : userData[field] ?? ''}
              </div>
            </div>
          ))}
          <button onClick={() => setShowRectifyModal(true)} style={{ fontSize: "1.1em", padding: "10px 20px", marginTop: 10, borderRadius: 5, background: "#f5c242", border: "none", fontWeight: 600, cursor: "pointer" }}>Request Data Change</button>
        </>
      </div>

      {showRectifyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, boxShadow: '0 2px 12px #0002', minWidth: 340 }}>
            <h3 style={{ marginBottom: 8 }}>Request Data Rectification</h3>
            <form onSubmit={handleRectifySubmit}>
              {Object.entries(userData)
                .filter(([field]) => dataFields.includes(field) && field !== 'email_verified')
                .map(([field, value]) => (
                  <div key={field} style={{ marginBottom: 18, display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: "bold", marginBottom: 4 }}>{getLabel(field)}:</label>
                    <input
                      type="text"
                      value={rectifyFields[field] ?? value ?? ""}
                      onChange={e => handleRectifyChange(field, e.target.value)}
                      style={{ padding: 7, borderRadius: 4, border: "1px solid #bbb", fontSize: "1em" }}
                    />
                  </div>
                ))}
              <div style={{ marginBottom: 18, display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: 4 }}>
                  Justification (reason for rectification):
                </label>
                <textarea
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  style={{ padding: 7, borderRadius: 4, border: "1px solid #bbb", fontSize: "1em", minHeight: 60 }}
                  placeholder="Please provide a justification for your request"
                />
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <button type="submit" style={{ fontSize: "1.1em", padding: "10px 20px", borderRadius: 5, background: "#f5c242", border: "none", fontWeight: 600, cursor: "pointer" }}>Submit</button>
                <button type="button" onClick={() => setShowRectifyModal(false)} style={{ fontSize: "1.1em", padding: "10px 20px", borderRadius: 5, background: "#eee", border: "1px solid #bbb", fontWeight: 400, cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
            {showConfirm && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1100
              }}>
                <div style={{ background: '#fff', padding: 32, borderRadius: 10, boxShadow: '0 2px 12px #0002', minWidth: 320 }}>
                  <h3>Confirm Rectification Request</h3>
                  <p>Are you sure you want to submit this rectification request?</p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                    <button onClick={handleConfirmRectify} style={{ padding: '8px 18px', background: '#f5c242', border: 'none', borderRadius: 5, fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
                    <button onClick={() => setShowConfirm(false)} style={{ padding: '8px 18px', background: '#eee', border: '1px solid #bbb', borderRadius: 5, fontWeight: 400, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {message && (
        <div style={{
          marginTop: 24,
          color: messageType === 'error' ? 'red' : 'green',
          fontWeight: 'bold',
        }}>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default DataRightsForm;
