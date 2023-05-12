const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

const testQuestions = [
  {
    id: faker.datatype.uuid(),
    summary: 'What is my name?',
    author: 'Jack London',
    answers: []
  },
  {
    id: faker.datatype.uuid(),
    summary: 'Who are you?',
    author: 'Tim Doods',
    answers: []
  }
]

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

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a result of given id', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(
      await questionRepo.getQuestionById(testQuestions[0].id)
    ).toHaveProperty('id', testQuestions[0].id)
  })

  test('should return an empty list', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    // there is low chance that "nonExistentId" will be colliding
    // but for the test lets say that its really 100% unique
    const nonExistentId = faker.datatype.uuid()

    expect(await questionRepo.getQuestionById(nonExistentId)).toBeFalsy()
  })
})
