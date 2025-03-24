'use client'
import React, { useEffect, useState, ChangeEvent } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/navigation'
import { useQuestionnaire } from '../../context/questionnaireContext'
import { IFetchedData } from '../../types/questionnaire.interface'
import PrimaryButton from '@/shared/primaryButton'
import Image from 'next/image'
import axios from 'axios'
import { urls } from '../../config/urls'
import TextInput from '@/shared/textInput'

const Card = () => {
    const router = useRouter()
    const { fetchedData, setFetchedData } = useQuestionnaire()

    const [renderedData, setRenderedData] = useState<IFetchedData | null>(null)

    const [isMenuId, setIsMenuId] = useState<string | null>(null)

    useEffect(() => {
        if (fetchedData) {
            setRenderedData(fetchedData)
        }
    }, [fetchedData])

    //Search by title
    const handleSearch = (value: ChangeEvent<HTMLInputElement>) => {
        const inputValue = value.target.value
        if (!inputValue.trim()) {
            setRenderedData(fetchedData)
            return
        }
        if (renderedData) {
            const filteredData = renderedData.questionnaire.filter(x => {
                return x.title.toLowerCase().includes(inputValue.toLowerCase())
            })
            setRenderedData({
                questionnaire: filteredData,
                questions: renderedData.questions,
            })
        }
    }

    const handleMenu = (id: string) => {
        setIsMenuId(id)
    }

    //EDIT
    const handleEdit = (id: string) => {
        router.push('/builder')
    }

    // DELETE
    const handleDelete = (id: string) => {
        try {
            axios.delete(`${urls.deleteQuestionnaire}`, { data: { id } }).then(function(response) {
                if (response.data.status === 'success') {
                    if (fetchedData) {
                        const updatedQuestionnaire = fetchedData?.questionnaire.filter(q => q.id !== id)
                        const updatedQuestions = fetchedData?.questions.filter(x => x.questionnaireId !== id)
                        setFetchedData({
                            questionnaire: updatedQuestionnaire,
                            questions: updatedQuestions,
                        })
                    }
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleRun = (id: string) => {
        router.push(`/interactive/${id}`)
    }

    const menuIcon = '/icons/menu-icon.svg'

    return (
        <section className={styles.card_container}>
            <TextInput id={'Search by title'} onChange={handleSearch} />

            {renderedData?.questionnaire.length === 0 && <p style={{ color: 'red' }}>No items found</p>}

            {renderedData && renderedData.questionnaire && renderedData.questions && (
                <>
                    {renderedData.questionnaire.map(questionnaire => {
                        const relatedQuestions = renderedData.questions.filter(
                            question => question.questionnaireId === questionnaire.id,
                        )

                        return (
                            <div key={questionnaire.id} className={styles.card}>
                                {/* TITLE AND MENU */}
                                <div className={styles.title_and_menu}>
                                    <p>{questionnaire.title}</p>

                                    {/* MENU */}
                                    <div>
                                        <button
                                            className={styles.menu_button}
                                            onClick={() => handleMenu(questionnaire.id)}
                                        >
                                            {menuIcon && <Image src={menuIcon} alt="menu" width={25} height={25} />}
                                        </button>
                                        {isMenuId === questionnaire.id && (
                                            <div className={styles.menu_container}>
                                                <button
                                                    className={styles.menu_button}
                                                    onClick={() => setIsMenuId(null)}
                                                >
                                                    close
                                                </button>
                                                <button
                                                    className={styles.menu_button}
                                                    onClick={() => handleEdit(questionnaire.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.menu_button}
                                                    title={'Delete'}
                                                    onClick={() => handleDelete(questionnaire.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Description */}
                                </div>
                                <p>{questionnaire.description}</p>
                                <div>
                                    <p style={{ color: '#186487' }}>Amount of questions: {relatedQuestions.length}</p>
                                    <PrimaryButton title={'Run'} onClick={() => handleRun(questionnaire.id)} />
                                </div>
                            </div>
                        )
                    })}
                </>
            )}
        </section>
    )
}

export default Card
