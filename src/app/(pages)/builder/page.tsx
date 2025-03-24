'use client'
import React, { useState } from 'react'
import styles from './styles.module.css'
import SecondaryButton from '@/shared/secondaryButton'
import PrimaryButton from '@/shared/primaryButton'
import { useId } from 'react'
import { IQuestionnaire, IQuestion } from '../../../types/questionnaire.interface'
import TextInput from '@/shared/textInput'
import axios from 'axios'
import { urls } from '../../../config/urls'
import { useRouter } from 'next/navigation'
import { useQuestionnaire } from '../../../context/questionnaireContext'

const BuilderPage = () => {
    const selectId = useId()
    const router = useRouter()

    const { setReloadFetchData, setFetchedData } = useQuestionnaire()

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [questions, setQuestions] = useState<IQuestion[] | []>([])

    const handleAddNewQuestion = () => {
        setQuestions(prev => [...prev, { questionTitle: '', questionType: '', questionAnswers: [] }])
    }

    const sendQuestionnaire = async () => {
        const newQuestionnaire: IQuestionnaire = {
            title,
            description,
            questions,
        }

        try {
            const response = await axios.post(`${urls.builderQuestion}`, {
                questionnaire: [newQuestionnaire],
            })

            //set to context
            setFetchedData(response.data.data)
            if (response.status >= 200 && response.status < 300) {
                router.push('/')
                setReloadFetchData(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await sendQuestionnaire()
    }

    const handleDeleteQuestion = (questionIndex: number) => {
        const updatedDeletedQuestion = questions.filter((_, i) => i !== questionIndex)
        setQuestions(updatedDeletedQuestion)
    }

    //TODO:
    //const handleDeleteAnswer = (questionIndex: number, answerIndex: number) => {}

    return (
        <section className={styles.builder_container}>
            <h1 className={styles.builder_title}>Create Quiz</h1>

            <form onSubmit={handleSubmit} className={styles.form_container}>
                {/* Title */}
                <TextInput id={'Title'} onChange={e => setTitle(e.target.value)} />
                {/* Description */}
                <TextInput id={'Description'} onChange={e => setDescription(e.target.value)} />
                {/* AddnewQuestion BUTTON */}
                <PrimaryButton title={'Add new question'} onClick={handleAddNewQuestion} />

                {/* Question section*/}
                <>
                    {questions.map((q, questionIndex) => (
                        <section key={questionIndex}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {/* <p style={{ marginLeft: '16px' }}>Question</p> */}
                                {<span style={{ marginRight: '16px' }}>{questionIndex + 1}.</span>}
                                <div className={styles.question_select_container}>
                                    <div className={styles.question_title}>
                                        <TextInput
                                            id={'Question'}
                                            onChange={e => {
                                                setQuestions(prev =>
                                                    prev.map((q, i) =>
                                                        i === questionIndex
                                                            ? { ...q, questionTitle: e.target.value }
                                                            : q,
                                                    ),
                                                )
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: ' flex-end',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <div style={{ marginRight: '16px' }}>
                                            <label htmlFor={selectId}>Type</label>
                                            <select
                                                name={selectId}
                                                id="answers_type"
                                                onChange={e => {
                                                    const updatedQuestions = [...questions]
                                                    updatedQuestions[questionIndex] = {
                                                        ...q,
                                                        questionType: e.target.value,
                                                    }
                                                    setQuestions(updatedQuestions)
                                                }}
                                                defaultValue=""
                                                className={styles.select_items}
                                            >
                                                <option value="" disabled hidden>
                                                    select
                                                </option>
                                                <option value="text">text</option>
                                                <option value="single_choise">single choise</option>
                                                <option value="multiple_choises">multiple choises</option>
                                            </select>
                                        </div>

                                        <SecondaryButton
                                            title={'Remove'}
                                            onClick={() => handleDeleteQuestion(questionIndex)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                {(q.questionType === 'single_choise' || q.questionType === 'multiple_choises') && (
                                    <div>
                                        <p>Answers</p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>1.</span>
                                            <TextInput
                                                id={'Choice'}
                                                onBlur={e => {
                                                    const updatedQuestions = [...questions]
                                                    updatedQuestions[questionIndex] = {
                                                        ...q,
                                                        questionAnswers: [e.target.value],
                                                    }
                                                    setQuestions(updatedQuestions)
                                                }}
                                            />
                                            {/* TODO: */}
                                            {/* <SecondaryButton
                                                title={'Remove'}
                                                onClick={() => handleDeleteAnswer(questionIndex, )}
                                            /> */}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>2.</span>
                                            <TextInput
                                                id={'Choice'}
                                                onBlur={e => {
                                                    const updatedQuestions = [...questions]
                                                    updatedQuestions[questionIndex] = {
                                                        ...q,
                                                        questionAnswers: [...q.questionAnswers, e.target.value],
                                                    }
                                                    setQuestions(updatedQuestions)
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </>
                <button type="submit" className={styles.submit_button}>
                    submit
                </button>
            </form>
        </section>
    )
}

export default BuilderPage
