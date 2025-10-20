import { hover } from "framer-motion";
import { AirVent, AlignRight } from "lucide-react";

export const menuBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "10px",
};

export const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(90deg,#10b981,#059669)",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "10px",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "10px",
};

export const inputLogin: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "9999px",
  padding: "12px 16px 12px 40px",
  fontSize: "16px",

}

export const iconLogin: React.CSSProperties = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "green",
  width: "20px",
  height: "20px",
}
export const fildsPositionStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
}

export const buttonStyle = {
  fontFamily: 'calibri',
  fontWeight: 600,
  fontSize: '0.9rem',
  flex: 0.5,
  backgroundColor: "green",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
}

export const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

export const labelStyle: React.CSSProperties = {
  fontFamily: 'calibri',
  fontWeight: 600,
  fontSize: '0.9rem',
};


// A wrapper container for both buttons
export const toggleGroup: React.CSSProperties = {
  display: 'inline-flex',
  border: "1px solid #ccc",
  borderRadius: "9999px",
  fontSize: "16px",
  width: "100%",
};

// Common ground for both situations
export const toggleBase: React.CSSProperties = {
  cursor: 'pointer',
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "9999px",
  padding: "12px 16px 12px 40px",
  fontSize: "16px",
};

// Active mode
export const toggleOn: React.CSSProperties = {
  ...toggleBase,
  background: '#fff',
  color: '#111827',
};

// Off mode
export const toggleOff: React.CSSProperties = {
  ...toggleBase,
  background: 'transparent',
  color: '#1f2937',
};

export const ngoListStyle: React.CSSProperties = {
  display: 'inline-flex',
  padding: '6px 18px',
  border: '1px solid #000000ff',
  borderRadius: "10px",
};

