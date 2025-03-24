'use client'
import React from 'react'
import styles from './styles.module.css'
import Card from '@/components/card'
import { useRouter } from 'next/navigation'
import PrimaryButton from '@/shared/primaryButton'

const CatalogPage = () => {
    const router = useRouter()

    const handleRoute = () => {
        router.push('/builder')
    }

    return (
        <main className={styles.catalog_container}>
            <section>
                <header className={styles.catalog_header}>
                    <h1>Quiz Catalog</h1>
                    <div className={styles.catalog_header_add_new}>
                        <PrimaryButton title={'Add new questionnaire'} onClick={handleRoute} />
                    </div>
                </header>
                <Card />
            </section>
        </main>
    )
}

export default CatalogPage
