export interface IQuestionnaire {
    title: string
    description: string
    questions: IQuestion[]
    fetchedData?: IQuestionnaire | null
}

export interface IQuestion {
    questionnaireId?: string
    questionTitle: string
    questionType: string
    questionAnswers: string[]
}

export interface IFetchedQuestionnaires {
    id: string
    title: string
    description: string
}

export interface IFetchedQuestions {
    answer: string[]
    id: string
    questionTitle: string
    questionType: string
    questionnaireId: string
}

export interface IFetchedData {
    questionnaire: IFetchedQuestionnaires[]
    questions: IFetchedQuestions[]
}
