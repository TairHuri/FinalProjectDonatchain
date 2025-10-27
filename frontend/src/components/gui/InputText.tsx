
import type { ReactNode } from "react"
import { inputLogin, inputStyle } from "../../css/dashboardStyles"


export interface InputTextProps {
  placeholder?: string,
  field: string,
  onChange: (field: string, value: string | number) => void,
  type?: "text" | 'number' | 'email' | 'tel' | 'password',
  value: string | number,
  className?: string
  isMultiLine?: boolean
  list?: string
  disabled?: boolean
  required?: boolean
}

const InputText = ({ disabled = false, required = true, list, className, field, value, placeholder, onChange, type = "text", isMultiLine = false }: InputTextProps) => {
  if (isMultiLine) {
    return (
      <textarea
        value={value}
        className={className}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
        style={className ? {} : inputStyle}
      ></textarea>
    )
  }
  return (
    <input
      type={type}
      value={value}
      className={className}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      style={className ? {} : inputStyle}
      list={list}
      disabled={disabled}
      required={required}
    />
  )
}

export interface InputProps extends InputTextProps {
  Icon?: ReactNode;
  label: string

}
export const Input = ({ disabled, list, field, value, label, placeholder, onChange, type, Icon, isMultiLine = false }: InputProps) => {
  return (
    <div style={{ direction: 'rtl' }}>
      <label>{label}</label>
      <div>
        {Icon}
        <InputText {...{ disabled, list, field, value, placeholder: placeholder || label, onChange, type, isMultiLine }} />
      </div>
    </div>
  )
}



export interface InputIconProps {
  placeholder?: string,
  field: string|any,
  className?: string
  Icon?: ReactNode;
  label: string;
}
export interface InputWithIconProps extends InputIconProps {

  onChange: (field: string, value: string | number) => void,
  type?: "text" | 'number' | 'email' | 'tel' | 'password',
  value: string | number,
  isMultiLine?: boolean;
  field: string;
}

export const InputWithIcon = ({ Icon, label, className, field, value, placeholder, onChange, type = "text", isMultiLine = false, }: InputWithIconProps) => {
  const multiLine = (<textarea
    value={value}
    className={className}
    onChange={(e) => onChange(field, e.target.value)}
    placeholder={placeholder || label}
    style={inputLogin}
  ></textarea>);
  const singleLine = (<input
    type={type}
    value={value}
    className={className}
    onChange={(e) => onChange(field, e.target.value)}
    placeholder={placeholder || label}
    style={inputLogin}
  />)

  return (
    <div style={{ position: "relative", display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
      {Icon}
      {isMultiLine ? multiLine : singleLine}
      <label style={{ minWidth: '16vw' }}>{label}</label>
    </div>

  )
}

export interface InputFileWithIconProps <T,> extends InputIconProps {
  onChange: (field: keyof T, value: FileList | null) => void,
  value: FileList|File|null ,
  multiple?: boolean
  accept?: string
  field: keyof T;
}
export const InputFileWithIcon =<T,>({ Icon, label, className, field, value, placeholder, onChange, accept, multiple = false, }: InputFileWithIconProps<T>) => {
  return (
    <div style={{ position: "relative", display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
      {Icon}
      <input
        type="file"
        // file={value}
        className={className}
        onChange={(e) => onChange(field, e.target.files)}
        placeholder={placeholder || label}
        style={inputLogin}
        accept={accept}
        multiple={multiple}
      />
      <label style={{ minWidth: '16vw' }}>{label}</label>
    </div>

  )
}

export default InputText
