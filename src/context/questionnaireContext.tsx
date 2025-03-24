'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { IQuestionnaire, IQuestion, IFetchedData } from '../types/questionnaire.interface'

import axios from 'axios'
import { urls } from '../config/urls'

interface IFetchedDataContext {
    fetchedData: IFetchedData | null
    setFetchedData: (data: IFetchedData | null) => void
}

const QuestionnaireContext = createContext<IFetchedDataContext | undefined>(undefined)

export function useQuestionnaire() {
    const context = useContext(QuestionnaireContext)
    if (!context) {
        throw new Error('context error')
    }
    return context
}

export const QuestionnaireProvider = ({ children }: { children: React.ReactNode }) => {
    const [fetchedData, setFetchedData] = useState<IFetchedData | null>(null)

    useEffect(() => {
        axios.get(`${urls.getAllQuiz}`).then(response => setFetchedData(response.data))
    }, [])

    return (
        <QuestionnaireContext.Provider
            value={{
                fetchedData,
                setFetchedData,
            }}
        >
            {children}
        </QuestionnaireContext.Provider>
    )
}
