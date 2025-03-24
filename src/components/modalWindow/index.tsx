'use client'
import React, { useId } from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/navigation'
import { IAnswers, IAnswersTime } from '../../types/answers.interface'
import PrimaryButton from '@/shared/primaryButton'

interface IModal {
    time: IAnswersTime
    answers: IAnswers[] | null
}

const ModalWindow: React.FC<IModal> = ({ time, answers }) => {
    const router = useRouter()
    const AnswerId = useId()

    const handleRoute = () => {
        router.push('/')
    }
    return (
        <section className={styles.modalwindow_container}>
            <div className={styles.modalwindow}>
                <div>
                    <span>{time.minutes}</span> : <span>{time.seconds}</span>
                    <div>
                        {answers &&
                            answers.map((answer, index) => (
                                <div key={AnswerId + index}>
                                    <p>
                                        <span>{index + 1}.&nbsp;</span>
                                        <span>{answer.completedQuestion}</span>
                                    </p>
                                    <p>{answer.completedAnswer}</p>
                                </div>
                            ))}
                    </div>
                    <PrimaryButton title={'Catalog page'} onClick={handleRoute} />
                </div>
            </div>
        </section>
    )
}

export default ModalWindow
