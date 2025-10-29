
import type { ReactNode } from "react"
import { inputLogin, inputStyle } from "../../css/dashboardStyles"


export interface InputTextProps {
  placeholder?: string,
  field: string,
  onChange: (field: string, value: string | number) => void,
  type?: "text" | 'number' | 'email' | 'tel' | 'password' | 'date',
  value: string | number,
  className?: string
  isMultiLine?: boolean
  list?: string
  disabled?: boolean
  required?: boolean
  label?: string
  style?: React.CSSProperties
}

const InputText = ({ disabled = false, required = true, list, className, field, value, placeholder, onChange, type = "text", isMultiLine = false, label, style={} }: InputTextProps) => {
  const Textarea = (<textarea
    value={value}
    className={className}
    onChange={(e) => onChange(field, e.target.value)}
    placeholder={placeholder}
    style={{...inputStyle, ...style}}
  ></textarea>)

  const Input = (<input
    type={type}
    value={value}
    className={className}
    onChange={(e) => onChange(field, e.target.value)}
    placeholder={placeholder}
    style={{...inputStyle, ...style}}
    list={list}
    disabled={disabled}
    required={required}
  />)
  const Label = <label style={{ fontWeight: "bold" }}>{label}</label>

  if (label) {
    return <>{Label} {isMultiLine ? Textarea : Input}</>
  }
  return isMultiLine ? Textarea : Input;
}

export interface InputFileProps {
  onChange: (field: string, value: FileList | null, multiple:boolean) => void,
  // value: FileList | File | null,
  multiple?: boolean
  accept?: string
  placeholder?: string,
  field: string,
  className?: string
  disabled?: boolean
  required?: boolean
  label?: string
  style?: React.CSSProperties;

}
export const InputFile= ({ label, className, field, placeholder, onChange, accept, multiple = false,style={} }: InputFileProps) => {
  const Label = <label style={{ minWidth: '16vw' }}>{label}</label>
  const Input = <input
        type="file"
        className={className}
        style={{...inputStyle, ...style}}
        onChange={(e) => onChange(field, e.target.files, multiple)}
        placeholder={placeholder || label}

        accept={accept}
        multiple={multiple}
      />
  return label? <>{Label} {Input}</> : Input
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
  field: string | any,
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

export interface InputFileWithIconProps<T,> extends InputIconProps {
  onChange: (field: keyof T, value: FileList | null) => void,
  value: FileList | File | null,
  multiple?: boolean
  accept?: string
  field: keyof T;
}
export const InputFileWithIcon = <T,>({ Icon, label, className, field, value, placeholder, onChange, accept, multiple = false, }: InputFileWithIconProps<T>) => {
  return (
    <div style={{ position: "relative", display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
      {Icon}
      <input
        type="file"
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
