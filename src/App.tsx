import { useState } from "react"
import MultiSelect from "./components/MultiSelect/MultiSelect"
import SingleMultiSelect from "./components/SingleMultiSelect/SingleMultiSelect"
import SingleSelect from "./components/SingleSelect/SingleSelect"

const options = [
  { value: 'first', label: 'first' },
  { value: 'second', label: 'second' },
  { value: 'third', label: 'third' },
  { value: 'fourth', label: 'fourth' },
]

interface SelectOption {
  value: string | number
  label: string
}

function App() {

  const [value, setValue] = useState<SelectOption | undefined>(options[0])
  const [multipleValue, setMultipleValue] = useState<SelectOption[]>([options[0]])

  const [singleValue, setSingleValue] = useState<SelectOption | undefined>(options[0])

  const [multiValue, setMultiValue] = useState<SelectOption[]>([options[0]])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        SingleMultiSelect
        <SingleMultiSelect options={options} value={value} onChange={option => setValue(option)} />
        <br />
        <SingleMultiSelect multiple options={options} value={multipleValue} onChange={option => setMultipleValue(option)} />
      </div>
      <div>
        SingleSelect
        <SingleSelect value={singleValue} options={options} onChange={option => setSingleValue(option)} />
      </div>
      <div>
        MultiSelect
        <MultiSelect value={multiValue} options={options} onChange={option => setMultiValue(option)} />
      </div>
    </div>
  )
}

export default App
