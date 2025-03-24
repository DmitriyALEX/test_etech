import React from 'react'
import styles from './styles.module.css'
import { IButton } from '../../types/button.interface'
import Image from 'next/image'

const SecondaryButton: React.FC<IButton> = ({ title, alt, img, onClick }) => {
    return (
        <>
            <button className={styles.secondary_button} onClick={onClick}>
                {img && alt ? <Image src={img} alt={alt} width={25} height={25} /> : title}
            </button>
        </>
    )
}

export default SecondaryButton
