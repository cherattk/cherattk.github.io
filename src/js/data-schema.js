export const answerSchema = {
  answer: "",
  answer_description: ""
}

export const questionSchema = {
  question: "",
  options: [answerSchema],
  multiple_choice: true,
  good_answers_index: []
}

export const quizMetadata = {
  id: 0,
  categorie: "",
  description: "",
  level: 1,
  title: "",
  nbr_question: 0,
}
export const quizSchema = {
  metadata: quizMetadata,
  questions: [questionSchema]
}


