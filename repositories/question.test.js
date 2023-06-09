const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

const testQuestions = [
  {
    id: faker.datatype.uuid(),
    summary: 'What is my name?',
    author: 'Jack London',
    answers: [
      {
        id: faker.datatype.uuid(),
        author: 'Jack London',
        summary: 'Jack London'
      }
    ]
  },
  {
    id: faker.datatype.uuid(),
    summary: 'Who are you?',
    author: 'Tim Doods',
    answers: []
  }
]

const externalTestQuestion = {
  id: faker.datatype.uuid(),
  summary: 'Why are you here?',
  author: 'Deve Loper',
  answers: [
    {
      id: faker.datatype.uuid(),
      author: 'Deve Loper',
      summary: 'Deve Loper'
    }
  ]
}

// there is low chance that "v4 uuid" will be colliding, but for the test
// lets say that its really 100% unique otherwise, we will need to write uuid provider in a future to avoid that

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(testQuestions.length)
  })

  test('should return a result of given id', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(
      await questionRepo.getQuestionById(testQuestions[0].id)
    ).toHaveProperty('id', testQuestions[0].id)
  })

  test('should return an empty list', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(
      await questionRepo.getQuestionById(externalTestQuestion.id)
    ).toBeFalsy()
  })

  test('should add an question increasing the size of questions by 1', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await questionRepo.addQuestion(externalTestQuestion)

    expect(await questionRepo.getQuestions()).toHaveLength(
      testQuestions.length + 1
    )
  })

  test('should not add an question (wrong object / empty)', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await questionRepo.addQuestion({})

    expect(await questionRepo.getQuestions()).toHaveLength(testQuestions.length)
  })

  test('should return an answers for existing question id', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getAnswers(testQuestions[0].id)).toHaveLength(
      testQuestions[0].answers.length
    )
  })

  test('should return an undefined for non existing id', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getAnswers(externalTestQuestion.id)).toBeFalsy()
  })

  test('should return an answer for existing question id and answer id', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(
      await questionRepo.getAnswer(
        testQuestions[0].id,
        testQuestions[0].answers[0].id
      )
    ).toHaveProperty('id', testQuestions[0].answers[0].id)
  })

  test('should return an undefined for non existing question id and answer id', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(
      await questionRepo.getAnswer(
        externalTestQuestion.id,
        externalTestQuestion.answers[0].id
      )
    ).toBeFalsy()
  })

  test('should add an anwer increasing the size of answers by 1', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await questionRepo.addAnswer(
      testQuestions[0].id,
      externalTestQuestion.answers[0]
    )

    expect(await questionRepo.getAnswers(testQuestions[0].id)).toHaveLength(
      testQuestions[0].answers.length + 1
    )
  })

  test('should not add an answer (wrong object / empty)', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await questionRepo.addAnswer(testQuestions[0].id, {})

    expect(await questionRepo.getAnswers(testQuestions[0].id)).toHaveLength(
      testQuestions[0].answers.length
    )
  })
})
