import { inputStyle } from "../../css/dashboardStyles"

const InputText = ({field,value,placeholder, onChange,type="text"}:{placeholder:string,field:string, onChange(field:string, value:string|number):void, type?:"text"|'number'|'email'|'tel'|'password', value:string|number}) => {

  return (
    <input
      type={type}
      value={value}
      onChange={(e) =>  onChange( field, e.target.value )}
      placeholder={placeholder}
      style={inputStyle}
    />
  )
}
export default InputText