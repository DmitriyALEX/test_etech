import React from 'react'
import styles from './styles.module.css'

interface IInput {
    id: string
    onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (value: React.ChangeEvent<HTMLInputElement>) => void
}

const TextInput: React.FC<IInput> = ({ id, onChange, onBlur }) => {
    return (
        <section className={styles.input_container}>
            <label htmlFor={id}>{id}</label>
            <input id={id} type="text" onChange={onChange} onBlur={onBlur} className={styles.input} />
        </section>
    )
}

export default TextInput
