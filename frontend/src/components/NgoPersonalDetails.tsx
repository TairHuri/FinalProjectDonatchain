import { useAuth } from "../contexts/AuthContext"

const NgoPersonalDetails = () => {
    const {ngo} =useAuth()


    return(
        <div>
                    <p><strong>שם העמותה:</strong> {ngo.name}</p>
                    <p><strong>מספר עמותה:</strong> {ngo._id}</p>
                    <p><strong>אימייל:</strong> {ngo.email}</p>
                    <p><strong>טלפון:</strong> {ngo.phone}</p>
                    <button
                      onClick={() => setEditMode("edit")}
                      style={{ ...primaryBtnStyle, marginTop: "15px" }}
                    >
                      עריכת פרטים
                    </button>
                  </div>
                )}

                {editMode === "edit" && (
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="שם העמותה"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="מספר עמותה"
                      style={inputStyle}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={handleSaveChanges} style={primaryBtnStyle}>שמור</button>
                      <button onClick={() => setEditMode("view")} style={{ ...menuBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
            )}
          </div>
        )}
    )

}