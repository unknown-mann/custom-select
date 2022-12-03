import { useState } from "react"
import Select, { SelectOption } from "./Select"

const options = [
  { value: 'first', label: 'first' },
  { value: 'second', label: 'second' },
  { value: 'third', label: 'third' },
  { value: 'fourth', label: 'fourth' },
]

function App() {

  const [value, setValue] = useState<SelectOption | undefined>(options[0])
  const [multipleValue, setMultipleValue] = useState<SelectOption[]>([options[0]])

  return (
    <>
      <Select options={options} value={value} onChange={option => setValue(option)} />
      <br /> 
      <Select multiple options={options} value={multipleValue} onChange={option => setMultipleValue(option)} />
    </>
  )
}

export default App
