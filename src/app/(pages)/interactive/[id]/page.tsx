'use client'
import React, { use, useEffect, useState } from 'react'
import styles from './styles.module.css'
import { useQuestionnaire } from '../../../../context/questionnaireContext'
import { IFetchedData } from '../../../../types/questionnaire.interface'
import TextInput from '@/shared/textInput'
import PrimaryButton from '@/shared/primaryButton'
import StopWatch from '@/components/stopWatch'
import ModalWindow from '@/components/modalWindow'
import axios from 'axios'
import { urls } from '@/config/urls'

interface IAnswers {
    completedQuestion: string
    completedAnswer: string
}

const InteractivePage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { fetchedData } = useQuestionnaire()
    const { id } = use(params)

    const [renderedData, setRenderedData] = useState<IFetchedData | null>(null)

    const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false)

    const [runningStopWatch, setRunningStopWatch] = useState<boolean>(true)
    const [answer, setAnswer] = useState<IAnswers[] | null>([])

    const [minute, setMinute] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)

    useEffect(() => {
        if (fetchedData && id) {
            const selectedQuestionnaire = fetchedData?.questionnaire.filter(q => q.id === id)
            const selectedQuestion = fetchedData?.questions.filter(x => x.questionnaireId === id)

            setRenderedData({
                questionnaire: selectedQuestionnaire,
                questions: selectedQuestion,
            })
        }
    }, [fetchedData, id])
    const time = {
        minutes: minute,
        seconds: seconds,
    }

    const handleStop = () => {
        setRunningStopWatch(false)
        console.log(time)
        setIsOpenModalWindow(true)

        setMinute(minute)
        setSeconds(seconds)

        handleSendAnswers(seconds, minute, answer)
    }

    const handleSendAnswers = async (seconds: number, minute: number, answer: IAnswers[] | null) => {
        if (answer) {
            axios.post(`${urls.completedAnswers}`, {
                questionnaireId: renderedData?.questionnaire[0].id,
                seconds: seconds,
                minute: minute,
                answer: answer,
            })
        }
    }

    return (
        <section className={styles.interactive_page_container}>
            <div>
                {renderedData?.questionnaire.map(q => (
                    <div key={q.id}>
                        <p>{q.title}</p>
                        <p>{q.description}</p>
                    </div>
                ))}

                <StopWatch
                    minute={minute}
                    setMinute={setMinute}
                    seconds={seconds}
                    setSeconds={setSeconds}
                    runningStopWatch={runningStopWatch}
                    setRunningStopWatch={setRunningStopWatch}
                />

                {/* QUESTIONS */}
                {renderedData?.questions.map((question, index) => (
                    <div key={question.id} className={styles.questions_container}>
                        <div>
                            {/* TEXT */}
                            {question.questionType === 'text' && (
                                <div className={styles.question_container}>
                                    <p>
                                        {index + 1}.&nbsp;{question.questionTitle}
                                    </p>
                                    <TextInput
                                        id={'Answer'}
                                        onBlur={e => {
                                            setAnswer(
                                                // TODO: Simplified version
                                                // prev => {
                                                //     prev && [
                                                //         ...prev,
                                                //         {
                                                //             completedQuestion: question.questionTitle,
                                                //             completedAnswer: e.target.value,
                                                //         },
                                                //     ],
                                                // }
                                                prev => {
                                                    if (!prev) return []

                                                    const newAnswer = {
                                                        completedQuestion: question.questionTitle,
                                                        completedAnswer: e.target.value,
                                                    }

                                                    const updatedAnswers = prev.filter(
                                                        a => a.completedQuestion !== question.questionTitle,
                                                    )

                                                    return [...updatedAnswers, newAnswer]
                                                },
                                            )
                                        }}
                                    />
                                </div>
                            )}
                            {/* single_choise */}
                            {question.questionType === 'single_choise' && (
                                <div className={styles.question_container}>
                                    <p>
                                        {index + 1}.&nbsp;{question.questionTitle}
                                    </p>
                                    {question.answer.map((answer, i) => (
                                        <div key={i} className={styles.answers_container}>
                                            <input
                                                id={`${question.id}-${i}`}
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={answer}
                                                onChange={e =>
                                                    setAnswer(
                                                        prev => {
                                                            if (!prev) return []

                                                            const newAnswer = {
                                                                completedQuestion: question.questionTitle,
                                                                completedAnswer: e.target.value,
                                                            }

                                                            const updatedAnswers = prev.filter(
                                                                a => a.completedQuestion !== question.questionTitle,
                                                            )

                                                            return [...updatedAnswers, newAnswer]
                                                        },

                                                        // TODO: Simplified version
                                                        // prev && [
                                                        //     ...prev,
                                                        //     {
                                                        //         completedQuestion: question.questionTitle,
                                                        //         completedAnswer: e.target.value,
                                                        //     },
                                                        // ],
                                                    )
                                                }
                                            />
                                            <label htmlFor={`${question.id}-${i}`}>{answer}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* multiple_choises */}
                            {question.questionType === 'multiple_choises' && (
                                <div className={styles.question_container}>
                                    <p>
                                        {index + 1}.&nbsp;{question.questionTitle}
                                    </p>
                                    {question.answer.map((answer, i) => (
                                        <div key={i} className={styles.answers_container}>
                                            <input
                                                id={`${question.id}-${i}`}
                                                type="checkbox"
                                                value={answer}
                                                onChange={e =>
                                                    setAnswer(
                                                        prev => {
                                                            if (!prev) return []

                                                            const isCheked = e.target.checked

                                                            if (isCheked) {
                                                                return [
                                                                    ...prev,
                                                                    {
                                                                        completedQuestion: question.questionTitle,
                                                                        completedAnswer: e.target.value,
                                                                    },
                                                                ]
                                                            } else {
                                                                return prev.filter(
                                                                    a =>
                                                                        a.completedQuestion ===
                                                                            question.questionTitle &&
                                                                        a.completedAnswer === e.target.value,
                                                                )
                                                            }
                                                        },

                                                        // TODO: Simplified version
                                                        // prev && [
                                                        //     ...prev,
                                                        //     {
                                                        //         completedQuestion: question.questionTitle,
                                                        //         completedAnswer: e.target.value,
                                                        //     },
                                                        // ],
                                                    )
                                                }
                                            />
                                            <label htmlFor={`${question.id}-${i}`}>{answer}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <PrimaryButton title="Save" onClick={handleStop} />

            {isOpenModalWindow && <ModalWindow time={{ minutes: minute, seconds: seconds }} answers={answer} />}
        </section>
    )
}

export default InteractivePage
