const { readFile, writeFile } = require('fs/promises')

const validateQuestion = question => {
  const expectedKeys = ['id', 'author', 'summary', 'answers']

  return expectedKeys.every(key => Object.keys(question).includes(key))
}

const validateAnswer = answer => {
  const expectedKeys = ['id', 'author', 'summary']

  return expectedKeys.every(key => Object.keys(answer).includes(key))
}

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()

    return questions.find(question => question.id == questionId)
  }

  const addQuestion = async question => {
    if (validateQuestion(question)) {
      const questions = await getQuestions()

      questions.push(question)

      await writeFile(fileName, JSON.stringify(questions))
    }
    return
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)

    return question?.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)

    return answers ? answers.find(answer => answer.id == answerId) : undefined
  }

  const addAnswer = async (questionId, answer) => {
    if (!validateAnswer(answer)) return

    const questions = await getQuestions()

    questions.forEach(question => {
      if (question.id == questionId) {
        question.answers.push(answer)
      }
    })

    await writeFile(fileName, JSON.stringify(questions))

    return
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
