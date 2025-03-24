import React from 'react'
import styles from './styles.module.css'
import { IButton } from '../../types/button.interface'

const PrimaryButton: React.FC<IButton> = ({ title, alt, img, onClick, type }) => {
    return (
        <section className={styles.primary_button_container}>
            <button type={type ? type : 'button'} className={styles.primary_button} onClick={onClick}>
                {title}
            </button>
        </section>
    )
}

export default PrimaryButton
