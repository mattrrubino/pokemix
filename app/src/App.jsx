import * as tf from "@tensorflow/tfjs"
import { useEffect, useState, useRef } from "react"
import { PropTypes } from "prop-types"

function PokemonSelector({ pokemon, code, onChange }) {
  const [selectedPokemon, setSelectedPokemon] = useState()

  useEffect(() => {
    if (selectedPokemon === undefined) setSelectedPokemon(code ? code : pokemon[0])
  }, [pokemon, code, selectedPokemon])

  const onChangeInner = (e) => {
    setSelectedPokemon(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col justify-center">
      <select className="capitalize mx-16 border border-black" value={selectedPokemon} onChange={onChangeInner}>
        {pokemon.map((item, i) => <option key={i} value={item}>{item}</option>)}
      </select>
      <img className="w-[256px] h-[192px] my-[24px] nearest" src={`swsh/${selectedPokemon}.png`} alt={selectedPokemon} />
    </div>
  )
}

function PokemonMixer({ model, code0, code1, onChange }) {
  const [value, setValue] = useState(0.5)
  const ref = useRef()

  useEffect(() => {
    if (model === undefined || code0 === undefined || code1 === undefined) return

    const i0 = tf.tensor(code0, [1, 128], "float32")
    const i1 = tf.tensor(code1, [1, 128], "float32")
    const i = i0.mul(1-value).add(i1.mul(value))

    const output = model.predict(i).squeeze()
    tf.browser.toPixels(output, ref.current)
  }, [model, code0, code1, value])

  const onChangeInner = (e) => {
    setValue(+e.target.value)
    onChange?.(+e.target.value)
  }

  const download = () => {
    const link = document.createElement("a")
    link.download = "mix.png"
    link.href = ref.current.toDataURL()
    link.click()
    link.remove()
  }

  return (
    <div className="flex flex-col align-center">
      <span className="m-auto">{value*100}%</span>
      <input className="mx-16" value={value} onChange={onChangeInner} type="range" step={0.1} min={0} max={1} />
      <canvas ref={ref} height={64} width={64} />
      <button onClick={download} className="mx-16 border border-black">Download</button>
    </div>
  )
}

function App() {
  const [model, setModel] = useState()
  const [codes, setCodes] = useState()
  const [pokemon0, setPokemon0] = useState("dialga")
  const [pokemon1, setPokemon1] = useState("palkia")

  useEffect(() => {
    tf.loadLayersModel("decoder/model.json").then(setModel)
    fetch("codes.json").then(resp => resp.json().then(setCodes))
  }, [])

  return (
    model !== undefined && codes !== undefined
    ? <div className="flex justify-center">
        <PokemonSelector pokemon={Object.keys(codes)} code={pokemon0} onChange={setPokemon0} />
        <PokemonMixer model={model} code0={codes[pokemon0]} code1={codes[pokemon1]} />
        <PokemonSelector pokemon={Object.keys(codes)} code={pokemon1} onChange={setPokemon1} />
      </div>
    : <div className="flex justify-center" role="status">
        <svg aria-hidden="true" className="w-64 h-64 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
  )
}

export default App

PokemonSelector.propTypes = {
  pokemon: PropTypes.arrayOf(PropTypes.string).isRequired,
  code: PropTypes.string,
  onChange: PropTypes.func,
}

PokemonMixer.propTypes = {
  model: PropTypes.object.isRequired,
  code0: PropTypes.arrayOf(PropTypes.number).isRequired,
  code1: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func,
}
